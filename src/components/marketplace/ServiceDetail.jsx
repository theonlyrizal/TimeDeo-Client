import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Check, Clock, X } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Rating } from '@/components/common/Rating'
import { CategoryChip } from '@/components/common/category'
import { listingLayoutId } from './ListingCard'
import { useAppStore } from '@/store/useAppStore'
import { creditDisplay, formatHours, initials } from '@/lib/format'
import { cn } from '@/lib/utils'

export function ServiceDetail({ listing, onClose, onBook }) {
  const { t } = useTranslation()
  const balance = useAppStore((s) => s.wallet.balance)
  const affordable = balance >= listing.hours

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const bookButton = (
    <Button
      size="lg"
      onClick={() => affordable && onBook(listing)}
      aria-disabled={!affordable}
      className={cn('gap-1.5', !affordable && 'pointer-events-none opacity-50 grayscale')}
    >
      {t('listing.getThisHelp')}
    </Button>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-6 md:p-10">
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.article
        layoutId={listingLayoutId(listing.id)}
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid size-8 place-items-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={t('detail.close')}
        >
          <X className="size-4" />
        </button>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.2 }}
          className="p-6 sm:p-7"
        >
          <div className="flex items-center gap-2">
            <CategoryChip id={listing.category} />
            {listing.popular && <Badge variant="brand" className="h-5 px-1.5">{t('listing.popular')}</Badge>}
          </div>

          <h2 className="mt-3 max-w-lg text-balance text-xl font-semibold leading-tight tracking-tight text-foreground">
            {listing.title}
          </h2>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
            <div className="flex items-center gap-2">
              <Avatar className="size-8">
                <AvatarFallback className="text-xs">
                  {initials(listing.provider.name)}
                </AvatarFallback>
              </Avatar>
              <div className="leading-tight">
                <p className="text-sm font-medium text-foreground">{listing.provider.name}</p>
                <p className="text-xs text-muted-foreground">@{listing.provider.handle}</p>
              </div>
            </div>
            {listing.reviews > 0 && <Rating value={listing.rating} count={listing.reviews} />}
            {listing.skillName && (
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                {listing.skillName}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="size-4" />
              {t('detail.session', { hours: formatHours(listing.hours) })}
            </span>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            {listing.description}
          </p>

          {listing.deliverables?.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-medium uppercase tracking-caps text-muted-foreground">
                {t('detail.whatYouGet')}
              </p>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                {listing.deliverables.map((d) => (
                  <li key={d} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="size-4 shrink-0 text-success" strokeWidth={2.5} />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {listing.tags?.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {listing.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.16 }}
          className="flex items-center justify-between gap-4 border-t border-border bg-muted/30 px-6 py-4 sm:px-7"
        >
          <div className="text-sm">
            <p className="font-semibold text-foreground">
              {t('detail.youPayLine', { hours: formatHours(listing.hours) })}
            </p>
            <p className="text-xs text-muted-foreground">{t('detail.heldSafely')}</p>
          </div>
          {listing.mine ? (
            <span className="text-sm text-muted-foreground">{t('listing.yours')}</span>
          ) : affordable ? (
            bookButton
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0}>{bookButton}</span>
              </TooltipTrigger>
              <TooltipContent>
                {t('listing.costsTooltip', {
                  hours: formatHours(listing.hours),
                  balance: creditDisplay(balance),
                })}
              </TooltipContent>
            </Tooltip>
          )}
        </motion.div>
      </motion.article>
    </div>
  )
}
