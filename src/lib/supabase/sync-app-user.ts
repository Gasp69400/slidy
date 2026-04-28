import type { SubscriptionStatus } from '@prisma/client'
import type { User as SupabaseAuthUser } from '@supabase/supabase-js'

import { prisma } from '@/lib/prisma'

function displayNameFromSupabase(
  supabaseUser: SupabaseAuthUser,
  email: string,
): string {
  return (
    (typeof supabaseUser.user_metadata?.name === 'string' &&
      supabaseUser.user_metadata.name.trim()) ||
    (typeof supabaseUser.user_metadata?.full_name === 'string' &&
      supabaseUser.user_metadata.full_name.trim()) ||
    email.split('@')[0] ||
    'Utilisateur'
  )
}

/**
 * Ancien compte Prisma (ex. NextAuth) : même e-mail, id différent de l’UUID Supabase.
 * On libère l’e-mail, crée la ligne avec l’id Supabase, réassigne les FK puis supprime l’ancienne ligne.
 */
async function migrateLegacyUserToSupabaseAuth(
  legacy: {
    id: string
    email: string
    name: string
    stripeCustomerId: string | null
    subscriptionStatus: SubscriptionStatus
  },
  supabaseUser: SupabaseAuthUser,
  email: string,
  name: string,
): Promise<void> {
  const newId = supabaseUser.id
  const placeholderEmail = `__legacy_${legacy.id}@migrated.invalid`

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: legacy.id },
      data: {
        email: placeholderEmail,
        stripeCustomerId: null,
      },
    })

    await tx.user.create({
      data: {
        id: newId,
        email,
        name,
        hashedPassword: null,
        stripeCustomerId: legacy.stripeCustomerId,
        subscriptionStatus: legacy.subscriptionStatus,
      },
    })

    await tx.client.updateMany({
      where: { userId: legacy.id },
      data: { userId: newId },
    })
    await tx.account.updateMany({
      where: { userId: legacy.id },
      data: { userId: newId },
    })
    await tx.session.updateMany({
      where: { userId: legacy.id },
      data: { userId: newId },
    })
    await tx.presentation.updateMany({
      where: { userId: legacy.id },
      data: { userId: newId },
    })
    await tx.aiDocument.updateMany({
      where: { userId: legacy.id },
      data: { userId: newId },
    })
    await tx.mediaAsset.updateMany({
      where: { userId: legacy.id },
      data: { userId: newId },
    })
    await tx.generationJob.updateMany({
      where: { userId: legacy.id },
      data: { userId: newId },
    })

    await tx.user.delete({ where: { id: legacy.id } })
  })
}

/**
 * Assure une ligne `users` Prisma pour les FK (documents, jobs…).
 * L’identifiant est l’UUID Supabase Auth (`auth.users.id`).
 */
export async function ensureAppUserFromSupabase(
  supabaseUser: SupabaseAuthUser,
): Promise<void> {
  const email = supabaseUser.email?.trim().toLowerCase()
  if (!email) return

  const name = displayNameFromSupabase(supabaseUser, email)
  const supabaseId = supabaseUser.id

  const byId = await prisma.user.findUnique({ where: { id: supabaseId } })
  if (byId) {
    await prisma.user.update({
      where: { id: supabaseId },
      data: { email, name },
    })
    return
  }

  const byEmail = await prisma.user.findUnique({ where: { email } })
  if (byEmail) {
    if (byEmail.id === supabaseId) {
      return
    }
    await migrateLegacyUserToSupabaseAuth(
      {
        id: byEmail.id,
        email: byEmail.email,
        name: byEmail.name,
        stripeCustomerId: byEmail.stripeCustomerId,
        subscriptionStatus: byEmail.subscriptionStatus,
      },
      supabaseUser,
      email,
      name,
    )
    return
  }

  await prisma.user.create({
    data: {
      id: supabaseId,
      email,
      name,
      hashedPassword: null,
      subscriptionStatus: 'TRIAL',
    },
  })
}
