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
import { fetchMeProfile, type MeProfile } from '@/lib/fetch-me'
import { useSiteLocale } from '@/lib/site-locale'

type PlanTier = MeProfile['activePlan']

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

function planKey(
  plan: PlanTier,
):
  | 'account.plan.STARTER'
  | 'account.plan.PRO'
  | 'account.plan.ULTIMATE' {
  if (plan === 'PRO') return 'account.plan.PRO'
  if (plan === 'ULTIMATE') return 'account.plan.ULTIMATE'
  return 'account.plan.STARTER'
}

function formatPeriodEnd(
  unix: number | null | undefined,
  locale: 'fr' | 'en',
): string {
  if (!unix) return '—'
  return new Date(unix * 1000).toLocaleDateString(
    locale === 'en' ? 'en-GB' : 'fr-FR',
    { day: 'numeric', month: 'long', year: 'numeric' },
  )
}

export default function AccountPage() {
  const { t, locale } = useSiteLocale()
  const [data, setData] = useState<MeProfile | null>(null)
  const [unauthorized, setUnauthorized] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const result = await fetchMeProfile()
        if (cancelled) return
        if (!result.ok) {
          if (result.unauthorized) {
            setUnauthorized(true)
            setData(null)
          } else {
            setError(
              result.message
                ? t('account.err_load_detail', { detail: result.message })
                : t('account.err_load'),
            )
          }
          return
        }
        setData(result.data)
      } catch (err) {
        if (!cancelled) {
          const detail = err instanceof Error ? err.message : String(err)
          setError(t('account.err_load_detail', { detail }))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const activePlan = data?.activePlan ?? 'STARTER'
  const isPaidPlan = activePlan === 'PRO' || activePlan === 'ULTIMATE'
  const cancelScheduled = data?.subscription?.cancelAtPeriodEnd ?? false
  const dbUnavailable = data?.dbUnavailable ?? false

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <LandingHeader />
      <main className="mx-auto max-w-lg px-4 py-10 sm:px-6 lg:px-8">
        <Card className="border-slate-200 bg-white text-slate-900 shadow-lg dark:border-slate-200 dark:bg-white dark:text-slate-900">
          <CardHeader>
            <CardTitle className="text-slate-900">
              {t('account.title')}
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-600">
              {t('account.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {unauthorized && (
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-600">
                <p>{t('account.login_hint')}</p>
                <Button asChild className="rounded-full">
                  <Link href="/auth/login">{t('account.login_cta')}</Link>
                </Button>
              </div>
            )}
            {!unauthorized && loading && (
              <p className="text-sm text-slate-500 dark:text-slate-600">
                {t('editor.loading_short')}
              </p>
            )}
            {!unauthorized && !loading && error && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              >
                {error}
              </p>
            )}
            {!unauthorized && !loading && data && (
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="font-medium text-slate-500 dark:text-slate-600">
                    {t('account.email')}
                  </dt>
                  <dd className="text-slate-900 dark:text-slate-900">
                    {data.email ?? '—'}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-500 dark:text-slate-600">
                    {t('account.plan_label')}
                  </dt>
                  <dd className="text-base font-semibold text-slate-900 dark:text-slate-900">
                    {t(planKey(activePlan))}
                  </dd>
                  {!isPaidPlan ? (
                    <dd className="mt-1 text-slate-600 dark:text-slate-600">
                      {t('account.plan_starter_hint')}
                    </dd>
                  ) : null}
                </div>
                {isPaidPlan ? (
                  <div>
                    <dt className="font-medium text-slate-500 dark:text-slate-600">
                      {t('account.status_label')}
                    </dt>
                    <dd className="text-slate-900 dark:text-slate-900">
                      {t(statusKey(data.subscriptionStatus))}
                    </dd>
                  </div>
                ) : null}
              </dl>
            )}

            {!unauthorized && !loading && data && dbUnavailable && (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {t('account.db_unavailable')}
              </p>
            )}

            {!unauthorized && !loading && data && cancelScheduled && (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {t('account.cancel_pending', {
                  date: formatPeriodEnd(
                    data.subscription?.currentPeriodEnd,
                    locale,
                  ),
                })}
              </p>
            )}

            {!unauthorized && !loading && data && isPaidPlan && (
              <Button
                variant="outline"
                className="w-full rounded-full border-red-200 text-red-700 hover:bg-red-50 dark:border-red-300 dark:text-red-800"
                asChild
              >
                <Link href="/account/cancel">{t('account.cancel_cta')}</Link>
              </Button>
            )}

            {!unauthorized && !loading && data && !isPaidPlan && (
              <Button
                className="w-full rounded-full bg-brand-500 shadow-md shadow-brand-500/25 hover:bg-brand-600"
                asChild
              >
                <Link href="/pricing">{t('account.upgrade_cta')}</Link>
              </Button>
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
