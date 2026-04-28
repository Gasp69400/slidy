import { NextRequest, NextResponse } from 'next/server'

import { requireSessionUser } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { DashboardStats } from '@/types'

export async function GET(_request: NextRequest) {
  try {
    const auth = await requireSessionUser()
    if (!auth.ok) return auth.response

    const userId = auth.userId

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    const totalClients = await prisma.client.count({
      where: { userId },
    })

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const totalProperties = await prisma.property.count({
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
    })

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const recentMatches = await prisma.match.count({
      where: {
        client: { userId },
        createdAt: { gte: oneWeekAgo },
      },
    })

    const timeSaved = totalClients * 2

    const matchesWithScore = await prisma.match.findMany({
      where: { client: { userId } },
      select: { score: true },
      take: 100,
    })

    const averageMatchScore =
      matchesWithScore.length > 0
        ? Math.round(
            matchesWithScore.reduce(
              (sum: number, match: { score: number }) => sum + match.score,
              0,
            ) / matchesWithScore.length,
          )
        : 0

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const alertsSentToday = await prisma.alert.count({
      where: {
        client: { userId },
        sent: true,
        sentAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    })

    const stats: DashboardStats = {
      totalClients,
      activeClients: totalClients,
      totalProperties,
      recentMatches,
      timeSaved,
      averageMatchScore,
      alertsSentToday,
    }

    return NextResponse.json(stats)
  } catch (error: unknown) {
    console.error('GET /api/dashboard/stats error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 },
    )
  }
}
