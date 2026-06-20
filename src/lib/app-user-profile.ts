import type { PlanTier, SubscriptionStatus } from '@prisma/client'
import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { resolvePlanForUser } from '@/lib/plan-access'
import { isPrismaConnectionError } from '@/lib/prisma-errors'

export type AppUserProfile = {
  email: string
  name: string | null
  subscriptionStatus: SubscriptionStatus
  planTier: PlanTier
  activePlan: PlanTier
}

function isPrismaSchemaMismatch(error: unknown): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false
  return (
    error.code === 'P2022' ||
    error.code === 'P2010' ||
    error.message.includes('planTier') ||
    error.message.includes('does not exist')
  )
}

/** Charge le profil Prisma avec repli si la colonne planTier est absente. */
export async function loadAppUserProfile(
  userId: string,
  fallbackEmail: string,
): Promise<AppUserProfile | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        name: true,
        subscriptionStatus: true,
        planTier: true,
      },
    })
    if (!user) return null

    return {
      email: user.email,
      name: user.name,
      subscriptionStatus: user.subscriptionStatus,
      planTier: user.planTier,
      activePlan: resolvePlanForUser(user, { userId, email: user.email }),
    }
  } catch (error) {
    if (isPrismaConnectionError(error)) return null
    if (!isPrismaSchemaMismatch(error)) throw error

    console.warn('[loadAppUserProfile] planTier indisponible, repli sans colonne')

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        name: true,
        subscriptionStatus: true,
      },
    })
    if (!user) return null

    const withTier = { ...user, planTier: 'STARTER' as PlanTier }
    return {
      email: user.email,
      name: user.name,
      subscriptionStatus: user.subscriptionStatus,
      planTier: 'STARTER',
      activePlan: resolvePlanForUser(withTier, { userId, email: user.email }),
    }
  }
}

export function fallbackAppUserProfile(
  email: string,
  userId = '',
): AppUserProfile {
  const activePlan = resolvePlanForUser(null, { userId, email })
  return {
    email,
    name: null,
    subscriptionStatus: 'TRIAL',
    planTier: 'STARTER',
    activePlan,
  }
}
