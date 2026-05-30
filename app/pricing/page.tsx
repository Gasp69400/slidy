'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import Link from 'next/link'

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
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/80 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <LandingHeader />

      <div className="mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
            {t('pricing.kicker')}
          </p>
          <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {t('pricing.title')}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
            {t('pricing.subtitle')}
          </p>
        </div>

        <PricingTierGrid className="mt-14">
          {tiers.map((tier) => (
            <PricingTierCard
              key={tier.planId}
              id={`plan-${tier.planId}`}
              tier={tier}
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

        <p className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
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
    </div>
  )
}
