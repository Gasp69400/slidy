import { NextRequest, NextResponse } from 'next/server'
import { requireSessionUser } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'

type Params = { params: { id: string } }

export async function POST(_request: NextRequest, { params }: Params) {
  try {
    const auth = await requireSessionUser()
    if (!auth.ok) return auth.response

    const presentation = await prisma.presentation.findFirst({
      where: { id: params.id, userId: auth.userId },
    })

    if (!presentation) {
      return NextResponse.json({ error: 'Présentation non trouvée' }, { status: 404 })
    }

    const updated = await prisma.presentation.update({
      where: { id: params.id },
      data: { isPublic: !presentation.isPublic },
    })

    return NextResponse.json({ success: true, data: { isPublic: updated.isPublic } })
  } catch (error) {
    console.error('POST /api/presentations/[id]/share error:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}