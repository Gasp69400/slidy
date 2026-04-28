'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  SITE_STRINGS,
  formatSiteString,
  type SiteLocale,
  type SiteStrKey,
} from '@/lib/site-messages'

const STORAGE_KEY = 'slidy-site-locale'

type SiteLocaleContextValue = {
  locale: SiteLocale
  setLocale: (locale: SiteLocale) => void
  t: (key: SiteStrKey, vars?: Record<string, string | number>) => string
}

const SiteLocaleContext = createContext<SiteLocaleContextValue | null>(null)

export function SiteLocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<SiteLocale>('fr')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw === 'en' || raw === 'fr') {
        setLocaleState(raw)
      }
    } catch {
      /* ignore */
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.lang = locale === 'en' ? 'en' : 'fr'
    if (!ready) return
    try {
      localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      /* ignore */
    }
  }, [locale, ready])

  const setLocale = useCallback((next: SiteLocale) => {
    setLocaleState(next)
  }, [])

  const t = useCallback(
    (key: SiteStrKey, vars?: Record<string, string | number>) => {
      const row = SITE_STRINGS[key]
      if (!row) return String(key)
      return formatSiteString(row[locale], vars)
    },
    [locale],
  )

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  )

  return (
    <SiteLocaleContext.Provider value={value}>
      {children}
    </SiteLocaleContext.Provider>
  )
}

export function useSiteLocale(): SiteLocaleContextValue {
  const ctx = useContext(SiteLocaleContext)
  if (!ctx) {
    throw new Error('useSiteLocale must be used within SiteLocaleProvider')
  }
  return ctx
}
