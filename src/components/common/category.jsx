import { Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { categoryById } from '@/data/categories'
import { cn } from '@/lib/utils'

export function CategoryChip({ id, withIcon = true, className }) {
  const { t } = useTranslation()
  const c = categoryById[id]
  if (!c) return null
  const Icon = c.icon
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground', className)}>
      {withIcon && <Icon className="size-3.5" />}
      {t(`categories.${id}`, c.label)}
    </span>
  )
}

export function CategoryGlyph({ id, className, iconClassName }) {
  const c = categoryById[id]
  const Icon = c?.icon ?? Sparkles
  return (
    <div
      className={cn(
        'grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-secondary text-foreground',
        className,
      )}
    >
      <Icon className={cn('size-4', iconClassName)} strokeWidth={2} />
    </div>
  )
}
