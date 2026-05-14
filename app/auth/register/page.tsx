'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

export default function RegisterPage() {
  const { t, locale } = useSiteLocale()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [pendingEmailConfirm, setPendingEmailConfirm] = useState(false)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError(t('auth.register.err_mismatch'))
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError(t('auth.register.err_short'))
      setIsLoading(false)
      return
    }

    try {
      const supabase = createSupabaseBrowserClient()
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            name: name.trim(),
            full_name: name.trim(),
          },
        },
      })

      if (authError) {
        setError(mapSupabaseAuthError(authError, locale))
        return
      }

      if (data.session) {
        router.refresh()
        router.push('/studio')
        return
      }

      setPendingEmailConfirm(true)
      setSuccess(true)
      setTimeout(() => {
        router.push(
          `/auth/login?message=${encodeURIComponent(t('auth.register.redirect_msg'))}`,
        )
      }, 2500)
    } catch {
      setError(t('auth.register.err_unexpected'))
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className={authPageShellClass}>
        <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
          <LanguageToggle />
        </div>
        <Card className={authCardClass}>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="mt-2 text-base font-semibold text-black">
                {t('auth.register.success_title')}
              </h3>
              <p className="mt-1 text-sm text-gray-900">
                {pendingEmailConfirm
                  ? locale === 'fr'
                    ? 'Consultez votre boîte mail pour confirmer votre compte avant de vous connecter.'
                    : 'Check your inbox to confirm your account before signing in.'
                  : t('auth.register.success_sub')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={authPageShellClass}>
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <LanguageToggle />
      </div>
      <Card className={authCardClass}>
        <CardHeader className="space-y-1">
          <CardTitle className={authCardTitleClass}>{t('auth.register.title')}</CardTitle>
          <CardDescription className={authCardDescriptionClass}>
            {t('auth.register.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className={authAlertDestructiveClass}>
                <AlertDescription className="text-gray-900">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className={authLabelClass}>
                {t('auth.register.name')}
              </Label>
              <Input
                id="name"
                type="text"
                placeholder={t('auth.register.ph_name')}
                className={authInputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
              <Label htmlFor="password" className={authLabelClass}>
                {t('auth.register.password')}
              </Label>
              <AuthPasswordInput
                id="password"
                placeholder={t('auth.register.ph_password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className={authLabelClass}>
                {t('auth.register.confirm')}
              </Label>
              <AuthPasswordInput
                id="confirmPassword"
                placeholder={t('auth.register.ph_confirm')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <Button type="submit" className={authSubmitButtonClass} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('auth.register.submit')}
            </Button>
          </form>

          <div className={authFooterClass}>
            {t('auth.register.has_account')}{' '}
            <Link href="/auth/login" className={authFooterLinkClass}>
              {t('auth.register.signin')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
