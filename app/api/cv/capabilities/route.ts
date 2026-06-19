import { NextRequest, NextResponse } from 'next/server'

import { requireSessionUser } from '@/lib/api-auth'
import { getCapabilities, resolveUserPlan } from '@/lib/plans'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const auth = await requireSessionUser(request)
  if (!auth.ok) return auth.response

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { subscriptionStatus: true, planTier: true },
  })

  const plan = user ? resolveUserPlan(user) : 'STARTER'

  return NextResponse.json({
    success: true,
    data: getCapabilities(plan),
  })
}
