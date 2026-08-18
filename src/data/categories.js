import {
  Palette,
  Code2,
  GraduationCap,
  Wrench,
  HeartPulse,
  PenLine,
  Music,
  Languages,
  Camera,
  Briefcase,
} from 'lucide-react'

export const CATEGORIES = [
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'development', label: 'Development', icon: Code2 },
  { id: 'tutoring', label: 'Tutoring', icon: GraduationCap },
  { id: 'home-repair', label: 'Home & Repair', icon: Wrench },
  { id: 'wellness', label: 'Wellness', icon: HeartPulse },
  { id: 'writing', label: 'Writing', icon: PenLine },
  { id: 'music', label: 'Music', icon: Music },
  { id: 'languages', label: 'Languages', icon: Languages },
  { id: 'photography', label: 'Photography', icon: Camera },
  { id: 'business', label: 'Business', icon: Briefcase },
]

export const categoryById = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]))

export const DURATION_BUCKETS = [
  { id: 'short', label: 'Under 1 hour', test: (h) => h < 1 },
  { id: 'standard', label: '1–2 hours', test: (h) => h >= 1 && h <= 2 },
  { id: 'long', label: '2–4 hours', test: (h) => h > 2 && h <= 4 },
  { id: 'xl', label: '4+ hours', test: (h) => h > 4 },
]

export const MODES = [
  { id: 'online', label: 'Online' },
  { id: 'local', label: 'Local' },
]
