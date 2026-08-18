import { useTranslation } from 'react-i18next'
import { Plus, Star, Timer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/common/PageHeader'
import { NewTradeMenu } from '@/components/trade/NewTradeMenu'
import { WalletWidget } from '@/components/dashboard/WalletWidget'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { StatTile } from '@/components/dashboard/StatTile'
import { ActiveBookings } from '@/components/dashboard/ActiveBookings'
import { RecommendedStrip } from '@/components/dashboard/RecommendedStrip'
import { useAppStore } from '@/store/useAppStore'

function greetingKey(date = new Date()) {
  const h = date.getHours()
  if (h < 12) return 'dashboard.greetingMorning'
  if (h < 18) return 'dashboard.greetingAfternoon'
  return 'dashboard.greetingEvening'
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Skeleton className="h-[380px] rounded-xl md:col-span-2 xl:col-span-2 xl:row-span-2" />
        <Skeleton className="h-[188px] rounded-xl md:col-span-2 xl:col-span-2" />
        <Skeleton className="h-[188px] rounded-xl" />
        <Skeleton className="h-[188px] rounded-xl" />
        <Skeleton className="h-72 rounded-xl md:col-span-2 xl:col-span-4" />
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { t } = useTranslation()
  const loading = useAppStore((s) => !s.ready)
  const user = useAppStore((s) => s.user)

  if (loading) return <DashboardSkeleton />

  return (
    <div className="space-y-6">
      <PageHeader
        title={t(greetingKey(), { name: user.name.split(' ')[0] })}
        description={t('dashboard.subtitle')}
      >
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <WalletWidget className="md:col-span-2 xl:col-span-2 xl:row-span-2" />
        <QuickActions className="md:col-span-2 xl:col-span-2" />
        <StatTile
          icon={Star}
          label={t('dashboard.yourRating')}
          value={user.rating.toFixed(1)}
          sub={t('dashboard.fromReviews', { count: user.ratingCount })}
        />
        <StatTile
          icon={Timer}
          label={t('dashboard.hoursTraded')}
          value={user.hoursTraded}
          unit={t('common.hrs')}
          sub={t('dashboard.allTime')}
        />
        <ActiveBookings className="md:col-span-2 xl:col-span-4" />
      </div>

      <RecommendedStrip />
    </div>
  )
}
