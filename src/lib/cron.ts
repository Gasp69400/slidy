import cron from 'node-cron'
import { prisma } from '@/lib/prisma'
import { sendEmailAlert } from '@/lib/email'
import { leboncoinScraper, selogerScraper, papScraper, paruvenduScraper } from '@/scrapers'
import { calculateMatchingScore } from '@/lib/matching'
import { AlertType } from '@prisma/client'
import type { ScrapingCriteria } from '@/types'

// Configuration des tâches cron
const SCRAPING_SCHEDULE = '0 */6 * * *' // Toutes les 6 heures
const ALERTS_SCHEDULE = '0 */2 * * *'  // Toutes les 2 heures

/**
 * Démarre toutes les tâches cron
 */
export function startCronJobs() {
  console.log('🚀 Starting cron jobs...')

  // Tâche de scraping automatique
  cron.schedule(SCRAPING_SCHEDULE, async () => {
    console.log('🔍 Running automated scraping...')
    await runAutomatedScraping()
  })

  // Tâche d'envoi d'alertes
  cron.schedule(ALERTS_SCHEDULE, async () => {
    console.log('📧 Running alerts check...')
    await checkAndSendAlerts()
  })

  console.log('✅ Cron jobs started successfully')
}

/**
 * Arrête toutes les tâches cron
 */
export function stopCronJobs() {
  console.log('🛑 Stopping cron jobs...')
  // node-cron gère automatiquement l'arrêt
}

/**
 * Exécute le scraping automatique pour tous les utilisateurs actifs
 */
async function runAutomatedScraping() {
  try {
    // Récupérer tous les utilisateurs avec abonnement actif
    const activeUsers = await prisma.user.findMany({
      where: {
        subscriptionStatus: {
          in: ['ACTIVE', 'TRIAL']
        }
      },
      include: {
        clients: {
          include: {
            searchCriteria: true
          }
        }
      }
    })

    console.log(`Found ${activeUsers.length} active users for scraping`)

    for (const user of activeUsers) {
      if (user.clients.length === 0) continue

      console.log(`Processing user ${user.email} (${user.clients.length} clients)`)

      // Collecter toutes les villes recherchées par les clients de cet utilisateur
      const allCities = new Set<string>()
      let minBudget = Infinity
      let maxBudget = 0
      let minSurface = Infinity
      let maxSurface = 0
      let minRooms = Infinity
      let maxRooms = 0

      for (const client of user.clients) {
        for (const criteria of client.searchCriteria) {
          criteria.cities.forEach((city: string) => allCities.add(city))

          if (criteria.budgetMin && criteria.budgetMin < minBudget) minBudget = criteria.budgetMin
          if (criteria.budgetMax && criteria.budgetMax > maxBudget) maxBudget = criteria.budgetMax
          if (criteria.surfaceMin && criteria.surfaceMin < minSurface) minSurface = criteria.surfaceMin
          if (criteria.surfaceMax && criteria.surfaceMax > maxSurface) maxSurface = criteria.surfaceMax
          if (criteria.roomsMin && criteria.roomsMin < minRooms) minRooms = criteria.roomsMin
          if (criteria.roomsMax && criteria.roomsMax > maxRooms) maxRooms = criteria.roomsMax
        }
      }

      if (allCities.size === 0) continue

      // Paramètres de scraping larges pour couvrir tous les critères
      const cities = Array.from(allCities)

      const scrapingCriteria: ScrapingCriteria = {
        cities,
        locations: cities,
        budgetMin: minBudget === Infinity ? null : minBudget,
        budgetMax: maxBudget === 0 ? null : maxBudget,
        surfaceMin: minSurface === Infinity ? null : minSurface,
        surfaceMax: maxSurface === 0 ? null : maxSurface,
        roomsMin: minRooms === Infinity ? null : minRooms,
        roomsMax: maxRooms === 0 ? null : maxRooms,
        propertyType: null,
        mustHave: [],
        mustNotHave: [],
        keywords: [],
      }

      // Exécuter le scraping sur toutes les plateformes
      const scrapers = [leboncoinScraper, selogerScraper, papScraper, paruvenduScraper]
      const scrapingPromises = scrapers.map(scraper => scraper(scrapingCriteria))

      try {
        const results = await Promise.allSettled(scrapingPromises)

        for (let i = 0; i < results.length; i++) {
          const result = results[i]
          if (result.status === 'fulfilled') {
            console.log(`✅ ${scrapers[i].name} completed: ${result.value.properties.length} properties`)
          } else {
            console.error(`❌ ${scrapers[i].name} failed:`, result.reason)
          }
        }
      } catch (error) {
        console.error(`Error during scraping for user ${user.email}:`, error)
      }
    }

    console.log('✅ Automated scraping completed')

  } catch (error) {
    console.error('❌ Automated scraping failed:', error)
  }
}

