'use client'

import Link from 'next/link'
import { PenLine } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSiteLocale } from '@/lib/site-locale'

export default function CoverLetterPage() {
  const { t } = useSiteLocale()

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <Card className="rounded-3xl border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/25">
            <PenLine className="h-7 w-7" aria-hidden />
          </div>
          <CardTitle className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            {t('coverLetter.placeholder.title')}
          </CardTitle>
          <CardDescription className="text-base text-slate-600 dark:text-slate-400">
            {t('coverLetter.placeholder.sub')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-8">
          <Button asChild className="rounded-xl bg-indigo-600 hover:bg-indigo-700">
            <Link href="/studio/cv">{t('coverLetter.placeholder.cta')}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
