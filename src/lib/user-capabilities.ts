import { getCapabilities, resolveUserPlan, type PlanCapabilities } from '@/lib/plans'
import { prisma } from '@/lib/prisma'

export async function getCapabilitiesForUserId(
  userId: string,
): Promise<PlanCapabilities> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionStatus: true, planTier: true },
  })
  return getCapabilities(user ? resolveUserPlan(user) : 'STARTER')
}
