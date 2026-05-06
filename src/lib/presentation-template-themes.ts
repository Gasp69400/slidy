/**
 * Thèmes visuels des présentations (slug stocké en base sur `Presentation.templateSlug`).
 * 15 templates répartis par niveau d'abonnement : starter (5), pro (5), ultimate (5).
 */

export const PRESENTATION_TEMPLATE_SLUGS = [
  // Starter
  'modern',
  'minimalist',
  'creative',
  'colorful',
  'sunset',
  // Pro
  'corporate',
  'neon',
  'elegant',
  'ocean',
  'forest',
  // Ultimate
  'luxury',
  'aurora',
  'midnight',
  'rose-gold',
  'editorial',
] as const

export type PresentationTemplateSlug =
  (typeof PRESENTATION_TEMPLATE_SLUGS)[number]

export type TemplateMeta = {
  slug: PresentationTemplateSlug
  label: string
  category: 'business' | 'creative' | 'marketing' | 'nature' | 'luxury'
  plan_tier: 'starter' | 'pro' | 'ultimate'
  description: string
}

export const PRESENTATION_TEMPLATES_META: TemplateMeta[] = [
  // ── STARTER ──────────────────────────────────────────────
  {
    slug: 'modern',
    label: 'Indigo Horizon',
    category: 'business',
    plan_tier: 'starter',
    description: 'Dégradés bleu indigo, blanc lumineux — idéal pitch & produit.',
  },
  {
    slug: 'minimalist',
    label: 'Quiet Studio',
    category: 'business',
    plan_tier: 'starter',
    description:
      "Beaucoup d'espace, traits fins et tons pierre — élégance silencieuse.",
  },
  {
    slug: 'creative',
    label: 'Creative Pop',
    category: 'creative',
    plan_tier: 'starter',
    description: 'Violet et fuchsia, formes organiques — énergie sans agressivité.',
  },
  {
    slug: 'colorful',
    label: 'Sunny Spectrum',
    category: 'marketing',
    plan_tier: 'starter',
    description: 'Ambre, corail et teal — rendu chaleureux et mémorable.',
  },
  {
    slug: 'sunset',
    label: 'Golden Hour',
    category: 'creative',
    plan_tier: 'starter',
    description: 'Dégradés crépuscule corail-mauve — storytelling émotionnel.',
  },

  // ── PRO ──────────────────────────────────────────────────
  {
    slug: 'corporate',
    label: 'Boardroom Elite',
    category: 'business',
    plan_tier: 'pro',
    description: 'Bandeau sombre, typo sobre — présentations direction & finance.',
  },
  {
    slug: 'neon',
    label: 'Neon Pulse',
    category: 'creative',
    plan_tier: 'pro',
    description: 'Fond sombre, accents fluo — keynote tech & événements.',
  },
  {
    slug: 'elegant',
    label: 'Gilded Editorial',
    category: 'luxury',
    plan_tier: 'pro',
    description: 'Noir profond et filets dorés — luxe accessible.',
  },
  {
    slug: 'ocean',
    label: 'Coastal Calm',
    category: 'nature',
    plan_tier: 'pro',
    description: 'Bleus profonds et menthe — santé, bien-être, RSE.',
  },
  {
    slug: 'forest',
    label: 'Evergreen Story',
    category: 'nature',
    plan_tier: 'pro',
    description: 'Verts feuille, tons terre — marques nature & outdoor.',
  },

  // ── ULTIMATE ─────────────────────────────────────────────
  {
    slug: 'luxury',
    label: 'Velvet Soirée',
    category: 'luxury',
    plan_tier: 'ultimate',
    description: 'Platine et bordeaux profond — rendu gala & premium.',
  },
  {
    slug: 'aurora',
    label: 'Boreal Glow',
    category: 'creative',
    plan_tier: 'ultimate',
    description: 'Violets et cyan d’aurore — créatif & inspiration.',
  },
  {
    slug: 'midnight',
    label: 'Moonlight Pro',
    category: 'business',
    plan_tier: 'ultimate',
    description: 'Bleu nuit et contrastes nets — SaaS & consulting.',
  },
  {
    slug: 'rose-gold',
    label: 'Blush Copper',
    category: 'luxury',
    plan_tier: 'ultimate',
    description: 'Rose cuivré et gris perle — lifestyle & beauté.',
  },
  {
    slug: 'editorial',
    label: 'Cover Line',
    category: 'creative',
    plan_tier: 'ultimate',
    description: 'Grilles magazine, typo forte — mode & média.',
  },
]

