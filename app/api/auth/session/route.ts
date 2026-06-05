import { NextRequest, NextResponse } from 'next/server'

import {
  applySessionCookies,
  createSupabaseRouteHandlerClient,
} from '@/lib/supabase/route-handler'

/** Rafraîchit la session Supabase côté serveur (cookies httpOnly). */
export async function POST(request: NextRequest) {
  const { supabase, cookieResponse } = createSupabaseRouteHandlerClient(request)
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  const sessionCookies = cookieResponse()

  if (error || !user?.id) {
    const res = NextResponse.json({ authenticated: false }, { status: 401 })
    return applySessionCookies(res, sessionCookies)
  }

  const res = NextResponse.json({
    authenticated: true,
    userId: user.id,
    email: user.email,
  })
  return applySessionCookies(res, sessionCookies)
}
