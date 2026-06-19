'use client'

import Link from 'next/link'

import { SlidyLogoMark } from '@/components/brand/SlidyLogoMark'
import { SlidyWordmark } from '@/components/brand/SlidyWordmark'
import { LanguageToggle } from '@/components/LanguageToggle'
import { SiteHeaderMenu } from '@/components/layout/SiteHeaderMenu'

/** Header compact sur mobile quand la nav complète est masquée (accueil, pricing, compte). */
export function MobileMinimalHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 sm:hidden">
      <div className="mx-auto flex h-12 items-center justify-between gap-3 px-4">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-1.5 text-lg font-bold tracking-tight text-slate-900 dark:text-white"
        >
          <SlidyLogoMark size="wordmark" className="shadow-md shadow-brand-500/20" />
          <SlidyWordmark />
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <LanguageToggle className="h-8 px-2 text-xs" />
          <SiteHeaderMenu triggerClassName="h-8 w-8 rounded-full" />
        </div>
      </div>
    </header>
  )
}
