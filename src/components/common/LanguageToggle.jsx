import { useState } from 'react'
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
import { ApiConfigDialog } from '@/components/common/ApiConfigDialog'
import { LANGS } from '@/i18n'
import { cn } from '@/lib/utils'

export function LanguageToggle({ className }) {
  const { t, i18n } = useTranslation()
  const current = i18n.resolvedLanguage || i18n.language
  const [menuOpen, setMenuOpen] = useState(false)
  const [apiOpen, setApiOpen] = useState(false)

  const label = t('lang.label')
  const firstChar = label.charAt(0)
  const rest = label.slice(1)

  function openApiConfig(e) {
    e.preventDefault()
    e.stopPropagation()
    setMenuOpen(false)
    setApiOpen(true)
  }

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
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
          <DropdownMenuLabel>
            {/* Hidden trigger: the first letter opens the Data-source dialog.
                Cursor stays as text so it reads as an ordinary label. */}
            <span onClick={openApiConfig} className="cursor-text select-none">
              {firstChar}
            </span>
            {rest}
          </DropdownMenuLabel>
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

      <ApiConfigDialog open={apiOpen} onOpenChange={setApiOpen} />
    </>
  )
}
