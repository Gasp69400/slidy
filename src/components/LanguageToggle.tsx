'use client'

import { Button } from '@/components/ui/button'
import { useSiteLocale } from '@/lib/site-locale'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function LanguageToggle({ className, size = 'sm' }: Props) {
  const { locale, setLocale, t } = useSiteLocale()

  if (locale === 'fr') {
    return (
      <Button
        type="button"
        variant="outline"
        size={size}
        className={cn(
          'border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-300 dark:bg-white dark:text-slate-800 dark:hover:bg-slate-100',
          className,
        )}
        onClick={() => setLocale('en')}
      >
        {t('lang.switch_en')}
      </Button>
    )
  }

  return (
    <Button
      type="button"
      variant="outline"
      size={size}
      className={cn(
        'border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-300 dark:bg-white dark:text-slate-800 dark:hover:bg-slate-100',
        className,
      )}
      onClick={() => setLocale('fr')}
    >
      {t('lang.switch_fr')}
    </Button>
  )
}
