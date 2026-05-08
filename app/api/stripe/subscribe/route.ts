import { NextRequest, NextResponse } from 'next/server'
import { requireSupabaseSession } from '@/lib/supabase/require-supabase-session'
import { createCheckoutSession, SUBSCRIPTION_PLANS } from '@/lib/stripe'
import { z } from 'zod'

const subscribeSchema = z.object({
  priceId: z.string(),
  trialDays: z.number().min(0).max(365).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await requireSupabaseSession()
    if (!session.ok) return session.response

    const { userId } = session
    const body = await request.json()
    const { priceId, trialDays } = subscribeSchema.parse(body)
    const checkoutSession = await createCheckoutSession({
      userId,
      userEmail: session.email!,
      priceId,
      trialDays,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Subscribe error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}