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

function normalizeCoverLetterEnding(
  text: string,
  fullName: string,
  locale: 'fr' | 'en',
): string {
  const name =
    fullName.trim() ||
    (locale === 'fr' ? 'Prénom Nom' : 'First Last Name')
  const closingPhrase =
    locale === 'fr'
      ? /^(cordialement|sincères salutations|bien à vous|je vous prie)/i
      : /^(sincerely|kind regards|best regards|yours faithfully|yours sincerely)/i

  const parts = text
    .trim()
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  while (parts.length > 0) {
    const last = parts[parts.length - 1]!
    const firstLine = (last.split('\n')[0] ?? '').trim()
    if (!firstLine) {
      parts.pop()
      continue
    }
    if (firstLine.replace(/[.,]/g, '').trim().toLowerCase() === name.toLowerCase()) {
      parts.pop()
      continue
    }
    if (closingPhrase.test(firstLine)) {
      parts.pop()
      continue
    }
    break
  }

  const body = parts.join('\n\n').trim()
  const closing = locale === 'fr' ? 'Cordialement,' : 'Sincerely,'
  if (!body) {
    return `${closing}\n\n${name}`
  }
  return `${body}\n\n${closing}\n\n${name}`
}

function defaultCoverLetterBodyOnly(kit: CvKit, locale: 'fr' | 'en'): string {
  const { profile, experience } = kit
  const company =
    experience[0]?.company ??
    (locale === 'fr' ? 'votre structure' : 'your organization')

  const summaryRaw = profile.summary.trim()
  const summaryShort =
    summaryRaw.length > 420 ? `${summaryRaw.slice(0, 420).trim()}…` : summaryRaw

  if (locale === 'fr') {
    return [
      'Madame, Monsieur,',
      '',
      `Je vous adresse ma candidature pour un poste en lien avec « ${profile.headline} », au sein de ${company}. Mon parcours m’a permis de développer des compétences opérationnelles, mobilisables dès la prise de poste.`,
      '',
      summaryShort ||
        'Je suis convaincu·e que mon profil correspond aux attentes de votre organisation.',
      '',
      'Rigoureux·se, impliqué·e et orienté·e résultats, je souhaite mettre mes compétences au service de vos objectifs. Je serais ravi·e d’échanger sur la manière dont je peux contribuer à vos projets.',
      '',
      'Je vous remercie pour l’attention portée à ma candidature, et je reste à votre disposition pour un entretien.',
    ].join('\n')
  }
  return [
    'Dear Hiring Manager,',
    '',
    `I am writing to apply for a role aligned with "${profile.headline}" at ${company}. My background has prepared me to contribute with a strong sense of ownership, clarity, and execution.`,
    '',
    summaryShort ||
      'I am confident that my skills and attitude are a good match for your team.',
    '',
    'I would welcome the opportunity to discuss how my experience can support your priorities and help deliver tangible results.',
    '',
    'Thank you for your time and consideration; I remain available for an interview at your convenience.',
  ].join('\n')
}

export function defaultCoverLetter(kit: CvKit, locale: 'fr' | 'en'): string {
  return normalizeCoverLetterEnding(
    defaultCoverLetterBodyOnly(kit, locale),
    kit.profile.fullName,
    locale,
  )
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
      manual?.interests ||
      partial.profile?.interests ||
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

  const rawCover =
    (typeof partial.coverLetter === 'string' && partial.coverLetter.trim()
      ? partial.coverLetter.trim()
      : null) ?? defaultCoverLetterBodyOnly(cvKit, args.locale)

  const coverLetter = normalizeCoverLetterEnding(
    rawCover,
    profile.fullName,
    args.locale,
  )

  return {
    version: 1,
    cvKit,
    coverLetter,
    source: args.source,
    lastPrompt: args.lastPrompt,
    locale: args.locale,
  }
}
