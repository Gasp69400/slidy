import 'server-only'

function normalizeEnvUrl(raw: string): string {
  return raw.trim().replace(/^["']|["']$/g, '')
}

/**
 * Prisma + Supabase transaction pooler (port 6543) nécessite le mode pgbouncer.
 * Sans ce paramètre, les requêtes échouent (prepared statements) alors que SELECT 1 passe.
 */
function withPgBouncerIfNeeded(url: string): string {
  try {
    const parsed = new URL(url)
    const isTransactionPooler =
      parsed.port === '6543' ||
      (parsed.hostname.includes('.pooler.supabase.com') && parsed.port === '6543')

    if (isTransactionPooler && !parsed.searchParams.has('pgbouncer')) {
      parsed.searchParams.set('pgbouncer', 'true')
      return parsed.toString()
    }
  } catch {
    // URL mal formée : laisser Prisma remonter l'erreur
  }

  return url
}

/**
 * URL Postgres pour Prisma (Supabase).
 * Priorité : SUPABASE_DATABASE_URL → DATABASE_URL
 */
export function resolveDatabaseUrl(): string {
  const url = normalizeEnvUrl(
    process.env.SUPABASE_DATABASE_URL?.trim() ||
      process.env.DATABASE_URL?.trim() ||
      '',
  )

  if (!url) {
    throw new Error(
      'SUPABASE_DATABASE_URL manquante. Supabase → Connect → Transaction pooler (6543), puis .env.local et Vercel.',
    )
  }

  return withPgBouncerIfNeeded(url)
}

export const DATABASE_URL_SETUP_HINT =
  'Supabase → Connect → Transaction pooler (port 6543). Copiez l’URI dans SUPABASE_DATABASE_URL (.env.local + Vercel). Le paramètre ?pgbouncer=true est ajouté automatiquement pour Prisma.'
