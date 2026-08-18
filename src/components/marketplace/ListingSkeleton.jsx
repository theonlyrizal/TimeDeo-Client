import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function ListingSkeleton({ lines = 2, className }) {
  return (
    <div className={cn('rounded-xl border border-border bg-card p-4', className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
      <Skeleton className="mt-3 h-4 w-3/4" />
      <div className="mt-2 space-y-1.5">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-full" />
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
        <Skeleton className="size-6 rounded-full" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="ml-auto h-3 w-10" />
      </div>
      <Skeleton className="mt-3 h-8 w-full rounded-md" />
    </div>
  )
}

const HEIGHTS = [2, 3, 2, 4, 2, 3, 3, 2, 4]

export function ListingSkeletonGrid({ count = 9 }) {
  return (
    <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="mb-4 break-inside-avoid">
          <ListingSkeleton lines={HEIGHTS[i % HEIGHTS.length]} />
        </div>
      ))}
    </div>
  )
}
