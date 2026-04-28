import { SearchCriteria, Property } from '@prisma/client'

/**
 * Calcule le score de matching entre des critères de recherche et une propriété
 * @param criteria - Les critères de recherche du client
 * @param property - La propriété à évaluer
 * @returns Score entre 0 et 100 (plus élevé = meilleur match)
 */
export function calculateMatchingScore(criteria: SearchCriteria, property: Property): number {
  let totalScore = 0
  let maxScore = 0

  // Pondération des critères (total = 100 points)
  const weights = {
    budget: 30,      // 30% pour le budget
    city: 30,        // 30% pour la ville
    surface: 20,     // 20% pour la surface
    rooms: 20,       // 20% pour le nombre de pièces
  }

  // 1. Évaluation du budget (30 points max)
  maxScore += weights.budget
  const budgetScore = calculateBudgetScore(criteria, property)
  totalScore += budgetScore * (weights.budget / 100)

  // 2. Évaluation de la ville (30 points max)
  maxScore += weights.city
  const cityScore = calculateCityScore(criteria, property)
  totalScore += cityScore * (weights.city / 100)

  // 3. Évaluation de la surface (20 points max)
  maxScore += weights.surface
  const surfaceScore = calculateSurfaceScore(criteria, property)
  totalScore += surfaceScore * (weights.surface / 100)

  // 4. Évaluation du nombre de pièces (20 points max)
  maxScore += weights.rooms
  const roomsScore = calculateRoomsScore(criteria, property)
  totalScore += roomsScore * (weights.rooms / 100)

  // Bonus/malus pour les critères mustHave/mustNotHave
  const featureScore = calculateFeatureScore(criteria, property)
  totalScore += featureScore

  // S'assurer que le score est entre 0 et 100
  const finalScore = Math.max(0, Math.min(100, totalScore))

  return Math.round(finalScore * 100) / 100 // Arrondir à 2 décimales
}

/**
 * Calcule le score pour le budget (0-100)
 */
function calculateBudgetScore(criteria: SearchCriteria, property: Property): number {
  const { budgetMin, budgetMax } = criteria
  const propertyPrice = property.price

  // Si aucun budget défini, score maximum
  if (!budgetMin && !budgetMax) {
    return 100
  }

  // Prix trop élevé
  if (budgetMax && propertyPrice > budgetMax) {
    const overBudget = propertyPrice - budgetMax
    const penalty = Math.min(overBudget / budgetMax, 1) // Pénalité proportionnelle
    return Math.max(0, 100 - (penalty * 100))
  }

  // Prix trop bas
  if (budgetMin && propertyPrice < budgetMin) {
    const underBudget = budgetMin - propertyPrice
    const penalty = Math.min(underBudget / budgetMin, 1)
    return Math.max(0, 100 - (penalty * 50)) // Pénalité moindre pour prix trop bas
  }

  // Prix dans la fourchette idéale
  if (budgetMin && budgetMax && propertyPrice >= budgetMin && propertyPrice <= budgetMax) {
    return 100
  }

  // Prix légèrement au-dessus (mais pas trop)
  if (budgetMax && propertyPrice > budgetMax && propertyPrice <= budgetMax * 1.1) {
    return 80
  }

  // Prix légèrement en-dessous
  if (budgetMin && propertyPrice < budgetMin && propertyPrice >= budgetMin * 0.9) {
    return 90
  }

  return 100
}

/**
 * Calcule le score pour la ville (0-100)
 */
function calculateCityScore(criteria: SearchCriteria, property: Property): number {
  const { cities } = criteria
  const propertyCity = property.city.toLowerCase().trim()

  // Si aucune ville spécifiée, score maximum
  if (!cities || cities.length === 0) {
    return 100
  }

  // Recherche exacte
  const exactMatch = cities.some(city =>
    city.toLowerCase().trim() === propertyCity
  )
  if (exactMatch) {
    return 100
  }

  // Recherche partielle (contient le nom de la ville)
  const partialMatch = cities.some(city =>
    propertyCity.includes(city.toLowerCase().trim()) ||
    city.toLowerCase().trim().includes(propertyCity)
  )
  if (partialMatch) {
    return 70
  }

  // Aucune correspondance
  return 0
}

/**
 * Calcule le score pour la surface (0-100)
 */
function calculateSurfaceScore(criteria: SearchCriteria, property: Property): number {
  const { surfaceMin, surfaceMax } = criteria
  const propertySurface = property.surface

  // Si aucune surface définie ou propriété sans surface, score maximum
  if ((!surfaceMin && !surfaceMax) || !propertySurface) {
    return 100
  }

  // Surface trop grande
  if (surfaceMax && propertySurface > surfaceMax) {
    const overSurface = propertySurface - surfaceMax
    const penalty = Math.min(overSurface / surfaceMax, 1)
    return Math.max(0, 100 - (penalty * 80))
  }

  // Surface trop petite
  if (surfaceMin && propertySurface < surfaceMin) {
    const underSurface = surfaceMin - propertySurface
    const penalty = Math.min(underSurface / surfaceMin, 1)
    return Math.max(0, 100 - (penalty * 60))
  }

  // Surface dans la fourchette idéale
  if (surfaceMin && surfaceMax && propertySurface >= surfaceMin && propertySurface <= surfaceMax) {
    return 100
  }

  // Surface légèrement en-dessous
  if (surfaceMin && propertySurface < surfaceMin && propertySurface >= surfaceMin * 0.9) {
    return 85
  }

  // Surface légèrement au-dessus
  if (surfaceMax && propertySurface > surfaceMax && propertySurface <= surfaceMax * 1.1) {
    return 90
  }

  return 100
}

