import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { Check, Monitor, Moon, Sun } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { PageHeader } from '@/components/common/PageHeader'
import { useAppStore } from '@/store/useAppStore'
import { useTheme } from '@/store/useTheme'
import { ACCENTS, useAccent } from '@/store/useAccent'
import { LANGS } from '@/i18n'
import { initials } from '@/lib/format'
import { cn } from '@/lib/utils'

function ProfileForm() {
  const { t } = useTranslation()
  const user = useAppStore((s) => s.user)
  const updateUser = useAppStore((s) => s.updateUser)

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, t('settings.errName')),
        title: z.string().min(2, t('settings.errTitle')),
        location: z.string().min(2, t('settings.errLocation')),
        bio: z.string().max(400, t('settings.errBio')),
        skills: z.string(),
      }),
    [t],
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user.name,
      title: user.title,
      location: user.location,
      bio: user.bio,
      skills: user.skills.join(', '),
    },
  })

  async function onSubmit(values) {
    await new Promise((r) => setTimeout(r, 450))
    const skills = values.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    updateUser({
      name: values.name,
      title: values.title,
      location: values.location,
      bio: values.bio,
      skills,
    })
    toast.success(t('settings.updated'))
    reset({ ...values })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.profileTitle')}</CardTitle>
        <CardDescription>{t('settings.profileDesc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarFallback className="text-lg">{initials(user.name)}</AvatarFallback>
            </Avatar>
            <p className="text-sm text-muted-foreground">{t('settings.avatarNote')}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="s-name">{t('settings.name')}</Label>
              <Input id="s-name" aria-invalid={!!errors.name} {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-title">{t('settings.headline')}</Label>
              <Input
                id="s-title"
                placeholder={t('settings.headlinePlaceholder')}
                aria-invalid={!!errors.title}
                {...register('title')}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="s-location">{t('settings.location')}</Label>
            <Input id="s-location" aria-invalid={!!errors.location} {...register('location')} />
            {errors.location && (
              <p className="text-xs text-destructive">{errors.location.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="s-bio">{t('settings.bioLabel')}</Label>
            <Textarea id="s-bio" rows={4} aria-invalid={!!errors.bio} {...register('bio')} />
            {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="s-skills">{t('settings.skillsLabel')}</Label>
            <Input id="s-skills" placeholder={t('settings.skillsPlaceholder')} {...register('skills')} />
            <p className="text-xs text-muted-foreground">{t('settings.skillsHint')}</p>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => reset()} disabled={!isDirty}>
              {t('settings.reset')}
            </Button>
            <Button type="submit" disabled={isSubmitting || !isDirty}>
              {isSubmitting ? t('settings.saving') : t('settings.save')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function ThemeControl() {
  const { t } = useTranslation()
  const theme = useTheme((s) => s.theme)
  const setTheme = useTheme((s) => s.setTheme)
  const options = [
    { id: 'light', label: t('settings.light'), icon: Sun },
    { id: 'dark', label: t('settings.dark'), icon: Moon },
    { id: 'system', label: t('settings.system'), icon: Monitor },
  ]

  function pick(id) {
    if (id === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
      try {
        localStorage.removeItem('timedeo-theme')
      } catch {
        /* ignore */
      }
    } else {
      setTheme(id)
    }
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((o) => {
        const Icon = o.icon
        const active = o.id === theme && o.id !== 'system'
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => pick(o.id)}
            className={cn(
              'flex flex-col items-center gap-2 rounded-lg border p-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
              active
                ? 'border-primary bg-primary/[0.06] text-foreground ring-1 ring-inset ring-primary/30'
                : 'border-border text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="size-4" />
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

function LanguageControl() {
  const { t, i18n } = useTranslation()
  const current = i18n.resolvedLanguage || i18n.language
  return (
    <div className="grid grid-cols-2 gap-2">
      {LANGS.map((l) => {
        const active = current === l.code
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => i18n.changeLanguage(l.code)}
            className={cn(
              'rounded-lg border p-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
              active
                ? 'border-primary bg-primary/[0.06] text-foreground ring-1 ring-inset ring-primary/30'
                : 'border-border text-muted-foreground hover:text-foreground',
            )}
          >
            {l.native}
          </button>
        )
      })}
    </div>
  )
}

function AppearanceCard() {
  const { t } = useTranslation()
  const accent = useAccent((s) => s.accent)
  const setAccent = useAccent((s) => s.setAccent)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.appearanceTitle')}</CardTitle>
        <CardDescription>{t('settings.appearanceDesc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>{t('settings.language')}</Label>
          <LanguageControl />
          <p className="text-xs text-muted-foreground">{t('settings.languageHint')}</p>
        </div>

        <div className="space-y-2">
          <Label>{t('settings.theme')}</Label>
          <ThemeControl />
        </div>

        <div className="space-y-2">
          <Label>{t('settings.accent')}</Label>
          <div className="flex flex-wrap gap-2">
            {ACCENTS.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setAccent(a.id)}
                aria-label={a.label}
                className={cn(
                  'grid size-9 place-items-center rounded-full ring-1 ring-inset ring-black/10 outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring',
                  accent === a.id && 'ring-2 ring-offset-2 ring-offset-background',
                )}
                style={{ background: a.swatch, boxShadow: accent === a.id ? '0 0 0 2px var(--ring)' : undefined }}
              >
                {accent === a.id && <Check className="size-4 text-white" strokeWidth={3} />}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{t('settings.accentHint')}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function NotificationsCard() {
  const { t } = useTranslation()
  const [prefs, setPrefs] = useState({
    bookingUpdates: true,
    newMessages: true,
    weeklyDigest: true,
    marketing: false,
  })

  const rows = [
    { id: 'bookingUpdates', label: t('settings.notifBookingUpdates'), desc: t('settings.notifBookingUpdatesDesc') },
    { id: 'newMessages', label: t('settings.notifMessages'), desc: t('settings.notifMessagesDesc') },
    { id: 'weeklyDigest', label: t('settings.notifWeekly'), desc: t('settings.notifWeeklyDesc') },
    { id: 'marketing', label: t('settings.notifMarketing'), desc: t('settings.notifMarketingDesc') },
  ]

  function toggle(id) {
    setPrefs((p) => {
      const next = { ...p, [id]: !p[id] }
      toast(next[id] ? t('settings.turnedOn') : t('settings.turnedOff'), {
        description: rows.find((r) => r.id === id).label,
      })
      return next
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.notifTitle')}</CardTitle>
        <CardDescription>{t('settings.notifDesc')}</CardDescription>
      </CardHeader>
      <CardContent className="divide-y divide-border">
        {rows.map((r) => (
          <div key={r.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{r.label}</p>
              <p className="text-xs text-muted-foreground">{r.desc}</p>
            </div>
            <Switch checked={prefs[r.id]} onCheckedChange={() => toggle(r.id)} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default function Settings() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title={t('settings.title')} description={t('settings.desc')} />

      <Tabs defaultValue="profile" className="space-y-5">
        <TabsList>
          <TabsTrigger value="profile">{t('settings.tabProfile')}</TabsTrigger>
          <TabsTrigger value="appearance">{t('settings.tabAppearance')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('settings.tabNotifications')}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileForm />
        </TabsContent>
        <TabsContent value="appearance">
          <AppearanceCard />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationsCard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
