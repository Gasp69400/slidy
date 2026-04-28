import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { generatePresentationFromPrompt } from '@/lib/presentation-llm'
import { isGroqApiConfigured } from '@/lib/server-chat-llm'
import { requireSupabaseSession } from '@/lib/supabase/require-supabase-session'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const bodySchema = z.object({
  prompt: z.string().min(1),
  response_json_schema: z.unknown().optional(),
})

/**
 * Génération LLM pour les présentations (Groq).
 *
 * - `GROQ_API_KEY` : lue **uniquement** côté serveur (`process.env['GROQ_API_KEY']` dans `@/lib/server-chat-llm`).
 *   Aucun client, aucun ancien SDK : seule cette route pour la génération « slide deck » depuis le navigateur.
 * - Modèle : `GROQ_MODEL` dans l’environnement (sinon défaut serveur).
 */
export async function POST(request: NextRequest) {
  const session = await requireSupabaseSession()
  if (!session.ok) return session.response

  if (!isGroqApiConfigured()) {
    return NextResponse.json(
      {
        success: false,
        error:
          'Clé Groq absente : définissez GROQ_API_KEY (ou GROQ_KEY) dans .env.local à la racine du projet, redémarrez le serveur, ou configurez la variable sur votre hébergeur (ex. Vercel) — .env.local n’est pas déployé.',
      },
      { status: 503 },
    )
  }

  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body' },
      { status: 400 },
    )
  }

  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid request: prompt is required' },
      { status: 400 },
    )
  }

  try {
    const data = await generatePresentationFromPrompt({
      prompt: parsed.data.prompt,
      responseJsonSchema: parsed.data.response_json_schema,
    })
    return NextResponse.json({ success: true, data })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'LLM generation failed'
    console.error('POST /api/generate error:', e)
    return NextResponse.json({ success: false, error: message }, { status: 502 })
  }
}
