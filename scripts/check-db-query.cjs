#!/usr/bin/env node
const { PrismaClient } = require('@prisma/client')

const url = process.env.SUPABASE_DATABASE_URL
if (!url) {
  console.error('SUPABASE_DATABASE_URL manquante')
  process.exit(1)
}

const p = new PrismaClient({ datasources: { db: { url } } })
p.$queryRaw`SELECT 1`
  .then(() => {
    console.log('OK')
    process.exit(0)
  })
  .catch((e) => {
    console.error(e.message)
    process.exit(1)
  })
  .finally(() => p.$disconnect())
