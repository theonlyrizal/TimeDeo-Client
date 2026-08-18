import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { CalendarClock, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CategoryGlyph } from '@/components/common/category'
import { BookingStatusBadge } from './BookingStatusBadge'
import { useAppStore } from '@/store/useAppStore'
import { flowForRole, toneClasses } from '@/lib/flow'
import { formatHours, formatWhen, timeAgo } from '@/lib/format'
import { cn } from '@/lib/utils'

export function BookingCard({ booking, className }) {
  const { t } = useTranslation()
  const completeBooking = useAppStore((s) => s.completeBooking)

  const flow = flowForRole(booking.role)
  const tone = toneClasses[flow.tone]
  const FlowIcon = flow.icon
  const isRequester = booking.role === 'requester'
  // Backend complete_booking accepts pending or in_progress. The requester's own
  // pending booking waits on the provider, so only expose "complete" when it's
  // in progress (requester) or at any active stage (provider delivering).
  const canComplete = booking.status === 'in_progress' || (booking.status === 'pending' && !isRequester)

  async function handleComplete() {
    const res = await completeBooking(booking.id)
    if (res.ok) {
      toast.success(isRequester ? t('booking.toastCompleteTitle') : t('booking.toastDeliveredTitle'), {
        description: isRequester
          ? t('booking.toastReleased', {
              hours: formatHours(booking.hours),
              name: booking.counterparty.name,
            })
          : t('booking.toastEarned', { hours: formatHours(booking.hours) }),
      })
    } else {
      toast.error(t('booking.toastFailTitle'), {
        description: res.error || t('booking.toastFailDesc'),
        action: { label: t('booking.retry'), onClick: handleComplete },
      })
    }
  }

  return (
    <motion.div
      layout
      className={cn('rounded-xl border border-border bg-card p-4 shadow-sm transition-colors', className)}
    >
      <div className="flex items-start gap-3">
        <CategoryGlyph id={booking.category} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="truncate text-sm font-medium text-foreground">{booking.title}</h4>
              <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-muted-foreground">
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-medium',
                    tone.chip,
                  )}
                >
                  <FlowIcon className="size-3" />
                  {t(`flow.${flow.key}Title`)}
                </span>
                <span className="truncate">
                  {isRequester ? t('booking.from') : t('booking.for')} {booking.counterparty.name}
                </span>
              </p>
            </div>
            <BookingStatusBadge status={booking.status} />
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
            <span className={cn('inline-flex items-center gap-1 font-semibold tabular-nums', tone.text)}>
              {flow.sign}
              {formatHours(booking.hours)}
              <span className="font-normal text-muted-foreground">
                {' '}
                {isRequester ? t('booking.spend') : t('booking.earn')}
              </span>
            </span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <CalendarClock className="size-3.5" />
              {booking.status === 'completed' && booking.completedAt
                ? t('booking.doneAgo', { ago: timeAgo(booking.completedAt) })
                : formatWhen(booking.scheduledAt)}
            </span>
          </div>

          {booking.status === 'in_progress' && (
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{t('booking.progress')}</span>
                <span className="tabular-nums">{booking.progress}%</span>
              </div>
              <Progress value={booking.progress} className="h-1.5" indicatorClassName={tone.dot} />
            </div>
          )}

          <div className="mt-3.5 flex items-center gap-2">
            {canComplete && (
              <Button size="sm" onClick={handleComplete} className="gap-1.5">
                <Check className="size-3.5" />
                {isRequester ? t('booking.confirmDone') : t('booking.markDelivered')}
              </Button>
            )}

            {booking.status === 'pending' && isRequester && (
              <span className="text-xs text-muted-foreground">{t('booking.waiting')}</span>
            )}

            {booking.status === 'completed' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
                <Check className="size-3.5" />
                {t('booking.settled')}
              </span>
            )}

            {booking.status === 'cancelled' && (
              <span className="text-xs text-muted-foreground">{t('status.cancelled')}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
