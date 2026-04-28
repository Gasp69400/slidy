import { Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { requireSessionUser } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'

const createDocumentSchema = z.object({
  title: z.string().min(1),
  topic: z.string().min(1),
  type: z
    .enum([
      'PRESENTATION',
      'WHITEBOARD',
      'DOCUMENT',
      'NOTES',
      'VISUAL_PAGE',
      'MARKETING_PRESENTATION',
      'CV_COVER',
    ])
    .default('PRESENTATION'),
  audience: z.string().optional(),
  detailLevel: z.enum(['short', 'medium', 'detailed']).optional(),
  templateSlug: z.string().optional(),
  designOptions: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
  initialBlocks: z
    .array(
      z.object({
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
      }),
    )
    .optional(),
})

export async function GET(_request: NextRequest) {
  const auth = await requireSessionUser()
  if (!auth.ok) return auth.response

  try {
    const documents = await prisma.aiDocument.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { blocks: true, generationJobs: true },
        },
      },
    })

    return NextResponse.json({ success: true, data: documents })
  } catch (error) {
    console.error('GET /api/documents error:', error)
    if (
      error instanceof Prisma.PrismaClientInitializationError ||
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      return NextResponse.json({ success: true, data: [] })
    }
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireSessionUser()
  if (!auth.ok) return auth.response

  try {
    const body = await request.json()
    const parsed = createDocumentSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.issues },
        { status: 400 },
      )
    }

    const data = parsed.data

    const document = await prisma.aiDocument.create({
      data: {
        userId: auth.userId,
        title: data.title,
        topic: data.topic,
        type: data.type,
        audience: data.audience,
        detailLevel: data.detailLevel,
        templateSlug: data.templateSlug,
        designOptions: data.designOptions,
        metadata: data.metadata,
        status: 'DRAFT',
        blocks: data.initialBlocks?.length
          ? {
              create: data.initialBlocks.map((block, index) => ({
                blockType: block.blockType,
                position: index,
                contentJson: block.contentJson,
                styleJson: block.styleJson,
              })),
            }
          : undefined,
      },
      include: {
        blocks: { orderBy: { position: 'asc' } },
      },
    })

    return NextResponse.json({ success: true, data: document })
  } catch (error) {
    console.error('POST /api/documents error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 },
    )
  }
}

