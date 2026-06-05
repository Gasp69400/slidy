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

export default function AccountCancelPage() {
  const { t, locale } = useSiteLocale()
  const [data, setData] = useState<MeProfile | null>(null)
  const [unauthorized, setUnauthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successDate, setSuccessDate] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const result = await fetchMeProfile()
        if (cancelled) return
        if (!result.ok) {
          if (result.unauthorized) setUnauthorized(true)
          else setError(t('account.err_load'))
          return
        }
        setData(result.data)
        if (result.data.subscription?.cancelAtPeriodEnd) {
          setSuccessDate(
            formatPeriodEnd(
              result.data.subscription.currentPeriodEnd,
              locale,
            ),
          )
        }
      } catch {
        if (!cancelled) setError(t('account.err_load'))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [locale, t])

  const activePlan = data?.activePlan ?? 'STARTER'
  const isPaidPlan = activePlan === 'PRO' || activePlan === 'ULTIMATE'
  const canCancel = data?.canCancelSubscription ?? false
  const periodEndLabel = formatPeriodEnd(
    data?.subscription?.currentPeriodEnd,
    locale,
  )

  const handleCancel = async () => {
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch('/api/stripe/cancel', {
        method: 'POST',
        credentials: 'include',
      })
      const json = (await res.json()) as {
        success?: boolean
        error?: string
        currentPeriodEnd?: number
        alreadyScheduled?: boolean
      }

      if (!res.ok) {
        setError(
          t('account.cancel.err', {
            detail: json.error ?? `HTTP ${res.status}`,
          }),
        )
        return
      }

      setSuccessDate(formatPeriodEnd(json.currentPeriodEnd, locale))
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err)
      setError(t('account.cancel.err', { detail }))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <LandingHeader />
      <main className="mx-auto max-w-lg px-4 py-10 sm:px-6 lg:px-8">
        <Card className="border-slate-200 bg-white text-slate-900 shadow-lg dark:border-slate-200 dark:bg-white dark:text-slate-900">
          <CardHeader>
            <CardTitle className="text-slate-900">
              {t('account.cancel.title')}
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-600">
              {t('account.cancel.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {unauthorized && (
              <div className="space-y-3 text-sm text-slate-600">
                <p>{t('account.cancel.login_hint')}</p>
                <Button asChild className="rounded-full">
                  <Link href="/auth/login">{t('account.login_cta')}</Link>
                </Button>
              </div>
            )}

            {!unauthorized && loading && (
              <p className="text-sm text-slate-500">{t('editor.loading_short')}</p>
            )}

            {!unauthorized && !loading && data && (
              <>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="font-medium text-slate-500">
                      {t('account.cancel.plan_label')}
                    </dt>
                    <dd className="text-slate-900">{t(planKey(activePlan))}</dd>
                  </div>
                  {data.subscription?.currentPeriodEnd ? (
                    <div>
                      <dt className="font-medium text-slate-500">
                        {t('account.status_label')}
                      </dt>
                      <dd className="text-slate-900">{periodEndLabel}</dd>
                    </div>
                  ) : null}
                </dl>

                <p className="text-sm leading-relaxed text-slate-600">
                  {t('account.cancel.body')}
                </p>

                {successDate ? (
                  <p
                    role="status"
                    className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
                  >
                    {t('account.cancel.success', { date: successDate })}
                  </p>
                ) : null}

                {error ? (
                  <p
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                  >
                    {error}
                  </p>
                ) : null}

                {!isPaidPlan && (
                  <p className="text-sm text-slate-600">
                    {t('account.cancel.not_eligible')}
                  </p>
                )}

                {canCancel && !successDate ? (
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full rounded-full"
                    disabled={submitting}
                    onClick={() => void handleCancel()}
                  >
                    {submitting ? '…' : t('account.cancel.confirm')}
                  </Button>
                ) : null}
              </>
            )}

            <Button
              variant="outline"
              className="w-full rounded-full border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50"
              asChild
            >
              <Link href="/account">{t('account.cancel.back')}</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
