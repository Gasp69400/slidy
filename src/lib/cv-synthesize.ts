import type { CvDocumentMetadata, CvKit, ManualCvInput } from '@/lib/cv-schema'
import {
  cvEducationSchema,
  cvExperienceSchema,
  cvKitSchema,
  cvProfileSchema,
  cvSkillGroupSchema,
  llmCvResponseSchema,
  type LlmCvResponse,
} from '@/lib/cv-schema'

function normalizeExperiences(
  manual: ManualCvInput | undefined,
  partial: LlmCvResponse,
): CvKit['experience'] {
  const fromManual = manual?.experience ?? []
  if (fromManual.length) {
    return fromManual.map((e) =>
      cvExperienceSchema.parse({ ...e, bullets: e.bullets ?? [] }),
    )
  }
  const rows = partial.experience ?? []
  return rows
    .map((e) =>
      cvExperienceSchema.safeParse({
        role: e.role ?? '',
        company: e.company ?? '',
        period: e.period ?? '',
        bullets: e.bullets ?? [],
      }),
    )
    .filter((r) => r.success)
    .map((r) => r.data)
    .filter((e) => e.role && e.company)
}

function normalizeEducation(
  manual: ManualCvInput | undefined,
  partial: LlmCvResponse,
): CvKit['education'] {
  const fromManual = manual?.education ?? []
  if (fromManual.length) {
    return fromManual.map((e) => cvEducationSchema.parse(e))
  }
  return (partial.education ?? [])
    .map((e) =>
      cvEducationSchema.safeParse({
        degree: e.degree ?? '',
        school: e.school ?? '',
        year: e.year,
      }),
    )
    .filter((r) => r.success)
    .map((r) => r.data)
    .filter((e) => e.degree && e.school)
}

function normalizeSkills(
  manual: ManualCvInput | undefined,
  partial: LlmCvResponse,
  skillsText: string | undefined,
  locale: 'fr' | 'en',
): CvKit['skills'] {
  const fromManual = manual?.skills ?? []
  if (fromManual.length) {
    return fromManual.map((g) => cvSkillGroupSchema.parse(g))
  }
  const fromLlm = (partial.skills ?? [])
    .map((g) =>
      cvSkillGroupSchema.safeParse({
        name: g.name ?? (locale === 'fr' ? 'Compétences' : 'Skills'),
        items: g.items ?? [],
      }),
    )
    .filter((r) => r.success)
    .map((r) => r.data)
    .filter((g) => g.items.length)
  if (fromLlm.length) return fromLlm

  if (skillsText?.trim()) {
    const items = skillsText
      .split(/[\n,;]+/)
      .map((s) => s.trim())
      .filter(Boolean)
    if (items.length) {
      return [
        cvSkillGroupSchema.parse({
          name: locale === 'fr' ? 'Compétences' : 'Skills',
          items,
        }),
      ]
    }
  }

  return [
    cvSkillGroupSchema.parse({
      name: locale === 'fr' ? 'Compétences' : 'Skills',
      items: [locale === 'fr' ? 'À compléter' : 'To be completed'],
    }),
  ]
}

export function defaultCoverLetter(kit: CvKit, locale: 'fr' | 'en'): string {
  const { profile, experience } = kit
  const company =
    experience[0]?.company ??
    (locale === 'fr' ? 'votre structure' : 'your organization')
  if (locale === 'fr') {
    return `Madame, Monsieur,\n\nJe vous adresse ma candidature pour un poste en lien avec "${profile.headline}" au sein de ${company}. Mon parcours m'a permis de développer des compétences opérationnelles directement mobilisables.\n\n${profile.summary.slice(0, 420)}${profile.summary.length > 420 ? '…' : ''}\n\nRigoureux(se), impliqué(e) et orienté(e) résultats, je souhaite mettre mes compétences au service de vos objectifs et contribuer concrètement à la réussite de vos projets.\n\nJe vous remercie de l'attention portée à ma candidature et me tiens à votre disposition pour un entretien.\n\nJe vous prie d’agréer, Madame, Monsieur, mes salutations distinguées.\n${profile.fullName}`
  }
  return `Dear Hiring Manager,\n\nI am writing to apply for a role aligned with "${profile.headline}" at ${company}. My background has prepared me to contribute quickly with a strong sense of ownership and execution.\n\n${profile.summary.slice(0, 420)}${profile.summary.length > 420 ? '…' : ''}\n\nI am confident my profile can bring immediate value to your team and support your operational and strategic priorities.\n\nThank you for your time and consideration. I would welcome the opportunity to discuss my application further.\n\nSincerely,\n${profile.fullName}`
}

export function mergeToCvMetadata(args: {
  llm: LlmCvResponse | null
  manual: ManualCvInput | undefined
  skillsText?: string
  locale: 'fr' | 'en'
  source: CvDocumentMetadata['source']
  lastPrompt?: string
}): CvDocumentMetadata {
  const partial = args.llm ?? llmCvResponseSchema.parse({})
  const manual = args.manual

  const profileMerged = {
    fullName:
      manual?.fullName ??
      partial.profile?.fullName ??
      (args.locale === 'fr' ? 'Candidat·e' : 'Candidate'),
    headline:
      manual?.headline ??
      partial.profile?.headline ??
      (args.locale === 'fr' ? 'Profil professionnel' : 'Professional profile'),
    summary:
      manual?.summary ??
      partial.profile?.summary ??
      (args.locale === 'fr'
        ? 'Résumé professionnel à personnaliser selon votre parcours.'
        : 'Professional summary — customize to reflect your experience.'),
    photoUrl:
      manual?.photoUrl?.trim() ||
      partial.profile?.photoUrl?.trim() ||
      undefined,
    searchPeriod:
      manual?.searchPeriod?.trim() ||
      partial.profile?.searchPeriod?.trim() ||
      undefined,
    interests:
      manual?.interests?.trim() ||
      partial.profile?.interests?.trim() ||
      undefined,
    contact: {
      ...partial.profile?.contact,
      ...manual?.contact,
    },
  }

  const profile = cvProfileSchema.parse(profileMerged)

  const cvKit = cvKitSchema.parse({
    profile,
    experience: normalizeExperiences(manual, partial),
    education: normalizeEducation(manual, partial),
    skills: normalizeSkills(manual, partial, args.skillsText, args.locale),
  })

  const coverLetter =
    (typeof partial.coverLetter === 'string' && partial.coverLetter.trim()
      ? partial.coverLetter.trim()
      : null) ?? defaultCoverLetter(cvKit, args.locale)

  return {
    version: 1,
    cvKit,
    coverLetter,
    source: args.source,
    lastPrompt: args.lastPrompt,
    locale: args.locale,
  }
}
