import type { SiteStrKey } from '@/lib/site-messages'

/**
 * Liens du menu principal du header (ordre d’affichage).
 * La logique d’état actif est centralisée pour rester cohérente desktop / mobile.
 */
export type AppHeaderNavItem = {
  href: string
  labelKey: SiteStrKey
  isActive: (pathname: string) => boolean
}

export const APP_HEADER_NAV: AppHeaderNavItem[] = [
  {
    href: '/templates',
    labelKey: 'nav.templates',
    isActive: (p) => p === '/templates' || p.startsWith('/templates/'),
  },
  {
    href: '/presentations',
    labelKey: 'nav.presentations',
    isActive: (p) => p.startsWith('/presentations'),
  },
  {
    href: '/studio',
    labelKey: 'nav.studio',
    isActive: (p) =>
      p === '/studio' ||
      (p.startsWith('/studio/') && !p.startsWith('/studio/cv')),
  },
  {
    href: '/studio/cv',
    labelKey: 'nav.menu_cv',
    isActive: (p) => p.startsWith('/studio/cv'),
  },
  {
    href: '/cover-letter',
    labelKey: 'nav.menu_cover_letter',
    isActive: (p) => p === '/cover-letter' || p.startsWith('/cover-letter/'),
  },
]
