import type { ReactNode } from 'react'

import { STUDIO_CV_PAGE_METADATA } from '@/lib/site-metadata'

export const metadata = STUDIO_CV_PAGE_METADATA

export default function StudioCvLayout({ children }: { children: ReactNode }) {
  return children
}
