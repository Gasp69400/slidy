'use client'

import { ReactNode, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/lib/AuthContext'
import { SiteLocaleProvider } from '@/lib/site-locale'
import { ThemeProvider } from '@/lib/theme'

type ProvidersProps = {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  return (
    <AuthProvider>
      <ThemeProvider>
        <SiteLocaleProvider>
          <QueryClientProvider client={queryClient}>
            {children}
            <Toaster />
          </QueryClientProvider>
        </SiteLocaleProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

