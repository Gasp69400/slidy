import { Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

import { requireSessionUser } from '@/lib/api-auth'
import { getCapabilitiesForUserId } from '@/lib/user-capabilities'

export async function GET(request: NextRequest) {
  const auth = await requireSessionUser(request)
  if (!auth.ok) return auth.response

  try {
    const data = await getCapabilitiesForUserId(auth.userId, auth.email)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('GET /api/me/capabilities error:', error)
    if (
      error instanceof Prisma.PrismaClientInitializationError ||
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      const data = await getCapabilitiesForUserId(auth.userId, auth.email)
      return NextResponse.json({ success: true, data })
    }
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 },
    )
  }
}
