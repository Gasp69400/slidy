'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { LandingHeader } from '@/components/landing/LandingHeader'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useSiteLocale } from '@/lib/site-locale'

type MePayload = {
  success: boolean
  data?: {
    email: string | null
    name: string | null
    subscriptionStatus: string | null
  }
  error?: string
}

function statusKey(
  status: string | null | undefined,
):
  | 'account.status.TRIAL'
  | 'account.status.ACTIVE'
  | 'account.status.PAST_DUE'
  | 'account.status.CANCELED'
  | 'account.status.UNPAID'
  | 'account.status.UNKNOWN' {
  if (status === 'TRIAL') return 'account.status.TRIAL'
  if (status === 'ACTIVE') return 'account.status.ACTIVE'
  if (status === 'PAST_DUE') return 'account.status.PAST_DUE'
  if (status === 'CANCELED') return 'account.status.CANCELED'
  if (status === 'UNPAID') return 'account.status.UNPAID'
  return 'account.status.UNKNOWN'
}

export default function AccountPage() {
  const { t } = useSiteLocale()
  const [data, setData] = useState<MePayload['data'] | null>(null)
  const [unauthorized, setUnauthorized] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/me')
        if (res.status === 401) {
          if (!cancelled) {
            setUnauthorized(true)
            setData(null)
          }
          return
        }
        const json = (await res.json()) as MePayload
        if (!cancelled && res.ok && json.success && json.data) {
          setData(json.data)
        } else if (!cancelled) {
          setError(true)
        }
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <LandingHeader />
      <main className="mx-auto max-w-lg px-4 py-10 sm:px-6 lg:px-8">
        <Card className="border-slate-200 bg-white shadow-lg dark:border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-50">
              {t('account.title')}
            </CardTitle>
            <CardDescription className="dark:text-slate-400">
              {t('account.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {unauthorized && (
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <p>{t('account.login_hint')}</p>
                <Button asChild className="rounded-full">
                  <Link href="/auth/login">{t('account.login_cta')}</Link>
                </Button>
              </div>
            )}
            {!unauthorized && loading && (
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('editor.loading_short')}</p>
            )}
            {!unauthorized && !loading && error && (
              <p className="text-sm text-red-600">{t('account.err_load')}</p>
            )}
            {!unauthorized && !loading && data && (
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="font-medium text-slate-500 dark:text-slate-400">
                    {t('account.email')}
                  </dt>
                  <dd className="text-slate-900 dark:text-slate-100">
                    {data.email ?? '—'}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-500 dark:text-slate-400">
                    {t('account.status_label')}
                  </dt>
                  <dd className="text-slate-900 dark:text-slate-100">
                    {t(statusKey(data.subscriptionStatus))}
                  </dd>
                </div>
              </dl>
            )}
            <Button
              variant="outline"
              className="mt-2 w-full rounded-full border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-300 dark:bg-white dark:hover:bg-slate-100"
              asChild
            >
              <Link href="/">{t('account.back_home')}</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
