import { useTranslation } from 'react-i18next'
import { ArrowDownLeft, ArrowUpRight, Lock, Wallet } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useAppStore } from '@/store/useAppStore'
import { creditDisplay } from '@/lib/format'
import { cn } from '@/lib/utils'

export function WalletWidget({ className }) {
  const { t } = useTranslation()
  const wallet = useAppStore((s) => s.wallet)
  const user = useAppStore((s) => s.user)
  const total = wallet.balance + wallet.escrow
  const availPct = total > 0 ? Math.round((wallet.balance / total) * 100) : 100

  return (
    <Card className={cn('flex flex-col p-6', className)}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-caps text-muted-foreground">
          {t('wallet.title')}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
          <Wallet className="size-3" />
          {t('wallet.timeCredits')}
        </span>
      </div>

      <div className="mt-5">
        <p className="text-sm text-muted-foreground">{t('wallet.availableToSpend')}</p>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-5xl font-semibold tracking-tighter tabular-nums text-foreground">
            {creditDisplay(wallet.balance)}
          </span>
          <span className="text-base text-muted-foreground">{t('common.hours')}</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{t('wallet.hourEqualsHour')}</p>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
        <Lock className="size-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{t('wallet.onHoldActive')}</span>
        <span className="ml-auto text-sm font-semibold tabular-nums text-foreground">
          {creditDisplay(wallet.escrow)} {t('common.hrs')}
        </span>
      </div>

      <div className="mt-5">
        <div className="flex h-2 overflow-hidden rounded-full bg-muted">
          <div className="bg-primary transition-all duration-500" style={{ width: `${availPct}%` }} />
          <div
            className="bg-foreground/25 transition-all duration-500"
            style={{ width: `${100 - availPct}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-primary" />
            {t('wallet.toSpend', { pct: availPct })}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-foreground/25" />
            {t('wallet.onHoldPct', { pct: 100 - availPct })}
          </span>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
        <div className="rounded-lg border border-border p-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ArrowDownLeft className="size-3.5 text-success" />
            {t('wallet.earned')}
          </div>
          <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">
            {user.hoursEarned}
            <span className="text-xs font-normal text-muted-foreground"> {t('common.hrs')}</span>
          </p>
        </div>
        <div className="rounded-lg border border-border p-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ArrowUpRight className="size-3.5 text-primary" />
            {t('wallet.spent')}
          </div>
          <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">
            {user.hoursSpent}
            <span className="text-xs font-normal text-muted-foreground"> {t('common.hrs')}</span>
          </p>
        </div>
      </div>
    </Card>
  )
}
