'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Briefcase,
  FileDown,
  Layers,
  Shield,
  Sparkles,
} from 'lucide-react'

import { LandingHeader } from '@/components/landing/LandingHeader'
import {
  PricingTierCard,
  PricingTierGrid,
  pricingTierCtaClassName,
} from '@/components/pricing/PricingTierCard'
import { useSiteLocale } from '@/lib/site-locale'
import { buildPricingTiers } from '@/lib/pricing-tiers'
import { cn } from '@/lib/utils'

export default function PricingPage() {
  const { t } = useSiteLocale()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [highlightedPlan, setHighlightedPlan] = useState<string | null>(null)
  const cardRefs = useRef<Record<string, HTMLElement | null>>({})

  const tiers = useMemo(() => buildPricingTiers(t), [t])

  const trustPills = useMemo(
    () => [
      { icon: Layers, label: t('pricing.trust_slides') },
      { icon: Briefcase, label: t('pricing.trust_cv') },
      { icon: FileDown, label: t('pricing.trust_export') },
    ],
    [t],
  )

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash.startsWith('plan-')) {
      const planId = hash.replace('plan-', '')
      setHighlightedPlan(planId)
      setTimeout(() => {
        const el = cardRefs.current[planId]
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
      setTimeout(() => setHighlightedPlan(null), 2500)
    }
  }, [])

  const handleSubscribe = async (
    priceId: string,
    planId: string,
    trialDays: number,
  ) => {
    setLoadingPlan(planId)
    try {
      const res = await fetch('/api/stripe/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, trialDays }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('Pas de lien Stripe reçu', data)
      }
    } catch (err) {
      console.error('Erreur abonnement', err)
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="relative isolate min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#f8f6ff_0%,#ffffff_38%,#f4f7fb_100%)] text-slate-900 dark:bg-[linear-gradient(180deg,#0f0d14_0%,#09090b_42%,#0a0c12_100%)] dark:text-slate-50">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-8%,rgba(139,92,246,0.26),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-6%,rgba(139,92,246,0.16),transparent)]" />
        <div className="absolute -left-32 top-24 h-[26rem] w-[26rem] rounded-full bg-violet-300/35 blur-[110px] dark:bg-violet-800/22" />
        <div className="absolute -right-24 top-[28rem] h-80 w-80 rounded-full bg-fuchsia-300/30 blur-[100px] dark:bg-fuchsia-900/18" />
        <div className="absolute bottom-0 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-[100%] bg-violet-200/25 blur-[90px] dark:bg-violet-950/35" />
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.12]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgb(139 92 246 / 0.14) 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      <LandingHeader />

      <main className="relative mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200/55 bg-white/75 px-4 py-1.5 text-xs font-medium tracking-wide text-violet-700 shadow-md shadow-violet-500/[0.12] ring-1 ring-white/60 backdrop-blur-md dark:border-white/14 dark:bg-slate-900/55 dark:text-violet-100 dark:ring-white/10">
            <Sparkles className="h-3.5 w-3.5 text-violet-500 dark:text-violet-300" />
            {t('pricing.hero_badge')}
          </div>

          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-600 dark:text-violet-400">
            {t('pricing.kicker')}
          </p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl sm:leading-[1.08]">
            <span className="text-slate-900 dark:text-white">
              {t('pricing.title_lead')}{' '}
            </span>
            <span className="bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-600 bg-clip-text text-transparent dark:from-violet-400 dark:via-violet-300 dark:to-fuchsia-400">
              {t('pricing.title_accent')}
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
            {t('pricing.subtitle')}
          </p>

          <ul className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-2.5">
            {trustPills.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm shadow-violet-500/[0.06] ring-1 ring-violet-100/80 backdrop-blur-sm dark:border-white/12 dark:bg-slate-900/55 dark:text-slate-200 dark:ring-white/10"
              >
                <Icon className="h-3.5 w-3.5 text-violet-500 dark:text-violet-400" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto mt-14 max-w-5xl">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-4 rounded-[2.75rem] bg-gradient-to-br from-violet-400/15 via-transparent to-fuchsia-400/12 blur-2xl dark:from-violet-600/12 dark:to-fuchsia-600/10"
          />
          <div className="relative overflow-hidden rounded-[2.25rem] border border-white/70 bg-white/45 p-5 shadow-[0_28px_80px_-36px_rgba(109,40,217,0.28)] ring-1 ring-violet-200/45 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/45 dark:ring-violet-500/15 sm:p-8 lg:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.55)_0%,transparent_42%,rgba(167,139,250,0.06)_100%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.04)_0%,transparent_50%,rgba(139,92,246,0.08)_100%)]"
            />
            <PricingTierGrid className="relative max-w-none">
              {tiers.map((tier) => (
                <PricingTierCard
                  key={tier.planId}
                  id={`plan-${tier.planId}`}
                  tier={tier}
                  visual={tier.planId}
                  popularLabel={t('pricing.popular')}
                  includesLabel={t('home.pricing.includes')}
                  flashHighlight={highlightedPlan === tier.planId}
                  innerRef={(el) => {
                    cardRefs.current[tier.planId] = el
                  }}
                  footer={
                    tier.priceId ? (
                      <button
                        type="button"
                        className={cn(
                          pricingTierCtaClassName(tier.highlighted),
                          'disabled:cursor-not-allowed disabled:opacity-60',
                        )}
                        disabled={
                          loadingPlan === tier.planId || !tier.priceId.length
                        }
                        onClick={() =>
                          void handleSubscribe(
                            tier.priceId!,
                            tier.planId,
                            tier.trialDays,
                          )
                        }
                      >
                        {loadingPlan === tier.planId ? '…' : tier.cta}
                      </button>
                    ) : (
                      <Link
                        href={tier.href ?? '/studio'}
                        className={pricingTierCtaClassName(tier.highlighted)}
                      >
                        {tier.cta}
                      </Link>
                    )
                  }
                />
              ))}
            </PricingTierGrid>
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-lg flex-col items-center gap-3 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50/80 px-4 py-2 text-xs font-medium text-emerald-800 shadow-sm dark:border-emerald-800/40 dark:bg-emerald-950/40 dark:text-emerald-200">
            <Shield className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {t('pricing.secure')}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            <Link
              href="/legal/cgu"
              className="font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
            >
              {t('home.footer.terms')}
            </Link>
            <span className="mx-2 text-slate-300 dark:text-slate-600">·</span>
            <Link
              href="/"
              className="font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
            >
              {t('pricing.back')}
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
