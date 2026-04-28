import axios from 'axios'
import { ScrapingCriteria, ScrapingResult, PropertyCreateInput } from '@/types'
import { PropertySource } from '@prisma/client'

export async function selogerScraper(criteria: ScrapingCriteria): Promise<ScrapingResult> {
  const startTime = Date.now()
  const properties: PropertyCreateInput[] = []
  const errors: string[] = []

  try {
    console.log('🔍 Scraping SeLoger with criteria:', criteria)

    // Simulation pour développement
    const mockProperties = generateMockProperties(criteria, PropertySource.SELOGER)
    properties.push(...mockProperties)

    console.log(`✅ SeLoger scraping completed: ${properties.length} properties found`)

  } catch (error) {
    console.error('❌ SeLoger scraping error:', error)
    errors.push(`Erreur lors du scraping SeLoger: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
  const basePrice = criteria.budgetMin || 250000
  const maxPrice = criteria.budgetMax || 700000

  for (const city of cities) {
    const numProperties = Math.floor(Math.random() * 8) + 3

    for (let i = 0; i < numProperties; i++) {
      const price = Math.floor(Math.random() * (maxPrice - basePrice)) + basePrice
      const surface = criteria.surfaceMin
        ? Math.floor(Math.random() * ((criteria.surfaceMax || criteria.surfaceMin + 60) - criteria.surfaceMin)) + criteria.surfaceMin
        : Math.floor(Math.random() * 100) + 30
      const rooms = criteria.roomsMin
        ? Math.floor(Math.random() * ((criteria.roomsMax || criteria.roomsMin + 4) - criteria.roomsMin)) + criteria.roomsMin
        : Math.floor(Math.random() * 5) + 1

      const property: PropertyCreateInput = {
        source,
        url: `https://www.seloger.com/annonces/achat/appartement/${city.toLowerCase().replace(/\s/g, '-')}/${Date.now()}-${i}.htm`,
        title: `Appartement ${rooms} pièces ${surface}m² - ${city}`,
        price,
        city,
        surface,
        rooms,
        description: `Belle annonce SeLoger. Appartement moderne de ${surface}m² avec ${rooms} pièces à ${city}.`,
        images: [
          'https://via.placeholder.com/400x300/FF9800/white?text=SeLoger',
          'https://via.placeholder.com/400x300/2196F3/white?text=Appartement',
        ],
        rawJson: {
          scrapedAt: new Date().toISOString(),
          source: 'mock',
          platform: 'seloger',
        }
      }

      properties.push(property)
    }
  }

  return properties
}
