'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { ImagePlus, Sparkles, X } from 'lucide-react'

import type { PresentationAudience } from '@/api/client-types'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import TemplateSelector from '@/components/presentation/create/TemplateSelector'
import GenerationProgress from '@/components/presentation/create/GenerationProgress'
import FontSelector from '@/components/presentation/create/FontSelector'
import { useSiteLocale } from '@/lib/site-locale'
import type { SiteLocale } from '@/lib/site-messages'
import { normalizePresentationTemplateSlug } from '@/lib/presentation-template-themes'

const NARRATIVE_EN: Record<string, string[]> = {
  educational: [
    'Title Slide',
    'Learning Objectives',
    'Background & Context',
    'Core Concept',
    'Explanation',
    'Examples & Applications',
    'Key Takeaways',
    'Summary & Review',
  ],
  persuasive: [
    'Title Slide',
    'The Problem',
    'Why It Matters',
    'Our Solution',
    'Evidence & Proof',
    'How It Works',
    'Benefits',
    'Call to Action',
  ],
  analytical: [
    'Title Slide',
    'Executive Summary',
    'Context & Background',
    'Data Analysis',
    'Key Findings',
    'Implications',
    'Recommendations',
    'Conclusion',
  ],
  professional: [
    'Title Slide',
    'Overview',
    'Situation Analysis',
    'Strategic Framework',
    'Core Insights',
    'Action Plan',
    'Timeline & Milestones',
    'Summary',
  ],
}

const NARRATIVE_FR: Record<string, string[]> = {
  educational: [
    'Diapositive titre',
    'Objectifs d’apprentissage',
    'Contexte et arrière-plan',
    'Concept central',
    'Explication',
    'Exemples et applications',
    'Points clés',
    'Synthèse et récapitulatif',
  ],
  persuasive: [
    'Diapositive titre',
    'Le problème',
    'Pourquoi c’est important',
    'Notre solution',
    'Preuves et éléments de conviction',
    'Comment ça fonctionne',
    'Bénéfices',
    'Appel à l’action',
  ],
  analytical: [
    'Diapositive titre',
    'Synthèse exécutive',
    'Contexte et arrière-plan',
    'Analyse des données',
    'Constats clés',
    'Implications',
    'Recommandations',
    'Conclusion',
  ],
  professional: [
    'Diapositive titre',
    'Vue d’ensemble',
    'Analyse de la situation',
    'Cadre stratégique',
    'Insights clés',
    'Plan d’action',
    'Calendrier et jalons',
    'Synthèse',
  ],
}

function detailInstructionsForPrompt(
  locale: SiteLocale,
  detail: string,
): string {
  const en = {
    short:
      '2-3 concise bullet points per slide, laser-focused on the key idea',
    medium:
      '3-4 bullet points per slide with supporting context',
    detailed:
      '4-5 bullet points per slide with explanations, data, and nuance',
  }
  const fr = {
    short:
      '2 à 3 puces concises par slide, centrées sur l’idée clé',
    medium: '3 à 4 puces par slide avec du contexte d’appui',
    detailed:
      '4 à 5 puces par slide avec explications, données et nuances',
  }
  const map = locale === 'fr' ? fr : en
  return (
    map[detail as keyof typeof map] ??
    map.medium
  )
}

const MAX_ATTACHED_PHOTOS = 10

type AttachedPhoto = {
  id: string
  url: string
  uploading: boolean
  error?: string
}

function mergeUserPhotosIntoSlides(
  slides: unknown[],
  photoUrls: string[],
): unknown[] {
  if (!Array.isArray(slides) || !photoUrls.length) return slides
  const urlSet = new Set(photoUrls)
  const used = new Set<string>()
  for (const raw of slides) {
    if (raw && typeof raw === 'object') {
      const u = (raw as Record<string, unknown>).imageUrl
      if (typeof u === 'string') {
        const trimmed = u.trim()
        if (trimmed && urlSet.has(trimmed)) used.add(trimmed)
      }
    }
  }
  const remaining = photoUrls.filter((u) => !used.has(u))
  let idx = 0
  return slides.map((raw) => {
    if (!raw || typeof raw !== 'object') return raw
    const o: Record<string, unknown> = {
      ...(raw as Record<string, unknown>),
    }
    const has =
      typeof o.imageUrl === 'string' && o.imageUrl.trim().length > 0
    if (!has && idx < remaining.length) {
      o.imageUrl = remaining[idx]
      idx += 1
    }
    return o
  })
}

