import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CalendarClock, HelpCircle, LogOut, Settings, User as UserIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAppStore } from '@/store/useAppStore'
import { useAuth } from '@/store/useAuth'
import { initials } from '@/lib/format'

export function UserMenu() {
  const user = useAppStore((s) => s.user)
  const resetApp = useAppStore((s) => s.reset)
  const logout = useAuth((s) => s.logout)
  const navigate = useNavigate()
  const { t } = useTranslation()

  async function handleSignOut() {
    await logout()
    resetApp()
    toast.success(t('userMenu.signedOut'))
    navigate('/login', { replace: true })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="rounded-full outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={t('userMenu.openAccount')}
        >
          <Avatar className="size-8">
            <AvatarFallback>{initials(user.name)}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <div className="flex items-center gap-2.5 p-2">
          <Avatar className="size-9">
            <AvatarFallback>{initials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">@{user.handle}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate('/profile')}>
          <UserIcon />
          {t('userMenu.profile')}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate('/bookings')}>
          <CalendarClock />
          {t('userMenu.myTrades')}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate('/settings')}>
          <Settings />
          {t('userMenu.settings')}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate('/')}>
          <HelpCircle />
          {t('userMenu.howItWorks')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={handleSignOut}>
          <LogOut />
          {t('userMenu.signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
