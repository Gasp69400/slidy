import { Stripe } from 'stripe'
import { PlanTier, SubscriptionStatus } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { planTierFromStripePriceId } from '@/lib/plans'

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
      '50 documents par mois',
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
      '200 documents par mois',
      'Tous les templates débloqués',
      'Export PDF + PPTX + JSON',
      'Support prioritaire',
      'API access',
    ],
  },
}

export const TRIAL_DAYS = 14

function subscriptionStatusFromStripe(status: Stripe.Subscription.Status): SubscriptionStatus {
  switch (status) {
    case 'active':
      return SubscriptionStatus.ACTIVE
    case 'trialing':
      return SubscriptionStatus.TRIAL
    case 'past_due':
      return SubscriptionStatus.PAST_DUE
    case 'unpaid':
      return SubscriptionStatus.UNPAID
    case 'canceled':
    case 'incomplete_expired':
      return SubscriptionStatus.CANCELED
    default:
      return SubscriptionStatus.TRIAL
  }
}

function planTierFromSubscription(subscription: Stripe.Subscription): PlanTier | null {
  const priceId = subscription.items.data[0]?.price?.id
  if (!priceId) return null
  return planTierFromStripePriceId(priceId)
}

async function resolveUserIdForSubscription(
  subscription: Stripe.Subscription,
  hintUserId?: string | null,
): Promise<string | null> {
  if (hintUserId) return hintUserId
  if (subscription.metadata?.userId) return subscription.metadata.userId

  const customerId =
    typeof subscription.customer === 'string' ?
      subscription.customer
    : subscription.customer?.id

  if (!customerId) return null

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
    select: { id: true },
  })
  if (user?.id) return user.id

  try {
    const customer = await getStripe().customers.retrieve(customerId)
    if (!customer.deleted && customer.email) {
      const byEmail = await prisma.user.findUnique({
        where: { email: customer.email.trim().toLowerCase() },
        select: { id: true },
      })
      return byEmail?.id ?? null
    }
  } catch {
    /* ignore */
  }

  return null
}

/** Synchronise statut Stripe + plan Pro/Ultimate en base. */
export async function syncStripeSubscription(
  subscription: Stripe.Subscription,
  hintUserId?: string | null,
): Promise<void> {
  const userId = await resolveUserIdForSubscription(subscription, hintUserId)
  if (!userId) {
    console.warn('syncStripeSubscription: userId introuvable', subscription.id)
    return
  }

  const status = subscriptionStatusFromStripe(subscription.status)
  const tier = planTierFromSubscription(subscription)
  const entitled =
    status === SubscriptionStatus.ACTIVE ||
    status === SubscriptionStatus.TRIAL ||
    status === SubscriptionStatus.PAST_DUE

  const customerId =
    typeof subscription.customer === 'string' ?
      subscription.customer
    : subscription.customer?.id

  await prisma.user.update({
    where: { id: userId },
    data: {
      ...(customerId ? { stripeCustomerId: customerId } : {}),
      subscriptionStatus: status,
      planTier:
        entitled && tier ? tier
        : entitled ? undefined
        : PlanTier.STARTER,
    },
  })
}

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
  const tier = planTierFromStripePriceId(priceId)
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ??
    'http://localhost:3000'

  const session = await getStripe().checkout.sessions.create({
    mode: 'subscription',
    customer_email: userEmail,
    client_reference_id: userId,
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      ...(trialDays > 0 ? { trial_period_days: trialDays } : {}),
      metadata: {
        userId,
        ...(tier ? { planTier: tier } : {}),
      },
    },
    metadata: {
      userId,
      ...(tier ? { planTier: tier } : {}),
    },
    success_url: `${appUrl}/account?success=true`,
    cancel_url: `${appUrl}/pricing?canceled=true`,
  })

  if (!session.url) {
    throw new Error('Stripe n’a pas renvoyé d’URL de checkout')
  }

  return session
}

