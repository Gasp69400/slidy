/**
 * Thèmes visuels des présentations (slug stocké en base sur `Presentation.templateSlug`).
 * La génération IA (Groq) ne définit pas ces styles : ils s’appliquent côté UI à l’affichage.
 */

export const PRESENTATION_TEMPLATE_SLUGS = [
  'modern',
  'minimalist',
  'corporate',
  'creative',
  'colorful',
] as const

export type PresentationTemplateSlug =
  (typeof PRESENTATION_TEMPLATE_SLUGS)[number]

export type TemplateMeta = {
  slug: PresentationTemplateSlug
  category: 'business' | 'creative' | 'marketing'
  plan_tier: 'starter' | 'pro' | 'team'
}

/** Métadonnées liste création (hors Prisma `Template`). */
export const PRESENTATION_TEMPLATES_META: TemplateMeta[] = [
  { slug: 'modern', category: 'business', plan_tier: 'starter' },
  { slug: 'minimalist', category: 'business', plan_tier: 'starter' },
  { slug: 'corporate', category: 'business', plan_tier: 'pro' },
  { slug: 'creative', category: 'creative', plan_tier: 'starter' },
  { slug: 'colorful', category: 'marketing', plan_tier: 'starter' },
]

/** Aperçu mini-slide (couleurs + typo) pour le sélecteur. */
export type TemplatePreviewTokens = {
  frame: string
  header: string
  accentBar: string
  body: string
  line1: string
  line2: string
  fontFamily: string
}

export const TEMPLATE_PREVIEW: Record<
  PresentationTemplateSlug,
  TemplatePreviewTokens
> = {
  modern: {
    frame: 'rounded-lg border border-slate-200/80 bg-white shadow-sm',
    header: 'h-[22%] rounded-t-md bg-gradient-to-r from-indigo-600 to-violet-600',
    accentBar: 'w-1 rounded-full bg-indigo-500',
    body: 'bg-slate-50/80',
    line1: 'h-1 w-[72%] rounded-full bg-slate-300',
    line2: 'h-1 w-[55%] rounded-full bg-slate-200',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
  },
  minimalist: {
    frame: 'rounded-lg border border-stone-200 bg-stone-50',
    header: 'h-[18%] border-b border-stone-200/90 bg-white',
    accentBar: 'w-px bg-stone-300',
    body: 'bg-white',
    line1: 'h-0.5 w-[68%] bg-stone-300',
    line2: 'h-0.5 w-[48%] bg-stone-200',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
  },
  corporate: {
    frame: 'rounded-lg border border-slate-300 bg-white shadow-sm',
    header: 'h-[24%] bg-slate-900',
    accentBar: 'w-1 rounded-full bg-blue-500',
    body: 'bg-slate-50',
    line1: 'h-1 w-[70%] rounded-full bg-slate-400/70',
    line2: 'h-1 w-[52%] rounded-full bg-slate-300/80',
    fontFamily: 'Georgia, "Times New Roman", serif',
  },
  creative: {
    frame: 'rounded-xl border border-fuchsia-200/80 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 shadow-sm',
    header: 'h-[22%] rounded-t-xl bg-gradient-to-r from-fuchsia-500 to-violet-600',
    accentBar: 'w-1.5 rounded-full bg-fuchsia-400',
    body: 'bg-white/60',
    line1: 'h-1 w-[65%] rounded-full bg-violet-200',
    line2: 'h-1 w-[50%] rounded-full bg-fuchsia-100',
    fontFamily: '"Segoe UI", system-ui, sans-serif',
  },
  colorful: {
    frame: 'rounded-lg border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50/80 to-teal-50',
    header: 'h-[22%] rounded-t-md bg-gradient-to-r from-orange-500 via-amber-500 to-teal-500',
    accentBar: 'w-1.5 rounded-full bg-teal-500',
    body: 'bg-white/70',
    line1: 'h-1 w-[68%] rounded-full bg-orange-200/90',
    line2: 'h-1 w-[45%] rounded-full bg-teal-200/80',
    fontFamily: 'ui-rounded, "Nunito", system-ui, sans-serif',
  },
}

/** Styles carte slide (page détail présentation). */
export type SlideCardTheme = {
  card: string
  title: string
  bullet: string
  visual: string
  sectionHeading: string
}

export const SLIDE_CARD_THEME: Record<
  PresentationTemplateSlug,
  SlideCardTheme
> = {
  modern: {
    card: 'border-slate-200/90 bg-white shadow-sm',
    title: 'text-slate-900 font-semibold tracking-tight',
    bullet: 'text-slate-700',
    visual: 'text-slate-400',
    sectionHeading: 'text-slate-800',
  },
  minimalist: {
    card: 'border-stone-200 bg-white',
    title: 'text-stone-900 font-medium tracking-tight',
    bullet: 'text-stone-600 text-[13px]',
    visual: 'text-stone-400',
    sectionHeading: 'text-stone-800',
  },
  corporate: {
    card: 'border-slate-300 bg-white shadow-sm ring-1 ring-slate-900/5',
    title: 'text-slate-900 font-semibold font-serif',
    bullet: 'text-slate-700',
    visual: 'text-slate-500',
    sectionHeading: 'text-slate-900 font-serif',
  },
  creative: {
    card: 'border-fuchsia-100 bg-gradient-to-br from-violet-50/90 to-fuchsia-50/50 shadow-sm',
    title: 'text-violet-950 font-semibold',
    bullet: 'text-violet-900/85',
    visual: 'text-violet-600/70',
    sectionHeading: 'text-violet-900',
  },
  colorful: {
    card: 'border-amber-200/90 bg-gradient-to-br from-amber-50/90 via-white to-teal-50/80',
    title: 'text-orange-950 font-semibold',
    bullet: 'text-orange-900/85',
    visual: 'text-teal-700/80',
    sectionHeading: 'text-orange-900',
  },
}

export function normalizePresentationTemplateSlug(
  raw: string | null | undefined,
): PresentationTemplateSlug {
  const s = (raw ?? '').trim().toLowerCase()
  if (s === 'minimal-modern' || s === 'minimal_modern') return 'minimalist'
  if (
    (PRESENTATION_TEMPLATE_SLUGS as readonly string[]).includes(s)
  ) {
    return s as PresentationTemplateSlug
  }
  return 'modern'
}

export function getSlideCardTheme(
  rawSlug: string | null | undefined,
): SlideCardTheme {
  const slug = normalizePresentationTemplateSlug(rawSlug)
  return SLIDE_CARD_THEME[slug]
}

export function getTemplatePreview(
  rawSlug: string | null | undefined,
): TemplatePreviewTokens {
  const slug = normalizePresentationTemplateSlug(rawSlug)
  return TEMPLATE_PREVIEW[slug]
}
