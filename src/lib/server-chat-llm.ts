import 'server-only'

import path from 'path'

import { loadEnvConfig } from '@next/env'
import OpenAI from 'openai'

/** Groq : API Chat Completions compatible OpenAI. */
const GROQ_BASE_URL = 'https://api.groq.com/openai/v1'

export const DEFAULT_GROQ_MODEL = 'llama-3.3-70b-versatile'

const DEPRECATED_GROQ_MODELS = new Map<string, string>([
  ['llama3-70b-8192', DEFAULT_GROQ_MODEL],
  ['llama3-8b-8192', 'llama-3.1-8b-instant'],
])

let serverEnvLoaded = false

/**
 * Recharge `.env` / `.env.local` depuis la racine du projet (là où se trouve `package.json`
 * quand vous lancez `next dev`). Sans cet appel, certains contextes (workers, outils)
 * ne voient pas les variables chargées au boot.
 */
function ensureServerEnvLoaded(): void {
  if (serverEnvLoaded) return
  serverEnvLoaded = true
  try {
    loadEnvConfig(path.join(process.cwd()))
  } catch {
    /* ignore : CI / plateforme injecte déjà process.env */
  }
}

/** Normalise une valeur d’environnement (trim, guillemets, BOM). */
function normalizeEnvString(raw: string | undefined): string | undefined {
  if (typeof raw !== 'string') return undefined
  let v = raw.replace(/^\uFEFF/, '').trim()
  if (!v) return undefined
  if (
    (v.startsWith('"') && v.endsWith('"') && v.length >= 2) ||
    (v.startsWith("'") && v.endsWith("'") && v.length >= 2)
  ) {
    v = v.slice(1, -1).trim()
  }
  return v || undefined
}

/**
 * Lit la clé Groq uniquement côté serveur (jamais exposée au navigateur).
 * Essaie `GROQ_API_KEY` puis l’alias `GROQ_KEY`.
 */
function readGroqApiKeyFromEnv(): string | undefined {
  ensureServerEnvLoaded()
  for (const key of ['GROQ_API_KEY', 'GROQ_KEY'] as const) {
    const v = normalizeEnvString(process.env[key])
    if (v) return v
  }
  return undefined
}

function normalizeGroqModelId(id: string): string {
  const key = id.trim().toLowerCase()
  return DEPRECATED_GROQ_MODELS.get(key) ?? id.trim()
}

function readGroqModelFromEnv(): string | undefined {
  ensureServerEnvLoaded()
  return normalizeEnvString(process.env['GROQ_MODEL'])
}

/**
 * Résout le modèle Groq : **priorité absolue à `GROQ_MODEL` dans `.env.local`** (ou l’environnement),
 * puis éventuel hint serveur (id Groq), puis défaut.
 * CV, lettre de motivation et présentations doivent tous passer par cette fonction côté serveur.
 */
export function resolveGroqChatModel(requestedFromUi?: string): string {
  const envModel = readGroqModelFromEnv()
  if (envModel) return normalizeGroqModelId(envModel)

  const raw = (requestedFromUi ?? '').trim()
  const r = raw.toLowerCase()
  if (
    r.startsWith('llama') ||
    r.startsWith('mixtral') ||
    r.startsWith('gemma') ||
    r.startsWith('meta-llama') ||
    r.startsWith('openai/') ||
    r.includes('llama-') ||
    r.includes('mixtral-') ||
    r.includes('llama3')
  ) {
    return normalizeGroqModelId(raw)
  }
  return DEFAULT_GROQ_MODEL
}

/** Présence de la clé Groq (aucune base de données requise). */
export function isGroqApiConfigured(): boolean {
  return Boolean(readGroqApiKeyFromEnv())
}

/** Client OpenAI pointant sur l’API Groq. */
export function getGroqClient(): OpenAI {
  const groqKey = readGroqApiKeyFromEnv()
  if (!groqKey) {
    throw new Error(
      'Configurer GROQ_API_KEY dans .env.local (à la racine du projet), puis redémarrer `next dev` / `next start`.',
    )
  }
  return new OpenAI({ apiKey: groqKey, baseURL: GROQ_BASE_URL })
}
