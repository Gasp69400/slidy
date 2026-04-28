import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'

import { requireSessionUser } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { getCapabilities, planFromSubscription } from '@/lib/plans'

export async function GET() {
  const auth = await requireSessionUser()
  if (!auth.ok) return auth.response

  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { subscriptionStatus: true },
    })

    if (!user) {
      const plan = planFromSubscription('TRIAL')
      return NextResponse.json({
        success: true,
        data: getCapabilities(plan),
      })
    }

    const plan = planFromSubscription(user.subscriptionStatus)
    return NextResponse.json({
      success: true,
      data: getCapabilities(plan),
    })
  } catch (error) {
    console.error('GET /api/me/capabilities error:', error)
    if (
      error instanceof Prisma.PrismaClientInitializationError ||
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      const plan = planFromSubscription('TRIAL')
      return NextResponse.json({
        success: true,
        data: getCapabilities(plan),
      })
    }
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 },
    )
  }
}

