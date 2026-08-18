import { Check, Globe } from 'lucide-react'
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
import { LANGS } from '@/i18n'
import { cn } from '@/lib/utils'

export function LanguageToggle({ className }) {
  const { t, i18n } = useTranslation()
  const current = i18n.resolvedLanguage || i18n.language

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t('lang.label')}
          className={cn('text-muted-foreground', className)}
        >
          <Globe className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>{t('lang.label')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LANGS.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onSelect={() => i18n.changeLanguage(l.code)}
            className="justify-between"
          >
            <span className="text-foreground">{l.native}</span>
            {current === l.code && <Check className="size-4 text-foreground" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
