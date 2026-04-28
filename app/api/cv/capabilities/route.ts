import { NextResponse } from 'next/server'

import { getCapabilities, planFromSubscription } from '@/lib/plans'
import { requireSupabaseSession } from '@/lib/supabase/require-supabase-session'

/**
 * Capacités pour le module CV sans Prisma : plan par défaut « trial » côté produit.
 */
export async function GET() {
  const session = await requireSupabaseSession()
  if (!session.ok) return session.response

  const plan = planFromSubscription('TRIAL')
  return NextResponse.json({
    success: true,
    data: getCapabilities(plan),
  })
}
