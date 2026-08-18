import { HandHeart, HandHelping } from 'lucide-react'

/**
 * The two directions of every trade on TimeDeo, in plain language.
 *
 *  get  — you SPEND your hours to receive someone's help  (role: requester)
 *  give — you EARN hours by helping someone else           (role: provider)
 *
 * Everything user-facing (labels, colors, icons, +/- signs) derives from here
 * so the two directions never get confused.
 */
export const FLOW = {
  get: {
    key: 'get',
    role: 'requester',
    title: 'Getting help',
    youLine: 'You get help',
    action: 'Get this help',
    verb: 'Spend',
    sign: '−',
    icon: HandHelping,
    tone: 'primary',
  },
  give: {
    key: 'give',
    role: 'provider',
    title: 'Giving help',
    youLine: "You're helping",
    action: 'Offer your time',
    verb: 'Earn',
    sign: '+',
    icon: HandHeart,
    tone: 'success',
  },
}

export function flowForRole(role) {
  return role === 'requester' ? FLOW.get : FLOW.give
}

/** Tailwind class fragments per tone, using design tokens only. */
export const toneClasses = {
  primary: {
    text: 'text-primary',
    chip: 'bg-primary/12 text-primary ring-1 ring-inset ring-primary/25',
    soft: 'bg-primary/[0.06] border-primary/20',
    dot: 'bg-primary',
    iconBg: 'bg-primary/12 text-primary',
  },
  success: {
    text: 'text-success',
    chip: 'bg-success/12 text-success ring-1 ring-inset ring-success/25',
    soft: 'bg-success/[0.06] border-success/20',
    dot: 'bg-success',
    iconBg: 'bg-success/12 text-success',
  },
}
