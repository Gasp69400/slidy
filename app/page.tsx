'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  Check,
  FileStack,
  Layers,
  Sparkles,
  Wand2,
  Zap,
  FileDown,
} from 'lucide-react'

import { SlidyLogoMark } from '@/components/brand/SlidyLogoMark'
import { LandingHeader } from '@/components/landing/LandingHeader'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useSiteLocale } from '@/lib/site-locale'

function HeroSection() {
  const { t } = useSiteLocale()

  const tags = [
    t('home.preview.tag_outline'),
    t('home.preview.tag_slides'),
    t('home.preview.tag_export'),
  ]

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-[100%] bg-gradient-to-b from-violet-100/90 via-fuchsia-50/50 to-transparent blur-3xl dark:from-violet-950/50 dark:via-slate-900/40 dark:to-transparent" />
        <div className="absolute -right-32 top-40 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl dark:bg-violet-900/25" />
        <div className="absolute -left-24 top-56 h-64 w-64 rounded-full bg-fuchsia-200/35 blur-3xl dark:bg-fuchsia-900/20" />
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8 lg:pb-28 lg:pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/95 px-4 py-1.5 text-xs font-medium text-violet-700 shadow-sm dark:border-violet-200/50 dark:bg-white/95 dark:text-violet-700">
            <Sparkles className="h-3.5 w-3.5" />
            {t('home.hero.badge')}
          </div>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl sm:leading-tight">
            {t('home.hero.title1')}{' '}
            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              {t('home.hero.title2')}
            </span>{' '}
            {t('home.hero.title3')}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-slate-600 dark:text-slate-300 sm:text-xl">
            {t('home.hero.subtitle')}
          </p>

          <HomeStatsSection />

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button
              size="lg"
              className="h-12 min-w-[200px] rounded-full bg-violet-600 px-8 text-base font-semibold shadow-lg shadow-violet-500/25 hover:bg-violet-700"
              asChild
            >
              <Link href="/studio">
                {t('home.hero.cta_primary')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 min-w-[200px] rounded-full border-slate-200 bg-white px-8 text-base text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-300 dark:bg-white dark:hover:bg-slate-100"
              asChild
            >
              <Link href="/auth/login">{t('home.hero.cta_secondary')}</Link>
            </Button>
          </div>

          <div className="mt-4">
            <Link
              href="/studio/cv"
              className="text-sm font-medium text-violet-600 underline-offset-4 transition hover:text-violet-700 hover:underline dark:text-violet-400 dark:hover:text-violet-300"
            >
              {t('home.hero.cta_cv')}
            </Link>
          </div>

          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">{t('home.hero.note')}</p>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-2 shadow-xl shadow-slate-200/60 ring-1 ring-slate-100 backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/90 dark:shadow-black/40 dark:ring-slate-800">
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-2.5 dark:bg-slate-950/80">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {t('home.preview.status')}
              </div>
              <div className="flex gap-1.5">
                <span className="h-2 w-10 rounded-full bg-slate-200 dark:bg-slate-600" />
                <span className="h-2 w-6 rounded-full bg-slate-200 dark:bg-slate-600" />
              </div>
            </div>
            <div className="mt-2 grid gap-2 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-violet-950 p-4 sm:grid-cols-[1fr_1.35fr] sm:p-5">
              <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-violet-300">
                    {t('home.preview.prompt')}
                  </p>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-white">
                    {t('home.preview.prompt_text')}
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/10 px-3 py-1 text-[11px] text-violet-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <div className="mb-3 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{t('home.preview.structure')}</span>
                  <SlidyLogoMark size="xs" className="shadow-md shadow-violet-900/40" />
                </div>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-2.5 rounded-full bg-gradient-to-r from-white/20 to-white/5"
                      style={{ width: `${100 - i * 12}%` }}
                    />
                  ))}
                </div>
                <Wand2 className="absolute bottom-3 right-3 h-8 w-8 text-violet-400/40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HomeStatsSection() {
  const { t } = useSiteLocale()

  return (
    <div className="mx-auto mt-10 max-w-4xl">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/80 p-5 text-center shadow-sm backdrop-blur-sm dark:border-slate-700/90 dark:bg-slate-900/80 sm:text-left">
          <div className="mb-3 inline-flex rounded-xl bg-violet-500/10 p-2 dark:bg-violet-500/20">
            <FileStack className="h-5 w-5 text-violet-600 dark:text-violet-400" aria-hidden />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            {t('home.stats.docs_label')}
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            <span className="tabular-nums">{t('home.stats.docs_value')}</span>
          </p>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {t('home.stats.docs_hint')}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/90 to-white/90 p-5 text-center shadow-sm dark:border-emerald-900/40 dark:from-emerald-950/50 dark:to-slate-900/80 sm:text-left">
          <div className="mb-3 inline-flex rounded-xl bg-emerald-500/15 p-2 dark:bg-emerald-500/20">
            <BarChart3 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-800/90 dark:text-emerald-200/80">
            {t('home.stats.ats_label')}
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-emerald-700 dark:text-emerald-300">
            <span className="tabular-nums">{t('home.stats.ats_value')}</span>
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/80 p-5 text-center shadow-sm backdrop-blur-sm dark:border-slate-700/90 dark:bg-slate-900/80 sm:text-left">
          <div className="mb-3 inline-flex rounded-xl bg-fuchsia-500/10 p-2 dark:bg-fuchsia-500/20">
            <Briefcase className="h-5 w-5 text-fuchsia-600 dark:text-fuchsia-400" aria-hidden />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            {t('home.stats.formats_label')}
          </p>
          <p className="mt-2 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {t('home.stats.formats_value')}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {t('home.stats.formats_sub')}
          </p>
        </div>
      </div>
      <p className="mt-4 text-center text-[11px] leading-snug text-slate-500 dark:text-slate-400">
        {t('home.stats.ats_hint')}
      </p>
    </div>
  )
}

