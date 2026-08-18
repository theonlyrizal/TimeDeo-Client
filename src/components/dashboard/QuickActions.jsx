import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowUpRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { OfferSkillDialog, PostRequestDialog } from '@/components/trade/TradeDialogs'
import { FLOW, toneClasses } from '@/lib/flow'
import { cn } from '@/lib/utils'

const ACTIONS = [
  { id: 'request', flow: FLOW.get, titleKey: 'quickActions.askTitle', descKey: 'quickActions.askDesc' },
  { id: 'offer', flow: FLOW.give, titleKey: 'quickActions.offerTitle', descKey: 'quickActions.offerDesc' },
]

export function QuickActions({ className }) {
  const { t } = useTranslation()
  const [dialog, setDialog] = useState(null)

  return (
    <Card className={cn('flex flex-col p-5', className)}>
      <span className="text-[11px] font-medium uppercase tracking-caps text-muted-foreground">
        {t('quickActions.title')}
      </span>

      <div className="mt-4 grid flex-1 gap-3 sm:grid-cols-2">
        {ACTIONS.map((a) => {
          const Icon = a.flow.icon
          const tone = toneClasses[a.flow.tone]
          return (
            <button
              key={a.id}
              onClick={() => setDialog(a.id)}
              className="group flex flex-col items-start gap-3 rounded-xl border border-border bg-background p-4 text-left outline-none transition-[transform,border-color,box-shadow] hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className={cn('grid size-9 place-items-center rounded-lg', tone.iconBg)}>
                <Icon className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1 font-medium text-foreground">
                  {t(a.titleKey)}
                  <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{t(a.descKey)}</span>
              </span>
            </button>
          )
        })}
      </div>

      <PostRequestDialog
        open={dialog === 'request'}
        onOpenChange={(v) => setDialog(v ? 'request' : null)}
      />
      <OfferSkillDialog open={dialog === 'offer'} onOpenChange={(v) => setDialog(v ? 'offer' : null)} />
    </Card>
  )
}
