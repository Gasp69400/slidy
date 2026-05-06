import { NextRequest, NextResponse } from 'next/server'

import { requireSessionUser } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'

type Params = {
  params: {
    id: string
  }
}

export async function GET(
  _request: NextRequest,
  { params }: Params,
) {
  try {
    const auth = await requireSessionUser()
    if (!auth.ok) return auth.response

    const presentation = await prisma.presentation.findFirst({
      where: {
        id: params.id,
        userId: auth.userId,
      },
    })

    if (!presentation) {
      return NextResponse.json(
        { error: 'Présentation non trouvée' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: presentation,
    })
  } catch (error) {
    console.error('GET /api/presentations/[id] error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 },
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: Params,
) {
  try {
    const auth = await requireSessionUser()
    if (!auth.ok) return auth.response

    const result = await prisma.presentation.deleteMany({
      where: {
        id: params.id,
        userId: auth.userId,
      },
    })

    if (result.count === 0) {
      return NextResponse.json(
        { error: 'Présentation non trouvée' },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/presentations/[id] error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 },
    )
  }
}

