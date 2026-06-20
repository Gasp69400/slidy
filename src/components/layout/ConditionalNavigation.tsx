'use client'

import type { CSSProperties, ReactNode } from 'react'
import { usePathname } from 'next/navigation'

import { shouldShowMobileTabBar, usesLandingHeader } from '@/lib/app-nav'
import { MOBILE_TAB_BAR_PADDING } from '@/lib/mobile-layout'
import { cn } from '@/lib/utils'

import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { Navigation } from '@/components/layout/navigation'

type Props = {
  children: ReactNode
}

export function ConditionalNavigation({ children }: Props) {
  const pathname = usePathname()
  const showAppNav = !usesLandingHeader(pathname)
  const showTabBar = shouldShowMobileTabBar(pathname)

  return (
    <>
      {showAppNav ? <Navigation /> : null}
      {showTabBar ? <MobileBottomNav /> : null}
      <main
        className={cn(
          'min-h-screen bg-background text-foreground transition-colors',
          showTabBar && 'max-sm:pb-[var(--mobile-tab-bar-pad)]',
        )}
        style={
          showTabBar
            ? ({ '--mobile-tab-bar-pad': MOBILE_TAB_BAR_PADDING } as CSSProperties)
            : undefined
        }
      >
        {children}
      </main>
    </>
  )
}
