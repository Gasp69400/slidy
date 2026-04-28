import 'server-only'

import {
  getGroqClient,
  isGroqApiConfigured,
  resolveGroqChatModel,
} from '@/lib/server-chat-llm'

const MAX_PROMPT_CHARS = 48_000

export { isGroqApiConfigured as isPresentationLlmConfigured }

function stripJsonFence(text: string): string {
  const t = text.trim()
  const fence = t.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i)
  if (fence) return fence[1].trim()
  return t
}

/**
 * Génère le JSON d’une présentation via Groq (côté serveur, `GROQ_API_KEY`).
 * Modèle : `GROQ_MODEL` dans l’environnement (sinon défaut projet). Clé : `GROQ_API_KEY` via `@/lib/server-chat-llm`.
 */
export async function generatePresentationFromPrompt(args: {
  prompt: string
  responseJsonSchema?: unknown
}): Promise<unknown> {
  const client = getGroqClient()
  const model = resolveGroqChatModel()

  const prompt = args.prompt.trim()
  if (!prompt) {
    throw new Error('prompt is empty')
  }
  if (prompt.length > MAX_PROMPT_CHARS) {
    throw new Error(`prompt exceeds ${MAX_PROMPT_CHARS} characters`)
  }

  const schemaBlock =
    args.responseJsonSchema !== undefined && args.responseJsonSchema !== null
      ? `\n\nRespond with a single JSON object only (no markdown). It MUST satisfy this JSON Schema:\n${JSON.stringify(args.responseJsonSchema, null, 2)}`
      : '\n\nRespond with JSON: {"title":"string","slides":[{"title":"string","content":["..."],"visual":"string","slide_type":"string","imageUrl":""}]}'

  const completion = await client.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content:
          'You are an expert presentation author. Output exactly one JSON object: keys "title" (string) and "slides" (array). Each slide: "title" (string), "content" (array of bullet strings), "visual" (short string, may be empty), "slide_type" (short label), "imageUrl" (optional string — full URL of a user-provided image when the slide should display that photo; omit or empty if none). No markdown fences, no text before or after the JSON.',
      },
      {
        role: 'user',
        content: `${prompt}${schemaBlock}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.65,
    max_tokens: 8192,
  })

  const raw = completion.choices[0]?.message?.content?.trim()
  if (!raw) {
    throw new Error('Réponse Groq vide')
  }

  const cleaned = stripJsonFence(raw)
  try {
    return JSON.parse(cleaned) as unknown
  } catch {
    throw new Error('JSON invalide (Groq)')
  }
}
