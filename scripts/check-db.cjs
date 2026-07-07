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

const dbUrl =
  env.SUPABASE_DATABASE_URL?.trim() ||
  env.DATABASE_URL?.trim() ||
  ''

if (!dbUrl) {
  console.error(
    '❌ SUPABASE_DATABASE_URL introuvable dans .env.local\n\n' +
      'Supabase → bouton Connect → Transaction pooler (6543) → copiez l’URI.',
  )
  process.exit(1)
}

console.log('Test connexion base de données…')

try {
  execSync(
    `npx tsx -e "import { PrismaClient } from '@prisma/client'; const p = new PrismaClient({ datasources: { db: { url: process.env.SUPABASE_DATABASE_URL } } }); p.\\$queryRaw\\`SELECT 1\\`.then(() => { console.log('OK'); process.exit(0); }).catch(e => { console.error(e.message); process.exit(1); });"`,
    {
      cwd: root,
      stdio: 'inherit',
      env: { ...process.env, SUPABASE_DATABASE_URL: dbUrl },
    },
  )
  console.log('✅ Connexion OK — la base répond.')
} catch {
  console.error(
    '\n❌ Authentification échouée (P1000).\n\n' +
      '1. Supabase → Project Settings → Database → Reset database password\n' +
      '2. Connect → Transaction pooler → copiez l’URI avec le NOUVEAU mot de passe\n' +
      '3. Mettez à jour SUPABASE_DATABASE_URL dans .env.local (une seule ligne)\n' +
      '4. Mettez la même valeur sur Vercel → Environment Variables\n' +
      '5. Relancez : npm run db:check\n',
  )
  process.exit(1)
}
