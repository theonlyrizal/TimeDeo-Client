import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Rating display.
 *  - variant="compact" (default): one star + numeric value (+ optional count)
 *  - variant="stars": five-star row for profile / review contexts
 */
export function Rating({
  value = 0,
  count,
  variant = 'compact',
  size = 'sm',
  className,
}) {
  const px = size === 'lg' ? 'size-4' : 'size-3.5'

  if (variant === 'stars') {
    return (
      <span className={cn('inline-flex items-center gap-0.5', className)} aria-label={`${value} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= Math.round(value)
          return (
            <Star
              key={i}
              className={cn(
                px,
                filled ? 'fill-warning text-warning' : 'fill-muted text-muted-foreground/40',
              )}
            />
          )
        })}
      </span>
    )
  }

  return (
    <span className={cn('inline-flex items-center gap-1 tabular-nums', className)}>
      <Star className={cn(px, 'fill-warning text-warning')} />
      <span className="font-medium text-foreground">{value.toFixed(1)}</span>
      {count != null && <span className="text-muted-foreground">({count})</span>}
    </span>
  )
}
