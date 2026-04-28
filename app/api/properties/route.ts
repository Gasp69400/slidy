import { NextRequest, NextResponse } from 'next/server'

import { requireSessionUser } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireSessionUser()
    if (!auth.ok) return auth.response

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const city = searchParams.get('city')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const source = searchParams.get('source')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    const where: any = {}

    if (city) {
      where.city = { contains: city, mode: 'insensitive' }
    }

    if (minPrice) {
      where.price = { ...where.price, gte: parseInt(minPrice) }
    }

    if (maxPrice) {
      where.price = { ...where.price, lte: parseInt(maxPrice) }
    }

    if (source) {
      where.source = source
    }

    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.property.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: properties,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      }
    })

  } catch (error) {
    console.error('Get properties error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
