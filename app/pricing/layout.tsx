import type { ReactNode } from 'react'

import { PRICING_PAGE_METADATA } from '@/lib/site-metadata'

export const metadata = PRICING_PAGE_METADATA

export default function PricingLayout({ children }: { children: ReactNode }) {
  return children
}
