'use client'

import { usePathname } from 'next/navigation'

import { Navigation } from '@/components/layout/navigation'

const HIDE_PATHS = new Set(['/', '/pricing', '/account'])

type Props = {
  children: React.ReactNode
}

export function ConditionalNavigation({ children }: Props) {
  const pathname = usePathname()
  const hide = HIDE_PATHS.has(pathname)

  return (
    <>
      {!hide && <Navigation />}
      {children}
    </>
  )
}
