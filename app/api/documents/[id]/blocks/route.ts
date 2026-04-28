import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { requireSessionUser } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'

const createBlockSchema = z.object({
  blockType: z.enum([
    'TITLE',
    'HEADING',
    'TEXT',
    'BULLETS',
    'IMAGE',
    'CHART',
    'QUOTE',
    'CTA',
    'DIVIDER',
  ]),
  contentJson: z.record(z.any()),
  styleJson: z.record(z.any()).optional(),
  position: z.number().int().min(0).optional(),
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
    const parsed = createBlockSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.issues },
        { status: 400 },
      )
    }

    const data = parsed.data

    const count = await prisma.documentBlock.count({
      where: { documentId: params.id },
    })

    const targetPosition = Math.min(
      data.position ?? count,
      count,
    )

    await prisma.documentBlock.updateMany({
      where: {
        documentId: params.id,
        position: { gte: targetPosition },
      },
      data: { position: { increment: 1 } },
    })

    const block = await prisma.documentBlock.create({
      data: {
        documentId: params.id,
        blockType: data.blockType,
        position: targetPosition,
        contentJson: data.contentJson,
        styleJson: data.styleJson,
      },
    })

    return NextResponse.json({ success: true, data: block })
  } catch (error) {
    console.error('POST /api/documents/[id]/blocks error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 },
    )
  }
}

