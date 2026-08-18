import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Lock,
  ShieldCheck,
  TriangleAlert,
  User,
  Wallet,
} from 'lucide-react'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { CategoryGlyph } from '@/components/common/category'
import { Rating } from '@/components/common/Rating'
import { useAppStore } from '@/store/useAppStore'
import { creditDisplay, formatHours, formatWhen, initials, round2 } from '@/lib/format'
import { cn } from '@/lib/utils'

const STEP_KEYS = ['escrow.stepReview', 'escrow.stepSchedule', 'escrow.stepConfirm']

function useSlots() {
  return useMemo(() => {
    const now = new Date()
    const mk = (addDays, hour) => {
      const d = new Date(now)
      d.setDate(d.getDate() + addDays)
      d.setHours(hour, 0, 0, 0)
      return d
    }
    return [mk(1, 10), mk(1, 15), mk(2, 11), mk(3, 14)].map((d, i) => ({
      id: String(i),
      at: d.toISOString(),
    }))
  }, [])
}

function Stepper({ step }) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-1.5">
      {STEP_KEYS.map((key, i) => {
        const state = i < step ? 'done' : i === step ? 'active' : 'todo'
        return (
          <div key={key} className="flex items-center gap-1.5">
            <div
              className={cn(
                'flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
                state === 'active' && 'bg-primary/12 text-primary ring-1 ring-inset ring-primary/25',
                state === 'done' && 'text-foreground',
                state === 'todo' && 'text-muted-foreground',
              )}
            >
              <span
                className={cn(
                  'grid size-5 place-items-center rounded-full text-[11px] font-semibold',
                  state === 'active' && 'bg-primary text-primary-foreground',
                  state === 'done' && 'bg-success text-success-foreground',
                  state === 'todo' && 'bg-muted text-muted-foreground',
                )}
              >
                {state === 'done' ? <Check className="size-3" strokeWidth={3} /> : i + 1}
              </span>
              <span className="hidden sm:inline">{t(key)}</span>
            </div>
            {i < STEP_KEYS.length - 1 && <span className="h-px w-3 bg-border" />}
          </div>
        )
      })}
    </div>
  )
}

function EscrowNode({ icon: Icon, label, sub, highlight }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1.5 text-center">
      <div
        className={cn(
          'grid size-11 place-items-center rounded-xl border',
          highlight
            ? 'border-primary/30 bg-primary/12 text-primary'
            : 'border-border bg-background text-muted-foreground',
        )}
      >
        <Icon className="size-5" />
      </div>
      <div className="leading-tight">
        <p className="text-[11px] font-medium text-foreground">{label}</p>
        <p className="text-[10px] text-muted-foreground">{sub}</p>
      </div>
    </div>
  )
}

