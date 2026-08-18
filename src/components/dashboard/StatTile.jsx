import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function StatTile({ icon: Icon, label, value, unit, sub, className }) {
  return (
    <Card className={cn('flex flex-col justify-between p-5', className)}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-caps text-muted-foreground">
          {label}
        </span>
        {Icon && <Icon className="size-4 text-muted-foreground" />}
      </div>
      <div className="mt-4">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-semibold tracking-tight tabular-nums text-foreground">
            {value}
          </span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
        {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
      </div>
    </Card>
  )
}
