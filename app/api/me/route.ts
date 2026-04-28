import { NextResponse } from 'next/server'

import { requireSessionUser } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const auth = await requireSessionUser()
    if (!auth.ok) return auth.response

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: {
        id: true,
        email: true,
        name: true,
        subscriptionStatus: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error('GET /api/me error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 },
    )
  }
}
