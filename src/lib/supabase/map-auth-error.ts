import type { AuthError } from '@supabase/supabase-js'

/** Messages utilisateur (FR) pour les erreurs fréquentes Supabase Auth */
export function mapSupabaseAuthError(error: AuthError, locale: 'fr' | 'en' = 'fr'): string {
  const msg = error.message?.toLowerCase() ?? ''
  const code = error.status

  if (locale === 'en') {
    if (msg.includes('invalid login') || msg.includes('invalid credentials'))
      return 'Invalid email or password.'
    if (msg.includes('email not confirmed'))
      return 'Please confirm your email before signing in.'
    if (msg.includes('user already registered'))
      return 'An account with this email already exists.'
    if (msg.includes('password') && msg.includes('least'))
      return 'Password does not meet requirements.'
    return error.message || 'Authentication error.'
  }

  if (
    msg.includes('invalid login') ||
    msg.includes('invalid credentials') ||
    code === 400
  ) {
    return 'Email ou mot de passe incorrect.'
  }
  if (msg.includes('email not confirmed')) {
    return 'Veuillez confirmer votre e-mail avant de vous connecter (lien envoyé par Supabase).'
  }
  if (msg.includes('user already registered')) {
    return 'Un compte existe déjà avec cette adresse e-mail.'
  }
  if (msg.includes('password') && msg.includes('least')) {
    return 'Le mot de passe ne respecte pas les règles du projet Supabase.'
  }
  if (msg.includes('network') || msg.includes('fetch')) {
    return 'Erreur réseau. Vérifiez votre connexion.'
  }

  return error.message || 'Erreur d’authentification.'
}
