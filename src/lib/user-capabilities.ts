import { capabilitiesForUser, type UserIdentity } from '@/lib/plan-access'
import type { PlanCapabilities } from '@/lib/plans'
import { isPrismaConnectionError } from '@/lib/prisma-errors'
import { prisma } from '@/lib/prisma'

export async function getCapabilitiesForUserId(
  userId: string,
  email?: string | null,
): Promise<PlanCapabilities> {
  const identity: UserIdentity = { userId, email }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionStatus: true, planTier: true, email: true },
    })
    return capabilitiesForUser(user, {
      userId,
      email: email ?? user?.email,
    })
  } catch (error) {
    if (isPrismaConnectionError(error)) {
      console.warn('getCapabilitiesForUserId: BDD injoignable, repli plan owner/STARTER')
      return capabilitiesForUser(null, identity)
    }
    throw error
  }
}
