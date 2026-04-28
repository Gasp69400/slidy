import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { handleWebhook } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const sig = headers().get('stripe-signature')

    if (!sig) {
      return NextResponse.json(
        { error: 'Missing Stripe signature' },
        { status: 400 }
      )
    }

    // Vérifier la signature du webhook
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!
    let event

    try {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      )
    }

    // Traiter l'événement
    await handleWebhook(event)

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
