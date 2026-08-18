import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { OfferSkillDialog, PostRequestDialog } from './TradeDialogs'
import { FLOW, toneClasses } from '@/lib/flow'
import { cn } from '@/lib/utils'

/**
 * The single "New trade" entry point, reused in the sidebar, top bar, and
 * dashboard quick-action bar. `trigger` is the caller's styled button.
 */
export function NewTradeMenu({ trigger, align = 'start' }) {
  const { t } = useTranslation()
  const [dialog, setDialog] = useState(null) // 'request' | 'offer' | null

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent align={align} className="w-64">
          <DropdownMenuItem
            onSelect={() => setDialog('request')}
            className="items-start gap-3 py-2.5 [&_svg]:text-current"
          >
            <span className={cn('mt-0.5 grid size-7 shrink-0 place-items-center rounded-md', toneClasses[FLOW.get.tone].iconBg)}>
              <FLOW.get.icon className="size-4" />
            </span>
            <span className="flex flex-col">
              <span className="font-medium text-foreground">{t('newTrade.askTitle')}</span>
              <span className="text-xs text-muted-foreground">{t('newTrade.askDesc')}</span>
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setDialog('offer')} className="items-start gap-3 py-2.5 [&_svg]:text-current">
            <span className={cn('mt-0.5 grid size-7 shrink-0 place-items-center rounded-md', toneClasses[FLOW.give.tone].iconBg)}>
              <FLOW.give.icon className="size-4" />
            </span>
            <span className="flex flex-col">
              <span className="font-medium text-foreground">{t('newTrade.offerTitle')}</span>
              <span className="text-xs text-muted-foreground">{t('newTrade.offerDesc')}</span>
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PostRequestDialog
        open={dialog === 'request'}
        onOpenChange={(v) => setDialog(v ? 'request' : null)}
      />
      <OfferSkillDialog
        open={dialog === 'offer'}
        onOpenChange={(v) => setDialog(v ? 'offer' : null)}
      />
    </>
  )
}
