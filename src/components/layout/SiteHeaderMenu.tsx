'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'

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

type SiteHeaderMenuProps = {
  /** Classes du bouton déclencheur (taille, thème sombre, etc.) */
  triggerClassName?: string
  align?: 'start' | 'end' | 'center'
}

export function SiteHeaderMenu({
  triggerClassName,
  align = 'end',
}: SiteHeaderMenuProps) {
  const { t } = useSiteLocale()
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={cn(
            'shrink-0 rounded-full border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-300 dark:bg-white dark:text-slate-800 dark:hover:bg-slate-100',
            triggerClassName,
          )}
          aria-label={t('landing.menu_trigger')}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-56">
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
        <DropdownMenuItem asChild>
          <Link href="/legal/cgu">{t('home.footer.terms')}</Link>
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
  )
}
