import { create } from 'zustand'

const STORAGE_KEY = 'timedeo-theme'

function currentTheme() {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function apply(theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* ignore private-mode storage errors */
  }
}

export const useTheme = create((set, get) => ({
  theme: currentTheme(),
  setTheme: (theme) => {
    apply(theme)
    set({ theme })
  },
  toggle: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark'
    apply(next)
    set({ theme: next })
  },
}))
