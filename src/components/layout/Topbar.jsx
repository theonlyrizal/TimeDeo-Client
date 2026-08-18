import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Lock, Menu, Plus, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Logo } from '@/components/common/Logo'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { AccentSwitcher } from '@/components/common/AccentSwitcher'
import { LanguageToggle } from '@/components/common/LanguageToggle'
import { NavLinks } from './NavLinks'
import { UserMenu } from './UserMenu'
import { NewTradeMenu } from '@/components/trade/NewTradeMenu'
import { useAppStore } from '@/store/useAppStore'
import { creditDisplay } from '@/lib/format'

function BalanceChip() {
  const wallet = useAppStore((s) => s.wallet)
  const { t } = useTranslation()
  return (
    <Link
      to="/bookings"
      className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm shadow-xs outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex"
    >
      <Wallet className="size-4 text-primary" />
      <span className="font-semibold tabular-nums text-foreground">
        {creditDisplay(wallet.balance)}
      </span>
      <span className="text-muted-foreground">{t('common.hrs')}</span>
      <span className="h-3.5 w-px bg-border" />
      <Lock className="size-3.5 text-muted-foreground" />
      <span className="tabular-nums text-muted-foreground">{creditDisplay(wallet.escrow)}</span>
    </Link>
  )
}

function MobileNav() {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label={t('nav.menu')}>
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 gap-0 p-0" aria-describedby={undefined}>
        <SheetTitle className="sr-only">{t('nav.menu')}</SheetTitle>
        <div className="flex h-16 items-center px-5">
          <Logo />
        </div>
        <div className="px-3 pb-2">
          <NewTradeMenu trigger={<Button className="w-full">{t('nav.newTrade')}</Button>} />
        </div>
        <div className="px-3">
          <NavLinks onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function Topbar() {
  const { t } = useTranslation()
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <MobileNav />
      <Link
        to="/dashboard"
        className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
      >
        <Logo showWordmark={false} />
      </Link>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <BalanceChip />
        <NewTradeMenu
          align="end"
          trigger={
            <Button size="sm" className="hidden sm:inline-flex">
              <Plus />
              {t('nav.new')}
            </Button>
          }
        />
        <LanguageToggle />
        <AccentSwitcher />
        <ThemeToggle />
        <span className="mx-1 hidden h-6 w-px bg-border sm:block" />
        <UserMenu />
      </div>
    </header>
  )
}
