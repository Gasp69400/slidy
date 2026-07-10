import type { SiteStrKey } from '@/lib/site-messages'
import { getClientStripePriceId } from '@/lib/stripe-client-price-ids'

export type PricingPlanId = 'starter' | 'pro' | 'ultimate'

export const DEFAULT_SELECTED_PLAN: PricingPlanId = 'pro'

export type PricingTierDefinition = {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  highlighted: boolean
  planId: PricingPlanId
  cta: string
  href: string | null
  priceId: string | null
  trialDays: number
}

type Translate = (key: SiteStrKey) => string

export function buildPricingTiers(t: Translate): PricingTierDefinition[] {
  return [
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
      cta: t('pricing.tier.starter.cta'),
      href: '/studio',
      highlighted: false,
      priceId: null,
      planId: 'starter',
      trialDays: 0,
    },
    {
      name: t('pricing.tier.pro.name'),
      price: '9,90',
      period: t('pricing.tier.pro.period'),
      description: t('pricing.tier.pro.desc'),
      features: [
        t('pricing.tier.pro.f1'),
        t('pricing.tier.pro.f2'),
        t('pricing.tier.pro.f3'),
      ],
      cta: t('pricing.tier.pro.cta'),
      href: null,
      highlighted: true,
      priceId: getClientStripePriceId('pro') || null,
      planId: 'pro',
      trialDays: 0,
    },
    {
      name: t('pricing.tier.ultimate.name'),
      price: '15,99',
      period: t('pricing.tier.ultimate.period'),
      description: t('pricing.tier.ultimate.desc'),
      features: [
        t('pricing.tier.ultimate.f1'),
        t('pricing.tier.ultimate.f2'),
        t('pricing.tier.ultimate.f3'),
      ],
      cta: t('pricing.tier.ultimate.cta'),
      href: null,
      highlighted: false,
      priceId: getClientStripePriceId('ultimate') || null,
      planId: 'ultimate',
      trialDays: 2,
    },
  ]
}
