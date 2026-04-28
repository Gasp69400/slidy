#!/usr/bin/env tsx

import { startCronJobs } from '../src/lib/cron'

// Script pour démarrer les tâches cron

async function main() {
  console.log('🚀 Starting Immobilier SaaS cron jobs...')

  try {
    startCronJobs()

    console.log('✅ Cron jobs started successfully!')
    console.log('')
    console.log('Scheduled tasks:')
    console.log('  - Automated scraping: Every 6 hours')
    console.log('  - Alerts check: Every 2 hours')
    console.log('')
    console.log('Press Ctrl+C to stop...')

    // Garder le processus actif
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping cron jobs...')
      process.exit(0)
    })

    process.on('SIGTERM', () => {
      console.log('\n🛑 Stopping cron jobs...')
      process.exit(0)
    })

  } catch (error) {
    console.error('❌ Failed to start cron jobs:', error)
    process.exit(1)
  }
}

main()
