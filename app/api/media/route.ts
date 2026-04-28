import { NextRequest, NextResponse } from 'next/server'

import { requireSessionUser } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'

export async function GET(_request: NextRequest) {
  const auth = await requireSessionUser()
  if (!auth.ok) return auth.response

  try {
    const assets = await prisma.mediaAsset.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: 'desc' },
      take: 200,
    })

    return NextResponse.json({
      success: true,
      data: assets,
    })
  } catch (error) {
    console.error('GET /api/media error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 },
    )
  }
}

