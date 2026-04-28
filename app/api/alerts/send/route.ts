import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { requireSessionUser } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'

const sendAlertSchema = z.object({
  clientId: z.string().min(1),
  propertyId: z.string().optional(),
  type: z.enum(['NEW_MATCH', 'PRICE_DROP', 'PROPERTY_AVAILABLE']),
  customMessage: z.string().min(1).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const auth = await requireSessionUser()
    if (!auth.ok) return auth.response

    const body = await request.json()
    const parsed = sendAlertSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.issues },
        { status: 400 },
      )
    }

    const { clientId, propertyId, type, customMessage } = parsed.data

    // Client must belong to current user.
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        userId: auth.userId,
      },
      select: { id: true, firstName: true, lastName: true, email: true },
    })

    if (!client) {
      return NextResponse.json(
        { error: 'Client non trouvé' },
        { status: 404 },
      )
    }

    if (propertyId) {
      const property = await prisma.property.findUnique({
        where: { id: propertyId },
        select: { id: true },
      })
      if (!property) {
        return NextResponse.json(
          { error: 'Propriété non trouvée' },
          { status: 404 },
        )
      }
    }

    const alert = await prisma.alert.create({
      data: {
        clientId,
        propertyId: propertyId ?? null,
        type,
        message:
          customMessage ??
          `Alerte ${type} envoyée à ${client.firstName} ${client.lastName}`,
        sent: true,
        sentAt: new Date(),
      },
      include: {
        client: true,
        property: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: alert,
      message: 'Alerte créée avec succès',
    })
  } catch (error) {
    console.error('POST /api/alerts/send error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 },
    )
  }
}
