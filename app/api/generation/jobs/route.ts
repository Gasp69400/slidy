import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { requireSessionUser } from '@/lib/api-auth'
import { getCapabilities, planFromSubscription } from '@/lib/plans'
import { prisma } from '@/lib/prisma'
import { resolveGroqChatModel } from '@/lib/server-chat-llm'

const createJobSchema = z.object({
  prompt: z.string().min(8),
  topic: z.string().min(2),
  title: z.string().min(2).optional(),
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
  detailLevel: z.enum(['short', 'medium', 'detailed']).default('medium'),
  templateSlug: z.string().optional(),
  model: z.string().optional(),
  options: z.record(z.any()).optional(),
})

function buildStarterBlocks(input: {
  title: string
  topic: string
  detailLevel: string
}) {
  const densityHint =
    input.detailLevel === 'short'
      ? '2-3 bullet points'
      : input.detailLevel === 'detailed'
      ? '4-5 bullet points with insights'
      : '3-4 bullet points'

  return [
    {
      blockType: 'TITLE' as const,
      contentJson: {
        title: input.title,
        subtitle: `Topic: ${input.topic}`,
      },
    },
    {
      blockType: 'HEADING' as const,
      contentJson: {
        text: 'Key Message',
      },
    },
    {
      blockType: 'BULLETS' as const,
      contentJson: {
        items: [
          'AI-generated structure based on your prompt',
          `Content density target: ${densityHint}`,
          'You can edit and reorder every block in the editor',
        ],
      },
    },
  ]
}

export async function GET(_request: NextRequest) {
  const auth = await requireSessionUser()
  if (!auth.ok) return auth.response

  try {
    const jobs = await prisma.generationJob.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({ success: true, data: jobs })
  } catch (error) {
    console.error('GET /api/generation/jobs error:', error)
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
    const parsed = createJobSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.issues },
        { status: 400 },
      )
    }

    const input = parsed.data
    const generatedTitle = input.title ?? `Untitled ${input.type.toLowerCase()}`

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { subscriptionStatus: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 },
      )
    }

    const caps = getCapabilities(planFromSubscription(user.subscriptionStatus))
    if (!caps.allowedDocumentTypes.includes(input.type)) {
      return NextResponse.json(
        {
          error:
            "Votre plan actuel ne permet pas ce type de document. Passez au plan supérieur pour débloquer cette fonctionnalité.",
          requiredPlanHint: input.type,
        },
        { status: 403 },
      )
    }

    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    const todayCount = await prisma.generationJob.count({
      where: {
        userId: auth.userId,
        createdAt: { gte: startOfDay },
      },
    })

    if (todayCount >= caps.maxDocumentsPerDay) {
      return NextResponse.json(
        {
          error:
            'Limite quotidienne atteinte pour votre plan. Passez au plan supérieur pour générer plus de documents.',
          quota: {
            used: todayCount,
            max: caps.maxDocumentsPerDay,
          },
        },
        { status: 429 },
      )
    }

    const job = await prisma.generationJob.create({
      data: {
        userId: auth.userId,
        status: 'RUNNING',
        prompt: input.prompt,
        model: resolveGroqChatModel(input.model),
        detailLevel: input.detailLevel,
        requestedType: input.type,
        optionsJson: {
          audience: input.audience,
          templateSlug: input.templateSlug,
          ...(input.options ?? {}),
        },
      },
    })

    const starterBlocks = buildStarterBlocks({
      title: generatedTitle,
      topic: input.topic,
      detailLevel: input.detailLevel,
    })

    const document = await prisma.aiDocument.create({
      data: {
        userId: auth.userId,
        title: generatedTitle,
        topic: input.topic,
        type: input.type,
        audience: input.audience,
        detailLevel: input.detailLevel,
        templateSlug: input.templateSlug,
        status: 'READY',
        metadata: {
          source: 'generation_job',
          prompt: input.prompt,
        },
        blocks: {
          create: starterBlocks.map((block, index) => ({
            blockType: block.blockType,
            contentJson: block.contentJson,
            position: index,
          })),
        },
      },
    })

    const updatedJob = await prisma.generationJob.update({
      where: { id: job.id },
      data: {
        status: 'COMPLETED',
        documentId: document.id,
        resultJson: {
          documentId: document.id,
          blockCount: starterBlocks.length,
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        job: updatedJob,
        documentId: document.id,
      },
    })
  } catch (error) {
    console.error('POST /api/generation/jobs error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 },
    )
  }
}