// ─────────────────────────────────────────────────────────────
// PREVIEW TOKENS (sélecteur de template)
// ─────────────────────────────────────────────────────────────

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
  // STARTER
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
    accentBar: 'w-px bg-stone-400',
    body: 'bg-white',
    line1: 'h-0.5 w-[68%] bg-stone-300',
    line2: 'h-0.5 w-[48%] bg-stone-200',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
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
    fontFamily: 'ui-rounded, system-ui, sans-serif',
  },
  sunset: {
    frame: 'rounded-lg border border-rose-200/80 bg-gradient-to-br from-orange-50 to-pink-50 shadow-sm',
    header: 'h-[22%] rounded-t-md bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400',
    accentBar: 'w-1.5 rounded-full bg-rose-400',
    body: 'bg-white/70',
    line1: 'h-1 w-[70%] rounded-full bg-rose-200',
    line2: 'h-1 w-[52%] rounded-full bg-orange-100',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
  },

  // PRO
  corporate: {
    frame: 'rounded-lg border border-slate-300 bg-white shadow-sm',
    header: 'h-[24%] bg-slate-900',
    accentBar: 'w-1 rounded-full bg-blue-500',
    body: 'bg-slate-50',
    line1: 'h-1 w-[70%] rounded-full bg-slate-400/70',
    line2: 'h-1 w-[52%] rounded-full bg-slate-300/80',
    fontFamily: 'Georgia, "Times New Roman", serif',
  },
  neon: {
    frame: 'rounded-xl border border-cyan-500/30 bg-slate-950 shadow-lg',
    header: 'h-[22%] rounded-t-xl bg-gradient-to-r from-cyan-500 to-blue-500',
    accentBar: 'w-1.5 rounded-full bg-cyan-400',
    body: 'bg-slate-900',
    line1: 'h-1 w-[70%] rounded-full bg-cyan-800/60',
    line2: 'h-1 w-[50%] rounded-full bg-blue-900/60',
    fontFamily: '"Courier New", monospace',
  },
  elegant: {
    frame: 'rounded-lg border border-yellow-800/30 bg-neutral-950 shadow-lg',
    header: 'h-[22%] rounded-t-md bg-gradient-to-r from-yellow-700 to-amber-500',
    accentBar: 'w-1 rounded-full bg-yellow-500',
    body: 'bg-neutral-900',
    line1: 'h-0.5 w-[68%] rounded-full bg-yellow-800/60',
    line2: 'h-0.5 w-[50%] rounded-full bg-yellow-900/40',
    fontFamily: 'Georgia, serif',
  },
  ocean: {
    frame: 'rounded-xl border border-sky-200/60 bg-gradient-to-br from-sky-50 to-blue-100 shadow-sm',
    header: 'h-[22%] rounded-t-xl bg-gradient-to-r from-sky-600 to-blue-800',
    accentBar: 'w-1.5 rounded-full bg-sky-400',
    body: 'bg-white/80',
    line1: 'h-1 w-[70%] rounded-full bg-sky-200',
    line2: 'h-1 w-[52%] rounded-full bg-blue-100',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
  },
  forest: {
    frame: 'rounded-xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-green-100 shadow-sm',
    header: 'h-[22%] rounded-t-xl bg-gradient-to-r from-emerald-700 to-green-600',
    accentBar: 'w-1.5 rounded-full bg-emerald-400',
    body: 'bg-white/80',
    line1: 'h-1 w-[68%] rounded-full bg-emerald-200',
    line2: 'h-1 w-[50%] rounded-full bg-green-100',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
  },

  // ULTIMATE
  luxury: {
    frame: 'rounded-xl border border-red-900/30 bg-neutral-950 shadow-xl',
    header: 'h-[24%] rounded-t-xl bg-gradient-to-r from-red-900 via-rose-800 to-neutral-800',
    accentBar: 'w-1.5 rounded-full bg-red-400',
    body: 'bg-neutral-900',
    line1: 'h-0.5 w-[70%] rounded-full bg-red-900/50',
    line2: 'h-0.5 w-[52%] rounded-full bg-neutral-700',
    fontFamily: 'Georgia, serif',
  },
  aurora: {
    frame: 'rounded-xl border border-teal-500/20 bg-slate-950 shadow-xl',
    header: 'h-[24%] rounded-t-xl bg-gradient-to-r from-teal-500 via-emerald-400 to-violet-500',
    accentBar: 'w-1.5 rounded-full bg-teal-400',
    body: 'bg-slate-900',
    line1: 'h-1 w-[70%] rounded-full bg-teal-900/60',
    line2: 'h-1 w-[52%] rounded-full bg-violet-900/40',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
  },
  midnight: {
    frame: 'rounded-xl border border-blue-900/40 bg-blue-950 shadow-xl',
    header: 'h-[22%] rounded-t-xl bg-gradient-to-r from-blue-900 to-indigo-900',
    accentBar: 'w-1.5 rounded-full bg-blue-400',
    body: 'bg-blue-950',
    line1: 'h-1 w-[68%] rounded-full bg-blue-800/70',
    line2: 'h-1 w-[50%] rounded-full bg-indigo-900/60',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
  },
  'rose-gold': {
    frame: 'rounded-xl border border-rose-200/60 bg-gradient-to-br from-rose-50 to-amber-50 shadow-lg',
    header: 'h-[22%] rounded-t-xl bg-gradient-to-r from-rose-400 via-pink-400 to-amber-400',
    accentBar: 'w-1.5 rounded-full bg-rose-400',
    body: 'bg-white/90',
    line1: 'h-1 w-[70%] rounded-full bg-rose-200',
    line2: 'h-1 w-[52%] rounded-full bg-amber-100',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
  },
  editorial: {
    frame: 'rounded-none border-2 border-slate-900 bg-white shadow-xl',
    header: 'h-[28%] bg-slate-900',
    accentBar: 'w-2 bg-yellow-400',
    body: 'bg-white',
    line1: 'h-1.5 w-[75%] bg-slate-900',
    line2: 'h-0.5 w-[55%] bg-slate-300',
    fontFamily: 'Georgia, "Times New Roman", serif',
  },
}

