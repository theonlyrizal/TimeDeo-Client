import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Clock } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Rating } from '@/components/common/Rating'
import { CategoryChip } from '@/components/common/category'
import { useAppStore } from '@/store/useAppStore'
import { creditDisplay, formatHours, initials } from '@/lib/format'
import { cn } from '@/lib/utils'

export const listingLayoutId = (id) => `listing-card-${id}`

export function ListingCard({ listing, onSelect, onBook, enableLayout = false, className }) {
  const { t } = useTranslation()
  const balance = useAppStore((s) => s.wallet.balance)
  const affordable = balance >= listing.hours

  function book(e) {
    e.stopPropagation()
    onBook?.(listing)
  }

  const bookButton = (
    <Button
      size="sm"
      onClick={affordable ? book : (e) => e.stopPropagation()}
      aria-disabled={!affordable}
      className={cn('shrink-0', !affordable && 'pointer-events-none cursor-not-allowed opacity-50 grayscale')}
      tabIndex={affordable ? 0 : -1}
    >
      {t('listing.getThisHelp')}
    </Button>
  )

  return (
    <motion.article
      layoutId={enableLayout ? listingLayoutId(listing.id) : undefined}
      onClick={onSelect}
      className={cn(
        'group relative flex flex-col rounded-xl border border-border bg-card p-4 text-left shadow-sm',
        'transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md',
        onSelect && 'cursor-pointer',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <CategoryChip id={listing.category} />
        {listing.popular && <Badge variant="brand" className="h-5 px-1.5">{t('listing.popular')}</Badge>}
        {listing.mine && <Badge variant="muted" className="h-5 px-1.5">{t('listing.yours')}</Badge>}
      </div>

      <h3 className="mt-3 text-balance text-[15px] font-semibold leading-snug tracking-tight text-foreground">
        {listing.title}
      </h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{listing.summary}</p>

      {listing.tags?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {listing.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
        <Avatar className="size-6">
          <AvatarFallback className="text-[10px]">{initials(listing.provider.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-foreground">{listing.provider.name}</p>
          {listing.skillName && (
            <p className="truncate text-[11px] text-muted-foreground">{listing.skillName}</p>
          )}
        </div>
        {listing.rating > 0 && <Rating value={listing.rating} size="sm" className="ml-auto text-xs" />}
      </div>

      <div className="mt-3 flex items-end justify-between gap-2">
        <div className="leading-tight">
          <p className="text-[11px] text-muted-foreground">{t('listing.youPay')}</p>
          <p className="flex items-center gap-1 text-sm font-semibold tabular-nums text-primary">
            <Clock className="size-3.5" />
            {t('listing.ofYourTime', { hours: formatHours(listing.hours) })}
          </p>
        </div>

        {listing.mine ? (
          <span className="text-xs text-muted-foreground">{t('listing.yours')}</span>
        ) : affordable ? (
          bookButton
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="block" onClick={(e) => e.stopPropagation()}>
                {bookButton}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {t('listing.costsTooltip', {
                hours: formatHours(listing.hours),
                balance: creditDisplay(balance),
              })}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </motion.article>
  )
}
