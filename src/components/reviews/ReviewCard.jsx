import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Rating } from '@/components/common/Rating'
import { formatHours, initials, timeAgo } from '@/lib/format'
import { cn } from '@/lib/utils'

export function ReviewCard({ review, className }) {
  return (
    <figure
      className={cn(
        'break-inside-avoid rounded-xl border border-border bg-card p-4 shadow-sm',
        className,
      )}
    >
      <div className="flex items-center gap-2.5">
        <Avatar className="size-8">
          <AvatarFallback className="text-[10px]">{initials(review.author.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{review.author.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            @{review.author.handle} · {timeAgo(review.date)}
          </p>
        </div>
        <Rating variant="stars" value={review.rating} />
      </div>

      <blockquote className="mt-3 text-sm leading-relaxed text-foreground">{review.text}</blockquote>

      <figcaption className="mt-3 flex items-center gap-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="font-medium text-foreground/80">{review.service}</span>
        <span aria-hidden>·</span>
        <span>{formatHours(review.hours)}</span>
      </figcaption>
    </figure>
  )
}
