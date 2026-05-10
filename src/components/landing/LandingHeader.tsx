'use client'

import Link from 'next/link'
import { Sparkles } from 'lucide-react'

import { SlidyLogoMark } from '@/components/brand/SlidyLogoMark'
import { LanguageToggle } from '@/components/LanguageToggle'
import { SiteHeaderMenu } from '@/components/layout/SiteHeaderMenu'
import { Button } from '@/components/ui/button'
import { useSiteLocale } from '@/lib/site-locale'
import { cn } from '@/lib/utils'

export function LandingHeader() {
  const { t } = useSiteLocale()

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b backdrop-blur-md',
        'border-slate-200/80 bg-white/80 dark:border-slate-800/80 dark:bg-slate-950/80',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 shrink items-center gap-2 rounded-lg outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-violet-500"
        >
          <SlidyLogoMark size="md" />
          <span className="truncate text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Slidy
          </span>
        </Link>

        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
          <LanguageToggle />
          <Button
            className="shrink-0 rounded-full bg-violet-600 px-3 shadow-md shadow-violet-500/25 hover:bg-violet-700 sm:px-5"
            asChild
          >
            <Link href="/studio" className="inline-flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 sm:hidden" />
              <span className="hidden sm:inline">{t('landing.start')}</span>
              <span className="sm:hidden text-sm font-semibold">Studio</span>
            </Link>
          </Button>

          <SiteHeaderMenu />
        </div>
      </div>
    </header>
  )
}
