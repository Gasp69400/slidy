import { NextRequest, NextResponse } from 'next/server'

import { requireSessionUser } from '@/lib/api-auth'
import { exportCvCoverToPdf } from '@/lib/cv-export-pdf'
import { parseCvDesignOptions, parseCvMetadata } from '@/lib/cv-schema'
import {
  exportDocumentToPdf,
  exportDocumentToPptx,
} from '@/lib/exporters'
import { getCapabilities, planFromSubscription } from '@/lib/plans'
import { prisma } from '@/lib/prisma'

type Params = { params: { id: string } }

export async function GET(request: NextRequest, { params }: Params) {
  const auth = await requireSessionUser()
  if (!auth.ok) return auth.response

  try {
    const formatParam = request.nextUrl.searchParams.get('format')
    const format = formatParam === 'pptx' ? 'pptx' : formatParam === 'json' ? 'json' : 'pdf'

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
    if (!caps.exportFormats.includes(format)) {
      return NextResponse.json(
        {
          error:
            "Ce format d'export n'est pas inclus dans votre plan actuel.",
        },
        { status: 403 },
      )
    }

    const document = await prisma.aiDocument.findFirst({
      where: { id: params.id, userId: auth.userId },
      include: { blocks: { orderBy: { position: 'asc' } } },
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Document non trouvé' },
        { status: 404 },
      )
    }

    if (format === 'json') {
      return NextResponse.json({
        success: true,
        data: {
          id: document.id,
          title: document.title,
          topic: document.topic,
          type: document.type,
          blocks: document.blocks,
          metadata: document.metadata,
          designOptions: document.designOptions,
        },
      })
    }

    if (document.type === 'CV_COVER' && format === 'pptx') {
      return NextResponse.json(
        {
          error:
            'L’export PowerPoint n’est pas disponible pour les dossiers CV & lettre. Utilisez le PDF.',
        },
        { status: 400 },
      )
    }

    if (document.type === 'CV_COVER' && format === 'pdf') {
      const meta = parseCvMetadata(document.metadata)
      if (!meta) {
        return NextResponse.json(
          { error: 'Métadonnées CV invalides ou manquantes.' },
          { status: 500 },
        )
      }
      const design = parseCvDesignOptions(document.designOptions)
      const buffer = await exportCvCoverToPdf({ design, metadata: meta })
      return new NextResponse(buffer as BodyInit, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${safeName(document.title)}.pdf"`,
        },
      })
    }

    const blocks = document.blocks.map(
      (b: (typeof document.blocks)[number]) => ({
      blockType: b.blockType,
      contentJson: b.contentJson as Record<string, any>,
      }),
    )

    if (format === 'pptx') {
      const buffer = await exportDocumentToPptx({
        title: document.title,
        topic: document.topic,
        blocks,
      })
      return new NextResponse(buffer as BodyInit, {
        status: 200,
        headers: {
          'Content-Type':
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'Content-Disposition': `attachment; filename="${safeName(document.title)}.pptx"`,
        },
      })
    }

    const buffer = await exportDocumentToPdf({
      title: document.title,
      topic: document.topic,
      blocks,
    })
    return new NextResponse(buffer as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeName(document.title)}.pdf"`,
      },
    })
  } catch (error) {
    console.error('GET /api/documents/[id]/export error:', error)
    return NextResponse.json(
      { error: "Erreur interne lors de l'export" },
      { status: 500 },
    )
  }
}

function safeName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-_ ]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60) || 'document'
}

