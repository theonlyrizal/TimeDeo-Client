import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ListingCard } from '@/components/marketplace/ListingCard'
import { EscrowSheet } from '@/components/escrow/EscrowSheet'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

export function RecommendedStrip({ className }) {
  const { t } = useTranslation()
  const listings = useAppStore((s) => s.listings)
  const [selected, setSelected] = useState(null)
  const [escrowOpen, setEscrowOpen] = useState(false)

  const recs = useMemo(
    () =>
      [...listings]
        .filter((l) => !l.mine)
        .sort((a, b) => Number(b.popular) - Number(a.popular) || b.rating - a.rating)
        .slice(0, 6),
    [listings],
  )

  function book(listing) {
    setSelected(listing)
    setEscrowOpen(true)
  }

  return (
    <section className={className}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            {t('dashboard.recommended')}
          </h2>
          <p className="text-sm text-muted-foreground">{t('dashboard.recommendedSub')}</p>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link to="/explore">
            {t('dashboard.exploreAll')}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="no-scrollbar mt-4 flex snap-x gap-4 overflow-x-auto pb-2">
        {recs.map((l) => (
          <ListingCard
            key={l.id}
            listing={l}
            onBook={book}
            className={cn('w-[280px] shrink-0 snap-start')}
          />
        ))}
      </div>

      <EscrowSheet open={escrowOpen} onOpenChange={setEscrowOpen} listing={selected} />
    </section>
  )
}
