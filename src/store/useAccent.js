import { create } from 'zustand'

const STORAGE_KEY = 'timedeo-accent'

/**
 * Accent presets. `brand: null` means "use the CSS default" (the theme-aware
 * indigo defined in index.css, which also has a lifted dark-mode variant).
 * Everything else sets --brand / --brand-foreground inline on <html>.
 *
 * This is the runtime companion to the "one knob" token: the whole product
 * re-tints from here, exactly like editing --brand in index.css would.
 */
export const ACCENTS = [
  { id: 'indigo', label: 'Indigo', swatch: 'oklch(0.54 0.2 268)', brand: null },
  { id: 'violet', label: 'Violet', swatch: 'oklch(0.56 0.24 300)', brand: 'oklch(0.56 0.24 300)', fg: 'oklch(0.99 0 0)' },
  { id: 'blue', label: 'Blue', swatch: 'oklch(0.55 0.17 250)', brand: 'oklch(0.55 0.17 250)', fg: 'oklch(0.99 0 0)' },
  { id: 'emerald', label: 'Emerald', swatch: 'oklch(0.62 0.15 162)', brand: 'oklch(0.62 0.15 162)', fg: 'oklch(0.16 0.02 162)' },
  { id: 'amber', label: 'Amber', swatch: 'oklch(0.74 0.16 66)', brand: 'oklch(0.74 0.16 66)', fg: 'oklch(0.2 0.04 66)' },
  { id: 'rose', label: 'Rose', swatch: 'oklch(0.58 0.22 12)', brand: 'oklch(0.58 0.22 12)', fg: 'oklch(0.99 0 0)' },
]

const byId = Object.fromEntries(ACCENTS.map((a) => [a.id, a]))

function apply(id) {
  if (typeof document === 'undefined') return
  const accent = byId[id] || ACCENTS[0]
  const root = document.documentElement
  if (!accent.brand) {
    root.style.removeProperty('--brand')
    root.style.removeProperty('--brand-foreground')
  } else {
    root.style.setProperty('--brand', accent.brand)
    root.style.setProperty('--brand-foreground', accent.fg)
  }
}

const initial = (() => {
  try {
    return localStorage.getItem(STORAGE_KEY) || 'indigo'
  } catch {
    return 'indigo'
  }
})()

apply(initial)

export const useAccent = create((set) => ({
  accent: initial,
  setAccent: (id) => {
    apply(id)
    try {
      localStorage.setItem(STORAGE_KEY, id)
    } catch {
      /* ignore */
    }
    set({ accent: id })
  },
}))
