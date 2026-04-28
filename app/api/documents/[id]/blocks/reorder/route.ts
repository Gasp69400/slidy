import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { requireSessionUser } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'

const reorderSchema = z.object({
  orderedBlockIds: z.array(z.string().min(1)).min(1),
})

type Params = { params: { id: string } }

export async function POST(request: NextRequest, { params }: Params) {
  const auth = await requireSessionUser()
  if (!auth.ok) return auth.response

  try {
    const document = await prisma.aiDocument.findFirst({
      where: { id: params.id, userId: auth.userId },
      select: { id: true },
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Document non trouvé' },
        { status: 404 },
      )
    }

    const body = await request.json()
    const parsed = reorderSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.issues },
        { status: 400 },
      )
    }

    const existing = await prisma.documentBlock.findMany({
      where: { documentId: params.id },
      select: { id: true },
    })

    const existingIds = new Set(existing.map((b: { id: string }) => b.id))
    const incomingIds = parsed.data.orderedBlockIds

    if (
      incomingIds.length !== existing.length ||
      incomingIds.some((id) => !existingIds.has(id))
    ) {
      return NextResponse.json(
        { error: 'La liste des blocs est invalide' },
        { status: 400 },
      )
    }

    await prisma.$transaction(
      incomingIds.map((id, index) =>
        prisma.documentBlock.update({
          where: { id },
          data: { position: index },
        }),
      ),
    )

    const blocks = await prisma.documentBlock.findMany({
      where: { documentId: params.id },
      orderBy: { position: 'asc' },
    })

    return NextResponse.json({ success: true, data: blocks })
  } catch (error) {
    console.error('POST /api/documents/[id]/blocks/reorder error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 },
    )
  }
}

