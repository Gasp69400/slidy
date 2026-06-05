import { Prisma } from '@prisma/client'
import { NextResponse, type NextRequest } from 'next/server'

import {
  applySessionCookies,
  createSupabaseRouteHandlerClient,
} from '@/lib/supabase/route-handler'
import { createSupabaseServerClient } from '@/lib/supabase/server-client'
import { ensureAppUserFromSupabase } from '@/lib/supabase/sync-app-user'

export type SessionAuthOk = {
  ok: true
  userId: string
  email: string
  sessionCookies?: NextResponse
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

    await ensureAppUserFromSupabase(user)

    return {
      ok: true,
      userId: user.id,
      email: user.email,
      sessionCookies,
    }
  } catch (e) {
    console.error('requireSessionUser:', e)

    if (e instanceof Prisma.PrismaClientInitializationError) {
      return {
        ok: false,
        response: NextResponse.json(
          {
            error:
              'Base de données inaccessible. Vérifiez SUPABASE_DATABASE_URL dans .env.local.',
          },
          { status: 503 },
        ),
      }
    }

    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaConnectionCodes = new Set([
        'P1000',
        'P1001',
        'P1002',
        'P1003',
        'P1011',
        'P1017',
      ])
      if (prismaConnectionCodes.has(e.code)) {
        return {
          ok: false,
          response: NextResponse.json(
            {
              error:
                'Base de données inaccessible ou mal configurée. Vérifiez SUPABASE_DATABASE_URL dans .env.local.',
            },
            { status: 503 },
          ),
        }
      }
      return {
        ok: false,
        response: NextResponse.json(
          {
            error: `Erreur base de données (${e.code}). Réessayez ou vérifiez la configuration.`,
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
