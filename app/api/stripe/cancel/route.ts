import { NextRequest, NextResponse } from 'next/server'

import { jsonWithSessionCookies, requireSessionUser } from '@/lib/api-auth'
import { resolveUserPlan } from '@/lib/plans'
import { prisma } from '@/lib/prisma'
import { cancelSubscription } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const auth = await requireSessionUser(request)
    if (!auth.ok) return auth.response

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { subscriptionStatus: true, planTier: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé', code: 'USER_NOT_FOUND' },
        { status: 404 },
      )
    }

    const activePlan = resolveUserPlan(user)
    if (activePlan !== 'PRO' && activePlan !== 'ULTIMATE') {
      return NextResponse.json(
        {
          error: 'Aucun abonnement payant actif à résilier.',
          code: 'NO_PAID_PLAN',
        },
        { status: 400 },
      )
    }

    const result = await cancelSubscription(auth.userId)

    return jsonWithSessionCookies(
      {
        success: true,
        alreadyScheduled: result.alreadyScheduled,
        currentPeriodEnd: result.currentPeriodEnd,
      },
      undefined,
      auth.sessionCookies,
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Erreur interne du serveur'
    console.error('[stripe/cancel]', message, error)
    return NextResponse.json(
      { error: message, code: 'CANCEL_FAILED' },
      { status: 500 },
    )
  }
}
