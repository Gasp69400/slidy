'use client'

import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react'

type AuthErrorType = 'user_not_registered' | 'auth_required'

type AuthError = {
  type: AuthErrorType
  message?: string
} | null

type AuthContextValue = {
  isLoadingAuth: boolean
  isLoadingPublicSettings: boolean
  authError: AuthError
  navigateToLogin: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authError] = useState<AuthError>(null)

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoadingAuth: false,
      isLoadingPublicSettings: false,
      authError,
      navigateToLogin: () => {
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      },
    }),
    [authError],
  )

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}