/**
 * Calcule le score pour le nombre de pièces (0-100)
 */
function calculateRoomsScore(criteria: SearchCriteria, property: Property): number {
  const { roomsMin, roomsMax } = criteria
  const propertyRooms = property.rooms

  // Si aucun nombre de pièces défini ou propriété sans info, score maximum
  if ((!roomsMin && !roomsMax) || !propertyRooms) {
    return 100
  }

  // Trop de pièces
  if (roomsMax && propertyRooms > roomsMax) {
    const overRooms = propertyRooms - roomsMax
    const penalty = Math.min(overRooms / roomsMax, 1)
    return Math.max(0, 100 - (penalty * 70))
  }

  // Pas assez de pièces
  if (roomsMin && propertyRooms < roomsMin) {
    const underRooms = roomsMin - propertyRooms
    const penalty = Math.min(underRooms / roomsMin, 1)
    return Math.max(0, 100 - (penalty * 50))
  }

  // Nombre de pièces idéal
  if (roomsMin && roomsMax && propertyRooms >= roomsMin && propertyRooms <= roomsMax) {
    return 100
  }

  // Légèrement en-dessous
  if (roomsMin && propertyRooms < roomsMin && propertyRooms >= roomsMin - 1) {
    return 80
  }

  // Légèrement au-dessus
  if (roomsMax && propertyRooms > roomsMax && propertyRooms <= roomsMax + 1) {
    return 85
  }

  return 100
}

/**
 * Calcule le bonus/malus pour les caractéristiques requises (mustHave/mustNotHave)
 */
function calculateFeatureScore(criteria: SearchCriteria, property: Property): number {
  const { mustHave, mustNotHave } = criteria
  let score = 0

  // Analyse de la description et du titre pour détecter les caractéristiques
  const propertyText = `${property.title} ${property.description || ''}`.toLowerCase()

  // Bonus pour mustHave présents (+5 points par élément trouvé)
  if (mustHave && mustHave.length > 0) {
    for (const feature of mustHave) {
      if (propertyText.includes(feature.toLowerCase())) {
        score += 5
      }
    }
  }

  // Malus pour mustNotHave présents (-10 points par élément trouvé)
  if (mustNotHave && mustNotHave.length > 0) {
    for (const feature of mustNotHave) {
      if (propertyText.includes(feature.toLowerCase())) {
        score -= 10
      }
    }
  }

  return score
}

/**
 * Fonction utilitaire pour obtenir les raisons d'un score
 * Utile pour le débogage et l'explication des résultats
 */
export function getMatchingReasons(criteria: SearchCriteria, property: Property): string[] {
  const reasons: string[] = []

  // Budget
  if (criteria.budgetMax && property.price > criteria.budgetMax) {
    reasons.push(`Prix (${property.price}€) supérieur au budget maximum (${criteria.budgetMax}€)`)
  } else if (criteria.budgetMin && property.price < criteria.budgetMin) {
    reasons.push(`Prix (${property.price}€) inférieur au budget minimum (${criteria.budgetMin}€)`)
  } else {
    reasons.push(`Prix (${property.price}€) dans le budget demandé`)
  }

  // Ville
  const cityMatch = calculateCityScore(criteria, property)
  if (cityMatch === 100) {
    reasons.push(`Ville (${property.city}) correspond exactement`)
  } else if (cityMatch > 0) {
    reasons.push(`Ville (${property.city}) correspond partiellement`)
  } else {
    reasons.push(`Ville (${property.city}) ne correspond pas aux critères`)
  }

  // Surface
  if (property.surface) {
    if (criteria.surfaceMax && property.surface > criteria.surfaceMax) {
      reasons.push(`Surface (${property.surface}m²) supérieure à la limite (${criteria.surfaceMax}m²)`)
    } else if (criteria.surfaceMin && property.surface < criteria.surfaceMin) {
      reasons.push(`Surface (${property.surface}m²) inférieure au minimum (${criteria.surfaceMin}m²)`)
    } else {
      reasons.push(`Surface (${property.surface}m²) correspond aux critères`)
    }
  }

  // Pièces
  if (property.rooms) {
    if (criteria.roomsMax && property.rooms > criteria.roomsMax) {
      reasons.push(`${property.rooms} pièces, supérieur à la limite (${criteria.roomsMax})`)
    } else if (criteria.roomsMin && property.rooms < criteria.roomsMin) {
      reasons.push(`${property.rooms} pièces, inférieur au minimum (${criteria.roomsMin})`)
    } else {
      reasons.push(`${property.rooms} pièces correspond aux critères`)
    }
  }

  // Caractéristiques
  const propertyText = `${property.title} ${property.description || ''}`.toLowerCase()

  if (criteria.mustHave && criteria.mustHave.length > 0) {
    for (const feature of criteria.mustHave) {
      if (propertyText.includes(feature.toLowerCase())) {
        reasons.push(`Contient "${feature}" (critère requis)`)
      }
    }
  }

  if (criteria.mustNotHave && criteria.mustNotHave.length > 0) {
    for (const feature of criteria.mustNotHave) {
      if (propertyText.includes(feature.toLowerCase())) {
        reasons.push(`Contient "${feature}" (critère exclu)`)
      }
    }
  }

  return reasons
}
