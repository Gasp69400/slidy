#!/usr/bin/env node
/**
 * Applique les migrations Prisma sur Supabase.
 * Lit la dernière SUPABASE_DATABASE_URL non vide dans .env.local.
 */
const fs = require('fs')
const { execSync } = require('child_process')
const path = require('path')

const root = path.join(__dirname, '..')
const envPath = path.join(root, '.env.local')

let dbUrl = ''
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^SUPABASE_DATABASE_URL=(.*)$/)
    if (!m) continue
    const val = m[1].trim().replace(/^["']|["']$/g, '')
    if (val) dbUrl = val
  }
}

if (!dbUrl) {
  console.error(
    'SUPABASE_DATABASE_URL manquante dans .env.local\n' +
      'Supabase > Project Settings > Database > Connection string (Transaction pooler)',
  )
  process.exit(1)
}

console.log('Application des migrations Prisma sur Supabase…')
execSync('npx prisma migrate deploy', {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, SUPABASE_DATABASE_URL: dbUrl },
})

console.log('Migrations appliquées.')
