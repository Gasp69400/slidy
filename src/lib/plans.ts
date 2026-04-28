import type { PlanTier, SubscriptionStatus } from '@prisma/client'

export type { PlanTier }

export const PLAN_ORDER: Record<PlanTier, number> = {
  STARTER: 1,
  PRO: 2,
  TEAM: 3,
}

export function planFromSubscription(
  subscriptionStatus: SubscriptionStatus,
): PlanTier {
  if (subscriptionStatus === 'ACTIVE') return 'TEAM'
  if (subscriptionStatus === 'TRIAL') return 'PRO'
  return 'STARTER'
}

export type PlanCapabilities = {
  plan: PlanTier
  maxDocumentsPerDay: number
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

export function getCapabilities(plan: PlanTier): PlanCapabilities {
  if (plan === 'TEAM') {
    return {
      plan,
      maxDocumentsPerDay: 200,
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
      maxDocumentsPerDay: 60,
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

  // STARTER : CV_COVER inclus temporairement pour démo / tests (retirer quand la monétisation est figée).
  return {
    plan,
    maxDocumentsPerDay: 15,
    maxBlocksPerDocument: 60,
    allowedDocumentTypes: ['PRESENTATION', 'NOTES', 'CV_COVER'],
    exportFormats: ['pdf', 'json'],
  }
}