export default function CreatePresentationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const { t, locale } = useSiteLocale()
  const [generating, setGenerating] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)
  const [attachedPhotos, setAttachedPhotos] = useState<AttachedPhoto[]>([])
  const photoInputRef = useRef<HTMLInputElement>(null)

  type FormState = {
    topic: string
    audience: PresentationAudience
    tone: string
    detail: string
    slideCount: number
    template: string
    fontPair: string
    options: {
      charts: boolean
      diagrams: boolean
      examples: boolean
      stats: boolean
    }
  }

  const [form, setForm] = useState<FormState>({
    topic: '',
    audience: 'professionals',
    tone: 'professional',
    detail: 'medium',
    slideCount: 10,
    template: 'modern',
    fontPair: 'inter',
    options: {
      charts: false,
      diagrams: false,
      examples: true,
      stats: false,
    },
  })

  useEffect(() => {
    const tpl = searchParams.get('template')
    if (!tpl) return
    const normalized = normalizePresentationTemplateSlug(tpl)
    setForm((f) =>
      f.template === normalized ? f : { ...f, template: normalized },
    )
  }, [searchParams])

  const narrativeStructures = useMemo(
    () => (locale === 'fr' ? NARRATIVE_FR : NARRATIVE_EN),
    [locale],
  )

  const audiences = useMemo(
    () =>
      (['students', 'professors', 'professionals', 'executives'] as const).map(
        (value) => ({
          value,
          label: t(`create.audience.${value}`),
        }),
      ),
    [t],
  )

  const tones = useMemo(
    () =>
      (
        [
          'educational',
          'persuasive',
          'analytical',
          'professional',
        ] as const
      ).map((value) => ({
        value,
        label: t(`create.tone.${value}`),
      })),
    [t],
  )

  const detailLevels = useMemo(
    () =>
      (['short', 'medium', 'detailed'] as const).map((value) => ({
        value,
        title: t(`create.detail.${value}.title`),
        desc: t(`create.detail.${value}.desc`),
      })),
    [t],
  )

  const optionItems = useMemo(
    () =>
      (['charts', 'diagrams', 'examples', 'stats'] as const).map((key) => ({
        key,
        label: t(`create.option.${key}`),
      })),
    [t],
  )

  const set = <K extends keyof FormState>(field: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const toggleOption = (key: string) =>
    setForm((prev) => ({
      ...prev,
      options: { ...prev.options, [key]: !prev.options[key as keyof typeof prev.options] },
    }))

  const addPresentationPhotos = async (fileList: FileList | null) => {
    if (!fileList?.length) return
    for (const file of Array.from(fileList)) {
      let added = false
      const id = crypto.randomUUID()
      setAttachedPhotos((prev) => {
        if (prev.length >= MAX_ATTACHED_PHOTOS) return prev
        added = true
        return [...prev, { id, url: '', uploading: true }]
      })
      if (!added) break

      try {
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch('/api/media/upload', {
          method: 'POST',
          body: fd,
          credentials: 'include',
        })
        const json = (await res.json()) as {
          success?: boolean
          data?: { storageUrl: string }
          error?: string
        }
        if (!res.ok || !json.success || !json.data?.storageUrl) {
          setAttachedPhotos((prev) =>
            prev.map((p) =>
              p.id === id
                ? {
                    ...p,
                    uploading: false,
                    error: json.error ?? t('create.photos_error'),
                  }
                : p,
            ),
          )
          continue
        }
        const rel = json.data.storageUrl
        const abs =
          typeof window !== 'undefined'
            ? `${window.location.origin}${rel}`
            : rel
        setAttachedPhotos((prev) =>
          prev.map((p) =>
            p.id === id ? { id, url: abs, uploading: false } : p,
          ),
        )
      } catch {
        setAttachedPhotos((prev) =>
          prev.map((p) =>
            p.id === id
              ? { ...p, uploading: false, error: t('create.photos_error') }
              : p,
          ),
        )
      }
    }
    if (photoInputRef.current) photoInputRef.current.value = ''
  }

  const removePresentationPhoto = (id: string) => {
    setAttachedPhotos((prev) => prev.filter((p) => p.id !== id))
  }

  const parseJsonResponse = async (res: Response): Promise<unknown> => {
    const text = await res.text()
    if (!text.trim()) return {}
    try {
      return JSON.parse(text) as unknown
    } catch {
      throw new Error(`Réponse invalide (${res.status})`)
    }
  }

  const readApiErrorMessage = (body: unknown, status: number): string => {
    if (body && typeof body === 'object') {
      const o = body as Record<string, unknown>
      const err = o.error ?? o.message
      if (typeof err === 'string' && err.trim()) return err.trim()
    }
    return `Erreur ${status}`
  }

  const photosStillUploading = attachedPhotos.some((p) => p.uploading)

  const handleGenerate = async () => {
    setGenerateError(null)
    if (!form.topic.trim()) {
      setGenerateError(t('create.topic_required'))
      return
    }

    setGenerating(true)

    const enabledOptions = Object.entries(form.options)
      .filter(([, v]) => v)
      .map(([k]) => k)

    const structure =
      narrativeStructures[form.tone] ?? narrativeStructures.professional

    const detailInstructions = detailInstructionsForPrompt(locale, form.detail)

    const outputLanguage =
      locale === 'fr'
        ? 'French — all slide titles, bullet points, and the deck title must be in French.'
        : 'English — all slide titles, bullet points, and the deck title must be in English.'

    const seniorExpert =
      form.tone === 'analytical'
        ? 'consultant'
        : form.tone === 'persuasive'
          ? 'salesperson'
          : 'professional'

    const readyPhotoUrls = attachedPhotos
      .filter((p) => p.url && !p.uploading && !p.error)
      .map((p) => p.url)

    const photoPromptBlock =
      readyPhotoUrls.length > 0 ?
        `

USER-ATTACHED IMAGES (${readyPhotoUrls.length}) — use only where they strengthen the slide (product, team, venue, portrait, etc.). Copy each URL EXACTLY into that slide's "imageUrl" field. At most one distinct listed image per slide; omit "imageUrl" or use "" when no photo fits.
${readyPhotoUrls.map((u, i) => `${i + 1}. ${u}`).join('\n')}
`
      : ''

    const prompt = `You are an expert presentation designer. Create a professional ${form.tone} presentation about: "${form.topic}"

OUTPUT LANGUAGE: ${outputLanguage}

TARGET AUDIENCE: ${form.audience}
TONE: ${form.tone}
DETAIL LEVEL: ${form.detail}
NUMBER OF SLIDES: ${form.slideCount}
${enabledOptions.length > 0 ? `INCLUDE WHERE APPROPRIATE: ${enabledOptions.join(', ')}` : ''}

NARRATIVE STRUCTURE — Follow this storytelling arc (adapt to fit ${form.slideCount} slides):
${structure
  .slice(0, Math.min(structure.length, form.slideCount))
  .map((s, i) => `${i + 1}. ${s}`)
  .join('\n')}

CONTENT RULES:
- ${detailInstructions}
- Be SPECIFIC and INSIGHTFUL — avoid generic filler content
- Every slide must advance the narrative logically
- Bullet points should be crisp, factual, and actionable
- Tailor language complexity for ${form.audience}
- The presentation should feel like it was written by a senior ${seniorExpert}

For each slide, provide a "visual" field describing an optional visual element (chart type, diagram, icon set, or image concept — keep it brief).
${photoPromptBlock}
IMPORTANT: Generate EXACTLY ${form.slideCount} slides. Return the full presentation title and all slides.`

    try {
      const llmRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        cache: 'no-store',
        body: JSON.stringify({
          prompt,
          response_json_schema: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              slides: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    content: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                    visual: { type: 'string' },
                    slide_type: { type: 'string' },
                    imageUrl: {
                      type: 'string',
                      description:
                        'Optional. Full URL from USER-ATTACHED IMAGES list, copied exactly, or empty string.',
                    },
                  },
                },
              },
            },
          },
        }),
      })

      const llmBodyUnknown = await parseJsonResponse(llmRes)
      const llmJson = llmBodyUnknown as {
        success?: boolean
        error?: string
        data?: unknown
      }
      if (!llmRes.ok || !llmJson.success || llmJson.data == null) {
        throw new Error(readApiErrorMessage(llmBodyUnknown, llmRes.status))
      }

      const result = llmJson.data as {
        title?: unknown
        slides?: unknown
      }
      let slidesOut: unknown[] = Array.isArray(result.slides) ? result.slides : []
      if (slidesOut.length === 0) {
        throw new Error(t('create.generate_no_slides'))
      }
      if (readyPhotoUrls.length > 0 && slidesOut.length > 0) {
        slidesOut = mergeUserPhotosIntoSlides(slidesOut, readyPhotoUrls)
      }

      const titleRaw = result.title
      const deckTitle =
        typeof titleRaw === 'string' && titleRaw.trim().length > 0
          ? titleRaw.trim()
          : form.topic.trim().slice(0, 200)
      const presentationType =
        form.tone === 'educational'
          ? 'educational'
          : form.tone === 'persuasive'
            ? 'persuasive'
            : 'informative'

      const createRes = await fetch('/api/presentations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: deckTitle,
          topic: form.topic,
          audience: form.audience,
          presentation_type: presentationType,
          template: form.template,
          slide_count: slidesOut.length || form.slideCount,
          slides_json: JSON.stringify(slidesOut),
          status: 'completed',
          options: JSON.stringify({
            ...form.options,
            tone: form.tone,
            detail: form.detail,
            fontPair: form.fontPair,
          }),
        }),
      })

      const createBodyUnknown = await parseJsonResponse(createRes)
      const createJson = createBodyUnknown as {
        success?: boolean
        error?: string
        data?: { id?: string }
      }
      if (!createRes.ok || !createJson.success || !createJson.data?.id) {
        throw new Error(readApiErrorMessage(createBodyUnknown, createRes.status))
      }

      const presentationId = createJson.data.id

      queryClient.invalidateQueries({ queryKey: ['presentations'] })
      router.push(`/Presentation?id=${presentationId}`)
    } catch (error) {
      console.error('Generate presentation failed:', error)
      const message =
        error instanceof Error ? error.message : t('create.photos_error')
      setGenerateError(message)
      setGenerating(false)
    }
  }

  if (generating) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <GenerationProgress />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('create.title')}
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          {t('create.subtitle')}
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t('create.topic')}
          </Label>
          <Textarea
            placeholder={t('create.topic_ph')}
            value={form.topic}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              set('topic', e.target.value)
            }
            className="h-24 resize-none rounded-xl border-slate-200 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t('create.photos')}
          </Label>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('create.photos_hint')}</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            {t('create.photos_limit', { max: MAX_ATTACHED_PHOTOS })}
          </p>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(e) => addPresentationPhotos(e.target.files)}
          />
          <Button
            type="button"
            variant="outline"
            className="gap-2 rounded-xl border-slate-200 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            onClick={() => photoInputRef.current?.click()}
            disabled={attachedPhotos.length >= MAX_ATTACHED_PHOTOS}
          >
            <ImagePlus className="h-4 w-4" />
            {t('create.photos_add')}
          </Button>
          {attachedPhotos.length > 0 ? (
            <div className="flex flex-wrap gap-3 pt-2">
              {attachedPhotos.map((p) => (
                <div
                  key={p.id}
                  className="relative h-20 w-20 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-800"
                >
                  {p.url && !p.uploading ? (
                    <img
                      src={p.url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center p-1 text-center text-[10px] text-slate-500 dark:text-slate-400">
                      {p.uploading ?
                        t('create.photos_uploading')
                      : p.error ?? '—'}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removePresentationPhoto(p.id)}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/75 text-white hover:bg-slate-900"
                    aria-label={t('create.photos_remove')}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {t('create.audience')}
            </Label>
            <Select
              value={form.audience}
              onValueChange={(v) => set('audience', v as PresentationAudience)}
            >
              <SelectTrigger className="rounded-xl border-slate-200 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {audiences.map((a) => (
                  <SelectItem key={a.value} value={a.value}>
                    {a.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {t('create.tone')}
            </Label>
            <Select
              value={form.tone}
              onValueChange={(v) => set('tone', v)}
            >
              <SelectTrigger className="rounded-xl border-slate-200 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tones.map((toneRow) => (
                  <SelectItem key={toneRow.value} value={toneRow.value}>
                    {toneRow.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t('create.detail')}
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {detailLevels.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => set('detail', d.value)}
                className={`rounded-xl border p-3.5 text-left transition-all ${
                  form.detail === d.value
                    ? 'border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-200'
                    : 'border-slate-100 text-slate-600 hover:border-slate-200 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="text-sm font-semibold capitalize">
                  {d.title}
                </div>
                <div className="text-[11px] opacity-60 mt-0.5 leading-tight">
                  {d.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {t('create.slides')}
            </Label>
            <span className="rounded-lg bg-indigo-50 px-3 py-1 text-sm font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
              {form.slideCount}
            </span>
          </div>
          <Slider
            value={[form.slideCount]}
            onValueChange={([v]: number[]) => set('slideCount', v)}
            min={1}
            max={20}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500">
            <span>{t('create.slides_min')}</span>
            <span>{t('create.slides_max')}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t('create.enhance')}
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {optionItems.map((opt) => (
              <label
                key={opt.key}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-all ${
                  form.options[opt.key as keyof typeof form.options]
                    ? 'border-indigo-200 bg-indigo-50/50 dark:border-indigo-800 dark:bg-indigo-950/30'
                    : 'border-slate-100 hover:border-slate-200 dark:border-slate-700 dark:hover:border-slate-600'
                }`}
              >
                <Checkbox
                  checked={
                    form.options[opt.key as keyof typeof form.options]
                  }
                  onCheckedChange={() => toggleOption(opt.key)}
                />
                <span className="text-sm text-slate-700 dark:text-slate-200">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <FontSelector
          selected={form.fontPair}
          onSelect={(id) => set('fontPair', id)}
        />

        <div className="space-y-3">
          <div>
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {t('create.template')}
            </Label>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {t('create.template_preview_hint')}
            </p>
          </div>
          <TemplateSelector
            selected={form.template}
            onSelect={(slug) => set('template', slug)}
          />
        </div>

        <Button
          type="button"
          onClick={() => void handleGenerate()}
          disabled={!form.topic.trim() || generating}
          className="h-14 w-full gap-2 rounded-xl bg-indigo-600 text-base shadow-lg shadow-indigo-200 dark:shadow-indigo-950/40 hover:bg-indigo-700"
        >
          <Sparkles className="w-5 h-5" />
          {t('create.generate')}
        </Button>
        {!form.topic.trim() ? (
          <p className="-mt-2 text-center text-xs text-amber-800 dark:text-amber-200">
            {t('create.disabled_need_topic')}
          </p>
        ) : null}
        {photosStillUploading ? (
          <p className="-mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
            {t('create.photos_uploading_hint')}
          </p>
        ) : null}
        {generateError ? (
          <p
            role="alert"
            className="-mt-2 px-1 text-center text-sm text-red-600 dark:text-red-400"
          >
            {generateError}
          </p>
        ) : null}
        <p className="-mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
          {t('create.generate_note')}
        </p>
      </div>
    </div>
  )
}
