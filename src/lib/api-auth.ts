import { Prisma } from '@prisma/client'
import { NextResponse, type NextRequest } from 'next/server'

import {
  applySessionCookies,
  createSupabaseRouteHandlerClient,
} from '@/lib/supabase/route-handler'
import { isPrismaConnectionError } from '@/lib/prisma-errors'
import { createSupabaseServerClient } from '@/lib/supabase/server-client'
import { ensureAppUserFromSupabase } from '@/lib/supabase/sync-app-user'

export type SessionAuthOk = {
  ok: true
  userId: string
  email: string
  sessionCookies?: NextResponse
  /** Prisma injoignable : session Supabase valide, sync BDD ignorée. */
  dbUnavailable?: boolean
}

export type SessionAuthFail = {
  ok: false
  response: NextResponse
}

export type SessionAuthResult = SessionAuthOk | SessionAuthFail

function withSessionCookies(
  response: NextResponse,
  sessionCookies?: NextResponse,
): NextResponse {
  if (!sessionCookies) return response
  return applySessionCookies(response, sessionCookies)
}

/**
 * Session Supabase (cookies Next) + ligne Prisma `users`.
 * Passez `request` dans les Route Handlers pour rafraîchir les cookies de session.
 */
export async function requireSessionUser(
  request?: NextRequest,
): Promise<SessionAuthResult> {
  try {
    const routeClient = request
      ? createSupabaseRouteHandlerClient(request)
      : null
    const supabase =
      routeClient?.supabase ?? createSupabaseServerClient()
    const sessionCookies = routeClient?.cookieResponse()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user?.id || !user.email) {
      return {
        ok: false,
        response: withSessionCookies(
          NextResponse.json({ error: 'Non authentifié' }, { status: 401 }),
          sessionCookies,
        ),
      }
    }

    try {
      await ensureAppUserFromSupabase(user)
    } catch (syncError) {
      if (isPrismaConnectionError(syncError)) {
        console.warn(
          'requireSessionUser: sync Prisma ignorée (BDD injoignable)',
          syncError,
        )
        return {
          ok: true,
          userId: user.id,
          email: user.email,
          sessionCookies,
          dbUnavailable: true,
        }
      }
      throw syncError
    }

    return {
      ok: true,
      userId: user.id,
      email: user.email,
      sessionCookies,
    }
  } catch (e) {
    console.error('requireSessionUser:', e)

    if (isPrismaConnectionError(e)) {
      return {
        ok: false,
        response: NextResponse.json(
          {
            error:
              'Base de données inaccessible. Vérifiez SUPABASE_DATABASE_URL (mot de passe Supabase > Settings > Database).',
            code: 'DATABASE_UNAVAILABLE',
          },
          { status: 503 },
        ),
      }
    }

    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        ok: false,
        response: NextResponse.json(
          {
            error: `Erreur base de données (${e.code}). Réessayez ou vérifiez la configuration.`,
            code: 'DATABASE_ERROR',
          },
          { status: 503 },
        ),
      }
    }

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

export function jsonWithSessionCookies(
  body: unknown,
  init: ResponseInit | undefined,
  sessionCookies?: NextResponse,
): NextResponse {
  const res = NextResponse.json(body, init)
  if (!sessionCookies) return res
  return applySessionCookies(res, sessionCookies)
}
