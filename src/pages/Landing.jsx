import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trans, useTranslation } from 'react-i18next'
import {
  ArrowRight,
  Clock,
  HandHeart,
  HandHelping,
  HeartHandshake,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react'
import { AnimatedHandHeart } from '@/assets/AnimatedHandHeart'
import { AnimatedScale } from '@/assets/AnimatedScale'
import { AnimatedShield } from '@/assets/AnimatedShield'
import { AnimatedWallet } from '@/assets/AnimatedWallet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Logo } from '@/components/common/Logo'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { AccentSwitcher } from '@/components/common/AccentSwitcher'
import { LanguageToggle } from '@/components/common/LanguageToggle'
import { Rating } from '@/components/common/Rating'
import { CATEGORIES } from '@/data/categories'
import { initials } from '@/lib/format'
import { cn } from '@/lib/utils'
import womanGif from '@/assets/woman_giving_skill_and_getting_time_credit_loop.gif'
import watchGif from '@/assets/A_hand_with_a_wrist_watch_loop.gif'

const NAV = [
  { href: '#how', key: 'landing.navHow' },
  { href: '#why', key: 'landing.navWhy' },
  { href: '#categories', key: 'landing.navSkills' },
]

const STEPS = [
  { n: 1, Anim: AnimatedHandHeart, tone: 'success', title: 'landing.step1Title', body: 'landing.step1Body', tag: 'landing.step1Tag' },
  { n: 2, icon: HandHelping, tone: 'primary', title: 'landing.step2Title', body: 'landing.step2Body', tag: 'landing.step2Tag' },
  { n: 3, Anim: AnimatedScale, tone: 'neutral', title: 'landing.step3Title', body: 'landing.step3Body', tag: 'landing.step3Tag' },
]

const WHY = [
  { Anim: AnimatedWallet, title: 'landing.why1Title', body: 'landing.why1Body' },
  { Anim: AnimatedScale, title: 'landing.why2Title', body: 'landing.why2Body' },
  { icon: Users, title: 'landing.why3Title', body: 'landing.why3Body' },
  { Anim: AnimatedShield, title: 'landing.why4Title', body: 'landing.why4Body' },
]

const STATS = [
  { value: '12,480', label: 'landing.statHours' },
  { value: '3,120', label: 'landing.statMembers' },
  { value: '4.9', label: 'landing.statRating' },
  { value: '40+', label: 'landing.statSkills' },
]

// Marketing testimonials for the public landing page (static copy, not app data).
const TESTIMONIALS = [
  {
    rating: 5,
    text: 'Reframed our onboarding in twenty minutes flat. Every note was actionable.',
    author: { name: 'Jonah Pierce' },
    service: 'Product design critique',
  },
  {
    rating: 5,
    text: 'Found the exact renders killing our dashboard. Superb, practical fixes.',
    author: { name: 'Tom Bishop' },
    service: 'React performance audit',
  },
  {
    rating: 5,
    text: 'Natural, encouraging practice — I left with vocabulary I actually use.',
    author: { name: 'Hana Kim' },
    service: 'Conversational Spanish',
  },
]

const toneChip = {
  success: 'bg-success/12 text-success',
  primary: 'bg-primary/12 text-primary',
  neutral: 'bg-secondary text-secondary-foreground',
}

function Reveal({ children, className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function HeroVisual() {
  const { t } = useTranslation()
  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
      {/* Line-art loop, blended into whichever theme is active. */}
      <img
        src={womanGif}
        alt=""
        aria-hidden="true"
        className="blend-linework w-full select-none rounded-3xl"
      />

      {/* Floating "1 hour = 1 hour" chip, tucked at the lower-left edge. */}
      <div className="pointer-events-none absolute -bottom-3 left-4 hidden rounded-xl border border-border bg-card px-3 py-2 shadow-md sm:block">
        <p className="flex items-center gap-1.5 text-xs font-medium text-foreground">
          <Clock className="size-3.5 text-primary" />
          {t('landing.hvEqual')}
        </p>
      </div>
    </div>
  )
}

export default function Landing() {
  const { t } = useTranslation()

  return (
    <div className="min-h-dvh bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Link to="/" className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Logo />
          </Link>
          <nav className="ml-4 hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {t(n.key)}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1.5">
            <LanguageToggle />
            <AccentSwitcher />
            <ThemeToggle />
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link to="/login">{t('common.login')}</Link>
            </Button>
            <Button asChild>
              <Link to="/dashboard">{t('common.openApp')}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_60%)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <Badge variant="brand" className="gap-1.5">
              <Sparkles className="size-3" />
              {t('landing.badge')}
            </Badge>
            <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              <Trans i18nKey="landing.heroTitle" components={{ 1: <span className="text-primary" /> }} />
            </h1>
            <p className="mt-5 max-w-md text-balance text-lg text-muted-foreground">
              {t('landing.heroSubtitle')}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/register">
                  {t('landing.heroGetStarted')}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#how">{t('landing.heroSeeHow')}</a>
              </Button>
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="size-4" />
              {t('landing.heroJoin')}
            </p>
          </div>
          <Reveal delay={0.1}>
            <HeroVisual />
          </Reveal>
        </div>
      </section>

      {/* One-liner */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-10 text-center sm:px-6">
          <HeartHandshake className="size-6 text-primary" />
          <p className="text-balance text-xl font-medium tracking-tight text-foreground sm:text-2xl">
            <Trans i18nKey="landing.oneLiner" components={{ 1: <span className="text-primary" /> }} />
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-16 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-caps text-primary">
              {t('landing.howEyebrow')}
            </p>
            <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {t('landing.howTitle')}
            </h2>
            <p className="mt-3 text-muted-foreground">{t('landing.howDesc')}</p>
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              const Anim = s.Anim
              return (
                <Reveal key={s.n} delay={i * 0.08}>
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    whileHover="hover"
                    viewport={{ once: true, margin: '-60px' }}
                    className="group h-full"
                  >
                    <Card className="flex h-full flex-col p-6 transition-colors group-hover:border-foreground/20">
                      <div className="flex items-center justify-between">
                        <span className={cn('grid size-11 place-items-center rounded-xl', toneChip[s.tone])}>
                          {Anim ? <Anim /> : <Icon className="size-5" />}
                        </span>
                        <span className="text-4xl font-semibold tabular-nums text-border">0{s.n}</span>
                      </div>
                      <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
                        {t(s.title)}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {t(s.body)}
                      </p>
                      <span
                        className={cn(
                          'mt-4 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                          toneChip[s.tone],
                        )}
                      >
                        {t(s.tag)}
                      </span>
                    </Card>
                  </motion.div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why it works */}
      <section id="why" className="scroll-mt-16 border-t border-border bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-caps text-primary">
              {t('landing.whyEyebrow')}
            </p>
            <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {t('landing.whyTitle')}
            </h2>
            <p className="mt-3 text-muted-foreground">{t('landing.whyDesc')}</p>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w, i) => {
              const Icon = w.icon
              const Anim = w.Anim
              return (
                <Reveal key={w.title} delay={i * 0.06}>
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    whileHover="hover"
                    viewport={{ once: true, margin: '-60px' }}
                    className="group h-full"
                  >
                    <Card className="h-full p-5 transition-colors group-hover:border-foreground/20">
                      <span className="grid size-10 place-items-center rounded-lg bg-primary/12 text-primary">
                        {Anim ? <Anim /> : <Icon className="size-5" />}
                      </span>
                      <h3 className="mt-4 font-semibold tracking-tight text-foreground">{t(w.title)}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t(w.body)}</p>
                    </Card>
                  </motion.div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="scroll-mt-16 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-caps text-primary">
                {t('landing.catEyebrow')}
              </p>
              <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {t('landing.catTitle')}
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link to="/explore">
                {t('landing.catBrowse')}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </Reveal>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {CATEGORIES.map((c, i) => {
              const Icon = c.icon
              return (
                <Reveal key={c.id} delay={(i % 5) * 0.05}>
                  <Link
                    to="/explore"
                    className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 outline-none transition-[transform,border-color,box-shadow] hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="grid size-9 place-items-center rounded-lg bg-secondary text-foreground">
                      <Icon className="size-4" />
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {t(`categories.${c.id}`, c.label)}
                    </span>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats + testimonials */}
      <section className="border-t border-border bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.05}>
                <div className="text-center">
                  <p className="text-3xl font-semibold tracking-tight tabular-nums text-foreground sm:text-4xl">
                    {s.value}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{t(s.label)}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((r, i) => (
              <Reveal key={r.author.name} delay={i * 0.08}>
                <Card className="flex h-full flex-col p-5">
                  <Rating variant="stars" value={r.rating} />
                  <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground">
                    “{r.text}”
                  </blockquote>
                  <figcaption className="mt-4 flex items-center gap-2.5 border-t border-border pt-4">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-[10px]">
                        {initials(r.author.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {r.author.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{r.service}</p>
                    </div>
                  </figcaption>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:flex lg:h-[440px]">
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

            {/* Content — left region, vertically centered on desktop. */}
            <div className="relative px-6 py-14 text-center sm:px-12 lg:flex lg:flex-1 lg:flex-col lg:justify-center">
              <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/12 text-primary">
                <Clock className="size-6" />
              </div>
              <h2 className="mx-auto mt-5 max-w-md text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {t('landing.ctaTitle')}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-balance text-muted-foreground">
                {t('landing.ctaDesc')}
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg">
                  <Link to="/dashboard">
                    {t('landing.ctaOpen')}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/explore">{t('landing.ctaBrowse')}</Link>
                </Button>
              </div>
            </div>

            {/* Wrist-watch loop — square center-crop filling the card's full height on the right. */}
            <div className="relative shrink-0 px-6 pb-14 sm:px-12 lg:aspect-square lg:h-full lg:p-0">
              <div className="mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-2xl lg:mx-0 lg:h-full lg:w-full lg:max-w-none lg:rounded-none">
                <img
                  src={watchGif}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full select-none object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2.5">
            <Logo />
          </div>
          <p className="text-sm text-muted-foreground">{t('landing.footerTagline')}</p>
          <p className="text-xs text-muted-foreground">
            {t('landing.footerCopy', { year: new Date().getFullYear() })}
          </p>
        </div>
      </footer>
    </div>
  )
}
