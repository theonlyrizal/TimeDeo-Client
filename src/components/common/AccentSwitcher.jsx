import { Check, Palette } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ACCENTS, useAccent } from '@/store/useAccent'
import { cn } from '@/lib/utils'

export function AccentSwitcher({ className }) {
  const { t } = useTranslation()
  const accent = useAccent((s) => s.accent)
  const setAccent = useAccent((s) => s.setAccent)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t('settings.accent')}
          className={cn('text-muted-foreground', className)}
        >
          <Palette className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>{t('settings.accent')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {ACCENTS.map((a) => (
          <DropdownMenuItem
            key={a.id}
            onSelect={() => setAccent(a.id)}
            className="justify-between"
          >
            <span className="flex items-center gap-2.5">
              <span
                className="size-4 rounded-full ring-1 ring-inset ring-black/15"
                style={{ background: a.swatch }}
              />
              <span className="text-foreground">{a.label}</span>
            </span>
            {accent === a.id && <Check className="size-4 text-foreground" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
