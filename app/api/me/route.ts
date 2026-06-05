import { NextRequest, NextResponse } from 'next/server'

import { jsonWithSessionCookies, requireSessionUser } from '@/lib/api-auth'
import { resolveUserPlan } from '@/lib/plans'
import { prisma } from '@/lib/prisma'
import { getSubscriptionInfo } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireSessionUser(request)
    if (!auth.ok) return auth.response

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: {
        id: true,
        email: true,
        name: true,
        subscriptionStatus: true,
        planTier: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 },
      )
    }

    const activePlan = resolveUserPlan(user)
    const stripeSubscription = await getSubscriptionInfo(auth.userId)
    const entitled =
      user.subscriptionStatus === 'ACTIVE' ||
      user.subscriptionStatus === 'TRIAL' ||
      user.subscriptionStatus === 'PAST_DUE'
    const canCancelSubscription =
      entitled &&
      (activePlan === 'PRO' || activePlan === 'ULTIMATE') &&
      Boolean(stripeSubscription) &&
      !stripeSubscription?.cancelAtPeriodEnd

    return jsonWithSessionCookies(
      {
        success: true,
        data: {
          ...user,
          activePlan,
          canCancelSubscription,
          subscription: stripeSubscription
            ? {
                cancelAtPeriodEnd: stripeSubscription.cancelAtPeriodEnd,
                currentPeriodEnd: stripeSubscription.currentPeriodEnd,
                trialEnd: stripeSubscription.trialEnd,
              }
            : null,
        },
      },
      undefined,
      auth.sessionCookies,
    )
  } catch (error) {
    console.error('GET /api/me error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 },
    )
  }
}
