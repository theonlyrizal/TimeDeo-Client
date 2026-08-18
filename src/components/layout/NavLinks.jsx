import { NavLink } from 'react-router-dom'
import { CalendarClock, Compass, LayoutDashboard, Settings, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export const NAV_ITEMS = [
  { to: '/dashboard', key: 'nav.home', icon: LayoutDashboard, end: true },
  { to: '/explore', key: 'nav.findHelp', icon: Compass },
  { to: '/bookings', key: 'nav.myTrades', icon: CalendarClock },
  { to: '/profile', key: 'nav.profile', icon: User },
  { to: '/settings', key: 'nav.settings', icon: Settings },
]

export function NavLinks({ onNavigate, className }) {
  const { t } = useTranslation()
  return (
    <nav className={cn('flex flex-col gap-1', className)}>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
                isActive
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    'absolute left-0 h-5 w-0.5 rounded-r-full bg-primary transition-opacity',
                    isActive ? 'opacity-100' : 'opacity-0',
                  )}
                />
                <Icon
                  className={cn(
                    'size-4 shrink-0 transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
                  )}
                  strokeWidth={2}
                />
                {t(item.key)}
              </>
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}
