import { useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Search, SearchX, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { FacetSidebar } from '@/components/marketplace/FacetSidebar'
import { ListingCard } from '@/components/marketplace/ListingCard'
import { ListingSkeletonGrid } from '@/components/marketplace/ListingSkeleton'
import { ServiceDetail } from '@/components/marketplace/ServiceDetail'
import { EscrowSheet } from '@/components/escrow/EscrowSheet'
import { DURATION_BUCKETS } from '@/data/categories'
import { useAppStore } from '@/store/useAppStore'

const SORTS = {
  popular: { labelKey: 'explore.sortPopular', fn: (a, b) => Number(b.popular) - Number(a.popular) || b.rating - a.rating },
  rating: { labelKey: 'explore.sortRating', fn: (a, b) => b.rating - a.rating },
  shortest: { labelKey: 'explore.sortShortest', fn: (a, b) => a.hours - b.hours },
}

export default function Explore() {
  const { t } = useTranslation()
  const listings = useAppStore((s) => s.listings)
  const loading = useAppStore((s) => !s.ready)

  const [query, setQuery] = useState('')
  const [cats, setCats] = useState([])
  const [durations, setDurations] = useState([])
  const [sort, setSort] = useState('popular')

  const [selected, setSelected] = useState(null)
  const [bookListing, setBookListing] = useState(null)
  const [escrowOpen, setEscrowOpen] = useState(false)
  const [mobileFilters, setMobileFilters] = useState(false)

  const counts = useMemo(() => {
    const map = {}
    for (const l of listings) map[l.category] = (map[l.category] || 0) + 1
    return map
  }, [listings])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = listings.filter((l) => {
      if (cats.length && !cats.includes(l.category)) return false
      if (durations.length) {
        const ok = durations.some((id) => DURATION_BUCKETS.find((d) => d.id === id)?.test(l.hours))
        if (!ok) return false
      }
      if (q) {
        const hay = `${l.title} ${l.summary} ${l.provider.name} ${(l.tags || []).join(' ')}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
    return [...filtered].sort(SORTS[sort].fn)
  }, [listings, cats, durations, query, sort])

  function reset() {
    setCats([])
    setDurations([])
    setQuery('')
  }

  function openEscrow(listing) {
    setSelected(null)
    setBookListing(listing)
    setEscrowOpen(true)
  }

  const facetProps = { cats, setCats, durations, setDurations, counts, onReset: reset }

  return (
    <div className="space-y-6">
      <PageHeader title={t('explore.title')} description={t('explore.desc')} />

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('explore.searchPlaceholder')}
            className="pl-9 pr-9"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label={t('explore.clearSearch')}
              className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-full sm:w-[170px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(SORTS).map(([id, s]) => (
              <SelectItem key={id} value={id}>
                {t(s.labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Sheet open={mobileFilters} onOpenChange={setMobileFilters}>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden">
              <SlidersHorizontal className="size-4" />
              {t('explore.filters')}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto p-6" aria-describedby={undefined}>
            <SheetTitle className="sr-only">{t('explore.filters')}</SheetTitle>
            <FacetSidebar {...facetProps} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Body */}
      <div className="grid gap-6 lg:grid-cols-[248px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <FacetSidebar {...facetProps} />
          </div>
        </aside>

        <div>
          <p className="mb-3 text-sm text-muted-foreground">
            {loading ? t('explore.loading') : t('explore.results', { count: results.length })}
          </p>

          {loading ? (
            <ListingSkeletonGrid count={9} />
          ) : results.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title={t('explore.noMatchTitle')}
              description={t('explore.noMatchDesc')}
              action={<Button onClick={reset}>{t('explore.clearFilters')}</Button>}
            />
          ) : (
            <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
              {results.map((l) => (
                <div key={l.id} className="mb-4 break-inside-avoid">
                  <ListingCard
                    listing={l}
                    enableLayout
                    onSelect={() => setSelected(l)}
                    onBook={openEscrow}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <ServiceDetail
            key={selected.id}
            listing={selected}
            onClose={() => setSelected(null)}
            onBook={openEscrow}
          />
        )}
      </AnimatePresence>

      <EscrowSheet open={escrowOpen} onOpenChange={setEscrowOpen} listing={bookListing} />
    </div>
  )
}
