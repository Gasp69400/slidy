import { randomUUID } from 'crypto'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import {
  insertCvDocument,
  supabaseConfigErrorMessage,
} from '@/lib/cv-documents-supabase'
import { generateCvWithGroq, manualToContextString } from '@/lib/cv-llm'
import { shrinkManualPhoto } from '@/lib/cv-photo'
import { isPrismaConnectionError } from '@/lib/prisma-errors'
import { isGroqApiConfigured } from '@/lib/server-chat-llm'
import {
  CV_TEMPLATE_SLUGS,
  cvDesignOptionsSchema,
  manualCvInputSchema,
} from '@/lib/cv-schema'
import { mergeToCvMetadata } from '@/lib/cv-synthesize'
import { getCapabilitiesForUserId } from '@/lib/user-capabilities'
import {
  jsonWithSupabaseSessionCookies,
  requireSupabaseSession,
} from '@/lib/supabase/require-supabase-session'
import { ensureAppUserFromSupabase } from '@/lib/supabase/sync-app-user'

export const runtime = 'nodejs'
/** Groq + insertion Supabase peuvent dépasser 10 s sur mobile / réseau lent. */
export const maxDuration = 60

const bodySchema = z
  .object({
    mode: z.enum(['prompt', 'manual']),
    userPrompt: z.string().optional(),
    manual: manualCvInputSchema.optional(),
    skillsText: z.string().optional(),
    /** Offre d’emploi pour mots-clés ATS (optionnel) */
    jobDescription: z.string().optional(),
    templateSlug: z.enum(CV_TEMPLATE_SLUGS).optional(),
    fontFamily: cvDesignOptionsSchema.shape.fontFamily.optional(),
    layoutDensity: cvDesignOptionsSchema.shape.layoutDensity.optional(),
    accentHex: cvDesignOptionsSchema.shape.accentHex.optional(),
    locale: z.enum(['fr', 'en']).default('fr'),
    sector: z.enum(['general', 'finance']).optional().default('general'),
    title: z.string().min(1).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.mode === 'prompt') {
      const p = data.userPrompt?.trim() ?? ''
      if (p.length < 12) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'userPrompt_min',
          path: ['userPrompt'],
        })
      }
    }
    if (data.mode === 'manual') {
      const m = data.manual
      const skillsOk = Boolean(data.skillsText?.trim())
      const ok =
        Boolean(m?.fullName?.trim()) ||
        Boolean(m?.headline?.trim()) ||
        Boolean(m?.summary?.trim()) ||
        Boolean((m?.experience?.length ?? 0) > 0) ||
        Boolean((m?.education?.length ?? 0) > 0) ||
        skillsOk ||
        Boolean(m?.contact?.email?.trim()) ||
        Boolean(m?.contact?.phone?.trim()) ||
        Boolean(m?.contact?.location?.trim()) ||
        Boolean(m?.photoUrl?.trim()) ||
        Boolean((m?.interests?.length ?? 0) > 0) ||
        Boolean(data.jobDescription?.trim())
      if (!ok) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'manual_min',
          path: ['manual'],
        })
      }
    }
  })

async function isCvGenerationAllowed(userId: string): Promise<boolean> {
  try {
    const caps = await getCapabilitiesForUserId(userId)
    return caps.allowedDocumentTypes.includes('CV_COVER')
  } catch (error) {
    if (isPrismaConnectionError(error)) {
      console.warn('POST /api/cv/generate: quota plan ignoré (BDD injoignable)')
      return true
    }
    throw error
  }
}

