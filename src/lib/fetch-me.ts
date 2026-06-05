import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client'

type PlanTier = 'STARTER' | 'PRO' | 'ULTIMATE'

export type MeProfile = {
  email: string | null
  name: string | null
  subscriptionStatus: string | null
  planTier: PlanTier
  activePlan: PlanTier
  canCancelSubscription: boolean
  subscription: {
    cancelAtPeriodEnd: boolean
    currentPeriodEnd: number
    trialEnd: number | null
  } | null
}

type MeApiResponse = {
  success: boolean
  data?: MeProfile
  error?: string
}

async function syncServerSession(): Promise<void> {
  await fetch('/api/auth/session', {
    method: 'POST',
    credentials: 'include',
  })
}

async function fetchMeFromApi(): Promise<Response> {
  return fetch('/api/me', { credentials: 'include' })
}

/** Charge le profil via session navigateur + synchronisation cookies serveur. */
export async function fetchMeProfile(): Promise<
  | { ok: true; data: MeProfile }
  | { ok: false; unauthorized: boolean; error?: boolean; message?: string }
> {
  const supabase = createSupabaseBrowserClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, unauthorized: true }
  }

  await syncServerSession()

  let res = await fetchMeFromApi()
  if (res.status === 401) {
    await supabase.auth.refreshSession()
    await syncServerSession()
    res = await fetchMeFromApi()
  }

  if (res.status === 401) {
    return { ok: false, unauthorized: true }
  }

  const json = (await res.json().catch(() => ({}))) as MeApiResponse & {
    code?: string
  }

  if (!res.ok) {
    console.error('[fetchMeProfile] /api/me failed', {
      status: res.status,
      error: json.error,
      code: json.code,
    })
    return {
      ok: false,
      unauthorized: false,
      error: true,
      message: json.error ?? `HTTP ${res.status}`,
    }
  }

  if (!json.success || !json.data) {
    console.error('[fetchMeProfile] réponse invalide', json)
    return {
      ok: false,
      unauthorized: false,
      error: true,
      message: json.error ?? 'Réponse profil invalide',
    }
  }

  return { ok: true, data: json.data }
}
