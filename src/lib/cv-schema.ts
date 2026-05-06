import { z } from 'zod'
 
export const CV_TEMPLATE_SLUGS = [
  'modern',
  'minimalist',
  'creative',
  'professional',
  'ats',
] as const
 
export type CvTemplateSlug = (typeof CV_TEMPLATE_SLUGS)[number]
 
export const cvFontFamilySchema = z.enum(['inter', 'georgia', 'source'])
export type CvFontFamily = z.infer<typeof cvFontFamilySchema>
 
export const cvLayoutDensitySchema = z.enum(['compact', 'normal', 'spacious'])
export type CvLayoutDensity = z.infer<typeof cvLayoutDensitySchema>
 
export const cvContactSchema = z.object({
  email: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().optional(),
})
 
export const cvProfileSchema = z.object({
  fullName: z.string().min(1),
  headline: z.string().min(1),
  summary: z.string().min(1),
  /** URL https ou data:image/... (photo de profil, optionnelle) */
  photoUrl: z.string().optional(),
  /** Ex. « Sept. 2025 – présent », « CDI dès que possible » */
  searchPeriod: z.string().optional(),
  /** Loisirs, bénévolat, sports (texte libre ou lignes) */
  interests: z.union([z.string(), z.array(z.string())]).optional(),
  contact: cvContactSchema.optional(),
})
 
export const cvExperienceSchema = z.object({
  role: z.string().min(1),
  company: z.string().min(1),
  period: z.string().min(1),
  bullets: z.array(z.string()).default([]),
})
 
export const cvEducationSchema = z.object({
  degree: z.string().min(1),
  school: z.string().min(1),
  year: z.union([z.string(), z.number()]).optional(),
})
 
export const cvSkillGroupSchema = z.object({
  name: z.string().min(1),
  items: z.array(z.string()).min(1),
})
 
export const cvKitSchema = z.object({
  profile: cvProfileSchema,
  experience: z.array(cvExperienceSchema).default([]),
  education: z.array(cvEducationSchema).default([]),
  skills: z.array(cvSkillGroupSchema).default([]),
})
 
export type CvKit = z.infer<typeof cvKitSchema>
 
export const cvDesignOptionsSchema = z.object({
  templateSlug: z.enum(CV_TEMPLATE_SLUGS).default('modern'),
  fontFamily: cvFontFamilySchema.default('inter'),
  layoutDensity: cvLayoutDensitySchema.default('normal'),
  accentHex: z
  .string()
  .transform((val) => {
    const v = val.trim()
    if (/^#[0-9A-Fa-f]{6}$/.test(v)) return v
    if (/^#[0-9A-Fa-f]{3}$/.test(v)) {
      const r = v[1]
      const g = v[2]
      const b = v[3]
      return `#${r}${r}${g}${g}${b}${b}`
    }
    return '#4f46e5'
  })
  .default('#4f46e5'),
})
export type CvDesignOptions = z.infer<typeof cvDesignOptionsSchema>
 
export const cvDocumentMetadataSchema = z.object({
  version: z.literal(1),
  cvKit: cvKitSchema,
  coverLetter: z.string().min(1),
  source: z.enum(['manual', 'prompt', 'hybrid']),
  lastPrompt: z.string().optional(),
  locale: z.enum(['fr', 'en']).optional(),
})
 
export type CvDocumentMetadata = z.infer<typeof cvDocumentMetadataSchema>
 
export function defaultCvDesignOptions(
  partial?: Partial<CvDesignOptions>,
): CvDesignOptions {
  return cvDesignOptionsSchema.parse({ ...partial })
}
 
export function parseCvMetadata(raw: unknown): CvDocumentMetadata | null {
  const r = cvDocumentMetadataSchema.safeParse(raw)
  return r.success ? r.data : null
}
 
export function parseCvDesignOptions(raw: unknown): CvDesignOptions {
  const r = cvDesignOptionsSchema.safeParse(raw ?? {})
  return r.success ? r.data : cvDesignOptionsSchema.parse({})
}
 
/** Réponse attendue du modèle (JSON) — fusionnée avec les champs manuels si fournis */
export const llmCvResponseSchema = z.object({
  profile: cvProfileSchema.extend({
    interests: z.union([z.string(), z.array(z.string())]).optional(),
    searchPeriod: z.string().optional(),
    photoUrl: z.string().optional(),
  }).partial().optional(),
  experience: z.array(cvExperienceSchema.partial()).optional(),
  education: z.array(
    cvEducationSchema.extend({
      year: z.union([z.string(), z.number()]).optional(),
    }).partial()
  ).optional(),
  skills: z.array(cvSkillGroupSchema.partial()).optional(),
  coverLetter: z.string().optional(),
})
 
export type LlmCvResponse = z.infer<typeof llmCvResponseSchema>
 
export const manualCvInputSchema = z.object({
  fullName: z.string().optional(),
  headline: z.string().optional(),
  summary: z.string().optional(),
  photoUrl: z.string().optional(),
  searchPeriod: z.string().optional(),
  interests: z.array(z.string()).optional(),
  contact: cvContactSchema.optional(),
  experience: z.array(cvExperienceSchema).optional(),
  education: z.array(cvEducationSchema).optional(),
  skills: z.array(cvSkillGroupSchema).optional(),
})
 
export type ManualCvInput = z.infer<typeof manualCvInputSchema>
 