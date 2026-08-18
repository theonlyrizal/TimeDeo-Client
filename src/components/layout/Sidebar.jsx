import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Lock, Plus, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/common/Logo'
import { NavLinks } from './NavLinks'
import { NewTradeMenu } from '@/components/trade/NewTradeMenu'
import { useAppStore } from '@/store/useAppStore'
import { creditDisplay } from '@/lib/format'

function WalletMini() {
  const { t } = useTranslation()
  const wallet = useAppStore((s) => s.wallet)
  return (
    <div className="rounded-xl border border-border bg-background p-3.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-caps text-muted-foreground">
          {t('wallet.available')}
        </span>
        <Wallet className="size-3.5 text-muted-foreground" />
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">
          {creditDisplay(wallet.balance)}
        </span>
        <span className="text-xs text-muted-foreground">{t('common.hrs')}</span>
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="size-3" />
        {t('wallet.onHoldLine', { n: creditDisplay(wallet.escrow) })}
      </div>
    </div>
  )
}

export function Sidebar() {
  const { t } = useTranslation()
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-card/40 lg:flex">
      <div className="flex h-16 items-center px-5">
        <Link to="/dashboard" className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Logo />
        </Link>
      </div>

      <div className="px-3 pb-1">
        <NewTradeMenu
          trigger={
            <Button className="w-full justify-between">
              {t('nav.newTrade')}
              <Plus className="size-4" />
            </Button>
          }
        />
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2">
        <p className="px-3 pb-1.5 pt-2 text-[11px] font-medium uppercase tracking-caps text-muted-foreground">
          {t('nav.section')}
        </p>
        <NavLinks />
      </div>

      <div className="border-t border-border p-3">
        <Link to="/bookings" className="block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <WalletMini />
        </Link>
      </div>
    </aside>
  )
}
