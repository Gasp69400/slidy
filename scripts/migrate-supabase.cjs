#!/usr/bin/env node
/**
 * Applique les migrations Prisma sur Supabase.
 * Lit SUPABASE_DIRECT_URL (recommandé pour migrate) puis SUPABASE_DATABASE_URL
 * dans .env.local, puis .env.
 */
const fs = require('fs')
const { execSync } = require('child_process')
const path = require('path')

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

function mergeEnv() {
  const fromEnv = readEnvFile(path.join(root, '.env'))
  const fromLocal = readEnvFile(path.join(root, '.env.local'))
  return { ...fromEnv, ...fromLocal }
}

function maskDatabaseUrl(url) {
  try {
    const u = new URL(url)
    if (u.password) u.password = '****'
    return u.toString()
  } catch {
    return '(URL invalide — vérifiez le format postgresql://…)'
  }
}

const env = mergeEnv()
const dbUrl =
  env.SUPABASE_DIRECT_URL?.trim() ||
  env.SUPABASE_DATABASE_URL?.trim() ||
  ''

if (!dbUrl) {
  console.error(
    'Variable manquante : SUPABASE_DATABASE_URL (ou SUPABASE_DIRECT_URL) dans .env.local\n\n' +
      'Supabase → Project Settings → Database → Connection string\n' +
      '  • Migrations : onglet « URI », mode « Session pooler » ou « Direct connection » (port 5432)\n' +
      '  • App / Prisma runtime : « Transaction pooler » (port 6543)\n\n' +
      'Si le mot de passe contient @ # ! etc., encodez-le (ex. ! → %21).\n' +
      'En cas d’échec : Database → Reset database password, puis mettez à jour .env.local et Vercel.',
  )
  process.exit(1)
}

console.log('Application des migrations Prisma sur Supabase…')
console.log(`URL utilisée : ${maskDatabaseUrl(dbUrl)}`)

try {
  execSync('npx prisma migrate deploy', {
    cwd: root,
    stdio: 'inherit',
    env: {
      ...process.env,
      SUPABASE_DATABASE_URL: dbUrl,
    },
  })
} catch {
  console.error(
    '\nÉchec de la migration.\n\n' +
      'Si vous voyez P1000 (Authentication failed) :\n' +
      '  1. Supabase → Project Settings → Database → Reset database password\n' +
      '  2. Copiez la nouvelle connection string (Session ou Direct, port 5432)\n' +
      '  3. Collez-la dans .env.local comme SUPABASE_DIRECT_URL=…\n' +
      '     (et SUPABASE_DATABASE_URL=… pour l’app, souvent port 6543)\n' +
      '  4. Encodez les caractères spéciaux du mot de passe dans l’URL\n' +
      '  5. Relancez : npm run migrate:supabase\n\n' +
      'Contournement immédiat (SQL Editor Supabase) :\n' +
      '  ALTER TABLE "presentations" ADD COLUMN IF NOT EXISTS "isPublic" BOOLEAN NOT NULL DEFAULT false;',
  )
  process.exit(1)
}

console.log('Migrations appliquées.')
