import { useTranslation } from 'react-i18next'
import { CalendarClock, History, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { NewTradeMenu } from '@/components/trade/NewTradeMenu'
import { BookingCard } from '@/components/bookings/BookingCard'
import { BookingSkeleton } from '@/components/bookings/BookingSkeleton'
import { ACTIVE_STATUSES, useAppStore } from '@/store/useAppStore'

function BookingGrid({ items }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((b) => (
        <BookingCard key={b.id} booking={b} />
      ))}
    </div>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <BookingSkeleton key={i} />
      ))}
    </div>
  )
}

export default function Bookings() {
  const { t } = useTranslation()
  const loading = useAppStore((s) => !s.ready)
  const bookings = useAppStore((s) => s.bookings)
  const active = bookings.filter((b) => ACTIVE_STATUSES.includes(b.status))
  const history = bookings.filter((b) => !ACTIVE_STATUSES.includes(b.status))

  return (
    <div className="space-y-6">
      <PageHeader title={t('bookings.title')} description={t('bookings.desc')}>
        <NewTradeMenu
          align="end"
          trigger={
            <Button>
              <Plus />
              {t('nav.newTrade')}
            </Button>
          }
        />
      </PageHeader>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">
            {t('bookings.active')}
            <Badge variant="muted" className="px-1.5 py-0 text-[10px]">
              {active.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="history">
            {t('bookings.history')}
            <Badge variant="muted" className="px-1.5 py-0 text-[10px]">
              {history.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {loading ? (
            <SkeletonGrid />
          ) : active.length === 0 ? (
            <EmptyState
              icon={CalendarClock}
              title={t('bookings.noActiveTitle')}
              description={t('bookings.noActiveDesc')}
              action={
                <Button asChild>
                  <Link to="/explore">{t('bookings.browseMarketplace')}</Link>
                </Button>
              }
            />
          ) : (
            <BookingGrid items={active} />
          )}
        </TabsContent>

        <TabsContent value="history">
          {loading ? (
            <SkeletonGrid />
          ) : history.length === 0 ? (
            <EmptyState
              icon={History}
              title={t('bookings.noHistoryTitle')}
              description={t('bookings.noHistoryDesc')}
              action={
                <Button asChild>
                  <Link to="/explore">{t('bookings.findService')}</Link>
                </Button>
              }
            />
          ) : (
            <BookingGrid items={history} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
