import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { requireSessionUser } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'

const updateDocumentSchema = z.object({
  title: z.string().min(1).optional(),
  topic: z.string().min(1).optional(),
  audience: z.string().optional(),
  detailLevel: z.enum(['short', 'medium', 'detailed']).optional(),
  templateSlug: z.string().nullable().optional(),
  status: z
    .enum(['DRAFT', 'GENERATING', 'READY', 'FAILED'])
    .optional(),
  designOptions: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
})

type Params = { params: { id: string } }

export async function GET(_request: NextRequest, { params }: Params) {
  const auth = await requireSessionUser()
  if (!auth.ok) return auth.response

  try {
    const document = await prisma.aiDocument.findFirst({
      where: { id: params.id, userId: auth.userId },
      include: {
        blocks: { orderBy: { position: 'asc' } },
        generationJobs: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Document non trouvé' },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data: document })
  } catch (error) {
    console.error('GET /api/documents/[id] error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = await requireSessionUser()
  if (!auth.ok) return auth.response

  try {
    const existing = await prisma.aiDocument.findFirst({
      where: { id: params.id, userId: auth.userId },
      select: { id: true },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Document non trouvé' },
        { status: 404 },
      )
    }

    const body = await request.json()
    const parsed = updateDocumentSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.issues },
        { status: 400 },
      )
    }

    const updated = await prisma.aiDocument.update({
      where: { id: params.id },
      data: parsed.data,
      include: {
        blocks: { orderBy: { position: 'asc' } },
      },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('PATCH /api/documents/[id] error:', error)
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
    const existing = await prisma.aiDocument.findFirst({
      where: { id: params.id, userId: auth.userId },
      select: { id: true },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Document non trouvé' },
        { status: 404 },
      )
    }

    await prisma.aiDocument.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/documents/[id] error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 },
    )
  }
}

