'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Check } from 'lucide-react'

import { LandingHeader } from '@/components/landing/LandingHeader'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useSiteLocale } from '@/lib/site-locale'

export default function PricingPage() {
  const { t } = useSiteLocale()

  const tiers = useMemo(
    () => [
      {
        name: t('pricing.tier.starter.name'),
        price: '0',
        period: t('pricing.tier.starter.period'),
        description: t('pricing.tier.starter.desc'),
        features: [
          t('pricing.tier.starter.f1'),
          t('pricing.tier.starter.f2'),
          t('pricing.tier.starter.f3'),
        ],
        cta: t('pricing.tier.starter.cta'),
        href: '/studio',
        highlighted: false,
      },
      {
        name: t('pricing.tier.pro.name'),
        price: '17,99',
        period: t('pricing.tier.pro.period'),
        description: t('pricing.tier.pro.desc'),
        features: [
          t('pricing.tier.pro.f1'),
          t('pricing.tier.pro.f2'),
          t('pricing.tier.pro.f3'),
        ],
        cta: t('pricing.tier.pro.cta'),
        href: '/studio',
        highlighted: true,
      },
      {
        name: t('pricing.tier.team.name'),
        price: '49,99',
        period: t('pricing.tier.team.period'),
        description: t('pricing.tier.team.desc'),
        features: [
          t('pricing.tier.team.f1'),
          t('pricing.tier.team.f2'),
          t('pricing.tier.team.f3'),
        ],
        cta: t('pricing.tier.team.cta'),
        href: '/auth/login',
        highlighted: false,
      },
    ],
    [t],
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/80 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <LandingHeader />

      <div className="mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-violet-600 dark:text-violet-400">{t('pricing.kicker')}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            {t('pricing.title')}
          </h1>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300">{t('pricing.subtitle')}</p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={
                tier.highlighted
                  ? 'relative border-violet-200 bg-white shadow-lg shadow-violet-500/10 ring-2 ring-violet-500/20 dark:border-violet-300 dark:bg-white dark:shadow-violet-900/25 dark:ring-violet-400/40'
                  : 'border-slate-200/80 bg-white shadow-sm dark:border-slate-200 dark:bg-white'
              }
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-3 py-0.5 text-xs font-semibold text-white">
                  {t('pricing.popular')}
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg text-slate-900 dark:text-slate-900">
                  {tier.name}
                </CardTitle>
                <CardDescription className="dark:text-slate-400">{tier.description}</CardDescription>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-900">
                    {tier.price}
                  </span>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">€</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{tier.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  {tier.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full rounded-full"
                  variant={tier.highlighted ? 'default' : 'outline'}
                  asChild
                >
                  <Link href={tier.href}>{tier.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
          <Link
            href="/"
            className="font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
          >
            {t('pricing.back')}
          </Link>
        </p>
      </div>
    </div>
  )
}
