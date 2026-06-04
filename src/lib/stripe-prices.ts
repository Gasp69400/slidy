import type { PricingPlanId } from '@/lib/pricing-tiers'

export type StripeCheckoutPlanId = Extract<PricingPlanId, 'pro' | 'ultimate'>

function trimId(value: string | undefined): string {
  return value?.trim() ?? ''
}

/** Price ID serveur (prioritaire) ou public pour le checkout. */
export function getStripePriceIdForPlan(plan: StripeCheckoutPlanId): string {
  if (plan === 'pro') {
    return (
      trimId(process.env.STRIPE_PRO_PRICE_ID) ||
      trimId(process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID)
    )
  }
  return (
    trimId(process.env.STRIPE_ULTIMATE_PRICE_ID) ||
    trimId(process.env.NEXT_PUBLIC_STRIPE_ULTIMATE_PRICE_ID)
  )
}

export function isKnownStripePriceId(priceId: string): boolean {
  const id = priceId.trim()
  if (!id) return false
  return (
    id === trimId(process.env.STRIPE_PRO_PRICE_ID) ||
    id === trimId(process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID) ||
    id === trimId(process.env.STRIPE_ULTIMATE_PRICE_ID) ||
    id === trimId(process.env.NEXT_PUBLIC_STRIPE_ULTIMATE_PRICE_ID)
  )
}

export function resolveCheckoutPriceId(input: {
  planId?: StripeCheckoutPlanId
  priceId?: string
}): { priceId: string } | { error: string } {
  if (input.planId) {
    const fromPlan = getStripePriceIdForPlan(input.planId)
    if (!fromPlan) {
      return {
        error: `Price ID manquant pour le plan ${input.planId}. Définissez STRIPE_${input.planId.toUpperCase()}_PRICE_ID (et NEXT_PUBLIC_STRIPE_${input.planId.toUpperCase()}_PRICE_ID) sur Vercel.`,
      }
    }
    return { priceId: fromPlan }
  }

  const clientPrice = input.priceId?.trim() ?? ''
  if (!clientPrice) {
    return {
      error:
        'Price ID Stripe manquant. Vérifiez NEXT_PUBLIC_STRIPE_PRO_PRICE_ID et NEXT_PUBLIC_STRIPE_ULTIMATE_PRICE_ID.',
    }
  }

  if (!isKnownStripePriceId(clientPrice)) {
    return {
      error: `Price ID non reconnu : ${clientPrice}`,
    }
  }

  return { priceId: clientPrice }
}

export function publicStripePriceIdsForClient(): {
  pro: string
  ultimate: string
} {
  return {
    pro: trimId(process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID),
    ultimate: trimId(process.env.NEXT_PUBLIC_STRIPE_ULTIMATE_PRICE_ID),
  }
}
