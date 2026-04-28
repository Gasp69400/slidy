import { NextResponse } from 'next/server'

import { createSupabaseServerClient } from '@/lib/supabase/server-client'

export type SupabaseSessionOk = {
  ok: true
  userId: string
  email: string
  supabase: ReturnType<typeof createSupabaseServerClient>
}

export type SupabaseSessionFail = {
  ok: false
  response: NextResponse
}

export type SupabaseSessionResult = SupabaseSessionOk | SupabaseSessionFail

/**
 * Session Supabase uniquement (anon + cookies), sans Prisma ni DATABASE_URL.
 */
export async function requireSupabaseSession(): Promise<SupabaseSessionResult> {
  try {
    const supabase = createSupabaseServerClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user?.id || !user.email) {
      return {
        ok: false,
        response: NextResponse.json({ error: 'Non authentifié' }, { status: 401 }),
      }
    }

    return {
      ok: true,
      userId: user.id,
      email: user.email,
      supabase,
    }
  } catch (e) {
    console.error('requireSupabaseSession:', e)
    if (e instanceof Error && e.message.includes('NEXT_PUBLIC_SUPABASE')) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: 'Configuration Supabase manquante (URL ou clé anon).' },
          { status: 500 },
        ),
      }
    }
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Session invalide ou serveur mal configuré.' },
        { status: 401 },
      ),
    }
  }
}
