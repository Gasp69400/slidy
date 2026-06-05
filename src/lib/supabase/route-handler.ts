import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont requis.',
    )
  }
  return { url, key }
}

/** Client Supabase pour Route Handlers avec propagation des cookies de session. */
export function createSupabaseRouteHandlerClient(request: NextRequest) {
  const { url, key } = getSupabaseEnv()
  let cookieResponse = NextResponse.next({ request })

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })
        cookieResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieResponse.cookies.set(
            name,
            value,
            options as CookieOptions | undefined,
          )
        })
      },
    },
  })

  return { supabase, cookieResponse: () => cookieResponse }
}

/** Recopie les cookies de session rafraîchis vers une NextResponse JSON. */
export function applySessionCookies(
  target: NextResponse,
  source: NextResponse,
): NextResponse {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie)
  })
  return target
}
