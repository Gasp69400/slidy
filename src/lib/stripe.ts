import { Stripe } from 'stripe'
import { prisma } from '@/lib/prisma'
import { SubscriptionStatus } from '@prisma/client'

let stripeSingleton: Stripe | undefined

/** Client Stripe initialisé à la demande (évite de casser le build / le dev sans clés). */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is required')
  }
  if (!stripeSingleton) {
    stripeSingleton = new Stripe(key, {
      apiVersion: '2023-10-16',
      typescript: true,
    })
  }
  return stripeSingleton
}

// Configuration des plans d'abonnement
export const SUBSCRIPTION_PLANS = {
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 1900,
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro',
    features: [
      '60 documents par jour',
      'Templates Pro débloqués',
      'Export PDF + PPTX',
      'Support email',
    ],
  },
  ULTIMATE: {
    id: 'ultimate',
    name: 'Ultimate',
    price: 4900,
    priceId: process.env.STRIPE_ULTIMATE_PRICE_ID || 'price_ultimate',
    features: [
      '200 documents par jour',
      'Tous les templates débloqués',
      'Export PDF + PPTX + JSON',
      'Support prioritaire',
      'API access',
    ],
  },
}

export const TRIAL_DAYS = 14

/**
 * Crée une Checkout Session Stripe (redirection vers page de paiement)
 */
export async function createCheckoutSession({
  userId,
  userEmail,
  priceId,
  trialDays = TRIAL_DAYS,
}: {
  userId: string
  userEmail: string
  priceId: string
  trialDays?: number
}) {
  const session = await getStripe().checkout.sessions.create({
    mode: 'subscription',
    customer_email: userEmail,
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      ...(trialDays > 0 ? { trial_period_days: trialDays } : {}),
      metadata: { userId },
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
  })
  return session
}

/**
 * Crée un abonnement Stripe pour un utilisateur
 */
export async function createSubscription({
  userId,
  priceId,
  trialDays = TRIAL_DAYS,
}: {
  userId: string
  priceId: string
  trialDays?: number
}) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new Error('Utilisateur non trouvé')
    }

    let customer
    if (user.stripeCustomerId) {
      customer = await getStripe().customers.retrieve(user.stripeCustomerId)
    } else {
      customer = await getStripe().customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id },
      })

      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customer.id },
      })
    }

    const subscription = await getStripe().subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      trial_period_days: trialDays,
      metadata: { userId: user.id },
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    })

    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus:
          trialDays > 0 ? SubscriptionStatus.TRIAL : SubscriptionStatus.ACTIVE,
      },
    })

    return {
      subscriptionId: subscription.id,
      clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
      status: subscription.status,
      trialEnd: subscription.trial_end,
    }
  } catch (error) {
    console.error('Error creating subscription:', error)
    throw new Error("Erreur lors de la création de l'abonnement")
  }
}

/**
 * Annule un abonnement
 */
export async function cancelSubscription(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user?.stripeCustomerId) {
      throw new Error('Utilisateur ou client Stripe non trouvé')
    }

    const subscriptions = await getStripe().subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'active',
    })

    if (subscriptions.data.length === 0) {
      throw new Error('Aucun abonnement actif trouvé')
    }

    const subscription = subscriptions.data[0]
    await getStripe().subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
    })

    await prisma.user.update({
      where: { id: userId },
      data: { subscriptionStatus: SubscriptionStatus.CANCELED },
    })

    return { success: true }
  } catch (error) {
    console.error('Error canceling subscription:', error)
    throw new Error("Erreur lors de l'annulation de l'abonnement")
  }
}

/**
 * Met à jour un abonnement (changement de plan)
 */
export async function updateSubscription(userId: string, newPriceId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user?.stripeCustomerId) {
      throw new Error('Utilisateur ou client Stripe non trouvé')
    }

    const subscriptions = await getStripe().subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'active',
    })

    if (subscriptions.data.length === 0) {
      throw new Error('Aucun abonnement actif trouvé')
    }

    const subscription = subscriptions.data[0]

    await getStripe().subscriptions.update(subscription.id, {
      items: [{
        id: subscription.items.data[0].id,
        price: newPriceId,
      }],
      proration_behavior: 'create_prorations',
    })

    return { success: true }
  } catch (error) {
    console.error('Error updating subscription:', error)
    throw new Error("Erreur lors de la mise à jour de l'abonnement")
  }
}

/**
 * Gère les webhooks Stripe
 */
export async function handleWebhook(event: any) {
  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object
        const userId = subscription.metadata.userId

        if (!userId) break

        let status: SubscriptionStatus
        switch (subscription.status) {
          case 'active':
            status = SubscriptionStatus.ACTIVE
            break
          case 'past_due':
            status = SubscriptionStatus.PAST_DUE
            break
          case 'canceled':
          case 'unpaid':
            status = SubscriptionStatus.CANCELED
            break
          default:
            status = SubscriptionStatus.TRIAL
        }

        await prisma.user.update({
          where: { id: userId },
          data: { subscriptionStatus: status },
        })

        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object
        const customerId = invoice.customer

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId as string },
        })

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: { subscriptionStatus: SubscriptionStatus.ACTIVE },
          })
        }

        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        const customerId = invoice.customer

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId as string },
        })

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: { subscriptionStatus: SubscriptionStatus.UNPAID },
          })
        }

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  } catch (error) {
    console.error('Error handling webhook:', error)
    throw error
  }
}

/**
 * Vérifie si un utilisateur a un abonnement actif
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionStatus: true },
    })

    return (
      user?.subscriptionStatus === SubscriptionStatus.ACTIVE ||
      user?.subscriptionStatus === SubscriptionStatus.TRIAL
    )
  } catch (error) {
    console.error('Error checking subscription:', error)
    return false
  }
}

/**
 * Récupère les informations d'abonnement d'un utilisateur
 */
export async function getSubscriptionInfo(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionStatus: true,
        stripeCustomerId: true,
        createdAt: true,
      },
    })

    if (!user?.stripeCustomerId) return null

    const subscriptions = await getStripe().subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'all',
      limit: 1,
    })

    if (subscriptions.data.length === 0) return null

    const subscription = subscriptions.data[0]

    return {
      status: user.subscriptionStatus,
      currentPeriodStart: subscription.current_period_start,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      trialEnd: subscription.trial_end,
    }
  } catch (error) {
    console.error('Error getting subscription info:', error)
    return null
  }
}