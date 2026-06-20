import { getCapabilities, resolveUserPlan, type PlanCapabilities } from '@/lib/plans'
import { isPrismaConnectionError } from '@/lib/prisma-errors'
import { prisma } from '@/lib/prisma'

export async function getCapabilitiesForUserId(
  userId: string,
): Promise<PlanCapabilities> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionStatus: true, planTier: true },
    })
    return getCapabilities(user ? resolveUserPlan(user) : 'STARTER')
  } catch (error) {
    if (isPrismaConnectionError(error)) {
      console.warn('getCapabilitiesForUserId: BDD injoignable, plan STARTER par défaut')
      return getCapabilities('STARTER')
    }
    throw error
  }
}
