import { Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

import { requireSessionUser } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { getCapabilities, resolveUserPlan } from '@/lib/plans'

export async function GET(request: NextRequest) {
  const auth = await requireSessionUser(request)
  if (!auth.ok) return auth.response

  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { subscriptionStatus: true, planTier: true },
    })

    if (!user) {
      return NextResponse.json({
        success: true,
        data: getCapabilities('STARTER'),
      })
    }

    const plan = resolveUserPlan(user)
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
      return NextResponse.json({
        success: true,
        data: getCapabilities('STARTER'),
      })
    }
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 },
    )
  }
}
