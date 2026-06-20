import { NextRequest, NextResponse } from 'next/server'

import {
  fallbackAppUserProfile,
  loadAppUserProfile,
} from '@/lib/app-user-profile'
import { jsonWithSessionCookies, requireSessionUser } from '@/lib/api-auth'
import { createSupabaseRouteHandlerClient } from '@/lib/supabase/route-handler'
import { ensureAppUserFromSupabase } from '@/lib/supabase/sync-app-user'
import { getSubscriptionInfo } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  let sessionCookies: NextResponse | undefined

  try {
    const auth = await requireSessionUser(request)
    if (!auth.ok) return auth.response
    sessionCookies = auth.sessionCookies

    let profile = await loadAppUserProfile(auth.userId, auth.email)

    if (!profile) {
      try {
        const { supabase } = createSupabaseRouteHandlerClient(request)
        const {
          data: { user: supabaseUser },
        } = await supabase.auth.getUser()
        if (supabaseUser) {
          await ensureAppUserFromSupabase(supabaseUser)
          profile = await loadAppUserProfile(auth.userId, auth.email)
        }
      } catch (syncError) {
        console.warn('[GET /api/me] sync utilisateur échouée:', syncError)
      }
    }

    const dbUnavailable = auth.dbUnavailable ?? false

    if (!profile) {
      profile = fallbackAppUserProfile(auth.email, auth.userId)
    }

    let stripeSubscription: Awaited<ReturnType<typeof getSubscriptionInfo>> = null
    try {
      stripeSubscription = await getSubscriptionInfo(auth.userId)
    } catch (stripeError) {
      console.warn('[GET /api/me] Stripe indisponible:', stripeError)
    }

    const entitled =
      profile.subscriptionStatus === 'ACTIVE' ||
      profile.subscriptionStatus === 'TRIAL' ||
      profile.subscriptionStatus === 'PAST_DUE'
    const canCancelSubscription =
      entitled &&
      (profile.activePlan === 'PRO' || profile.activePlan === 'ULTIMATE') &&
      Boolean(stripeSubscription) &&
      !stripeSubscription?.cancelAtPeriodEnd

    return jsonWithSessionCookies(
      {
        success: true,
        data: {
          email: profile.email,
          name: profile.name,
          subscriptionStatus: profile.subscriptionStatus,
          planTier: profile.planTier,
          activePlan: profile.activePlan,
          dbUnavailable,
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
      sessionCookies,
    )
  } catch (error) {
    console.error('GET /api/me error:', error)

    return jsonWithSessionCookies(
      {
        success: false,
        error: 'Erreur interne du serveur',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 },
      sessionCookies,
    )
  }
}
