/**
 * API client for the TimeDeo PHP/MySQL backend (see ../../server).
 *
 * In dev, requests go to `/api/*.php`, which Vite proxies to the PHP built-in
 * server on :8000 (see vite.config.js). Override with VITE_API_BASE if you
 * serve the PHP elsewhere (e.g. XAMPP Apache at http://localhost/timedeo).
 *
 * Every endpoint returns `{ success, data }` or `{ success:false, error }`;
 * `request()` unwraps `data` and throws the server's error message otherwise.
 */

// --- API base resolution (runtime-overridable, no rebuild) -------------------
// Priority: in-browser override (localStorage) > build-time VITE_API_BASE > '/api'.
// The override lets the DEPLOYED app be repointed at a new backend/tunnel URL
// from the UI (hidden Data-source dialog) with no redeploy — it applies on reload.
// NOTE: a direct cross-origin override needs the backend to send credentialed CORS
// + a SameSite=None;Secure cookie. The default '/api' is same-origin (Vite proxy in
// dev, vercel.json rewrite in prod) and needs neither.
const OVERRIDE_KEY = 'timedeo-api-base'

function readOverride() {
  try {
    return (localStorage.getItem(OVERRIDE_KEY) || '').trim()
  } catch {
    return ''
  }
}

export function getApiOverride() {
  return readOverride()
}

export function setApiOverride(url) {
  try {
    localStorage.setItem(OVERRIDE_KEY, String(url).trim().replace(/\/+$/, ''))
  } catch {
    /* ignore private-mode storage errors */
  }
}

export function clearApiOverride() {
  try {
    localStorage.removeItem(OVERRIDE_KEY)
  } catch {
    /* ignore */
  }
}

// Resolved once per load; changing the override takes effect on reload.
export const API_BASE = (readOverride() || import.meta.env.VITE_API_BASE || '/api').replace(/\/+$/, '')

