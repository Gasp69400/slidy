import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

import { requireSessionUser } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'

const updateBlockSchema = z.object({
  contentJson: z.record(z.any()).optional(),
  styleJson: z.record(z.any()).nullable().optional(),
  blockType: z
    .enum([
      'TITLE',
      'HEADING',
      'TEXT',
      'BULLETS',
      'IMAGE',
      'CHART',
      'QUOTE',
      'CTA',
      'DIVIDER',
    ])
    .optional(),
})

type Params = { params: { id: string; blockId: string } }

export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = await requireSessionUser()
  if (!auth.ok) return auth.response

  try {
    const block = await prisma.documentBlock.findFirst({
      where: {
        id: params.blockId,
        documentId: params.id,
        document: { userId: auth.userId },
      },
      select: { id: true },
    })

    if (!block) {
      return NextResponse.json(
        { error: 'Bloc non trouvé' },
        { status: 404 },
      )
    }

    const body = await request.json()
    const parsed = updateBlockSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.issues },
        { status: 400 },
      )
    }

    const data: Prisma.DocumentBlockUpdateInput = {}

    if (parsed.data.contentJson !== undefined) {
      data.contentJson = parsed.data.contentJson as Prisma.InputJsonValue
    }

    if (parsed.data.styleJson !== undefined) {
      data.styleJson =
        parsed.data.styleJson === null
          ? Prisma.JsonNull
          : (parsed.data.styleJson as Prisma.InputJsonValue)
    }

    if (parsed.data.blockType !== undefined) {
      data.blockType = parsed.data.blockType
    }

    const updated = await prisma.documentBlock.update({
      where: { id: params.blockId },
      data,
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error(
      'PATCH /api/documents/[id]/blocks/[blockId] error:',
      error,
    )
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 },
    )
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const auth = await requireSessionUser()
  if (!auth.ok) return auth.response

  try {
    const block = await prisma.documentBlock.findFirst({
      where: {
        id: params.blockId,
        documentId: params.id,
        document: { userId: auth.userId },
      },
      select: { id: true, position: true },
    })

    if (!block) {
      return NextResponse.json(
        { error: 'Bloc non trouvé' },
        { status: 404 },
      )
    }

    await prisma.documentBlock.delete({
      where: { id: params.blockId },
    })

    await prisma.documentBlock.updateMany({
      where: {
        documentId: params.id,
        position: { gt: block.position },
      },
      data: { position: { decrement: 1 } },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(
      'DELETE /api/documents/[id]/blocks/[blockId] error:',
      error,
    )
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 },
    )
  }
}