// ─────────────────────────────────────────────────────────────
// SLIDE CARD THEMES (page détail présentation)
// ─────────────────────────────────────────────────────────────

export type SlideCardTheme = {
  bg: string
  titleColor: string
  bulletColor: string
  numBg: string
  accentColor: string
  decorColor: string
}

export const SLIDE_CARD_THEME: Record<PresentationTemplateSlug, SlideCardTheme> = {
  // STARTER
  modern: {
    bg: 'from-indigo-600 to-violet-700',
    titleColor: 'text-white',
    bulletColor: 'text-white/85',
    numBg: 'bg-white/20 text-white',
    accentColor: '#a78bfa',
    decorColor: '#a78bfa',
  },
  minimalist: {
    bg: 'from-stone-100 to-stone-200',
    titleColor: 'text-stone-900',
    bulletColor: 'text-stone-700',
    numBg: 'bg-stone-300 text-stone-700',
    accentColor: '#78716c',
    decorColor: '#a8a29e',
  },
  creative: {
    bg: 'from-fuchsia-500 to-violet-700',
    titleColor: 'text-white',
    bulletColor: 'text-white/85',
    numBg: 'bg-white/20 text-white',
    accentColor: '#e879f9',
    decorColor: '#e879f9',
  },
  colorful: {
    bg: 'from-orange-500 via-amber-500 to-teal-500',
    titleColor: 'text-white',
    bulletColor: 'text-white/85',
    numBg: 'bg-white/20 text-white',
    accentColor: '#fcd34d',
    decorColor: '#5eead4',
  },
  sunset: {
    bg: 'from-rose-500 via-orange-400 to-amber-400',
    titleColor: 'text-white',
    bulletColor: 'text-white/85',
    numBg: 'bg-white/20 text-white',
    accentColor: '#fda4af',
    decorColor: '#fed7aa',
  },

  // PRO
  corporate: {
    bg: 'from-slate-800 to-slate-900',
    titleColor: 'text-white',
    bulletColor: 'text-slate-200',
    numBg: 'bg-blue-500/30 text-blue-200',
    accentColor: '#60a5fa',
    decorColor: '#1e3a5f',
  },
  neon: {
    bg: 'from-slate-950 to-slate-900',
    titleColor: 'text-cyan-300',
    bulletColor: 'text-slate-300',
    numBg: 'bg-cyan-500/20 text-cyan-300',
    accentColor: '#22d3ee',
    decorColor: '#0e7490',
  },
  elegant: {
    bg: 'from-neutral-950 to-neutral-900',
    titleColor: 'text-amber-400',
    bulletColor: 'text-neutral-300',
    numBg: 'bg-amber-500/20 text-amber-400',
    accentColor: '#fbbf24',
    decorColor: '#78350f',
  },
  ocean: {
    bg: 'from-sky-600 to-blue-800',
    titleColor: 'text-white',
    bulletColor: 'text-sky-100',
    numBg: 'bg-white/20 text-white',
    accentColor: '#7dd3fc',
    decorColor: '#0369a1',
  },
  forest: {
    bg: 'from-emerald-700 to-green-900',
    titleColor: 'text-white',
    bulletColor: 'text-emerald-100',
    numBg: 'bg-white/20 text-white',
    accentColor: '#6ee7b7',
    decorColor: '#064e3b',
  },

  // ULTIMATE
  luxury: {
    bg: 'from-red-900 via-rose-900 to-neutral-900',
    titleColor: 'text-rose-200',
    bulletColor: 'text-neutral-300',
    numBg: 'bg-rose-800/40 text-rose-300',
    accentColor: '#fda4af',
    decorColor: '#881337',
  },
  aurora: {
    bg: 'from-slate-950 via-teal-950 to-violet-950',
    titleColor: 'text-teal-300',
    bulletColor: 'text-slate-200',
    numBg: 'bg-teal-500/20 text-teal-300',
    accentColor: '#5eead4',
    decorColor: '#134e4a',
  },
  midnight: {
    bg: 'from-blue-950 to-indigo-950',
    titleColor: 'text-blue-200',
    bulletColor: 'text-blue-100/80',
    numBg: 'bg-blue-700/30 text-blue-300',
    accentColor: '#93c5fd',
    decorColor: '#1e3a8a',
  },
  'rose-gold': {
    bg: 'from-rose-400 via-pink-400 to-amber-300',
    titleColor: 'text-white',
    bulletColor: 'text-white/90',
    numBg: 'bg-white/25 text-white',
    accentColor: '#fde68a',
    decorColor: '#fda4af',
  },
  editorial: {
    bg: 'from-slate-900 to-slate-800',
    titleColor: 'text-yellow-400',
    bulletColor: 'text-slate-200',
    numBg: 'bg-yellow-400/20 text-yellow-400',
    accentColor: '#facc15',
    decorColor: '#1e293b',
  },
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

export function normalizePresentationTemplateSlug(
  raw: string | null | undefined,
): PresentationTemplateSlug {
  const s = (raw ?? '').trim().toLowerCase()
  if (s === 'minimal-modern' || s === 'minimal_modern') return 'minimalist'
  if ((PRESENTATION_TEMPLATE_SLUGS as readonly string[]).includes(s)) {
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

export function getTemplateMeta(
  rawSlug: string | null | undefined,
): TemplateMeta {
  const slug = normalizePresentationTemplateSlug(rawSlug)
  return (
    PRESENTATION_TEMPLATES_META.find((t) => t.slug === slug) ??
    PRESENTATION_TEMPLATES_META[0]
  )
}

/** Filtre les templates accessibles selon le plan de l'utilisateur. */
export function getAccessibleTemplates(
  userPlan: 'starter' | 'pro' | 'ultimate',
): TemplateMeta[] {
  const allowed: Record<string, string[]> = {
    starter: ['starter'],
    pro: ['starter', 'pro'],
    ultimate: ['starter', 'pro', 'ultimate'],
  }
  return PRESENTATION_TEMPLATES_META.filter((t) =>
    allowed[userPlan].includes(t.plan_tier),
  )
}