/**
 * Checkout Stripe sans compte : l’email est saisi sur la page Stripe.
 * L’abonnement est rattaché au compte à l’inscription (même email).
 */
export async function createGuestCheckoutSession({
  priceId,
  trialDays = TRIAL_DAYS,
  planId,
}: {
  priceId: string
  trialDays?: number
  planId?: string
}) {
  const tier = planTierFromStripePriceId(priceId)
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ??
    'http://localhost:3000'

  const session = await getStripe().checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      ...(trialDays > 0 ? { trial_period_days: trialDays } : {}),
      metadata: {
        guestCheckout: 'true',
        ...(planId ? { planId } : {}),
        ...(tier ? { planTier: tier } : {}),
      },
    },
    metadata: {
      guestCheckout: 'true',
      ...(planId ? { planId } : {}),
      ...(tier ? { planTier: tier } : {}),
    },
    success_url: `${appUrl}/auth/register?checkout=success`,
    cancel_url: `${appUrl}/pricing?canceled=true`,
  })

  if (!session.url) {
    throw new Error('Stripe n’a pas renvoyé d’URL de checkout')
  }

  return session
}

/** Rattache un client Stripe existant (paiement invité) après inscription. */
export async function linkStripeCustomerByEmail(
  userId: string,
  email: string,
): Promise<void> {
  try {
    const normalized = email.trim().toLowerCase()
    const customers = await getStripe().customers.list({
      email: normalized,
      limit: 3,
    })

    const customer = customers.data.find((c) => !c.deleted)
    if (!customer) return

    const subscriptions = await getStripe().subscriptions.list({
      customer: customer.id,
      status: 'all',
      limit: 5,
    })

    const active = subscriptions.data.find((s) =>
      ['active', 'trialing', 'past_due'].includes(s.status),
    )

    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id },
    })

    if (active) {
      await syncStripeSubscription(active, userId)
    }
  } catch (error) {
    console.warn('linkStripeCustomerByEmail:', error)
  }
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
        ...(planTierFromStripePriceId(priceId) ?
          { planTier: planTierFromStripePriceId(priceId)! }
        : {}),
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
      status: 'all',
      limit: 10,
    })

    const subscription = subscriptions.data.find(
      (s) => s.status === 'active' || s.status === 'trialing',
    )

    if (!subscription) {
      throw new Error('Aucun abonnement actif trouvé')
    }

    if (subscription.cancel_at_period_end) {
      return {
        success: true,
        alreadyScheduled: true,
        currentPeriodEnd: subscription.current_period_end,
      }
    }

    const updated = await getStripe().subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
    })

    return {
      success: true,
      alreadyScheduled: false,
      currentPeriodEnd: updated.current_period_end,
    }
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
export async function handleWebhook(event: Stripe.Event) {
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        let userId =
          session.metadata?.userId ?? session.client_reference_id ?? null

        const checkoutEmail =
          session.customer_details?.email ??
          session.customer_email ??
          null

        if (!userId && checkoutEmail) {
          const byEmail = await prisma.user.findUnique({
            where: { email: checkoutEmail.trim().toLowerCase() },
            select: { id: true },
          })
          userId = byEmail?.id ?? null
        }

        if (userId && session.customer) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              stripeCustomerId: String(session.customer),
            },
          })
        }

        if (session.subscription) {
          const subscription = await getStripe().subscriptions.retrieve(
            String(session.subscription),
          )
          await syncStripeSubscription(subscription, userId)
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await syncStripeSubscription(subscription)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer
        if (!customerId) break

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: String(customerId) },
        })
        if (!user) break

        if (invoice.subscription) {
          const subscription = await getStripe().subscriptions.retrieve(
            String(invoice.subscription),
          )
          await syncStripeSubscription(subscription, user.id)
        } else {
          await prisma.user.update({
            where: { id: user.id },
            data: { subscriptionStatus: SubscriptionStatus.ACTIVE },
          })
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer
        if (!customerId) break

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: String(customerId) },
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