import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

function RingsBackdrop() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 240 240"
      className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-56 -translate-x-1/2 -translate-y-1/2 text-border"
    >
      <circle cx="120" cy="120" r="44" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.9" />
      <circle
        cx="120"
        cy="120"
        r="70"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 6"
        opacity="0.6"
      />
      <circle cx="120" cy="120" r="98" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    </svg>
  )
}

/**
 * Illustrated empty state with a framed icon medallion, concentric rings,
 * a faint grid, and a prominent call to action. Never a blank panel.
 */
export function EmptyState({ icon: Icon, title, description, action, secondaryAction, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />
      <div className="relative">
        <RingsBackdrop />
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.08, type: 'spring', stiffness: 220, damping: 18 }}
          className="relative mx-auto grid size-14 place-items-center rounded-2xl border border-border bg-background shadow-md"
        >
          {Icon && <Icon className="size-6 text-primary" strokeWidth={1.75} />}
        </motion.div>
      </div>
      <h3 className="relative mt-6 text-base font-semibold tracking-tight text-foreground">{title}</h3>
      {description && (
        <p className="relative mt-1.5 max-w-sm text-balance text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {(action || secondaryAction) && (
        <div className="relative mt-6 flex flex-wrap items-center justify-center gap-2">
          {action}
          {secondaryAction}
        </div>
      )}
    </motion.div>
  )
}
