'use client'

import Link from 'next/link'

import { SlidyLogoMark } from '@/components/brand/SlidyLogoMark'
import { LandingHeader } from '@/components/landing/LandingHeader'
import { getCguSections } from '@/lib/legal/cgu-content'
import { useSiteLocale } from '@/lib/site-locale'

export function LegalCguPage() {
  const { t, locale } = useSiteLocale()
  const sections = getCguSections(locale)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <LandingHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <p className="text-sm font-medium text-violet-600 dark:text-violet-400">
          <Link
            href="/"
            className="hover:text-violet-700 dark:hover:text-violet-300"
          >
            {t('legal.cgu.back_home')}
          </Link>
        </p>
        <div className="mt-6 flex items-center gap-3">
          <SlidyLogoMark size="sm" />
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t('legal.cgu.title')}
          </h1>
        </div>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {t('legal.cgu.updated')}
        </p>

        <article className="mt-10 space-y-10 border-t border-slate-200 pt-10 dark:border-slate-800">
          <ol className="space-y-10">
            {sections.map((section, i) => (
              <li key={`${section.title}-${i}`} className="scroll-mt-24">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {section.title ?
                    `${i + 1}. ${section.title}`
                  : `${i + 1}`}
                </h2>
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {section.paragraphs.map((p, pi) => (
                    <p key={`p-${i}-${pi}`}>{p}</p>
                  ))}
                  {section.bullets ?
                    <ul className="list-disc space-y-2 pl-5">
                      {section.bullets.map((item, bi) => (
                        <li key={`b-${i}-${bi}`}>{item}</li>
                      ))}
                    </ul>
                  : null}
                  {section.tailParagraphs?.map((p, pi) => (
                    <p key={`tp-${i}-${pi}`}>{p}</p>
                  ))}
                  {section.tailBullets ?
                    <ul className="list-disc space-y-2 pl-5">
                      {section.tailBullets.map((item, bi) => (
                        <li key={`tb-${i}-${bi}`}>{item}</li>
                      ))}
                    </ul>
                  : null}
                </div>
              </li>
            ))}
          </ol>
        </article>

        <p className="mt-12 border-t border-slate-200 pt-8 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          © {new Date().getFullYear()} Slidy ·{' '}
          <Link href="/" className="text-violet-600 hover:underline dark:text-violet-400">
            {t('nav.home')}
          </Link>
        </p>
      </main>
    </div>
  )
}