export async function POST(request: NextRequest) {
  const session = await requireSupabaseSession(request)
  if (!session.ok) return session.response

  const { supabase, userId, sessionCookies } = session

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      try {
        await ensureAppUserFromSupabase(user)
      } catch (syncErr) {
        console.warn('POST /api/cv/generate: sync Prisma ignorée', syncErr)
      }
    }

    if (!(await isCvGenerationAllowed(userId))) {
      return jsonWithSupabaseSessionCookies(
        { error: 'Votre offre ne permet pas de créer un CV. Passez à Pro ou Ultimate.' },
        { status: 403 },
        sessionCookies,
      )
    }

    let json: unknown
    try {
      json = await request.json()
    } catch {
      return jsonWithSupabaseSessionCookies(
        {
          error:
            'Requête trop volumineuse ou invalide. Réduisez la photo de profil et réessayez.',
        },
        { status: 413 },
        sessionCookies,
      )
    }

    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return jsonWithSupabaseSessionCookies(
        { error: 'Données invalides', details: parsed.error.issues },
        { status: 400 },
        sessionCookies,
      )
    }

    const input = parsed.data
    const manual = shrinkManualPhoto(input.manual)
    const hadPhoto = Boolean(input.manual?.photoUrl?.trim())
    const keptPhoto = Boolean(manual?.photoUrl?.trim())

    const designOptions = cvDesignOptionsSchema.parse({
      templateSlug: input.templateSlug,
      fontFamily: input.fontFamily,
      layoutDensity: input.layoutDensity,
      accentHex: input.accentHex,
    })

    const manualContext = manualToContextString({
      manual: manual ?? {},
      skillsText: input.skillsText,
    })

    let llm: Awaited<ReturnType<typeof generateCvWithGroq>> | null = null

    if (isGroqApiConfigured()) {
      try {
        llm = await generateCvWithGroq({
          mode: input.mode,
          userPrompt: input.userPrompt,
          manualContext,
          locale: input.locale,
          jobDescription: input.jobDescription?.trim(),
          sector: input.sector,
        })
      } catch (e) {
        console.error('CV Groq error:', e)
        if (input.mode === 'prompt') {
          return jsonWithSupabaseSessionCookies(
            {
              error:
                'La génération IA a échoué. Vérifiez GROQ_API_KEY ou réessayez plus tard.',
            },
            { status: 502 },
            sessionCookies,
          )
        }
      }
    } else if (input.mode === 'prompt') {
      return jsonWithSupabaseSessionCookies(
        {
          error:
            'La génération à partir d’une invite seule nécessite GROQ_API_KEY côté serveur. Utilisez le mode manuel.',
        },
        { status: 503 },
        sessionCookies,
      )
    }

    const hasManualBody = Boolean(
      manual?.fullName?.trim() ||
        manual?.summary?.trim() ||
        manual?.headline?.trim() ||
        (manual?.experience?.length ?? 0) > 0 ||
        (manual?.education?.length ?? 0) > 0 ||
        (manual?.skills?.length ?? 0) > 0,
    )

    const source: 'manual' | 'prompt' | 'hybrid' = llm
      ? hasManualBody
        ? 'hybrid'
        : input.mode === 'prompt'
          ? 'prompt'
          : 'hybrid'
      : 'manual'

    let metadata
    try {
      metadata = mergeToCvMetadata({
        llm,
        manual,
        skillsText: input.skillsText,
        locale: input.locale,
        source,
        lastPrompt: input.mode === 'prompt' ? input.userPrompt : undefined,
      })
    } catch (mergeError) {
      console.error('CV merge metadata error:', mergeError)
      return jsonWithSupabaseSessionCookies(
        { error: 'Impossible de finaliser le CV. Vérifiez les champs saisis.' },
        { status: 400 },
        sessionCookies,
      )
    }

    const title =
      input.title?.trim() ||
      `${metadata.cvKit.profile.fullName} — CV`

    const topic =
      input.mode === 'prompt' ? (input.userPrompt ?? title) : title

    const documentId = randomUUID()

    const { error: insertError } = await insertCvDocument(supabase, {
      id: documentId,
      user_id: userId,
      title,
      topic,
      template_slug: designOptions.templateSlug,
      design_options: designOptions as Record<string, unknown>,
      metadata: metadata as Record<string, unknown>,
    })

    if (insertError) {
      console.error('CV insert Supabase error:', insertError.message)
      const cfg = supabaseConfigErrorMessage(insertError)
      return jsonWithSupabaseSessionCookies(cfg.body, { status: cfg.status }, sessionCookies)
    }

    return jsonWithSupabaseSessionCookies(
      {
        success: true,
        data: {
          documentId,
          photoOmitted: hadPhoto && !keptPhoto,
        },
      },
      { status: 200 },
      sessionCookies,
    )
  } catch (error) {
    console.error('POST /api/cv/generate error:', error)
    if (isPrismaConnectionError(error)) {
      return jsonWithSupabaseSessionCookies(
        {
          error:
            'Base de données temporairement indisponible. Réessayez dans quelques instants.',
        },
        { status: 503 },
        sessionCookies,
      )
    }
    return jsonWithSupabaseSessionCookies(
      { error: 'Erreur interne du serveur' },
      { status: 500 },
      sessionCookies,
    )
  }
}
