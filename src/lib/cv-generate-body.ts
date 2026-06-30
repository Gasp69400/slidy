import { z } from 'zod'

import {
  CV_TEMPLATE_SLUGS,
  cvDesignOptionsSchema,
  manualCvInputSchema,
} from '@/lib/cv-schema'

function splitInterests(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    const items = value.map((s) => String(s).trim()).filter(Boolean)
    return items.length ? items : undefined
  }
  if (typeof value === 'string') {
    const items = value
      .split(/[\n,;]+/)
      .map((s) => s.trim())
      .filter(Boolean)
    return items.length ? items : undefined
  }
  return undefined
}

/** Nettoie le corps JSON client avant validation Zod. */
export function normalizeCvGeneratePayload(raw: unknown): unknown {
  if (typeof raw !== 'object' || raw === null) return raw
  const body = { ...(raw as Record<string, unknown>) }

  if (typeof body.manual === 'object' && body.manual !== null) {
    const manual = { ...(body.manual as Record<string, unknown>) }
    if ('interests' in manual) {
      manual.interests = splitInterests(manual.interests)
    }
    if (Array.isArray(manual.experience)) {
      manual.experience = manual.experience
        .map((row) => {
          if (typeof row !== 'object' || row === null) return null
          const r = row as Record<string, unknown>
          const role = String(r.role ?? '').trim()
          const company = String(r.company ?? '').trim()
          if (!role || !company) return null
          const period = String(r.period ?? '').trim() || '—'
          const bullets = Array.isArray(r.bullets)
            ? r.bullets.map((b) => String(b).trim()).filter(Boolean)
            : []
          return { role, company, period, bullets }
        })
        .filter(Boolean)
      if (!(manual.experience as unknown[]).length) {
        delete manual.experience
      }
    }
    body.manual = manual
  }

  return body
}

export const cvGenerateBodySchema = z
  .object({
    mode: z.enum(['prompt', 'manual']),
    userPrompt: z.string().optional(),
    manual: manualCvInputSchema.optional(),
    skillsText: z.string().optional(),
    jobDescription: z.string().optional(),
    templateSlug: z.enum(CV_TEMPLATE_SLUGS).optional(),
    fontFamily: cvDesignOptionsSchema.shape.fontFamily.optional(),
    layoutDensity: cvDesignOptionsSchema.shape.layoutDensity.optional(),
    accentHex: cvDesignOptionsSchema.shape.accentHex.optional(),
    locale: z.enum(['fr', 'en']).default('fr'),
    sector: z.enum(['general', 'finance']).optional().default('general'),
    title: z.string().min(1).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.mode === 'prompt') {
      const p = data.userPrompt?.trim() ?? ''
      const minLen = data.sector === 'finance' ? 8 : 12
      if (p.length < minLen) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'userPrompt_min',
          path: ['userPrompt'],
        })
      }
    }
    if (data.mode === 'manual') {
      const m = data.manual
      const skillsOk = Boolean(data.skillsText?.trim())
      const ok =
        Boolean(m?.fullName?.trim()) ||
        Boolean(m?.headline?.trim()) ||
        Boolean(m?.summary?.trim()) ||
        Boolean((m?.experience?.length ?? 0) > 0) ||
        Boolean((m?.education?.length ?? 0) > 0) ||
        skillsOk ||
        Boolean(m?.contact?.email?.trim()) ||
        Boolean(m?.contact?.phone?.trim()) ||
        Boolean(m?.contact?.location?.trim()) ||
        Boolean(m?.photoUrl?.trim()) ||
        Boolean((m?.interests?.length ?? 0) > 0) ||
        Boolean(data.jobDescription?.trim())
      if (!ok) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'manual_min',
          path: ['manual'],
        })
      }
    }
  })

const ERROR_MESSAGES_FR: Record<string, string> = {
  userPrompt_min:
    'Décrivez votre profil ou le poste visé (au moins une phrase complète).',
  manual_min:
    'Renseignez au moins un champ : nom, résumé, expérience, formation, compétences, contact ou photo.',
}

const ERROR_MESSAGES_EN: Record<string, string> = {
  userPrompt_min:
    'Describe your profile or target role (at least one full sentence).',
  manual_min:
    'Fill in at least one field: name, summary, experience, education, skills, contact, or photo.',
}

export function cvGenerateValidationMessage(
  issues: z.ZodIssue[],
  locale: 'fr' | 'en' = 'fr',
): string {
  const table = locale === 'en' ? ERROR_MESSAGES_EN : ERROR_MESSAGES_FR
  for (const issue of issues) {
    if (typeof issue.message === 'string' && table[issue.message]) {
      return table[issue.message]
    }
  }
  return locale === 'en'
    ? 'Some fields are invalid. Check the form and try again.'
    : 'Certains champs sont invalides. Vérifiez le formulaire et réessayez.'
}

export function parseCvGenerateBody(raw: unknown) {
  const normalized = normalizeCvGeneratePayload(raw)
  return cvGenerateBodySchema.safeParse(normalized)
}
