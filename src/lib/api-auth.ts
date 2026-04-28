import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'

import { createSupabaseServerClient } from '@/lib/supabase/server-client'
import { ensureAppUserFromSupabase } from '@/lib/supabase/sync-app-user'

export type SessionAuthOk = {
  ok: true
  userId: string
  email: string
}

export type SessionAuthFail = {
  ok: false
  response: NextResponse
}

export type SessionAuthResult = SessionAuthOk | SessionAuthFail

/**
 * Session Supabase (cookies Next) + ligne Prisma `users`.
 */
export async function requireSessionUser(): Promise<SessionAuthResult> {
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

    await ensureAppUserFromSupabase(user)

    return {
      ok: true,
      userId: user.id,
      email: user.email,
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
