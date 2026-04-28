import { NextRequest, NextResponse } from 'next/server'

import { requireSessionUser } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'

export async function GET(_request: NextRequest) {
  try {
    const auth = await requireSessionUser()
    if (!auth.ok) return auth.response

    const presentations = await prisma.presentation.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: presentations,
    })
  } catch (error) {
    console.error('GET /api/presentations error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireSessionUser()
    if (!auth.ok) return auth.response

    const body = await request.json()

    const created = await prisma.presentation.create({
      data: {
        userId: auth.userId,
        title: body.title,
        topic: body.topic,
        audience: body.audience,
        presentationType: body.presentation_type,
        templateSlug: body.template,
        slideCount: body.slide_count,
        slidesJson: body.slides_json,
        status: body.status ?? 'completed',
        options: body.options,
        fileUrl: body.file_url ?? null,
      },
    })

    return NextResponse.json({
      success: true,
      data: created,
    })
  } catch (error) {
    console.error('POST /api/presentations error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 },
    )
  }
}

