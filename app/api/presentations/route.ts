import { Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import {
  jsonWithSessionCookies,
  requireSessionUser,
} from '@/lib/api-auth'
import { capabilitiesForUser } from '@/lib/plan-access'
import { isPrismaConnectionError } from '@/lib/prisma-errors'
import { getDocumentQuotaWindowStart } from '@/lib/plans'
import { prisma } from '@/lib/prisma'
import { PRESENTATION_TEMPLATES_META } from '@/lib/presentation-template-themes'
import { createSupabaseRouteHandlerClient } from '@/lib/supabase/route-handler'
import { ensureAppUserFromSupabase } from '@/lib/supabase/sync-app-user'

const createPresentationSchema = z.object({
  title: z.string().min(1).max(500),
  topic: z.string().min(1).max(4000),
  audience: z.string().min(1).max(200),
  presentation_type: z.string().min(1).max(100),
  template: z.string().min(1).max(100),
  slide_count: z.coerce.number().int().min(1).max(50),
  slides_json: z.string().min(2),
  status: z.string().optional(),
  options: z.string().optional(),
  file_url: z.string().nullable().optional(),
})

function prismaErrorResponse(error: unknown, sessionCookies?: NextResponse) {
  if (isPrismaConnectionError(error)) {
    return jsonWithSessionCookies(
      {
        error:
          'Base de données inaccessible. Réessayez dans un instant ou vérifiez la configuration serveur.',
        code: 'DATABASE_UNAVAILABLE',
      },
      { status: 503 },
      sessionCookies,
    )
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2003') {
      return jsonWithSessionCookies(
        {
          error:
            'Compte utilisateur incomplet. Déconnectez-vous, reconnectez-vous, puis réessayez.',
          code: 'USER_FK',
        },
        { status: 503 },
        sessionCookies,
      )
    }
    if (error.code === 'P2022') {
      return jsonWithSessionCookies(
        {
          error:
            'Schéma base de données obsolète (migration manquante). Contactez le support ou relancez les migrations.',
          code: 'SCHEMA_OUTDATED',
        },
        { status: 503 },
        sessionCookies,
      )
    }
  }

  return jsonWithSessionCookies(
    { error: 'Erreur interne du serveur' },
    { status: 500 },
    sessionCookies,
  )
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireSessionUser(request)
    if (!auth.ok) return auth.response

    const presentations = await prisma.presentation.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: 'desc' },
    })
    return jsonWithSessionCookies(
      { success: true, data: presentations },
      undefined,
      auth.sessionCookies,
    )
  } catch (error) {
    console.error('GET /api/presentations error:', error)
    return prismaErrorResponse(error)
  }
}

export async function POST(request: NextRequest) {
  let sessionCookies: NextResponse | undefined

  try {
    const auth = await requireSessionUser(request)
    if (!auth.ok) return auth.response
    sessionCookies = auth.sessionCookies

    if (auth.dbUnavailable) {
      return jsonWithSessionCookies(
        {
          error:
            'Base de données inaccessible. Impossible d’enregistrer la présentation pour le moment.',
          code: 'DATABASE_UNAVAILABLE',
        },
        { status: 503 },
        sessionCookies,
      )
    }

    const routeClient = createSupabaseRouteHandlerClient(request)
    const {
      data: { user: supabaseUser },
    } = await routeClient.supabase.auth.getUser()
    if (supabaseUser) {
      try {
        await ensureAppUserFromSupabase(supabaseUser)
      } catch (syncErr) {
        if (!isPrismaConnectionError(syncErr)) {
          console.warn('POST /api/presentations: sync utilisateur', syncErr)
        }
      }
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return jsonWithSessionCookies(
        { error: 'Corps JSON invalide' },
        { status: 400 },
        sessionCookies,
      )
    }

    const parsed = createPresentationSchema.safeParse(body)
    if (!parsed.success) {
      return jsonWithSessionCookies(
        {
          error: 'Données invalides pour la présentation',
          details: parsed.error.issues,
        },
        { status: 400 },
        sessionCookies,
      )
    }

    const input = parsed.data

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { subscriptionStatus: true, planTier: true },
    })
    if (!user) {
      return jsonWithSessionCookies(
        {
          error:
            'Profil utilisateur introuvable. Déconnectez-vous puis reconnectez-vous.',
          code: 'USER_NOT_FOUND',
        },
        { status: 503 },
        sessionCookies,
      )
    }

    const capabilities = capabilitiesForUser(user, {
      userId: auth.userId,
      email: auth.email,
    })

    const quotaStart = getDocumentQuotaWindowStart(capabilities.documentQuotaPeriod)
    const countInPeriod = await prisma.presentation.count({
      where: {
        userId: auth.userId,
        createdAt: { gte: quotaStart },
      },
    })
    if (countInPeriod >= capabilities.maxDocuments) {
      const periodLabel =
        capabilities.documentQuotaPeriod === 'month' ? 'mois' : 'jour'
      return jsonWithSessionCookies(
        {
          error: `Limite atteinte : votre plan ${capabilities.plan} permet ${capabilities.maxDocuments} presentations par ${periodLabel}.`,
        },
        { status: 403 },
        sessionCookies,
      )
    }

    const templateMeta = PRESENTATION_TEMPLATES_META.find(
      (t) => t.slug === input.template,
    )
    const planOrder: Record<string, number> = {
      STARTER: 1,
      PRO: 2,
      ULTIMATE: 3,
      TEAM: 3,
    }
    const userPlanLevel = planOrder[capabilities.plan] ?? 1
    const templatePlanLevel =
      planOrder[templateMeta?.plan_tier?.toUpperCase() ?? 'STARTER'] ?? 1

    if (templatePlanLevel > userPlanLevel) {
      return jsonWithSessionCookies(
        { error: `Le template "${input.template}" necessite un plan superieur.` },
        { status: 403 },
        sessionCookies,
      )
    }

    const created = await prisma.presentation.create({
      data: {
        userId: auth.userId,
        title: input.title.trim(),
        topic: input.topic.trim(),
        audience: input.audience.trim(),
        presentationType: input.presentation_type.trim(),
        templateSlug: input.template.trim(),
        slideCount: input.slide_count,
        slidesJson: input.slides_json,
        status: input.status ?? 'completed',
        options: input.options ?? null,
        fileUrl: input.file_url ?? null,
      },
    })

    return jsonWithSessionCookies(
      { success: true, data: created },
      undefined,
      sessionCookies,
    )
  } catch (error) {
    console.error('POST /api/presentations error:', error)
    return prismaErrorResponse(error, sessionCookies)
  }
}
