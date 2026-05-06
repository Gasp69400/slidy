import { NextRequest, NextResponse } from 'next/server'
import { requireSessionUser } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { planFromSubscription, getCapabilities } from '@/lib/plans'
import { PRESENTATION_TEMPLATES_META } from '@/lib/presentation-template-themes'

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

    // Recupere l'utilisateur et son plan
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { subscriptionStatus: true },
    })
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
    }

    const plan = planFromSubscription(user.subscriptionStatus)
    const capabilities = getCapabilities(plan)

    // Verifie la limite de presentations par jour
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const countToday = await prisma.presentation.count({
      where: {
        userId: auth.userId,
        createdAt: { gte: today },
      },
    })
    if (countToday >= capabilities.maxDocumentsPerDay) {
      return NextResponse.json(
        {
          error: `Limite atteinte : votre plan ${plan} permet ${capabilities.maxDocumentsPerDay} presentations par jour.`,
        },
        { status: 403 },
      )
    }

    // Verifie le template selon le plan
    const templateSlug = body.template as string
    const templateMeta = PRESENTATION_TEMPLATES_META.find((t) => t.slug === templateSlug)
    const planOrder: Record<string, number> = {
      STARTER: 1,
      PRO: 2,
      ULTIMATE: 3,
      TEAM: 3,
    }
    const userPlanLevel = planOrder[plan] ?? 1
    const templatePlanLevel = planOrder[(templateMeta?.plan_tier?.toUpperCase() ?? 'STARTER')] ?? 1

    if (templatePlanLevel > userPlanLevel) {
      return NextResponse.json(
        { error: `Le template "${templateSlug}" necessite un plan superieur.` },
        { status: 403 },
      )
    }

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
    return NextResponse.json({ success: true, data: created })
  } catch (error) {
    console.error('POST /api/presentations error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 },
    )
  }
}