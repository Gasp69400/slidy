import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { Providers } from '@/components/providers'
import { ConditionalNavigation } from '@/components/layout/ConditionalNavigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Slidy — Présentations IA en quelques secondes',
  description:
    "Créez des slides pro avec l'IA. Décrivez votre idée, obtenez une présentation structurée en quelques secondes — exportez et partagez.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-X40L44JSH3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-X40L44JSH3');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <Providers>
          <ConditionalNavigation>
            <main className="min-h-screen bg-background text-foreground transition-colors">
              {children}
            </main>
          </ConditionalNavigation>
        </Providers>
      </body>
    </html>
  )
}
