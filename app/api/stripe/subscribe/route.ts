import { NextRequest, NextResponse } from 'next/server'

import { requireSessionUser } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { createSubscription } from '@/lib/stripe'
import { z } from 'zod'

const subscribeSchema = z.object({
  priceId: z.string(),
  trialDays: z.number().min(0).max(365).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const auth = await requireSessionUser()
    if (!auth.ok) return auth.response

    const body = await request.json()
    const { priceId, trialDays } = subscribeSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    const subscription = await createSubscription({
      userId: user.id,
      priceId,
      trialDays,
    })

    return NextResponse.json({
      success: true,
      data: subscription,
      message: 'Abonnement créé avec succès'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create subscription error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
