import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, CalendarClock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/EmptyState'
import { BookingCard } from '@/components/bookings/BookingCard'
import { ACTIVE_STATUSES, useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

function dotColor(status) {
  if (status === 'in_progress') return 'bg-primary'
  if (status === 'pending') return 'bg-warning'
  return 'bg-success'
}

export function ActiveBookings({ className }) {
  const { t } = useTranslation()
  const bookings = useAppStore((s) => s.bookings)
  const active = bookings.filter((b) => ACTIVE_STATUSES.includes(b.status))

  return (
    <Card className={cn('flex flex-col p-6', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            {t('dashboard.activeBookings')}
          </h2>
          <p className="text-sm text-muted-foreground">
            {active.length > 0
              ? t('dashboard.activeCount', { count: active.length })
              : t('dashboard.nothing')}
          </p>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link to="/bookings">
            {t('dashboard.viewAll')}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-5 flex-1">
        {active.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title={t('dashboard.noActiveTitle')}
            description={t('dashboard.noActiveDesc')}
            action={
              <Button asChild>
                <Link to="/explore">{t('dashboard.browseMarketplace')}</Link>
              </Button>
            }
            className="h-full"
          />
        ) : (
          <ol className="relative">
            {active.map((b, i) => (
              <li key={b.id} className="relative pb-4 pl-7 last:pb-0">
                {i < active.length - 1 && (
                  <span className="absolute left-[10px] top-5 h-full w-px bg-border" />
                )}
                <span
                  className={cn(
                    'absolute left-1 top-3 size-3 rounded-full ring-4 ring-card',
                    dotColor(b.status),
                  )}
                />
                <BookingCard booking={b} />
              </li>
            ))}
          </ol>
        )}
      </div>
    </Card>
  )
}