function Connector({ active }) {
  return (
    <div className="relative mb-6 h-px flex-1 bg-border">
      {active && (
        <motion.span
          className="absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-primary"
          initial={{ left: '0%', opacity: 0 }}
          animate={{ left: ['0%', '100%'], opacity: [0, 1, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </div>
  )
}

function EscrowDiagram({ providerName, active }) {
  const { t } = useTranslation()
  return (
    <div className="flex items-start justify-between gap-1 rounded-xl border border-border bg-muted/40 p-4">
      <EscrowNode icon={Wallet} label={t('escrow.diagramYou')} sub={t('escrow.diagramYouSub')} />
      <Connector active={active} />
      <EscrowNode
        icon={Lock}
        label={t('escrow.diagramHeld')}
        sub={t('escrow.diagramHeldSub')}
        highlight
      />
      <Connector active={active} />
      <EscrowNode
        icon={User}
        label={providerName.split(' ')[0]}
        sub={t('escrow.diagramDoneSub')}
      />
    </div>
  )
}

const stepMotion = {
  initial: { opacity: 0, x: 14 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -14 },
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
}

export function EscrowSheet({ open, onOpenChange, listing }) {
  const { t } = useTranslation()
  const balance = useAppStore((s) => s.wallet.balance)
  const bookService = useAppStore((s) => s.bookService)
  const navigate = useNavigate()
  const slots = useSlots()

  const [step, setStep] = useState(0)
  const [slot, setSlot] = useState(slots[0].at)
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (open) {
      setStep(0)
      setSlot(slots[0].at)
      setNote('')
      setSubmitting(false)
      setDone(false)
    }
  }, [open, listing?.id, slots])

  if (!listing) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full gap-0 p-0 sm:max-w-lg" aria-describedby={undefined}>
          <SheetTitle className="sr-only">{t('escrow.titleBook')}</SheetTitle>
        </SheetContent>
      </Sheet>
    )
  }

  const hours = listing.hours
  const affordable = balance >= hours
  const deficit = round2(hours - balance)
  const providerFirst = listing.provider.name.split(' ')[0]

  async function handleConfirm() {
    setSubmitting(true)
    const res = await bookService({ listing, note, scheduledAt: slot })
    setSubmitting(false)
    if (res.ok) {
      setDone(true)
      setStep(3)
      toast.success(t('escrow.toastLockedTitle'), {
        description: t('escrow.toastLockedDesc', { hours: formatHours(hours), title: listing.title }),
      })
    } else if (res.reason === 'insufficient') {
      toast.error(t('escrow.toastInsufficientTitle'), {
        description: t('escrow.toastInsufficientDesc'),
      })
    } else {
      toast.error(t('escrow.toastFailTitle'), { description: t('escrow.toastFailDesc') })
    }
  }

  const continueButton = (
    <Button
      onClick={() => (step === 2 ? handleConfirm() : setStep(step + 1))}
      disabled={(step === 0 && !affordable) || submitting}
      className={cn('gap-1.5', step === 0 && !affordable && 'grayscale')}
    >
      {step === 2 ? (
        submitting ? (
          <>
            <Lock className="size-4 animate-pulse" />
            {t('escrow.locking')}
          </>
        ) : (
          <>
            <Lock className="size-4" />
            {t('escrow.lockButton', { hours: formatHours(hours) })}
          </>
        )
      ) : (
        <>
          {t('common.continue')}
          <ArrowRight className="size-4" />
        </>
      )}
    </Button>
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="flex w-full flex-col gap-0 p-0 sm:max-w-lg"
        aria-describedby="escrow-desc"
      >
        <div className="border-b border-border p-6">
          <SheetTitle className="text-lg font-semibold tracking-tight">
            {done ? t('escrow.titleDone') : t('escrow.titleBook')}
          </SheetTitle>
          <SheetDescription id="escrow-desc" className="mt-0.5">
            {done ? t('escrow.descDone') : t('escrow.descBook')}
          </SheetDescription>
          {!done && (
            <div className="mt-4">
              <Stepper step={step} />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <motion.div key={step} {...stepMotion}>
            {/* STEP 0 — REVIEW */}
            {step === 0 && (
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <CategoryGlyph id={listing.category} className="size-11" />
                  <div className="min-w-0">
                    <h3 className="text-balance font-semibold leading-snug tracking-tight text-foreground">
                      {listing.title}
                    </h3>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Avatar className="size-5">
                        <AvatarFallback className="text-[9px]">
                          {initials(listing.provider.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">{listing.provider.name}</span>
                      <Rating value={listing.rating} className="text-xs" />
                    </div>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {listing.description}
                </p>

                {listing.deliverables?.length > 0 && (
                  <ul className="space-y-1.5">
                    {listing.deliverables.map((d) => (
                      <li key={d} className="flex items-center gap-2 text-sm text-foreground">
                        <Check className="size-4 text-success" strokeWidth={2.5} />
                        {d}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t('escrow.youSpend')}</span>
                    <span className="inline-flex items-center gap-1 font-semibold tabular-nums text-primary">
                      <Clock className="size-3.5" />
                      {t('escrow.ofYourTime', { hours: formatHours(hours) })}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t('escrow.availableNow')}</span>
                    <span className="tabular-nums text-foreground">
                      {creditDisplay(balance)} {t('common.hrs')}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-sm">
                    <span className="text-muted-foreground">{t('escrow.availableAfter')}</span>
                    <span
                      className={cn(
                        'tabular-nums font-medium',
                        affordable ? 'text-foreground' : 'text-destructive',
                      )}
                    >
                      {creditDisplay(round2(balance - hours))} {t('common.hrs')}
                    </span>
                  </div>
                </div>

                {affordable ? (
                  <div className="flex gap-3 rounded-xl border border-primary/20 bg-primary/[0.06] p-4">
                    <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                    <p className="text-sm leading-relaxed text-foreground">
                      {t('escrow.safeExplainer', { hours: formatHours(hours), name: providerFirst })}
                    </p>
                  </div>
                ) : (
                  <div className="flex gap-3 rounded-xl border border-destructive/25 bg-destructive/[0.06] p-4">
                    <TriangleAlert className="mt-0.5 size-5 shrink-0 text-destructive" />
                    <p className="text-sm leading-relaxed text-foreground">
                      {t('escrow.shortWarn', { hours: formatHours(deficit) })}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 1 — SCHEDULE */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-medium text-foreground">{t('escrow.pickTime')}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('escrow.pickTimeSub', { name: providerFirst })}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {slots.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSlot(s.at)}
                        className={cn(
                          'rounded-lg border px-3 py-2.5 text-left text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
                          slot === s.at
                            ? 'border-primary bg-primary/[0.06] text-foreground ring-1 ring-inset ring-primary/30'
                            : 'border-border bg-card text-muted-foreground hover:border-foreground/20 hover:text-foreground',
                        )}
                      >
                        <span className="font-medium">{formatWhen(s.at)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-foreground">
                    {t('escrow.noteFor', { name: providerFirst })}{' '}
                    <span className="font-normal text-muted-foreground">{t('escrow.optional')}</span>
                  </p>
                  <Textarea
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={t('escrow.notePlaceholder')}
                  />
                </div>
              </div>
            )}

            {/* STEP 2 — CONFIRM */}
            {step === 2 && (
              <div className="space-y-5">
                <EscrowDiagram providerName={listing.provider.name} active={submitting} />

                <div className="divide-y divide-border rounded-xl border border-border bg-card">
                  {[
                    [t('escrow.sumService'), listing.title],
                    [t('escrow.sumProvider'), listing.provider.name],
                    [t('escrow.sumWhen'), formatWhen(slot)],
                    [t('escrow.sumHeld'), formatHours(hours)],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between gap-4 px-4 py-2.5 text-sm">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="truncate text-right font-medium text-foreground">{v}</span>
                    </div>
                  ))}
                </div>

                {note && (
                  <div className="rounded-xl border border-border bg-muted/40 p-3">
                    <p className="text-xs font-medium uppercase tracking-caps text-muted-foreground">
                      {t('escrow.yourNote')}
                    </p>
                    <p className="mt-1 text-sm text-foreground">{note}</p>
                  </div>
                )}

                <p className="text-center text-xs text-muted-foreground">
                  {t('escrow.confirmNote', { hours: formatHours(hours), name: providerFirst })}
                </p>
              </div>
            )}

            {/* STEP 3 — SUCCESS */}
            {step === 3 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 16 }}
                  className="grid size-16 place-items-center rounded-2xl bg-success/12 text-success ring-1 ring-inset ring-success/25"
                >
                  <Lock className="size-7" />
                </motion.div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
                  {t('escrow.successTitle', { hours: formatHours(hours) })}
                </h3>
                <p className="mt-1 max-w-xs text-balance text-sm text-muted-foreground">
                  {t('escrow.successDesc', {
                    title: listing.title,
                    name: providerFirst,
                    when: formatWhen(slot),
                  })}
                </p>

                <div className="mt-6 flex w-full max-w-xs items-center justify-between rounded-xl border border-border bg-card p-4 text-sm">
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <Wallet className="size-4" />
                    {t('escrow.balance')}
                  </span>
                  <span className="tabular-nums font-medium text-foreground">
                    {creditDisplay(balance)} {t('common.hrs')}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        <div className="border-t border-border p-6">
          {done ? (
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                {t('common.done')}
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  onOpenChange(false)
                  navigate('/bookings')
                }}
              >
                {t('escrow.viewBookings')}
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              {step > 0 ? (
                <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={submitting}>
                  <ArrowLeft className="size-4" />
                  {t('common.back')}
                </Button>
              ) : (
                <Button variant="ghost" onClick={() => onOpenChange(false)}>
                  {t('common.cancel')}
                </Button>
              )}

              {step === 0 && !affordable ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span tabIndex={0}>{continueButton}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {t('escrow.shortTooltip', { hours: formatHours(deficit) })}
                  </TooltipContent>
                </Tooltip>
              ) : (
                continueButton
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
