import type { Metadata } from 'next'

import { LegalCguPage } from '@/components/legal/LegalCguPage'
import { LEGAL_CGU_PAGE_METADATA } from '@/lib/site-metadata'

export const metadata: Metadata = LEGAL_CGU_PAGE_METADATA

export default function CguRoutePage() {
  return <LegalCguPage />
}
