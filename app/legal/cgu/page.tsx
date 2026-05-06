import type { Metadata } from 'next'

import { LegalCguPage } from '@/components/legal/LegalCguPage'

export const metadata: Metadata = {
  title: 'Conditions générales d’utilisation — Slidy',
  description:
    'CGU du service Slidy : service IA, absence de garantie, responsabilité de l’utilisateur, détection de contenus IA.',
}

export default function CguRoutePage() {
  return <LegalCguPage />
}
