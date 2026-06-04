import type { PricingPlanId } from '@/lib/pricing-tiers'

export type StripePaidPlanId = Extract<PricingPlanId, 'pro' | 'ultimate'>

/** Price IDs Stripe exposés au client (build-time via NEXT_PUBLIC_*). */
export const NEXT_PUBLIC_STRIPE_PRICE_IDS: Record<StripePaidPlanId, string> = {
  pro: (process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? '').trim(),
  ultimate: (process.env.NEXT_PUBLIC_STRIPE_ULTIMATE_PRICE_ID ?? '').trim(),
}

export function getClientStripePriceId(plan: StripePaidPlanId): string {
  return NEXT_PUBLIC_STRIPE_PRICE_IDS[plan]
}
