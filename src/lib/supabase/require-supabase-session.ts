import { NextResponse, type NextRequest } from 'next/server'

import {
  applySessionCookies,
  createSupabaseRouteHandlerClient,
} from '@/lib/supabase/route-handler'
import { createSupabaseServerClient } from '@/lib/supabase/server-client'
import type { SupabaseClient } from '@supabase/supabase-js'

export type SupabaseSessionOk = {
  ok: true
  userId: string
  email: string
  supabase: SupabaseClient
  sessionCookies?: NextResponse
}

export type SupabaseSessionFail = {
  ok: false
  response: NextResponse
}

export type SupabaseSessionResult = SupabaseSessionOk | SupabaseSessionFail

/**
 * Session Supabase (anon + cookies), sans Prisma.
 * Passez `request` dans les Route Handlers pour lire/rafraîchir les cookies correctement.
 */
export async function requireSupabaseSession(
  request?: NextRequest,
): Promise<SupabaseSessionResult> {
  try {
    const routeClient = request ? createSupabaseRouteHandlerClient(request) : null
    const supabase = routeClient?.supabase ?? createSupabaseServerClient()
    const sessionCookies = routeClient?.cookieResponse()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user?.id || !user.email) {
      return {
        ok: false,
        response: applySessionCookies(
          NextResponse.json({ error: 'Non authentifié' }, { status: 401 }),
          sessionCookies ?? NextResponse.next(),
        ),
      }
    }

    return {
      ok: true,
      userId: user.id,
      email: user.email,
      supabase,
      sessionCookies,
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

export function jsonWithSupabaseSessionCookies(
  body: unknown,
  init: ResponseInit | undefined,
  sessionCookies?: NextResponse,
): NextResponse {
  const res = NextResponse.json(body, init)
  if (!sessionCookies) return res
  return applySessionCookies(res, sessionCookies)
}
