import type { SiteStrKey } from '@/lib/site-messages'

/**
 * Liens du menu principal du header (ordre d’affichage).
 * La logique d’état actif est centralisée pour rester cohérente desktop / mobile.
 */
export type AppHeaderNavItem = {
  href: string
  labelKey: SiteStrKey
  /** Libellé court pour la barre d’onglets mobile. */
  mobileLabelKey: SiteStrKey
  isActive: (pathname: string) => boolean
}

export const APP_HEADER_NAV: AppHeaderNavItem[] = [
  {
    href: '/templates',
    labelKey: 'nav.templates',
    mobileLabelKey: 'nav.templates',
    isActive: (p) => p === '/templates' || p.startsWith('/templates/'),
  },
  {
    href: '/presentations',
    labelKey: 'nav.presentations',
    mobileLabelKey: 'nav.presentations_short',
    isActive: (p) => p.startsWith('/presentations'),
  },
  {
    href: '/studio',
    labelKey: 'nav.studio',
    mobileLabelKey: 'nav.studio',
    isActive: (p) =>
      p === '/studio' ||
      (p.startsWith('/studio/') && !p.startsWith('/studio/cv')),
  },
  {
    href: '/studio/cv',
    labelKey: 'nav.menu_cv',
    mobileLabelKey: 'nav.menu_cv',
    isActive: (p) => p.startsWith('/studio/cv'),
  },
  {
    href: '/cover-letter',
    labelKey: 'nav.menu_cover_letter',
    mobileLabelKey: 'nav.menu_cover_letter_short',
    isActive: (p) => p === '/cover-letter' || p.startsWith('/cover-letter/'),
  },
]

/** Routes sans barre d’onglets mobile (auth, partage public, etc.). */
export function shouldShowMobileTabBar(pathname: string): boolean {
  if (pathname.startsWith('/auth')) return false
  if (pathname.startsWith('/p/')) return false
  return true
}

/** Routes sans header complet (accueil marketing, pricing, compte). */
export const HIDE_TOP_NAV_PATHS = new Set(['/', '/pricing', '/account'])
