import type { PlanTier, SubscriptionStatus } from '@prisma/client'

export type { PlanTier }

export const PLAN_ORDER: Record<PlanTier, number> = {
  STARTER: 1,
  PRO: 2,
  ULTIMATE: 3,
}

const PRO_PRICE_IDS = () =>
  [
    process.env.STRIPE_PRO_PRICE_ID,
    process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
  ].filter(Boolean) as string[]

const ULTIMATE_PRICE_IDS = () =>
  [
    process.env.STRIPE_ULTIMATE_PRICE_ID,
    process.env.NEXT_PUBLIC_STRIPE_ULTIMATE_PRICE_ID,
  ].filter(Boolean) as string[]

/** Déduit Pro vs Ultimate à partir du price Stripe checkout / abonnement. */
export function planTierFromStripePriceId(priceId: string): PlanTier | null {
  if (PRO_PRICE_IDS().includes(priceId)) return 'PRO'
  if (ULTIMATE_PRICE_IDS().includes(priceId)) return 'ULTIMATE'
  return null
}

export function resolveUserPlan(user: {
  subscriptionStatus: SubscriptionStatus
  planTier: PlanTier
}): PlanTier {
  if (user.planTier === 'STARTER') return 'STARTER'

  switch (user.subscriptionStatus) {
    case 'ACTIVE':
    case 'TRIAL':
    case 'PAST_DUE':
      return user.planTier
    default:
      return 'STARTER'
  }
}

/** @deprecated Préférer resolveUserPlan avec planTier en base. */
export function planFromSubscription(
  subscriptionStatus: SubscriptionStatus,
  planTier: PlanTier = 'STARTER',
): PlanTier {
  return resolveUserPlan({ subscriptionStatus, planTier })
}

export type DocumentQuotaPeriod = 'day' | 'month'

export type PlanCapabilities = {
  plan: PlanTier
  maxDocuments: number
  documentQuotaPeriod: DocumentQuotaPeriod
  maxBlocksPerDocument: number
  allowedDocumentTypes: Array<
    | 'PRESENTATION'
    | 'WHITEBOARD'
    | 'DOCUMENT'
    | 'NOTES'
    | 'VISUAL_PAGE'
    | 'MARKETING_PRESENTATION'
    | 'CV_COVER'
  >
  exportFormats: Array<'pdf' | 'pptx' | 'json'>
}

export function getDocumentQuotaWindowStart(
  period: DocumentQuotaPeriod,
  now = new Date(),
): Date {
  if (period === 'day') {
    const start = new Date(now)
    start.setHours(0, 0, 0, 0)
    return start
  }
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  start.setHours(0, 0, 0, 0)
  return start
}

export function getCapabilities(plan: PlanTier): PlanCapabilities {
  if (plan === 'ULTIMATE') {
    return {
      plan,
      maxDocuments: 200,
      documentQuotaPeriod: 'month',
      maxBlocksPerDocument: 300,
      allowedDocumentTypes: [
        'PRESENTATION',
        'WHITEBOARD',
        'DOCUMENT',
        'NOTES',
        'VISUAL_PAGE',
        'MARKETING_PRESENTATION',
        'CV_COVER',
      ],
      exportFormats: ['pdf', 'pptx', 'json'],
    }
  }

  if (plan === 'PRO') {
    return {
      plan,
      maxDocuments: 50,
      documentQuotaPeriod: 'month',
      maxBlocksPerDocument: 150,
      allowedDocumentTypes: [
        'PRESENTATION',
        'DOCUMENT',
        'NOTES',
        'VISUAL_PAGE',
        'CV_COVER',
      ],
      exportFormats: ['pdf', 'pptx', 'json'],
    }
  }

  // STARTER
  return {
    plan,
    maxDocuments: 1,
    documentQuotaPeriod: 'day',
    maxBlocksPerDocument: 30,
    allowedDocumentTypes: ['PRESENTATION', 'NOTES'],
    exportFormats: ['pdf'],
  }
}
