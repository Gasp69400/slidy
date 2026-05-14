'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
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
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client'
import {
  authCardClass,
  authCardDescriptionClass,
  authCardTitleClass,
  authLabelClass,
  authPageShellClass,
  authSubmitButtonClass,
  authAlertDestructiveClass,
  authAlertInfoClass,
} from '@/lib/auth-form-classes'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }

    setIsLoading(true)
    try {
      const supabase = createSupabaseBrowserClient()
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) {
        setError(updateError.message)
        return
      }
      setSuccess(true)
      setTimeout(() => router.push('/auth/login'), 2000)
    } catch {
      setError('Erreur inattendue, réessayez.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={authPageShellClass}>
      <Card className={authCardClass}>
        <CardHeader className="space-y-1">
          <CardTitle className={authCardTitleClass}>Nouveau mot de passe</CardTitle>
          <CardDescription className={authCardDescriptionClass}>
            Choisissez un nouveau mot de passe pour votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {success && (
              <Alert className={authAlertInfoClass}>
                <AlertDescription className="text-gray-900">
                  Mot de passe mis à jour ! Redirection...
                </AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert variant="destructive" className={authAlertDestructiveClass}>
                <AlertDescription className="text-gray-900">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className={authLabelClass}>
                Nouveau mot de passe
              </Label>
              <AuthPasswordInput
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm" className={authLabelClass}>
                Confirmer le mot de passe
              </Label>
              <AuthPasswordInput
                id="confirm"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <Button
              type="submit"
              className={authSubmitButtonClass}
              disabled={isLoading || success}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Mettre à jour le mot de passe
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}