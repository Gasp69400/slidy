import { randomUUID } from 'crypto'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import {
  insertCvDocument,
  supabaseConfigErrorMessage,
} from '@/lib/cv-documents-supabase'
import { generateCvWithGroq, manualToContextString } from '@/lib/cv-llm'
import { isGroqApiConfigured } from '@/lib/server-chat-llm'
import {
  CV_TEMPLATE_SLUGS,
  cvDesignOptionsSchema,
  manualCvInputSchema,
} from '@/lib/cv-schema'
import { mergeToCvMetadata } from '@/lib/cv-synthesize'
import { requireSupabaseSession } from '@/lib/supabase/require-supabase-session'

export const runtime = 'nodejs'

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

export async function POST(request: NextRequest) {
  const session = await requireSupabaseSession()
  if (!session.ok) return session.response

  const { supabase, userId } = session

  try {
    const json = await request.json()
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.issues },
        { status: 400 },
      )
    }
    const input = parsed.data
    const designOptions = cvDesignOptionsSchema.parse({
      templateSlug: input.templateSlug,
      fontFamily: input.fontFamily,
      layoutDensity: input.layoutDensity,
      accentHex: input.accentHex,
    })

    const manualContext = manualToContextString({
      manual: input.manual ?? {},
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
        })
      } catch (e) {
        console.error('CV Groq error:', e)
        if (input.mode === 'prompt') {
          return NextResponse.json(
            {
              error:
                'La génération IA a échoué. Vérifiez GROQ_API_KEY (fichier .env.local à la racine, puis redémarrage du serveur) ou réessayez plus tard.',
            },
            { status: 502 },
          )
        }
      }
    } else if (input.mode === 'prompt') {
      return NextResponse.json(
        {
          error:
            'La génération à partir d’une invite seule nécessite GROQ_API_KEY côté serveur (.env.local). Utilisez le mode manuel ou configurez la clé.',
        },
        { status: 503 },
      )
    }

    const hasManualBody = Boolean(
      input.manual?.fullName?.trim() ||
        input.manual?.summary?.trim() ||
        input.manual?.headline?.trim() ||
        (input.manual?.experience?.length ?? 0) > 0 ||
        (input.manual?.education?.length ?? 0) > 0 ||
        (input.manual?.skills?.length ?? 0) > 0,
    )

    const source: 'manual' | 'prompt' | 'hybrid' = llm
      ? hasManualBody
        ? 'hybrid'
        : input.mode === 'prompt'
          ? 'prompt'
          : 'hybrid'
      : 'manual'

    const metadata = mergeToCvMetadata({
      llm,
      manual: input.manual,
      skillsText: input.skillsText,
      locale: input.locale,
      source,
      lastPrompt: input.mode === 'prompt' ? input.userPrompt : undefined,
    })

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
      const cfg = supabaseConfigErrorMessage(insertError)
      return NextResponse.json(cfg.body, { status: cfg.status })
    }

    return NextResponse.json({
      success: true,
      data: { documentId },
    })
  } catch (error) {
    console.error('POST /api/cv/generate error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 },
    )
  }
}