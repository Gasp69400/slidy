import axios from 'axios'
import { ScrapingCriteria, ScrapingResult, PropertyCreateInput } from '@/types'
import { PropertySource } from '@prisma/client'

export async function papScraper(criteria: ScrapingCriteria): Promise<ScrapingResult> {
  const startTime = Date.now()
  const properties: PropertyCreateInput[] = []
  const errors: string[] = []

  try {
    console.log('🔍 Scraping PAP with criteria:', criteria)

    // Simulation pour développement
    const mockProperties = generateMockProperties(criteria, PropertySource.PAP)
    properties.push(...mockProperties)

    console.log(`✅ PAP scraping completed: ${properties.length} properties found`)

  } catch (error) {
    console.error('❌ PAP scraping error:', error)
    errors.push(`Erreur lors du scraping PAP: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  const duration = Date.now() - startTime

  return {
    properties,
    errors,
    duration,
  }
}

function generateMockProperties(criteria: ScrapingCriteria, source: PropertySource): PropertyCreateInput[] {
  const properties: PropertyCreateInput[] = []
  const cities = criteria.cities.length > 0 ? criteria.cities : ['Paris']
  const basePrice = criteria.budgetMin || 220000
  const maxPrice = criteria.budgetMax || 650000

  for (const city of cities) {
    const numProperties = Math.floor(Math.random() * 6) + 2

    for (let i = 0; i < numProperties; i++) {
      const price = Math.floor(Math.random() * (maxPrice - basePrice)) + basePrice
      const surface = criteria.surfaceMin
        ? Math.floor(Math.random() * ((criteria.surfaceMax || criteria.surfaceMin + 40) - criteria.surfaceMin)) + criteria.surfaceMin
        : Math.floor(Math.random() * 70) + 20
      const rooms = criteria.roomsMin
        ? Math.floor(Math.random() * ((criteria.roomsMax || criteria.roomsMin + 3) - criteria.roomsMin)) + criteria.roomsMin
        : Math.floor(Math.random() * 4) + 1

      const property: PropertyCreateInput = {
        source,
        url: `https://www.pap.fr/annonce/appartement-${city.toLowerCase().replace(/\s/g, '-')}-${Date.now()}-${i}`,
        title: `${rooms} pièces PAP ${city} ${surface}m²`,
        price,
        city,
        surface,
        rooms,
        description: `Annonce PAP.fr - ${rooms} pièces de ${surface}m² à ${city}. Parfait pour location ou investissement.`,
        images: [
          'https://via.placeholder.com/400x300/4CAF50/white?text=PAP',
          'https://via.placeholder.com/400x300/2196F3/white?text=Location',
        ],
        rawJson: {
          scrapedAt: new Date().toISOString(),
          source: 'mock',
          platform: 'pap',
        }
      }

      properties.push(property)
    }
  }

  return properties
}
