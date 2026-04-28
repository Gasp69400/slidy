'use client'

import Link from 'next/link'
import { Menu, Sparkles } from 'lucide-react'

import { LanguageToggle } from '@/components/LanguageToggle'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSiteLocale } from '@/lib/site-locale'
import { useTheme, type ThemePreference } from '@/lib/theme'
import { cn } from '@/lib/utils'

export function LandingHeader() {
  const { t } = useSiteLocale()
  const { theme, setTheme } = useTheme()

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
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-sm font-bold text-white shadow-sm">
            AI
          </span>
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="shrink-0 rounded-full border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-300 dark:bg-white dark:hover:bg-slate-100"
                aria-label={t('landing.menu_trigger')}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/">{t('nav.home')}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/pricing">{t('landing.pricing')}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/templates">{t('nav.templates')}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/auth/login">{t('landing.login')}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account">{t('landing.menu_account')}</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                {t('landing.menu_theme')}
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={(v) => setTheme(v as ThemePreference)}
              >
                <DropdownMenuRadioItem value="light">
                  {t('landing.theme_light')}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                  {t('landing.theme_dark')}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">
                  {t('landing.theme_system')}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
