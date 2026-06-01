/** GA4 measurement ID (layout charge gtag). */
export const GA_MEASUREMENT_ID = 'G-X40L44JSH3'

type EventParams = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

/** Envoie un événement GA4 (no-op côté serveur ou si gtag absent). */
export function trackEvent(eventName: string, params?: EventParams) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', eventName, params)
}

/** Clic « Voir cette offre » sur la home (lien vers /pricing#plan-*). */
export function trackPricingPlanCtaClick(planId: string) {
  trackEvent('pricing_plan_cta_click', {
    plan_id: planId,
    page_location: window.location.pathname,
    source: 'home',
  })
}

/** Clic chip CV sous le hero. */
export function trackCvChipClick(destination: 'studio_cv' | 'pricing') {
  trackEvent('cv_chip_click', {
    destination,
    page_location: window.location.pathname,
  })
}

/** L’utilisateur a scrollé jusqu’à la section tarifs (#pricing) sur la home. */
export function trackPricingSectionView() {
  trackEvent('pricing_section_view', {
    page_location: window.location.pathname,
  })
}

/** Session Stripe Checkout créée — redirection imminente. */
export function trackBeginCheckout(planId: string, trialDays: number) {
  trackEvent('begin_checkout', {
    plan_id: planId,
    trial_days: trialDays,
    page_location: window.location.pathname,
    source: 'pricing_page',
  })
}
