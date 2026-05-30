'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  FileStack,
  Layers,
  Sparkles,
  Wand2,
  Zap,
  FileDown,
} from 'lucide-react'

import { SlidyLogoMark } from '@/components/brand/SlidyLogoMark'
import { LandingHeader } from '@/components/landing/LandingHeader'
import {
  PricingTierCard,
  PricingTierGrid,
  pricingTierCtaClassName,
} from '@/components/pricing/PricingTierCard'
import { Button } from '@/components/ui/button'
import { buildPricingTiers, DEFAULT_SELECTED_PLAN, type PricingPlanId } from '@/lib/pricing-tiers'
import { useSiteLocale } from '@/lib/site-locale'
import { cn } from '@/lib/utils'

function HeroSection() {
  const { t } = useSiteLocale()

  /** Ne pas réutiliser la clé studio `capabilities` (queryFn différente). */
  const { data: capsData, isPending } = useQuery({
    queryKey: ['me-capabilities-home-cv-cta'],
    queryFn: async () => {
      const res = await fetch('/api/me/capabilities', {
        credentials: 'include',
      })
      if (!res.ok) {
        return { ok: false as const }
      }
      return {
        ok: true as const,
        json: (await res.json()) as {
          success: boolean
          data: { allowedDocumentTypes: string[] }
        },
      }
    },
    staleTime: 60_000,
  })

  const canUseCvStudio =
    capsData?.ok === true &&
    capsData.json.success === true &&
    capsData.json.data.allowedDocumentTypes.includes('CV_COVER')

  /** Tant que la requête n’a pas répondu, on évite d’envoyer vers le studio CV sans savoir si l’abo le permet */
  const cvCtaHref = isPending
    ? '/pricing'
    : canUseCvStudio
      ? '/studio/cv'
      : '/pricing'

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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-10%,rgba(139,92,246,0.28),transparent)] dark:bg-[radial-gradient(ellipse_75%_50%_at_50%_-8%,rgba(139,92,246,0.18),transparent)]" />
        <div className="absolute left-1/2 top-0 h-[520px] w-[920px] -translate-x-1/2 rounded-[100%] bg-gradient-to-b from-violet-200/65 via-fuchsia-100/35 to-transparent blur-3xl dark:from-violet-950/45 dark:via-fuchsia-950/20 dark:to-transparent" />
        <div className="absolute -right-28 top-32 h-[22rem] w-[22rem] rounded-full bg-violet-300/35 blur-3xl dark:bg-violet-800/22" />
        <div className="absolute -left-24 top-[22rem] h-72 w-72 rounded-full bg-fuchsia-200/35 blur-3xl dark:bg-fuchsia-900/14" />
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8 lg:pb-28 lg:pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200/55 bg-white/75 px-4 py-1.5 text-xs font-medium tracking-wide text-violet-700 shadow-md shadow-violet-500/[0.12] ring-1 ring-white/60 backdrop-blur-md dark:border-white/14 dark:bg-slate-900/55 dark:text-violet-100 dark:ring-white/10">
            <Sparkles className="h-3.5 w-3.5 text-violet-500 dark:text-violet-300" />
            {t('home.hero.badge')}
          </div>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl sm:leading-[1.1]">
            {t('home.hero.title1')}{' '}
            <span className="bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-600 bg-clip-text text-transparent dark:from-violet-400 dark:via-violet-300 dark:to-fuchsia-400">
              {t('home.hero.title2')}
            </span>{' '}
            {t('home.hero.title3')}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-slate-600 dark:text-slate-300 sm:text-xl">
            {t('home.hero.subtitle')}
          </p>

          <HomeStatsSection />

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button
              size="lg"
              className="h-12 min-w-[200px] rounded-full border border-violet-700/20 bg-gradient-to-r from-violet-600 to-violet-700 px-8 text-base font-semibold text-white shadow-xl shadow-violet-600/30 transition hover:from-violet-500 hover:to-violet-600 hover:shadow-violet-600/35"
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
              className="h-12 min-w-[200px] rounded-full border-violet-200/90 bg-white/90 px-8 text-base font-semibold text-slate-800 shadow-md shadow-slate-200/60 backdrop-blur-sm hover:border-violet-300 hover:bg-violet-50/80 dark:border-white/14 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:border-violet-400/70 dark:hover:bg-slate-800/80"
              asChild
            >
              <Link href="/auth/login">{t('home.hero.cta_secondary')}</Link>
            </Button>
          </div>

          <div className="mt-6 flex flex-col items-center gap-4">
            {isPending ? (
              <span
                className="inline-flex cursor-wait items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-4 py-2 text-sm font-medium text-slate-500 shadow-inner dark:border-white/10 dark:bg-slate-800/60 dark:text-slate-400"
                aria-busy="true"
              >
                <Sparkles className="h-3.5 w-3.5 animate-pulse text-violet-400" aria-hidden />
                {t('home.hero.cta_cv')}
              </span>
            ) : (
              <Link
                href={cvCtaHref}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-gradient-to-r from-emerald-50 to-white px-4 py-2 text-sm font-semibold text-emerald-900 shadow-md shadow-emerald-600/[0.12] ring-1 ring-emerald-100 transition hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-600/15 dark:border-emerald-800/55 dark:from-emerald-950/50 dark:to-slate-900/80 dark:text-emerald-200 dark:ring-emerald-900/40"
              >
                <Briefcase className="h-3.5 w-3.5" aria-hidden />
                {t('home.hero.cta_cv')}
              </Link>
            )}
            <Link
              href="#pricing"
              className="text-xs font-medium uppercase tracking-wider text-slate-400 transition hover:text-violet-600 dark:text-slate-500 dark:hover:text-violet-400"
            >
              {t('landing.pricing')}
            </Link>
          </div>

          <p className="mt-6 text-xs text-slate-500 dark:text-slate-500 sm:text-sm">{t('home.hero.note')}</p>
        </div>

        <div className="mx-auto mt-16 max-w-4xl sm:mt-20">
          <div className="rounded-[1.35rem] border border-slate-200/70 bg-white/75 p-[7px] shadow-[0_24px_60px_-20px_rgba(109,40,217,0.22)] ring-1 ring-violet-200/35 backdrop-blur-md dark:border-slate-700/70 dark:bg-slate-900/70 dark:shadow-black/55 dark:ring-violet-500/15">
            <div className="flex items-center justify-between rounded-2xl bg-slate-50/95 px-4 py-2.5 ring-1 ring-slate-200/70 dark:bg-slate-950/85 dark:ring-white/8">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-55" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_12px_theme(colors.emerald.500)]" />
                </span>
                {t('home.preview.status')}
              </div>
              <div className="flex gap-1.5">
                <span className="h-2 w-10 rounded-full bg-slate-200 dark:bg-slate-600" />
                <span className="h-2 w-6 rounded-full bg-slate-200 dark:bg-slate-600" />
              </div>
            </div>
            <div className="mt-2 grid gap-2 rounded-2xl bg-gradient-to-br from-slate-900 via-[#1a1530] to-violet-950 p-4 sm:grid-cols-[1fr_1.35fr] sm:p-5">
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
      <div className="overflow-hidden rounded-[1.25rem] border border-slate-200/75 bg-white/80 shadow-lg shadow-violet-500/[0.06] ring-1 ring-slate-200/55 backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/65 dark:ring-white/8">
        <div className="grid divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-slate-700/90">
          <div className="relative p-5 text-center sm:text-left">
            <div className="mb-3 inline-flex rounded-xl bg-violet-500/[0.12] p-2 ring-1 ring-violet-500/15 dark:bg-violet-400/15">
              <FileStack className="h-5 w-5 text-violet-600 dark:text-violet-300" aria-hidden />
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              {t('home.stats.docs_label')}
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
              <span className="tabular-nums">{t('home.stats.docs_value')}</span>
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              {t('home.stats.docs_hint')}
            </p>
          </div>

          <div className="relative bg-gradient-to-b from-emerald-50/95 to-white/90 p-5 text-center dark:from-emerald-950/40 dark:to-slate-900/40 sm:text-left">
            <div className="mb-3 inline-flex rounded-xl bg-emerald-500/15 p-2 ring-1 ring-emerald-500/25 dark:bg-emerald-400/10">
              <BarChart3 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden />
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-800/90 dark:text-emerald-200/90">
              {t('home.stats.ats_label')}
            </p>
            <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-emerald-700 dark:text-emerald-300">
              {t('home.stats.ats_value')}
            </p>
          </div>

          <div className="relative p-5 text-center sm:text-left">
            <div className="mb-3 inline-flex rounded-xl bg-fuchsia-500/12 p-2 ring-1 ring-fuchsia-500/18 dark:bg-fuchsia-400/14">
              <Briefcase className="h-5 w-5 text-fuchsia-600 dark:text-fuchsia-300" aria-hidden />
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              {t('home.stats.formats_label')}
            </p>
            <p className="mt-2 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
              {t('home.stats.formats_value')}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              {t('home.stats.formats_sub')}
            </p>
          </div>
        </div>
      </div>
      <p className="mt-4 text-center text-[11px] leading-snug text-slate-500 dark:text-slate-500">
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
      className="relative border-y border-slate-200/70 bg-gradient-to-b from-white via-slate-50/40 to-white py-20 dark:border-slate-800/80 dark:from-[#121016] dark:via-slate-900/95 dark:to-[#0e0e12]"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-[2rem] sm:leading-tight">
            {t('home.how.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            {t('home.how.subtitle')}
          </p>
        </div>
        <ol className="mt-14 grid gap-6 md:grid-cols-3 md:gap-7">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className={cn(
                'group relative flex flex-col overflow-hidden rounded-[1.65rem] border border-slate-200/60 bg-white/90 p-8 shadow-[0_14px_40px_-24px_rgba(15,23,42,0.35)] transition duration-300',
                'hover:-translate-y-1 hover:border-violet-200/80 hover:shadow-[0_22px_50px_-28px_rgba(109,40,217,0.28)] dark:border-white/10 dark:bg-slate-900/80 dark:hover:border-violet-400/35',
              )}
            >
              <span
                className="pointer-events-none absolute -right-0.5 -top-6 text-[4.65rem] font-bold leading-none tabular-nums text-violet-100 transition group-hover:text-violet-50/98 dark:text-violet-500/[0.12] dark:group-hover:text-violet-400/18"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="relative z-[1] mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-50 to-white shadow-inner ring-1 ring-violet-200/55 dark:from-violet-950/85 dark:to-slate-900 dark:ring-violet-500/25">
                <step.icon className="h-6 w-6 text-violet-600 dark:text-violet-300" />
              </div>
              <h3 className="relative z-[1] text-lg font-semibold text-slate-900 dark:text-white">{step.title}</h3>
              <p className="relative z-[1] mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {step.body}
              </p>
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
    <section
      className="relative bg-slate-50/55 py-20 dark:bg-[linear-gradient(180deg,#09090b_0%,#0c0a12_100%)]"
      id="features"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(139,92,246,0.04),transparent)] dark:bg-[linear-gradient(180deg,transparent,rgba(167,139,250,0.06),transparent)]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-[2rem]">
            {t('home.features.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            {t('home.features.subtitle')}
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.title}
              className={cn(
                'relative overflow-hidden rounded-[1.4rem] border border-slate-200/65 bg-white/90 p-7 shadow-[0_14px_40px_-26px_rgba(15,23,42,0.3)] backdrop-blur-sm transition duration-300',
                'before:pointer-events-none before:absolute before:inset-x-7 before:top-0 before:h-px before:rounded-full before:bg-gradient-to-r before:from-transparent before:via-violet-400/45 before:to-transparent',
                'hover:-translate-y-0.5 hover:border-violet-200/80 hover:shadow-[0_20px_44px_-28px_rgba(109,40,217,0.22)] dark:border-white/10 dark:bg-slate-900/75 dark:hover:border-violet-400/30',
              )}
            >
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HomePricingSection() {
  const { t } = useSiteLocale()
  const tiers = useMemo(() => buildPricingTiers(t), [t])
  const [selectedPlanId, setSelectedPlanId] =
    useState<PricingPlanId>(DEFAULT_SELECTED_PLAN)

  return (
    <section
      id="pricing"
      className="relative overflow-hidden border-y border-slate-200/70 bg-gradient-to-b from-white via-violet-50/25 to-slate-50/90 py-16 dark:border-slate-800/80 dark:from-[#0e0d12] dark:via-[#120f18] dark:to-[#09090b]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-28 top-20 h-[22rem] w-[22rem] rounded-full bg-fuchsia-400/14 blur-[100px] dark:bg-fuchsia-600/14"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-violet-400/18 blur-[100px] dark:bg-violet-600/14"
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
            {t('home.pricing.kicker')}
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-[2rem]">
            {t('home.pricing.title')}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
            {t('home.pricing.subtitle')}
          </p>
        </div>

        <PricingTierGrid className="mt-14">
          {tiers.map((tier) => {
            const isSelected = selectedPlanId === tier.planId
            return (
              <PricingTierCard
                key={tier.planId}
                tier={tier}
                selected={isSelected}
                selectedLabel={t('pricing.selected')}
                onSelect={() => setSelectedPlanId(tier.planId)}
                popularLabel={t('pricing.popular')}
                includesLabel={t('home.pricing.includes')}
                footer={
                  <Link
                    href={`/pricing#plan-${tier.planId}`}
                    className={pricingTierCtaClassName(isSelected)}
                  >
                    {t('home.pricing.card_cta')}
                  </Link>
                }
              />
            )
          })}
        </PricingTierGrid>

        <p className="relative mt-10 text-center text-xs text-slate-600 dark:text-slate-500 sm:text-sm">
          {t('home.pricing.footnote')}
        </p>
        <div className="relative mt-3 text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold text-violet-700 ring-1 ring-violet-200/85 transition hover:bg-violet-50 dark:text-violet-300 dark:ring-violet-500/25 dark:hover:bg-violet-950/55 sm:text-sm"
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
    <section className="relative isolate overflow-hidden border-t border-white/15 bg-gradient-to-br from-violet-600 via-violet-600 to-fuchsia-600 py-20 dark:border-white/10">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[20%] top-[-40%] h-[28rem] w-[28rem] rounded-full bg-white/22 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-50%] right-[-15%] h-[26rem] w-[26rem] rounded-full bg-fuchsia-400/33 blur-[100px]"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.18)_0%,transparent_45%,transparent_60%,rgba(255,255,255,0.08)_100%)]" />

      <div className="relative mx-auto max-w-3xl px-4 pb-6 pt-2 text-center sm:px-6">
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {t('home.footer.title')}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-lg text-white/92">{t('home.footer.subtitle')}</p>
        <div className="mx-auto mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Button
            size="lg"
            className="h-12 min-w-[220px] rounded-full border border-white/20 bg-white px-8 text-base font-semibold text-violet-700 shadow-xl shadow-violet-900/35 transition hover:bg-slate-50"
            asChild
          >
            <Link href="/studio">{t('home.footer.cta_primary')}</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 min-w-[200px] rounded-full border-white/85 bg-transparent px-8 text-base font-semibold text-white shadow-inner backdrop-blur-sm hover:bg-white/15"
            asChild
          >
            <Link href="/pricing">Voir les plans</Link>
          </Button>
        </div>
        <p className="mt-8">
          <Link
            href="#pricing"
            className="text-sm font-medium text-white/90 underline-offset-4 transition hover:text-white hover:underline"
          >
            {t('landing.pricing')}
          </Link>
        </p>
      </div>
    </section>
  )
}

function SiteFooter() {
  const { t } = useSiteLocale()

  return (
    <footer className="border-t border-slate-200/80 bg-white/92 py-11 backdrop-blur-sm dark:border-slate-800/90 dark:bg-slate-950/95">
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
    <div className="relative isolate overflow-x-hidden bg-[linear-gradient(180deg,#f8f6ff_0%,#ffffff_42%,#f4f7fb_100%)] text-slate-900 dark:bg-[linear-gradient(180deg,#0f0d14_0%,#09090b_45%,#0a0c12_100%)] dark:text-slate-50">
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
