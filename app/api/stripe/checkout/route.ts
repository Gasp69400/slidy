import { NextRequest, NextResponse } from 'next/server'
import { requireSessionUser } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { getStripe } from '@/lib/stripe'

const PRICE_IDS: Record<string, string> = {
  pro: process.env.STRIPE_PRO_PRICE_ID ?? '',
  ultimate: process.env.STRIPE_ULTIMATE_PRICE_ID ?? '',
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireSessionUser()
    if (!auth.ok) return auth.response

    const plan = request.nextUrl.searchParams.get('plan')
    if (!plan || !PRICE_IDS[plan]) {
      return NextResponse.redirect(new URL('/pricing', request.url))
    }

    const priceId = PRICE_IDS[plan]

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { email: true, stripeCustomerId: true },
    })

    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    const stripe = getStripe()

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: user.stripeCustomerId ? undefined : user.email,
      customer: user.stripeCustomerId ?? undefined,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/account?success=true`,
      cancel_url: `${appUrl}/pricing?canceled=true`,
      metadata: {
        userId: auth.userId,
        plan,
      },
    })

    return NextResponse.redirect(session.url!)
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.redirect(new URL('/pricing?error=true', request.url))
  }
}