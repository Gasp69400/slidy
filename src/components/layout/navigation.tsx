'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Blocks,
  Briefcase,
  FileText,
  LayoutTemplate,
  PenLine,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SlidyLogoMark } from '@/components/brand/SlidyLogoMark'
import { LanguageToggle } from '@/components/LanguageToggle'
import { APP_HEADER_NAV } from '@/lib/app-nav'
import { useSiteLocale } from '@/lib/site-locale'
import { cn } from '@/lib/utils'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client'

const NAV_ICONS: Record<string, LucideIcon> = {
  '/templates': LayoutTemplate,
  '/presentations': FileText,
  '/studio': Blocks,
  '/studio/cv': Briefcase,
  '/cover-letter': PenLine,
}

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useSiteLocale()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    void supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null)
      setUserName(data.user?.user_metadata?.full_name as string ?? data.user?.email ?? null)
    })
  }, [])

  const handleSignOut = async () => {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const linkClass = (active: boolean) =>
    cn(
      'inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors sm:px-2 min-[1100px]:px-2.5',
      active
        ? 'bg-indigo-50 text-indigo-800 ring-1 ring-indigo-200/80 dark:bg-indigo-950/60 dark:text-indigo-100 dark:ring-indigo-800/80'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
    )

  return (
    <nav className="border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 flex-col gap-2 py-2 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-0">
          <div className="flex min-w-0 items-center justify-between gap-3 sm:justify-start">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight text-slate-900 dark:text-white"
            >
              <SlidyLogoMark size="sm" className="shadow-md shadow-violet-500/20" />
              Slidy
            </Link>
            <div className="sm:hidden">
              <LanguageToggle className="h-8 px-2 text-xs" />
            </div>
          </div>

          <div className="-mx-1 min-w-0 flex-1 overflow-x-auto px-1 sm:mx-0 sm:overflow-visible sm:px-0">
            <ul className="flex w-max max-w-full items-center gap-0.5 sm:w-auto sm:max-w-none lg:gap-1">
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

          <div className="hidden shrink-0 items-center gap-2 sm:flex lg:gap-2.5">
            <LanguageToggle className="h-8 px-2 text-xs" />

            {/* Bouton profil */}
            {userEmail && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu((s) => !s)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold">
                    {(userName ?? userEmail).charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden max-w-[120px] truncate lg:block">
                    {userName ?? userEmail}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 top-11 z-50 w-56 rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {userName ?? userEmail}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{userEmail}</p>
                      </div>
                      <div className="p-1">
                        <Link
                          href="/account"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                        >
                          <User className="h-4 w-4" />
                          Mon compte
                        </Link>
                        <button
                          onClick={() => { setShowUserMenu(false); void handleSignOut() }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Se déconnecter
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
