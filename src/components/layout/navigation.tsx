'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Blocks,
  Briefcase,
  FileText,
  LayoutTemplate,
  PenLine,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { LanguageToggle } from '@/components/LanguageToggle'
import { APP_HEADER_NAV } from '@/lib/app-nav'
import { useSiteLocale } from '@/lib/site-locale'
import { cn } from '@/lib/utils'

const NAV_ICONS: Record<string, LucideIcon> = {
  '/templates': LayoutTemplate,
  '/presentations': FileText,
  '/studio': Blocks,
  '/studio/cv': Briefcase,
  '/cover-letter': PenLine,
}

export function Navigation() {
  const pathname = usePathname()
  const { t } = useSiteLocale()

  const linkClass = (active: boolean) =>
    cn(
      'inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
      active
        ? 'bg-indigo-50 text-indigo-800 ring-1 ring-indigo-200/80 dark:bg-indigo-950/60 dark:text-indigo-100 dark:ring-indigo-800/80'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100',
    )

  return (
    <nav className="border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 flex-col gap-2 py-2 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-0">
          <div className="flex min-w-0 items-center justify-between gap-3 sm:justify-start">
            <Link
              href="/"
              className="shrink-0 text-lg font-bold tracking-tight text-slate-900 dark:text-white"
            >
              Slidy
            </Link>
            <div className="sm:hidden">
              <LanguageToggle />
            </div>
          </div>

          <div className="-mx-1 min-w-0 flex-1 overflow-x-auto px-1 sm:mx-0 sm:overflow-visible sm:px-0">
            <ul className="flex w-max max-w-full items-center gap-1 sm:w-auto sm:max-w-none sm:gap-0.5 lg:gap-1">
              {APP_HEADER_NAV.map((item) => {
                const active = item.isActive(pathname)
                const Icon = NAV_ICONS[item.href] ?? FileText
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={linkClass(active)}
                      aria-current={active ? 'page' : undefined}
                    >
                      <Icon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                      <span className="whitespace-nowrap">{t(item.labelKey)}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="hidden shrink-0 items-center gap-3 sm:flex">
            <LanguageToggle />
            <p className="hidden text-xs text-slate-500 lg:block dark:text-slate-400">
              {t('nav.tagline')}
            </p>
          </div>
        </div>
      </div>
    </nav>
  )
}
