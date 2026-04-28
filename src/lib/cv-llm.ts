import 'server-only'

import { llmCvResponseSchema, type LlmCvResponse } from '@/lib/cv-schema'
import {
  getGroqClient,
  isGroqApiConfigured,
  resolveGroqChatModel,
} from '@/lib/server-chat-llm'

export { isGroqApiConfigured as isCvLlmConfigured }

const ATS_CONTENT_RULES_FR = `
Optimisation ATS (parsing par les logiciels de recrutement) :
- Résumé professionnel (profile.summary) : 3–5 phrases maximum, ton humain et précis. Intégrer des mots-clés métiers du contexte et, si fournie, de l’offre, sans bourrage ni répétitions artificielles. Éviter les formules génériques type « passionné », « dynamique », « polyvalent » sans preuve.
- Intitulés de postes (experience.role) : standards et reconnaissables (comme sur l’offre si pertinent). Entreprise réelle ou cohérente. Dates (period) au format mois/année en toutes lettres ou abrégées cohérentes, ex. « janv. 2022 – déc. 2024 » ou « January 2022 – December 2024 ».
- Puces : commencer par un verbe d’action fort ; inclure des résultats chiffrés quand c’est crédible (%, montants, volumes, délais). Pas de puces vagues.
- skills : exactement 2 groupes dont les noms EN ANGLAIS (pour compatibilité ATS) : premier groupe nommé exactement « Hard Skills », second exactement « Soft Skills ». Les items restent dans la langue du CV (fr ou en selon locale).
- Lettre (coverLetter) : ton naturel et professionnel ; réutiliser quelques mots-clés pertinents de l’offre si fournie ; une idée par paragraphe ; aucune tournure type « En tant qu’IA » ou liste de qualificatifs vides.`

const ATS_CONTENT_RULES_EN = `
ATS optimization:
- Professional summary (profile.summary): 3–5 tight sentences, human and specific. Weave industry and role keywords from context and from the job posting when provided—naturally, no stuffing or awkward repetition. Avoid empty claims (« passionate», «team player») without evidence.
- Job titles (experience.role): standard, recognizable titles (align with the posting when appropriate). Dates (period) in Month Year – Month Year form, e.g. January 2022 – December 2024.
- Bullets: lead with strong action verbs; include metrics where credible (%, revenue, volume, time saved). No vague bullets.
- skills: exactly 2 groups with names exactly « Hard Skills » and « Soft Skills » (these exact English labels). Items in English for English locale.
- Cover letter: natural professional tone; mirror key terminology from the job posting when provided; one idea per paragraph; no generic AI filler or buzzword stacking.`

export async function generateCvWithGroq(args: {
  mode: 'prompt' | 'manual'
  userPrompt?: string
  manualContext: string
  locale: 'fr' | 'en'
  /** Texte de l’offre : extraction de mots-clés et alignement des intitulés */
  jobDescription?: string
}): Promise<LlmCvResponse> {
  const client = getGroqClient()
  const model = resolveGroqChatModel()

  const jobBlock =
    args.jobDescription?.trim() ?
      args.jobDescription.trim().slice(0, 24_000)
    : ''

  const system =
    args.locale === 'fr' ?
      `Tu es un consultant carrière senior spécialisé en CV et lettres compatibles ATS.
Tu produis UN SEUL objet JSON valide (pas de markdown, pas de texte hors JSON).

Structure JSON obligatoire :
- profile: { fullName, headline (titre de poste cible, clair et aligné sur le marché), summary, searchPeriod?, interests?, contact?: { email?, phone?, location?, linkedin? } }
- experience: tableau de { role, company, period, bullets: string[] } — au moins 1 entrée crédible si le contexte le permet
- education: tableau de { degree, school, year? }
- skills: tableau d’EXACTEMENT 2 objets { name, items: string[] } avec name égal à « Hard Skills » puis « Soft Skills » (libellés en anglais, items en français)
- coverLetter: string — lettre en français, 3 à 5 paragraphes

${ATS_CONTENT_RULES_FR}

Si une offre d’emploi est fournie : identifier les exigences et mots-clés importants ; les intégrer dans summary, bullets et skills sans sur-optimisation ni répétition lourde ; utiliser l’intitulé de poste de l’offre pour headline si cohérent avec le candidat.`
    : `You are a senior career coach focused on ATS-friendly CVs and cover letters.
Output exactly ONE valid JSON object (no markdown, no text outside JSON).

Required JSON shape:
- profile: { fullName, headline (clear target job title), summary, searchPeriod?, interests?, contact?: { email?, phone?, location?, linkedin? } }
- experience: array of { role, company, period, bullets: string[] }
- education: array of { degree, school, year? }
- skills: array of EXACTLY TWO { name, items: string[] } with name exactly « Hard Skills » then « Soft Skills »
- coverLetter: string — 3–5 paragraphs, professional English

${ATS_CONTENT_RULES_EN}

When a job posting is provided: extract relevant requirements and keywords; weave them into summary, bullets, and skills naturally; use the posting’s job title for headline when it fits the candidate’s level.`

  const userContent = [
    args.mode === 'prompt' ?
      `Primary user request:\n${args.userPrompt ?? ''}`
    : `Structured user profile (JSON or notes):\n${args.manualContext || '{}'}`,
    '',
    jobBlock ?
      `Job posting / description (use for keyword alignment; do not invent experience):\n${jobBlock}`
    : 'Job posting: (none — infer keywords only from user context.)',
  ].join('\n')

  const completion = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: userContent },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
    max_tokens: 8192,
  })

  const raw = completion.choices[0]?.message?.content
  if (!raw?.trim()) throw new Error('Réponse Groq vide')

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error('JSON Groq invalide')
  }

  const safe = llmCvResponseSchema.safeParse(parsed)
  if (!safe.success) {
    throw new Error('Schéma CV LLM invalide')
  }
  return safe.data
}

export function manualToContextString(m: Record<string, unknown>): string {
  try {
    return JSON.stringify(m, null, 2)
  } catch {
    return String(m)
  }
}
