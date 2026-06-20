import { NextRequest, NextResponse } from 'next/server'

import { requireSessionUser } from '@/lib/api-auth'
import { getCapabilitiesForUserId } from '@/lib/user-capabilities'

export async function GET(request: NextRequest) {
  const auth = await requireSessionUser(request)
  if (!auth.ok) return auth.response

  const data = await getCapabilitiesForUserId(auth.userId, auth.email)

  return NextResponse.json({
    success: true,
    data,
  })
}
