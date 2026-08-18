import { create } from 'zustand'
import * as api from '@/lib/api'
import { useAuth } from '@/store/useAuth'

export const ACTIVE_STATUSES = ['pending', 'in_progress']

const EMPTY_USER = {
  id: null,
  name: '',
  handle: '',
  title: '',
  location: '',
  bio: '',
  rating: 0,
  ratingCount: 0,
  hoursEarned: 0,
  hoursSpent: 0,
  hoursTraded: 0,
  responseRate: null,
  memberSince: null,
  skills: [],
  offers: [],
}

const currentUid = () => useAuth.getState().user?.id ?? null

async function fetchAll(uid) {
  const [profile, bookings, marketplace] = await Promise.all([
    api.getProfile(uid),
    api.getBookings(uid),
    api.getMarketplace(),
  ])
  const listings = marketplace
    .map((l) => api.adaptListing(l, uid))
    .filter((l) => l.listingType === 'Offer')
  const { user, wallet } = api.adaptProfile(profile, listings, uid)
  return {
    user,
    wallet,
    listings,
    bookings: bookings.map((b) => api.adaptBooking(b, uid)),
    reviews: (profile.reviews || []).map(api.adaptReview),
  }
}

export const useAppStore = create((set, get) => ({
  currentUserId: null,
  ready: false,
  error: null,

  user: EMPTY_USER,
  wallet: { balance: 0, escrow: 0 },
  listings: [],
  bookings: [],
  reviews: [],

  // Initial load for the signed-in user (flips `ready` so pages drop skeletons).
  loadAll: async () => {
    const uid = currentUid()
    if (!uid) {
      set({ ready: true })
      return
    }
    try {
      const data = await fetchAll(uid)
      set({ ...data, currentUserId: uid, ready: true, error: null })
    } catch (e) {
      set({ ready: true, error: e.message || 'Failed to load data.' })
    }
  },

  // Re-pull everything after a mutation (wallet + bookings + listings + reviews).
  refresh: async () => {
    const uid = currentUid() ?? get().currentUserId
    if (!uid) return
    try {
      const data = await fetchAll(uid)
      set({ ...data, error: null })
    } catch (e) {
      set({ error: e.message || 'Failed to refresh data.' })
    }
  },

  // Clear all user data on sign-out so the next session starts fresh.
  reset: () =>
    set({
      currentUserId: null,
      ready: false,
      error: null,
      user: EMPTY_USER,
      wallet: { balance: 0, escrow: 0 },
      listings: [],
      bookings: [],
      reviews: [],
    }),

  // -----------------------------------------------------------------------
  // Selectors
  // -----------------------------------------------------------------------
  activeBookings: () => get().bookings.filter((b) => ACTIVE_STATUSES.includes(b.status)),
  historyBookings: () => get().bookings.filter((b) => !ACTIVE_STATUSES.includes(b.status)),
  canAfford: (hours) => get().wallet.balance >= hours,

  // -----------------------------------------------------------------------
  // Actions — each hits a real endpoint, then refreshes from the DB.
  // -----------------------------------------------------------------------
  bookService: async ({ listing }) => {
    try {
      const data = await api.createBooking({
        listing_id: listing.listingId ?? Number(listing.id),
        requester_id: currentUid() ?? get().currentUserId,
        agreed_hours: listing.hours,
      })
      await get().refresh()
      return { ok: true, booking: data }
    } catch (e) {
      if (/insufficient/i.test(e.message)) return { ok: false, reason: 'insufficient' }
      return { ok: false, error: e.message }
    }
  },

  completeBooking: async (id) => {
    const b = get().bookings.find((x) => x.id === id)
    if (!b) return { ok: false }
    try {
      await api.completeBooking({ booking_id: b.bookingId })
      await get().refresh()
      return { ok: true, booking: b }
    } catch (e) {
      return { ok: false, error: e.message }
    }
  },

  addListing: async (data) => {
    const skillId = api.SKILL_BY_CATEGORY[data.category]
    if (!skillId) throw new Error('Unknown category')
    await api.createListing({
      user_id: currentUid() ?? get().currentUserId,
      skill_id: skillId,
      listing_type: 'Offer',
      title: data.title,
      description: data.summary || data.description || '',
      estimated_hours: data.hours,
    })
    await get().refresh()
  },

  // Profile edits: session-local only (no backend user-update endpoint yet).
  updateUser: (patch) => set((s) => ({ user: { ...s.user, ...patch } })),
}))
