import { useTranslation } from 'react-i18next'
import {
  CalendarDays,
  Check,
  MapPin,
  MessageSquareQuote,
  Pencil,
  Share2,
  Star,
  Timer,
} from 'lucide-react'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { EmptyState } from '@/components/common/EmptyState'
import { Rating } from '@/components/common/Rating'
import { ReviewCard } from '@/components/reviews/ReviewCard'
import { useAppStore } from '@/store/useAppStore'
import { formatMonthYear, initials } from '@/lib/format'

function Stat({ icon: Icon, label, value, children }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-caps text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold tabular-nums text-foreground">{value}</div>
      {children}
    </div>
  )
}

function ProfileCard({ user }) {
  const { t } = useTranslation()
  return (
    <Card className="overflow-hidden">
      <div className="relative h-24 border-b border-border bg-muted/50">
        <div className="absolute inset-0 bg-grid opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      </div>

      <div className="px-5 pb-5">
        <div className="-mt-9 flex items-end justify-between">
          <Avatar className="size-16 ring-4 ring-card">
            <AvatarFallback className="text-lg">{initials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex gap-1.5 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast(t('profile.editToast'), { description: t('common.comingSoon') })}
            >
              <Pencil className="size-3.5" />
              {t('profile.edit')}
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={t('profile.shareProfile')}
              onClick={() => toast.success(t('profile.linkCopied'))}
            >
              <Share2 className="size-4" />
            </Button>
          </div>
        </div>

        <div className="mt-3">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">{user.name}</h1>
          <p className="text-sm text-muted-foreground">
            {user.title ? `${user.title} · ` : ''}@{user.handle}
          </p>
          {user.location && (
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3.5" />
              {user.location}
            </p>
          )}
        </div>

        {user.bio && (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{user.bio}</p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <Stat icon={Star} label={t('profile.rating')} value={user.rating.toFixed(1)}>
            <Rating variant="stars" value={user.rating} className="mt-1" />
          </Stat>
          <Stat icon={Timer} label={t('profile.traded')} value={`${user.hoursTraded}h`} />
          <Stat icon={MessageSquareQuote} label={t('profile.reviews')} value={user.ratingCount} />
          <Stat icon={CalendarDays} label={t('profile.joined')} value={formatMonthYear(user.memberSince).split(' ')[1]}>
            <p className="mt-0.5 text-xs font-normal text-muted-foreground">
              {formatMonthYear(user.memberSince)}
            </p>
          </Stat>
        </div>

        <Separator className="my-4" />

        <p className="text-[11px] font-medium uppercase tracking-caps text-muted-foreground">
          {t('profile.skills')}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {user.skills.map((s) => (
            <span
              key={s}
              className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </Card>
  )
}

function ReviewSummary({ user, reviews }) {
  const { t } = useTranslation()
  const dist = [5, 4, 3, 2, 1].map((star) => reviews.filter((r) => r.rating === star).length)
  const max = Math.max(1, ...dist)

  return (
    <Card className="flex flex-col gap-6 p-5 sm:flex-row">
      <div className="flex flex-col items-center justify-center gap-1 sm:w-40">
        <span className="text-4xl font-semibold tracking-tight tabular-nums text-foreground">
          {user.rating.toFixed(1)}
        </span>
        <Rating variant="stars" value={user.rating} size="lg" />
        <span className="text-xs text-muted-foreground">
          {t('profile.reviewsCount', { count: user.ratingCount })}
        </span>
      </div>
      <div className="flex-1 space-y-1.5">
        {[5, 4, 3, 2, 1].map((star, i) => (
          <div key={star} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-3 tabular-nums">{star}</span>
            <Star className="size-3 fill-warning text-warning" />
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-warning transition-all"
                style={{ width: `${(dist[i] / max) * 100}%` }}
              />
            </div>
            <span className="w-5 text-right tabular-nums">{dist[i]}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

function AboutSection({ user }) {
  const { t } = useTranslation()
  return (
    <Card className="space-y-5 p-5">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-caps text-muted-foreground">
          {t('profile.bio')}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-foreground">{user.bio}</p>
      </div>
      <div>
        <p className="text-[11px] font-medium uppercase tracking-caps text-muted-foreground">
          {t('profile.offers')}
        </p>
        <ul className="mt-2 space-y-1.5">
          {user.offers.map((o) => (
            <li key={o} className="flex items-center gap-2 text-sm text-foreground">
              <Check className="size-4 text-success" strokeWidth={2.5} />
              {o}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}

function ProfileSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
      <Skeleton className="h-[520px] rounded-xl" />
      <div className="space-y-4">
        <Skeleton className="h-40 rounded-xl" />
        <div className="columns-1 gap-4 md:columns-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="mb-4 h-36 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Profile() {
  const { t } = useTranslation()
  const loading = useAppStore((s) => !s.ready)
  const user = useAppStore((s) => s.user)
  const reviews = useAppStore((s) => s.reviews)

  if (loading) return <ProfileSkeleton />

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <ProfileCard user={user} />
      </aside>

      <div>
        <Tabs defaultValue="reviews" className="space-y-5">
          <TabsList>
            <TabsTrigger value="reviews">{t('profile.reviews')}</TabsTrigger>
            <TabsTrigger value="about">{t('profile.about')}</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="space-y-5">
            {reviews.length === 0 ? (
              <EmptyState
                icon={MessageSquareQuote}
                title={t('profile.noReviewsTitle')}
                description={t('profile.noReviewsDesc')}
              />
            ) : (
              <>
                <ReviewSummary user={user} reviews={reviews} />
                <div className="columns-1 gap-4 md:columns-2">
                  {reviews.map((r) => (
                    <ReviewCard key={r.id} review={r} className="mb-4" />
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="about">
            <AboutSection user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
