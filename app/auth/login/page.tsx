'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

import { AuthPasswordInput } from '@/components/auth/AuthPasswordInput'
import { LanguageToggle } from '@/components/LanguageToggle'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client'
import { mapSupabaseAuthError } from '@/lib/supabase/map-auth-error'
import { useSiteLocale } from '@/lib/site-locale'
import {
  authAlertDestructiveClass,
  authAlertInfoClass,
  authCardClass,
  authCardDescriptionClass,
  authCardTitleClass,
  authFooterClass,
  authFooterLinkClass,
  authInputClass,
  authLabelClass,
  authPageShellClass,
  authSubmitButtonClass,
} from '@/lib/auth-form-classes'

export default function LoginPage() {
  const { t, locale } = useSiteLocale()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/studio'
  const infoMessage = searchParams.get('message')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const supabase = createSupabaseBrowserClient()
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (authError) {
        setError(mapSupabaseAuthError(authError, locale))
        return
      }

      window.location.href = redirectTo
    } catch {
      setError(t('auth.login.err_unexpected'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Entrez votre email pour réinitialiser le mot de passe.')
      return
    }
    setResetLoading(true)
    setError('')
    try {
      const supabase = createSupabaseBrowserClient()
      await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      setResetSent(true)
    } catch {
      setError('Erreur lors de l\'envoi de l\'email.')
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div className={authPageShellClass}>
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <LanguageToggle />
      </div>
      <Card className={authCardClass}>
        <CardHeader className="space-y-1">
          <CardTitle className={authCardTitleClass}>{t('auth.login.title')}</CardTitle>
          <CardDescription className={authCardDescriptionClass}>
            {t('auth.login.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {infoMessage && !error && (
              <Alert className={authAlertInfoClass}>
                <AlertDescription className="text-gray-900">
                  {decodeURIComponent(infoMessage)}
                </AlertDescription>
              </Alert>
            )}
            {resetSent && (
              <Alert className={authAlertInfoClass}>
                <AlertDescription className="text-gray-900">
                  Un email de réinitialisation a été envoyé à {email} !
                </AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert variant="destructive" className={authAlertDestructiveClass}>
                <AlertDescription className="text-gray-900">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className={authLabelClass}>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@email.com"
                className={authInputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className={authLabelClass}>
                  {t('auth.login.password')}
                </Label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={resetLoading}
                  className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  {resetLoading ? 'Envoi...' : 'Mot de passe oublié ?'}
                </button>
              </div>
              <AuthPasswordInput
                id="password"
                placeholder={t('auth.login.ph_password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              className={authSubmitButtonClass}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('auth.login.submit')}
            </Button>
          </form>

          <div className={authFooterClass}>
            {t('auth.login.no_account')}{' '}
            <Link href="/auth/register" className={authFooterLinkClass}>
              {t('auth.login.register')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}