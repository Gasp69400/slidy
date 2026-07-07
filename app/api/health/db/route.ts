import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { resolveDatabaseUrl } from '@/lib/resolve-database-url'

export const dynamic = 'force-dynamic'

function safeDbMeta() {
  try {
    const parsed = new URL(resolveDatabaseUrl())
    return {
      host: parsed.hostname,
      port: parsed.port || '5432',
      user: parsed.username,
      pgbouncer: parsed.searchParams.get('pgbouncer') === 'true',
    }
  } catch {
    return null
  }
}

export async function GET() {
  const meta = safeDbMeta()

  if (!meta) {
    return NextResponse.json(
      {
        ok: false,
        code: 'MISSING_URL',
        error: 'SUPABASE_DATABASE_URL manquante ou invalide.',
      },
      { status: 503 },
    )
  }

  try {
    await prisma.user.findFirst({ select: { id: true, planTier: true } })
    await prisma.presentation.findFirst({ select: { id: true } })

    return NextResponse.json({
      ok: true,
      database: meta,
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2022'
    ) {
      return NextResponse.json(
        {
          ok: false,
          code: 'SCHEMA_OUTDATED',
          error: 'Schéma base de données incomplet. Lancez npm run migrate:supabase.',
          database: meta,
          column: error.meta?.column,
        },
        { status: 503 },
      )
    }

    return NextResponse.json(
      {
        ok: false,
        code: 'DATABASE_ERROR',
        error:
          error instanceof Error
            ? error.message.split('\n')[0]
            : 'Connexion base de données échouée.',
        database: meta,
      },
      { status: 503 },
    )
  }
}
