import { create } from 'zustand'
import * as api from '@/lib/api'

/**
 * Auth session — SECURE model, no client-side token storage.
 *
 * The session lives in a server-set **httpOnly cookie** (unreadable by JS, so
 * it survives XSS). This store only keeps the user object *in memory*:
 *   - on app boot, checkSession() asks the server who we are (cookie sent
 *     automatically via credentials:'include'); refreshes re-restore this way.
 *   - login/register: the server sets the cookie; we cache the returned user.
 *   - logout: the server clears the cookie; we drop the in-memory user.
 *
 * Nothing sensitive is written to localStorage/sessionStorage.
 *
 * >>> Backend contract this expects (for the backend agent) <<<
 *   POST /login.php     -> Set-Cookie: httpOnly session; body = user
 *   POST /register.php  -> same
 *   GET  /me.php        -> 200 user if cookie valid, else 401
 *   POST /logout.php    -> clears the session cookie
 *   All must send credentials and, if not same-origin via the Vite proxy,
 *   `Access-Control-Allow-Credentials: true` + an explicit origin (not '*').
 */

const toUser = (data) => ({
  id: Number(data.user_id),
  name: data.full_name,
  email: data.email,
})

export const useAuth = create((set) => ({
  user: null,
  status: 'checking', // 'checking' | 'authed' | 'guest'

  // Restore the session from the httpOnly cookie via the backend.
  checkSession: async () => {
    try {
      const data = await api.me()
      set({ user: toUser(data), status: 'authed' })
    } catch {
      // No/invalid cookie (or /me not implemented yet) -> treat as signed out.
      set({ user: null, status: 'guest' })
    }
  },

  login: async (email, password) => {
    const data = await api.login({ email, password }) // server sets httpOnly cookie
    const user = toUser(data)
    set({ user, status: 'authed' })
    return user
  },

  register: async ({ fullName, email, password }) => {
    const data = await api.register({ full_name: fullName, email, password })
    const user = toUser(data)
    set({ user, status: 'authed' })
    return user
  },

  logout: async () => {
    try {
      await api.logout() // server clears the cookie
    } catch {
      /* clear locally regardless of network result */
    }
    set({ user: null, status: 'guest' })
  },
}))
