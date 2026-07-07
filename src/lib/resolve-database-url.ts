import 'server-only'

/**
 * URL Postgres pour Prisma (Supabase).
 * Priorité : SUPABASE_DATABASE_URL → DATABASE_URL
 */
export function resolveDatabaseUrl(): string {
  const url =
    process.env.SUPABASE_DATABASE_URL?.trim() ||
    process.env.DATABASE_URL?.trim() ||
    ''

  if (!url) {
    throw new Error(
      'SUPABASE_DATABASE_URL manquante. Supabase → Connect → Transaction pooler (6543), puis .env.local et Vercel.',
    )
  }

  return url
}

export const DATABASE_URL_SETUP_HINT =
  'Supabase → Project Settings → Database → Reset database password, puis copiez l’URL « Transaction pooler » (port 6543) dans SUPABASE_DATABASE_URL (.env.local + Vercel). Encodez les caractères spéciaux du mot de passe (! → %21).'