async function request(path, { method = 'GET', body, params } = {}) {
  let url = API_BASE + path
  if (params) {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v != null && v !== ''),
    ).toString()
    if (qs) url += `?${qs}`
  }

  let res
  try {
    res = await fetch(url, {
      method,
      // Send the httpOnly session cookie with every request (secure auth).
      credentials: 'include',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('Could not reach the server. Is the PHP API running on :8000?')
  }

  let json
  try {
    json = await res.json()
  } catch {
    throw new Error(`Server returned a non-JSON response (${res.status}).`)
  }
  if (!res.ok || !json || json.success === false) {
    throw new Error((json && json.error) || `Request failed (${res.status}).`)
  }
  return json.data
}

/* ---------------------------------------------------------------------------
 * Endpoints
 * ------------------------------------------------------------------------- */
export const getProfile = (userId) => request('/get_profile.php', { params: { user_id: userId } })
export const getBookings = (userId, scope) =>
  request('/get_bookings.php', { params: { user_id: userId, scope } })
export const getMarketplace = (params = {}) => request('/get_marketplace.php', { params })
export const getCategories = () => request('/get_categories.php')
export const createBooking = (body) => request('/create_booking.php', { method: 'POST', body })
export const completeBooking = (body) => request('/complete_booking.php', { method: 'POST', body })
export const createListing = (body) => request('/listings.php', { method: 'POST', body })

// Auth (session-less: the SPA holds the returned user).
// login  -> { user_id, full_name, email, join_date, available_balance, escrow_balance }
// register -> { user_id, full_name, email, available_balance, escrow_balance }
export const login = (body) => request('/login.php', { method: 'POST', body })
export const register = (body) => request('/register.php', { method: 'POST', body })
// Session check + logout (backend must set/clear an httpOnly cookie).
export const me = () => request('/me.php')
export const logout = () => request('/logout.php', { method: 'POST' })

/* ---------------------------------------------------------------------------
 * Mapping helpers — backend rows -> the shapes the React pages already render.
 * ------------------------------------------------------------------------- */
const CATEGORY_NAME_TO_SLUG = {
  Design: 'design',
  Development: 'development',
  Tutoring: 'tutoring',
  'Home & Repair': 'home-repair',
  Wellness: 'wellness',
  Writing: 'writing',
  Music: 'music',
  Languages: 'languages',
  Photography: 'photography',
  Business: 'business',
}

export function slugFromCategory(name) {
  return CATEGORY_NAME_TO_SLUG[name] || String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

// "Offer a skill" only knows a category; pick a representative skill_id from the
// seeded Skills table so the INSERT satisfies the FK. (Matches server/init.sql.)
export const SKILL_BY_CATEGORY = {
  design: 1, // UI/UX Design
  development: 4, // React Development
  tutoring: 6, // Calculus Tutoring
  'home-repair': 7, // Plumbing
  wellness: 9, // Yoga
  writing: 10, // Copy Editing
  music: 11, // Guitar
  languages: 12, // Spanish
  photography: 13, // Product Photography
  business: 14, // Go-to-Market Strategy
}

const firstNameHandle = (name) => String(name || '').trim().split(/\s+/)[0].toLowerCase()
const emailHandle = (email) => String(email || '').split('@')[0]
const num = (v, d = 0) => (v == null ? d : Number(v))

export function adaptListing(l, currentUserId) {
  const rating = l.avg_rating != null ? Number(l.avg_rating) : 0
  return {
    id: String(l.listing_id),
    listingId: Number(l.listing_id),
    title: l.title,
    description: l.description || '',
    summary: l.description || '',
    category: slugFromCategory(l.category_name),
    categoryName: l.category_name,
    hours: Number(l.estimated_hours),
    skillName: l.skill_name,
    provider: {
      id: Number(l.provider_id),
      name: l.provider_name,
      handle: firstNameHandle(l.provider_name),
      rating,
      ratingCount: num(l.review_count),
    },
    rating,
    reviews: num(l.review_count),
    tags: l.skill_name ? [l.skill_name] : [],
    deliverables: [],
    popular: rating >= 4.8 && num(l.review_count) >= 1,
    mine: Number(l.provider_id) === currentUserId,
    listingType: l.listing_type,
  }
}

export function adaptBooking(b, currentUserId) {
  const status = b.booking_status
  const isRequester = b.role ? b.role === 'requester' : Number(b.requester_id) === currentUserId
  return {
    id: String(b.booking_id),
    bookingId: Number(b.booking_id),
    listingId: Number(b.listing_id),
    title: b.title,
    category: slugFromCategory(b.category_name),
    counterparty: { name: b.counterparty_name, handle: firstNameHandle(b.counterparty_name) },
    role: isRequester ? 'requester' : 'provider',
    status,
    hours: Number(b.agreed_hours),
    progress: status === 'in_progress' ? 50 : status === 'completed' ? 100 : 0,
    note: '',
    scheduledAt: b.created_at,
    createdAt: b.created_at,
    completedAt: status === 'completed' ? b.created_at : undefined,
  }
}

export function adaptReview(r) {
  return {
    id: String(r.review_id),
    author: { name: r.author_name, handle: firstNameHandle(r.author_name) },
    rating: Number(r.rating),
    text: r.comment || '',
    date: r.created_at,
    service: r.service_title,
    hours: null,
  }
}

export function adaptProfile(profile, listings, currentUserId) {
  const p = profile.user
  const earned = num(profile.hours_earned)
  const spent = num(profile.hours_spent)
  const user = {
    id: Number(p.user_id),
    name: p.full_name,
    handle: emailHandle(p.email),
    title: '',
    location: '',
    bio: '',
    rating: num(profile.avg_rating),
    ratingCount: num(profile.review_count),
    hoursEarned: earned,
    hoursSpent: spent,
    hoursTraded: Math.round((earned + spent) * 100) / 100,
    responseRate: null,
    memberSince: p.join_date,
    skills: (profile.skills || []).map((s) => s.skill_name),
    offers: (listings || []).filter((l) => l.provider.id === currentUserId).map((l) => l.title),
  }
  const wallet = {
    balance: num(p.available_balance),
    escrow: num(p.escrow_balance),
  }
  return { user, wallet }
}
