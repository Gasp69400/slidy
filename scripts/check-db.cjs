#!/usr/bin/env node
/**
 * Vérifie la connexion Prisma → Supabase.
 * Usage : npm run db:check
 */
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const root = path.join(__dirname, '..')

function readEnvFile(filePath) {
  const out = {}
  if (!fs.existsSync(filePath)) return out
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const m = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/)
    if (!m) continue
    out[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
  }
  return out
}

const env = {
  ...readEnvFile(path.join(root, '.env')),
  ...readEnvFile(path.join(root, '.env.local')),
}

const dbUrlRaw =
  env.SUPABASE_DATABASE_URL?.trim() ||
  env.DATABASE_URL?.trim() ||
  ''

function withPgBouncerIfNeeded(url) {
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
    // ignore
  }
  return url
}

const dbUrl = withPgBouncerIfNeeded(dbUrlRaw)

if (!dbUrl) {
  console.error(
    '❌ SUPABASE_DATABASE_URL introuvable dans .env.local\n\n' +
      'Supabase → bouton Connect → Transaction pooler (6543) → copiez l’URI.',
  )
  process.exit(1)
}

console.log('Test connexion base de données…')

try {
  execSync('node scripts/check-db-query.cjs', {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, SUPABASE_DATABASE_URL: dbUrl },
  })
  console.log('✅ Connexion OK — la base répond.')
} catch {
  console.error(
    '\n❌ Connexion base de données échouée.\n\n' +
      '1. Supabase → Connect → Transaction pooler (6543) → copiez l’URI complète\n' +
      '2. Mettez à jour SUPABASE_DATABASE_URL dans .env.local (une seule ligne)\n' +
      '3. Même valeur sur Vercel → Environment Variables → Redeploy\n' +
      '4. Prisma ajoute ?pgbouncer=true automatiquement pour le pooler\n' +
      '5. Relancez : npm run db:check\n',
  )
  process.exit(1)
}
