export type FinanceCvInput = {
  targetRole: string
  fullName: string
  contactLine: string
  education: string
  experience: string
  skills: string
  certifications: string
}

export function buildFinancePrompt(
  fields: FinanceCvInput,
  locale: 'fr' | 'en',
): string {
  const L =
    locale === 'fr' ?
      {
        role: 'Poste visé',
        identity: 'Identité & coordonnées',
        education: 'Formation',
        experience: 'Expériences professionnelles',
        skills: 'Compétences & outils',
        certs: 'Certifications & langues',
      }
    : {
        role: 'Target role',
        identity: 'Identity & contact',
        education: 'Education',
        experience: 'Professional experience',
        skills: 'Skills & tools',
        certs: 'Certifications & languages',
      }

  const identity = [fields.fullName.trim(), fields.contactLine.trim()]
    .filter(Boolean)
    .join('\n')

  return [
    fields.targetRole.trim() && `${L.role}:\n${fields.targetRole.trim()}`,
    identity && `${L.identity}:\n${identity}`,
    fields.education.trim() && `${L.education}:\n${fields.education.trim()}`,
    fields.experience.trim() &&
      `${L.experience}:\n${fields.experience.trim()}`,
    fields.skills.trim() && `${L.skills}:\n${fields.skills.trim()}`,
    fields.certifications.trim() &&
      `${L.certs}:\n${fields.certifications.trim()}`,
  ]
    .filter(Boolean)
    .join('\n\n')
}

export function hasMinFinanceInput(fields: FinanceCvInput): boolean {
  if (!fields.targetRole.trim()) return false
  const body =
    fields.education.trim().length +
    fields.experience.trim().length +
    fields.skills.trim().length
  return body >= 24
}
