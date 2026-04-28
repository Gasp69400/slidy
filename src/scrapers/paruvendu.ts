import axios from 'axios'
import { ScrapingCriteria, ScrapingResult, PropertyCreateInput } from '@/types'
import { PropertySource } from '@prisma/client'

export async function paruvenduScraper(criteria: ScrapingCriteria): Promise<ScrapingResult> {
  const startTime = Date.now()
  const properties: PropertyCreateInput[] = []
  const errors: string[] = []

  try {
    console.log('🔍 Scraping ParuVendu with criteria:', criteria)

    // Simulation pour développement
    const mockProperties = generateMockProperties(criteria, PropertySource.PARUVENDU)
    properties.push(...mockProperties)

    console.log(`✅ ParuVendu scraping completed: ${properties.length} properties found`)

  } catch (error) {
    console.error('❌ ParuVendu scraping error:', error)
    errors.push(`Erreur lors du scraping ParuVendu: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
  const basePrice = criteria.budgetMin || 180000
  const maxPrice = criteria.budgetMax || 550000

  for (const city of cities) {
    const numProperties = Math.floor(Math.random() * 7) + 4

    for (let i = 0; i < numProperties; i++) {
      const price = Math.floor(Math.random() * (maxPrice - basePrice)) + basePrice
      const surface = criteria.surfaceMin
        ? Math.floor(Math.random() * ((criteria.surfaceMax || criteria.surfaceMin + 55) - criteria.surfaceMin)) + criteria.surfaceMin
        : Math.floor(Math.random() * 85) + 35
      const rooms = criteria.roomsMin
        ? Math.floor(Math.random() * ((criteria.roomsMax || criteria.roomsMin + 4) - criteria.roomsMin)) + criteria.roomsMin
        : Math.floor(Math.random() * 5) + 1

      const property: PropertyCreateInput = {
        source,
        url: `https://www.paruvendu.fr/immobilier/annonce-vente-appartement-${city.toLowerCase().replace(/\s/g, '-')}-${Date.now()}-${i}`,
        title: `Vente appartement ${rooms} pièces ${city}`,
        price,
        city,
        surface,
        rooms,
        description: `ParuVendu.fr - Appartement ${rooms} pièces de ${surface}m² en vente à ${city}.`,
        images: [
          'https://via.placeholder.com/400x300/FF5722/white?text=ParuVendu',
          'https://via.placeholder.com/400x300/607D8B/white?text=Vente',
        ],
        rawJson: {
          scrapedAt: new Date().toISOString(),
          source: 'mock',
          platform: 'paruvendu',
        }
      }

      properties.push(property)
    }
  }

  return properties
}
