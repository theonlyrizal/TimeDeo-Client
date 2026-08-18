import i18n from '@/i18n'

/** Locale string for Intl formatting, following the active UI language. */
function activeLocale() {
  const lng = i18n?.language || 'en'
  return lng.startsWith('bn') ? 'bn' : 'en-US'
}

/** Round to 2 decimals to keep credit math free of float drift. */
export function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

/** Duration formatting: 1.5 -> "1h 30m", 2 -> "2h", 0.5 -> "30m". */
export function formatHours(hours) {
  if (hours == null || Number.isNaN(hours)) return '—'
  const totalMin = Math.round(hours * 60)
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

/** Wallet display: integers stay whole, fractions show one decimal. */
export function creditDisplay(hours) {
  if (hours == null || Number.isNaN(hours)) return '0'
  return Number.isInteger(hours) ? String(hours) : hours.toFixed(1)
}

const RELATIVE = [
  ['year', 31536000],
  ['month', 2592000],
  ['week', 604800],
  ['day', 86400],
  ['hour', 3600],
  ['minute', 60],
]

/** "3 days ago", "in 2 hours", "just now". */
export function timeAgo(input) {
  const date = input instanceof Date ? input : new Date(input)
  const seconds = Math.round((date.getTime() - Date.now()) / 1000)
  const abs = Math.abs(seconds)
  if (abs < 45) return 'just now'
  const rtf = new Intl.RelativeTimeFormat(activeLocale(), { numeric: 'auto' })
  for (const [unit, secs] of RELATIVE) {
    if (abs >= secs || unit === 'minute') {
      return rtf.format(Math.round(seconds / secs), unit)
    }
  }
  return 'just now'
}

/** Compact weekday + time, e.g. "Tue, 14:00". */
export function formatWhen(input) {
  const date = input instanceof Date ? input : new Date(input)
  return date.toLocaleString(activeLocale(), {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export function formatMonthYear(input) {
  const date = input instanceof Date ? input : new Date(input)
  return date.toLocaleString(activeLocale(), { month: 'long', year: 'numeric' })
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
