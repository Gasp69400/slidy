import { NextRequest, NextResponse } from 'next/server'
import type { Template } from '@prisma/client'

import { requireSessionUser } from '@/lib/api-auth'
import { planFromSubscription, PLAN_ORDER } from '@/lib/plans'
import { prisma } from '@/lib/prisma'

export async function GET(_request: NextRequest) {
  try {
    const auth = await requireSessionUser()
    if (!auth.ok) return auth.response

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { subscriptionStatus: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 },
      )
    }

    const allowedTier = planFromSubscription(user.subscriptionStatus)

    const allowedRank = PLAN_ORDER[allowedTier]

    const templates = await prisma.template.findMany({
      orderBy: [
        { isFeatured: 'desc' },
        { planTier: 'asc' },
        { name: 'asc' },
      ],
    })

    const visible = templates.filter((t: Template) => {
      return PLAN_ORDER[t.planTier] <= allowedRank
    })

    return NextResponse.json({
      success: true,
      data: visible,
    })
  } catch (error) {
    console.error('GET /api/templates error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 },
    )
  }
}
