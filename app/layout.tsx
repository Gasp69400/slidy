import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { ConditionalNavigation } from '@/components/layout/ConditionalNavigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Slidy — Présentations IA en quelques secondes',
  description:
    'Créez des slides pro avec l’IA. Décrivez votre idée, obtenez une présentation structurée en quelques secondes — exportez et partagez.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ConditionalNavigation>
            <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-50">
              {children}
            </main>
          </ConditionalNavigation>
        </Providers>
      </body>
    </html>
  )
}
