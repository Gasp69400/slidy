import type { PlanTier, SubscriptionStatus } from '@prisma/client'

import {
  getCapabilities,
  resolveUserPlan,
  type PlanCapabilities,
} from '@/lib/plans'

export type UserIdentity = {
  userId: string
  email?: string | null
}

const OWNER_PLAN: PlanTier = 'ULTIMATE'

/** Compte fondateur (accès Ultimate même en Starter). Complété par SLIDY_OWNER_EMAILS. */
const BUILTIN_OWNER_EMAILS = ['g.nepple@icloud.com']

function parseEnvList(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
}

/** Comptes fondateur / admin avec accès complet quel que soit le plan Stripe. */
export function isSlidyPlanOwner(identity: UserIdentity): boolean {
  const email = identity.email?.trim().toLowerCase()
  if (email) {
    const ownerEmails = [
      ...BUILTIN_OWNER_EMAILS,
      ...parseEnvList(process.env.SLIDY_OWNER_EMAILS),
    ].map((e) => e.toLowerCase())
    if (ownerEmails.includes(email)) return true
  }

  const ownerIds = parseEnvList(process.env.SLIDY_OWNER_USER_IDS)
  if (ownerIds.includes(identity.userId)) return true

  return false
}

export function resolvePlanForUser(
  dbUser:
    | {
        subscriptionStatus: SubscriptionStatus
        planTier: PlanTier
      }
    | null
    | undefined,
  identity: UserIdentity,
): PlanTier {
  if (isSlidyPlanOwner(identity)) return OWNER_PLAN
  if (!dbUser) return 'STARTER'
  return resolveUserPlan(dbUser)
}

export function capabilitiesForUser(
  dbUser:
    | {
        subscriptionStatus: SubscriptionStatus
        planTier: PlanTier
      }
    | null
    | undefined,
  identity: UserIdentity,
): PlanCapabilities {
  return getCapabilities(resolvePlanForUser(dbUser, identity))
}
