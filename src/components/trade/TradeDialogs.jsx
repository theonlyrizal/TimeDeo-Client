import { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CATEGORIES } from '@/data/categories'
import { useAppStore } from '@/store/useAppStore'
import { formatHours } from '@/lib/format'
import { cn } from '@/lib/utils'

const HOURS_OPTIONS = [0.5, 1, 1.5, 2, 2.5, 3, 4]

function FieldError({ children }) {
  if (!children) return null
  return <p className="text-xs font-medium text-destructive">{children}</p>
}

function ModeToggle({ value, onChange }) {
  const { t } = useTranslation()
  return (
    <div className="grid grid-cols-2 gap-1 rounded-lg border border-border bg-muted/50 p-1">
      {[
        { id: 'online', label: t('trade.online') },
        { id: 'local', label: t('trade.local') },
      ].map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
            value === opt.id
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function CategoryField({ control, error }) {
  const { t } = useTranslation()
  return (
    <div className="space-y-1.5">
      <Label>{t('trade.category')}</Label>
      <Controller
        control={control}
        name="category"
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger aria-invalid={!!error}>
              <SelectValue placeholder={t('trade.categoryPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {t(`categories.${c.id}`, c.label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <FieldError>{error?.message}</FieldError>
    </div>
  )
}

function HoursField({ control }) {
  const { t } = useTranslation()
  return (
    <div className="space-y-1.5">
      <Label>{t('trade.duration')}</Label>
      <Controller
        control={control}
        name="hours"
        render={({ field }) => (
          <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {HOURS_OPTIONS.map((h) => (
                <SelectItem key={h} value={String(h)}>
                  {formatHours(h)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  )
}

export function PostRequestDialog({ open, onOpenChange }) {
  const { t } = useTranslation()
  const schema = useMemo(
    () =>
      z.object({
        title: z.string().min(4, t('trade.vTitle')),
        category: z.string().min(1, t('trade.vCategory')),
        hours: z.coerce.number().min(0.5).max(8),
        mode: z.enum(['online', 'local']),
        description: z.string().min(10, t('trade.vDetails')).max(500),
      }),
    [t],
  )

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { title: '', category: '', hours: 1, mode: 'online', description: '' },
  })

  async function onSubmit(values) {
    await new Promise((r) => setTimeout(r, 550))
    toast.success(t('trade.requestPosted'), {
      description: `${values.title} · ${formatHours(values.hours)}`,
    })
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('trade.requestTitle')}</DialogTitle>
          <DialogDescription>{t('trade.requestDesc')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="req-title">{t('trade.requestTitleLabel')}</Label>
            <Input
              id="req-title"
              placeholder={t('trade.requestTitlePlaceholder')}
              aria-invalid={!!errors.title}
              {...register('title')}
            />
            <FieldError>{errors.title?.message}</FieldError>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <CategoryField control={control} error={errors.category} />
            <HoursField control={control} />
          </div>

          <div className="space-y-1.5">
            <Label>{t('trade.format')}</Label>
            <Controller
              control={control}
              name="mode"
              render={({ field }) => <ModeToggle value={field.value} onChange={field.onChange} />}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="req-desc">{t('trade.detailsLabel')}</Label>
            <Textarea
              id="req-desc"
              rows={3}
              placeholder={t('trade.detailsPlaceholder')}
              aria-invalid={!!errors.description}
              {...register('description')}
            />
            <FieldError>{errors.description?.message}</FieldError>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('trade.posting') : t('trade.postRequest')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function OfferSkillDialog({ open, onOpenChange }) {
  const { t } = useTranslation()
  const addListing = useAppStore((s) => s.addListing)
  const navigate = useNavigate()

  const schema = useMemo(
    () =>
      z.object({
        title: z.string().min(4, t('trade.vTitle')),
        category: z.string().min(1, t('trade.vCategory')),
        hours: z.coerce.number().min(0.5).max(8),
        mode: z.enum(['online', 'local']),
        summary: z.string().min(10, t('trade.vSummary')).max(280),
      }),
    [t],
  )

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { title: '', category: '', hours: 1, mode: 'online', summary: '' },
  })

  async function onSubmit(values) {
    try {
      await addListing({
        title: values.title,
        category: values.category,
        hours: values.hours,
        summary: values.summary,
        description: values.summary,
      })
      toast.success(t('trade.skillPublished'), {
        description: t('trade.skillPublishedDesc', { title: values.title }),
        action: { label: t('trade.view'), onClick: () => navigate('/explore') },
      })
      reset()
      onOpenChange(false)
    } catch (e) {
      toast.error(e.message || 'Could not publish skill')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('trade.offerTitle')}</DialogTitle>
          <DialogDescription>{t('trade.offerDesc')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="off-title">{t('trade.offerTitleLabel')}</Label>
            <Input
              id="off-title"
              placeholder={t('trade.offerTitlePlaceholder')}
              aria-invalid={!!errors.title}
              {...register('title')}
            />
            <FieldError>{errors.title?.message}</FieldError>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <CategoryField control={control} error={errors.category} />
            <HoursField control={control} />
          </div>

          <div className="space-y-1.5">
            <Label>{t('trade.format')}</Label>
            <Controller
              control={control}
              name="mode"
              render={({ field }) => <ModeToggle value={field.value} onChange={field.onChange} />}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="off-summary">{t('trade.summaryLabel')}</Label>
            <Textarea
              id="off-summary"
              rows={3}
              placeholder={t('trade.summaryPlaceholder')}
              aria-invalid={!!errors.summary}
              {...register('summary')}
            />
            <FieldError>{errors.summary?.message}</FieldError>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('trade.publishing') : t('trade.publishSkill')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
