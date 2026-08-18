import { useTranslation } from 'react-i18next'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { CATEGORIES, DURATION_BUCKETS } from '@/data/categories'
import { cn } from '@/lib/utils'

const DUR_KEY = {
  short: 'explore.durShort',
  standard: 'explore.durStandard',
  long: 'explore.durLong',
  xl: 'explore.durXl',
}

function toggle(list, id) {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
}

function FacetRow({ checked, onChange, label, icon: Icon, count }) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-secondary/60',
        checked ? 'text-foreground' : 'text-muted-foreground',
      )}
    >
      <Checkbox checked={checked} onCheckedChange={onChange} />
      {Icon && <Icon className="size-4 text-muted-foreground" />}
      <span className="flex-1">{label}</span>
      {count != null && <span className="text-xs tabular-nums text-muted-foreground/70">{count}</span>}
    </label>
  )
}

function Section({ title, children }) {
  return (
    <div className="space-y-1">
      <p className="px-2 pb-1 text-[11px] font-medium uppercase tracking-caps text-muted-foreground">
        {title}
      </p>
      {children}
    </div>
  )
}

export function FacetSidebar({ cats, setCats, durations, setDurations, counts = {}, onReset, className }) {
  const { t } = useTranslation()
  const activeCount = cats.length + durations.length

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between px-2">
        <p className="text-sm font-semibold text-foreground">{t('explore.filters')}</p>
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 px-2 text-xs text-muted-foreground"
          >
            {t('explore.reset', { count: activeCount })}
          </Button>
        )}
      </div>

      <Section title={t('explore.category')}>
        {CATEGORIES.map((c) => (
          <FacetRow
            key={c.id}
            icon={c.icon}
            label={t(`categories.${c.id}`, c.label)}
            count={counts[c.id]}
            checked={cats.includes(c.id)}
            onChange={() => setCats(toggle(cats, c.id))}
          />
        ))}
      </Section>

      <Section title={t('explore.duration')}>
        {DURATION_BUCKETS.map((d) => (
          <FacetRow
            key={d.id}
            label={t(DUR_KEY[d.id], d.label)}
            checked={durations.includes(d.id)}
            onChange={() => setDurations(toggle(durations, d.id))}
          />
        ))}
      </Section>
    </div>
  )
}
