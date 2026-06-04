import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { createCheckoutSession } from '@/lib/stripe'
import {
  resolveCheckoutPriceId,
  type StripeCheckoutPlanId,
} from '@/lib/stripe-prices'
import { requireSupabaseSession } from '@/lib/supabase/require-supabase-session'

const subscribeSchema = z.object({
  planId: z.enum(['pro', 'ultimate']).optional(),
  priceId: z.string().optional(),
  trialDays: z.number().min(0).max(365).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await requireSupabaseSession()
    if (!session.ok) {
      return NextResponse.json(
        {
          error: 'Connectez-vous pour souscrire à un plan payant.',
          code: 'AUTH_REQUIRED',
        },
        { status: 401 },
      )
    }

    const body = await request.json()
    const parsed = subscribeSchema.parse(body)

    const resolved = resolveCheckoutPriceId({
      planId: parsed.planId as StripeCheckoutPlanId | undefined,
      priceId: parsed.priceId,
    })

    if ('error' in resolved) {
      console.error('[stripe/subscribe] priceId:', resolved.error, {
        planId: parsed.planId,
        priceId: parsed.priceId,
      })
      return NextResponse.json(
        { error: resolved.error, code: 'INVALID_PRICE_ID' },
        { status: 400 },
      )
    }

    console.info('[stripe/subscribe] checkout', {
      userId: session.userId,
      planId: parsed.planId,
      priceId: resolved.priceId,
      trialDays: parsed.trialDays ?? 0,
    })

    const checkoutSession = await createCheckoutSession({
      userId: session.userId,
      userEmail: session.email!,
      priceId: resolved.priceId,
      trialDays: parsed.trialDays,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Données invalides',
          code: 'VALIDATION_ERROR',
          details: error.errors,
        },
        { status: 400 },
      )
    }

    const message =
      error instanceof Error ? error.message : 'Erreur interne du serveur'

    console.error('[stripe/subscribe]', message, error)

    if (message.includes('STRIPE_SECRET_KEY')) {
      return NextResponse.json(
        {
          error:
            'Paiement indisponible : STRIPE_SECRET_KEY manquante côté serveur (Vercel).',
          code: 'STRIPE_NOT_CONFIGURED',
        },
        { status: 503 },
      )
    }

    return NextResponse.json(
      { error: message, code: 'CHECKOUT_FAILED' },
      { status: 500 },
    )
  }
}