function HowItWorksSection() {
  const { t } = useSiteLocale()

  const steps = [
    {
      icon: Zap,
      title: t('home.how.1.title'),
      body: t('home.how.1.body'),
    },
    {
      icon: Layers,
      title: t('home.how.2.title'),
      body: t('home.how.2.body'),
    },
    {
      icon: FileDown,
      title: t('home.how.3.title'),
      body: t('home.how.3.body'),
    },
  ]

  return (
    <section
      id="how-it-works"
      className="border-y border-slate-200/80 bg-white py-20 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            {t('home.how.title')}
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">{t('home.how.subtitle')}</p>
        </div>
        <ol className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="relative rounded-3xl border border-slate-100 bg-slate-50/80 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-950/80"
            >
              <span className="absolute right-6 top-6 text-5xl font-bold text-slate-200/80 dark:text-slate-700/80">
                {i + 1}
              </span>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
                <step.icon className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const { t } = useSiteLocale()

  const items = [
    {
      title: t('home.features.1.title'),
      desc: t('home.features.1.desc'),
    },
    {
      title: t('home.features.2.title'),
      desc: t('home.features.2.desc'),
    },
    {
      title: t('home.features.3.title'),
      desc: t('home.features.3.desc'),
    },
    {
      title: t('home.features.4.title'),
      desc: t('home.features.4.desc'),
    },
  ]

  return (
    <section className="py-20 dark:bg-slate-950" id="features">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            {t('home.features.title')}
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">{t('home.features.subtitle')}</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:shadow-lg dark:hover:shadow-black/30"
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HomePricingSection() {
  const { t } = useSiteLocale()

  const tiers = useMemo(
    () =>
      [
        {
          name: t('pricing.tier.starter.name'),
          price: '0',
          period: t('pricing.tier.starter.period'),
          description: t('pricing.tier.starter.desc'),
          features: [
            t('pricing.tier.starter.f1'),
            t('pricing.tier.starter.f2'),
            t('pricing.tier.starter.f3'),
          ],
          highlighted: false,
          planId: 'starter',
        },
        {
          name: t('pricing.tier.pro.name'),
          price: '17,99',
          period: t('pricing.tier.pro.period'),
          description: t('pricing.tier.pro.desc'),
          features: [
            t('pricing.tier.pro.f1'),
            t('pricing.tier.pro.f2'),
            t('pricing.tier.pro.f3'),
          ],
          highlighted: true,
          planId: 'pro',
        },
        {
          name: t('pricing.tier.ultimate.name'),
          price: '49,99',
          period: t('pricing.tier.ultimate.period'),
          description: t('pricing.tier.ultimate.desc'),
          features: [
            t('pricing.tier.ultimate.f1'),
            t('pricing.tier.ultimate.f2'),
            t('pricing.tier.ultimate.f3'),
          ],
          highlighted: false,
          planId: 'ultimate',
        },
      ] as const,
    [t],
  )

  return (
    <section
      id="pricing"
      className="border-y border-slate-200/80 bg-gradient-to-b from-slate-50/90 via-white to-slate-50/50 py-14 dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-violet-600 dark:text-violet-400">
            {t('home.pricing.kicker')}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
            {t('home.pricing.title')}
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 sm:text-base">
            {t('home.pricing.subtitle')}
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-3 sm:items-stretch sm:gap-3 lg:gap-4">
          {tiers.map((tier) => (
            <Card
              key={tier.planId}
              className={
                tier.highlighted
                  ? 'relative flex flex-col border-violet-200 bg-white text-slate-900 shadow-md shadow-violet-500/10 ring-2 ring-violet-500/20 dark:border-violet-300 dark:bg-white dark:text-slate-900 dark:shadow-violet-900/20 dark:ring-violet-400/40'
                  : 'flex flex-col border-slate-200/80 bg-white text-slate-900 shadow-sm dark:border-slate-200 dark:bg-white dark:text-slate-900'
              }
            >
              {tier.highlighted ? (
                <div className="absolute -top-2.5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-violet-600 px-2 py-px text-[10px] font-semibold leading-tight text-white">
                  {t('pricing.popular')}
                </div>
              ) : null}
              <CardHeader className="space-y-1.5 p-4 pb-2">
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-900">
                  {tier.name}
                </CardTitle>
                <CardDescription className="line-clamp-3 min-h-[3rem] text-left text-xs leading-snug text-slate-600 dark:text-slate-900">
                  {tier.description}
                </CardDescription>
                <div className="mt-2 flex flex-wrap items-baseline gap-0.5">
                  <span className="text-2xl font-semibold tabular-nums tracking-tight text-slate-900 dark:text-slate-900 sm:text-[1.65rem]">
                    {tier.price}
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-700">
                    €
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-700">
                    {tier.period}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col p-4 pt-2">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-700">
                  {t('home.pricing.includes')}
                </p>
                <ul className="space-y-1.5 text-xs leading-snug text-slate-600 dark:text-slate-900">
                  {tier.features.map((f) => (
                    <li key={f} className="flex gap-1.5">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-600 dark:text-violet-600" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="mt-auto p-4 pt-2">
                <Button
                  size="sm"
                  className="h-9 w-full rounded-full text-xs"
                  variant={tier.highlighted ? 'default' : 'outline'}
                  asChild
                >
                  <Link href={`/pricing#plan-${tier.planId}`}>
                    {t('home.pricing.card_cta')}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
          {t('home.pricing.footnote')}
        </p>
        <div className="mt-3 text-center">
          <Link
            href="/pricing"
            className="text-xs font-medium text-violet-600 underline-offset-4 hover:underline dark:text-violet-400 sm:text-sm"
          >
            {t('home.pricing.link_full')}
          </Link>
        </div>
      </div>
    </section>
  )
}

function FooterCTA() {
  const { t } = useSiteLocale()

  return (
    <section className="border-t border-slate-200/80 bg-gradient-to-br from-violet-600 via-violet-600 to-fuchsia-600 py-16">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {t('home.footer.title')}
        </h2>
        <p className="mt-4 text-lg text-violet-100">{t('home.footer.subtitle')}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            className="h-12 rounded-full bg-white px-8 text-base font-semibold text-violet-700 shadow-lg hover:bg-slate-50"
            asChild
          >
            <Link href="/studio">{t('home.footer.cta_primary')}</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 rounded-full border-white/40 bg-transparent px-8 text-base text-white hover:bg-white/10"
            asChild
          >
            <Link href="/auth/login">{t('home.footer.cta_secondary')}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function SiteFooter() {
  const { t } = useSiteLocale()

  return (
    <footer className="border-t border-slate-200 bg-white py-10 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <SlidyLogoMark size="sm" />
          <span className="font-semibold text-slate-800 dark:text-slate-100">Slidy</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link
            href="/pricing"
            className="hover:text-slate-800 dark:hover:text-slate-100"
          >
            {t('home.footer.pricing')}
          </Link>
          <Link
            href="/studio"
            className="hover:text-slate-800 dark:hover:text-slate-100"
          >
            {t('home.footer.studio')}
          </Link>
          <Link
            href="/templates"
            className="hover:text-slate-800 dark:hover:text-slate-100"
          >
            {t('nav.templates')}
          </Link>
          <Link
            href="/legal/cgu"
            className="hover:text-slate-800 dark:hover:text-slate-100"
          >
            {t('home.footer.terms')}
          </Link>
          <Link
            href="/auth/login"
            className="hover:text-slate-800 dark:hover:text-slate-100"
          >
            {t('home.footer.login')}
          </Link>
        </div>
        <p className="text-xs">
          © {new Date().getFullYear()} Slidy · {t('home.footer.copy')}
        </p>
      </div>
    </footer>
  )
}

export default function HomePage() {
  return (
    <div className="relative text-slate-900 dark:text-slate-50">
      <LandingHeader />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <HomePricingSection />
      <FooterCTA />
      <SiteFooter />
    </div>
  )
}
