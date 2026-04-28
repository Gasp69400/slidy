import { supabaseAdmin } from '../lib/supabase'

async function seedDatabase() {
  console.log('🌱 Seeding database...')

  if (!supabaseAdmin) {
    console.error(
      '❌ Définissez SUPABASE_SERVICE_ROLE_KEY dans .env.local (clé secrète du projet, dashboard Supabase > API).'
    )
    process.exit(1)
  }

  try {
    // Create demo user (this would normally be done through Supabase Auth)
    // For seeding purposes, we'll create some demo data

    // Insert demo properties
    const demoProperties = [
      {
        source: 'LEBONCOIN' as const,
        url: 'https://www.leboncoin.fr/ventes_immobilieres/123456789.htm',
        title: 'Appartement 3 pièces centre-ville Lyon',
        price: 350000,
        city: 'Lyon',
        surface: 75,
        rooms: 3,
        description: 'Magnifique appartement de 75m² en plein centre-ville de Lyon. Proche de toutes commodités.',
        images: [
          'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800',
          'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800'
        ]
      },
      {
        source: 'SELOGER' as const,
        url: 'https://www.seloger.com/annonces/achat/appartement/lyon-69/123456.htm',
        title: 'Maison 4 pièces avec jardin Paris 15ème',
        price: 650000,
        city: 'Paris',
        surface: 120,
        rooms: 4,
        description: 'Belle maison familiale avec jardin dans le 15ème arrondissement.',
        images: [
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'
        ]
      },
      {
        source: 'PAP' as const,
        url: 'https://www.pap.fr/annonce/appartement-paris-75-123456',
        title: 'Studio moderne Montmartre',
        price: 280000,
        city: 'Paris',
        surface: 25,
        rooms: 1,
        description: 'Studio entièrement rénové dans le quartier artistique de Montmartre.',
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
        ]
      },
      {
        source: 'PARUVENDU' as const,
        url: 'https://www.paruvendu.fr/immobilier/annonce-123456',
        title: 'Duplex 5 pièces Marseille',
        price: 420000,
        city: 'Marseille',
        surface: 95,
        rooms: 5,
        description: 'Superbe duplex ensoleillé avec vue mer à Marseille.',
        images: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'
        ]
      }
    ]

    console.log('📝 Inserting demo properties...')
    for (const property of demoProperties) {
      const { error } = await supabaseAdmin
        .from('properties')
        .upsert(property, { onConflict: 'url' })

      if (error) {
        console.error('Error inserting property:', error)
      } else {
        console.log(`✅ Inserted property: ${property.title}`)
      }
    }

    console.log('🎉 Database seeded successfully!')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()
