import { Skeleton } from '@/components/ui/skeleton'

export function BookingSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <Skeleton className="size-9 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-3 w-28" />
          <Skeleton className="mt-3 h-1.5 w-full rounded-full" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}
