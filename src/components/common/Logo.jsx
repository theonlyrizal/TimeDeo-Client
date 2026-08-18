import { Clock3 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Logo({ className, showWordmark = true, size = 'md' }) {
  const box = size === 'sm' ? 'size-7' : 'size-8'
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn(
          'grid shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm',
          box,
        )}
      >
        <Clock3 className={size === 'sm' ? 'size-4' : 'size-[18px]'} strokeWidth={2.4} />
      </div>
      {showWordmark && (
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          Time<span className="text-primary">Deo</span>
        </span>
      )}
    </div>
  )
}