/**
 * Vérifie et envoie les alertes pour les nouveaux matchs
 */
async function checkAndSendAlerts() {
  try {
    // Récupérer tous les clients avec leurs critères
    const clients = await prisma.client.findMany({
      include: {
        searchCriteria: true,
        user: true,
      }
    })

    console.log(`Checking alerts for ${clients.length} clients`)

    for (const client of clients) {
      if (client.searchCriteria.length === 0) continue

      try {
        // Récupérer les propriétés récentes (dernières 24h)
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)

        const recentProperties = await prisma.property.findMany({
          where: {
            createdAt: {
              gte: yesterday
            }
          }
        })

        console.log(`Found ${recentProperties.length} recent properties for client ${client.firstName} ${client.lastName}`)

        for (const property of recentProperties) {
          // Vérifier si ce match existe déjà
          const existingMatch = await prisma.match.findFirst({
            where: {
              clientId: client.id,
              propertyId: property.id,
            }
          })

          if (existingMatch) continue

          const bestScore = client.searchCriteria.reduce((max, criteria) => {
            const score = calculateMatchingScore(criteria, property)
            return score > max ? score : max
          }, 0)

          // Seulement créer un match si le score est suffisamment élevé (> 50)
          if (bestScore > 50) {
            // Créer le match
            await prisma.match.create({
              data: {
                clientId: client.id,
                propertyId: property.id,
                score: bestScore,
              }
            })

            const message = `Nouveau bien potentiellement intéressant : ${property.title} (${property.city}).`

            // Créer une alerte
            const alert = await prisma.alert.create({
              data: {
                clientId: client.id,
                propertyId: property.id,
                type: AlertType.NEW_MATCH,
                message,
              }
            })

            // Envoyer l'email d'alerte
            try {
              await sendEmailAlert({
                to: client.email,
                subject: 'Nouveau match immobilier',
                message,
                clientName: `${client.firstName} ${client.lastName}`,
                propertyTitle: property.title,
                propertyPrice: property.price,
                propertyUrl: property.url,
              })

              // Marquer l'alerte comme envoyée
              await prisma.alert.update({
                where: { id: alert.id },
                data: {
                  sent: true,
                  sentAt: new Date(),
                },
              })

              console.log(`📧 Alert sent for client ${client.firstName} ${client.lastName} - property ${property.title}`)

            } catch (emailError) {
              console.error(`Failed to send alert email for client ${client.id}:`, emailError)
            }
          }
        }

      } catch (clientError) {
        console.error(`Error processing alerts for client ${client.id}:`, clientError)
      }
    }

    console.log('✅ Alerts check completed')

  } catch (error) {
    console.error('❌ Alerts check failed:', error)
  }
}

/**
 * Fonction utilitaire pour déclencher manuellement le scraping
 */
export async function triggerManualScraping(userId?: string) {
  console.log('🔍 Running manual scraping...')

  if (userId) {
    // Scraping pour un utilisateur spécifique
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        clients: {
          include: {
            searchCriteria: true
          }
        }
      }
    })

    if (!user) {
      throw new Error('Utilisateur non trouvé')
    }

    // Simuler le scraping pour cet utilisateur uniquement
    const mockUser = [user]
    // Reutiliser la logique de runAutomatedScraping mais pour un seul utilisateur
    console.log(`Manual scraping triggered for user ${user.email}`)
  } else {
    // Scraping pour tous les utilisateurs
    await runAutomatedScraping()
  }
}

/**
 * Fonction utilitaire pour déclencher manuellement les alertes
 */
export async function triggerManualAlerts() {
  console.log('📧 Running manual alerts check...')
  await checkAndSendAlerts()
}
