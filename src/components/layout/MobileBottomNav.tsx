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

import { APP_HEADER_NAV } from '@/lib/app-nav'
import { MOBILE_TAB_BAR_HEIGHT } from '@/lib/mobile-layout'
import { useSiteLocale } from '@/lib/site-locale'
import { cn } from '@/lib/utils'

const NAV_ICONS: Record<string, LucideIcon> = {
  '/templates': LayoutTemplate,
  '/presentations': FileText,
  '/studio': Blocks,
  '/studio/cv': Briefcase,
  '/cover-letter': PenLine,
}

export function MobileBottomNav() {
  const pathname = usePathname()
  const { t } = useSiteLocale()

  return (
    <nav
      aria-label={t('nav.mobile_tabs')}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/90 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95 sm:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div
        className="mx-auto flex max-w-lg items-stretch justify-around px-0.5"
        style={{ height: MOBILE_TAB_BAR_HEIGHT }}
      >
        {APP_HEADER_NAV.map((item) => {
          const active = item.isActive(pathname)
          const Icon = NAV_ICONS[item.href] ?? FileText
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex min-h-[44px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-0.5 py-1 text-[10px] font-medium leading-none transition-colors',
                active
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200',
              )}
            >
              <Icon
                className={cn('h-5 w-5 shrink-0', active && 'stroke-[2.25]')}
                aria-hidden
              />
              <span className="max-w-full truncate">{t(item.mobileLabelKey)}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
