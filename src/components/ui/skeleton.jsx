import { cn } from '@/lib/utils'

/**
 * Shimmering skeleton block. Compose these to match the exact shape of the
 * content they stand in for — never a spinner.
 */
function Skeleton({ className, ...props }) {
  return <div className={cn('shimmer rounded-md bg-muted', className)} {...props} />
}

export { Skeleton }
