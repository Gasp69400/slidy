import type { Metadata } from 'next'

export const SITE_NAME = 'Slidy'

/** URL publique canonique (prod : https://www.slidyapp.com). */
export const SITE_BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ?? 'https://www.slidyapp.com'

type PageSeo = {
  title: string
  description: string
  path: string
}

export function buildPageMetadata({ title, description, path }: PageSeo): Metadata {
  const url = `${SITE_BASE_URL}${path}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export const PRICING_PAGE_METADATA = buildPageMetadata({
  title: 'Tarifs et offres',
  description:
    'Comparez les plans Slidy : présentations IA, CV et lettres de motivation. Quotas, exports PDF/PPTX, indicateur ATS — commencez gratuitement.',
  path: '/pricing',
})

export const STUDIO_CV_PAGE_METADATA = buildPageMetadata({
  title: 'CV IA — générateur compatible ATS',
  description:
    'Créez un CV professionnel avec l’IA : modèles structurés pour les logiciels RH (ATS), personnalisation et export. Studio CV Slidy.',
  path: '/studio/cv',
})

export const LEGAL_CGU_PAGE_METADATA = buildPageMetadata({
  title: 'Conditions générales d’utilisation',
  description:
    'CGU du service Slidy : usage de l’IA, responsabilité de l’utilisateur, absence de garantie sur les contenus générés et la détection ATS.',
  path: '/legal/cgu',
})
