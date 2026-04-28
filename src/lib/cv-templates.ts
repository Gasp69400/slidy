import type { CvTemplateSlug } from '@/lib/cv-schema'
import type { SiteStrKey } from '@/lib/site-messages'

export type CvTemplateDef = {
  slug: CvTemplateSlug
  labelKey: SiteStrKey
  descriptionKey: SiteStrKey
  /** Classes Tailwind pour l’aperçu miniature */
  previewClass: string
  /** Classes pour le conteneur principal du CV */
  shellClass: string
  headerClass: string
  sidebarClass: string
}

export const CV_TEMPLATES: CvTemplateDef[] = [
  {
    slug: 'modern',
    labelKey: 'cv.tpl.modern',
    descriptionKey: 'cv.tpl.modern.desc',
    previewClass: 'bg-gradient-to-br from-slate-50 to-indigo-50',
    shellClass: 'bg-white text-slate-900',
    headerClass: 'border-b border-slate-200 pb-4 mb-4',
    sidebarClass: 'md:grid md:grid-cols-[160px_1fr] md:gap-6',
  },
  {
    slug: 'minimalist',
    labelKey: 'cv.tpl.minimalist',
    descriptionKey: 'cv.tpl.minimalist.desc',
    previewClass: 'bg-white',
    shellClass: 'bg-white text-slate-800',
    headerClass: 'border-b border-slate-100 pb-6 mb-6',
    sidebarClass: 'space-y-8',
  },
  {
    slug: 'creative',
    labelKey: 'cv.tpl.creative',
    descriptionKey: 'cv.tpl.creative.desc',
    previewClass: 'bg-slate-900',
    shellClass: 'bg-slate-950 text-slate-100',
    headerClass: 'pb-4 mb-4',
    sidebarClass: 'md:grid md:grid-cols-[12px_1fr] md:gap-0',
  },
  {
    slug: 'professional',
    labelKey: 'cv.tpl.professional',
    descriptionKey: 'cv.tpl.professional.desc',
    previewClass: 'bg-slate-100',
    shellClass: 'bg-white text-slate-900 border border-slate-200',
    headerClass: 'bg-slate-100 -mx-6 -mt-6 px-6 pt-6 pb-4 mb-4 border-b border-slate-200',
    sidebarClass: 'space-y-4',
  },
  {
    slug: 'ats',
    labelKey: 'cv.tpl.ats',
    descriptionKey: 'cv.tpl.ats.desc',
    previewClass: 'bg-white border border-slate-200',
    shellClass: 'bg-white text-slate-900 border border-slate-200',
    headerClass: '',
    sidebarClass: '',
  },
]

export function getCvTemplate(slug: CvTemplateSlug): CvTemplateDef {
  return CV_TEMPLATES.find((t) => t.slug === slug) ?? CV_TEMPLATES[0]
}
