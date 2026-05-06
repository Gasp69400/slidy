'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { Plus, Sparkles, FileText, ArrowRight, Contact } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSiteLocale } from '@/lib/site-locale'

type DocType =
  | 'PRESENTATION'
  | 'WHITEBOARD'
  | 'DOCUMENT'
  | 'NOTES'
  | 'VISUAL_PAGE'
  | 'MARKETING_PRESENTATION'
  | 'CV_COVER'

type Doc = {
  id: string
  title: string
  topic: string
  type: DocType
  status: 'DRAFT' | 'GENERATING' | 'READY' | 'FAILED'
  _count?: { blocks: number }
  createdAt: string
  deleteVia: 'cv' | 'documents'
}

export default function StudioPage() {
  const { t } = useSiteLocale()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [topic, setTopic] = useState('')
  const [title, setTitle] = useState('')
  const [type, setType] = useState<DocType>('PRESENTATION')
  const [detailLevel, setDetailLevel] = useState<'short' | 'medium' | 'detailed'>('medium')
  const [error, setError] = useState('')

  const typeLabels = useMemo(
    (): Record<DocType, string> => ({
      PRESENTATION: t('studio.type.presentation'),
      WHITEBOARD: t('studio.type.whiteboard'),
      DOCUMENT: t('studio.type.document'),
      NOTES: t('studio.type.notes'),
      VISUAL_PAGE: t('studio.type.visual_page'),
      MARKETING_PRESENTATION: t('studio.type.marketing'),
      CV_COVER: t('studio.type.cv_cover'),
    }),
    [t],
  )

  const detailLabels = useMemo(
    () => ({
      short: t('studio.detail_short'),
      medium: t('studio.detail_medium'),
      detailed: t('studio.detail_detailed'),
    }),
    [t],
  )

  const { data: docsData, isLoading } = useQuery({
    queryKey: ['studio-documents-list'],
    queryFn: async () => {
      const [prismaRes, cvRes] = await Promise.all([
        fetch('/api/documents', { credentials: 'include' }),
        fetch('/api/cv', { credentials: 'include' }),
      ])
      const prismaJson = prismaRes.ok
        ? ((await prismaRes.json()) as { success: boolean; data: Doc[] })
        : { success: true, data: [] as Doc[] }
      const cvJson = cvRes.ok
        ? ((await cvRes.json()) as { success: boolean; data: Doc[] })
        : { success: true, data: [] as Doc[] }
      const prismaDocsRaw = prismaJson.data ?? []
      const cvDocsRaw = cvJson.data ?? []
      const cvDocs: Doc[] = cvDocsRaw.map((d) => ({
        ...d,
        deleteVia: 'cv' as const,
      }))
      const prismaDocs: Doc[] = prismaDocsRaw.map((d) => ({
        ...d,
        deleteVia: 'documents' as const,
      }))
      const merged: Doc[] = [...cvDocs, ...prismaDocs].sort((a, b) => {
        const ta = new Date(a.createdAt).getTime()
        const tb = new Date(b.createdAt).getTime()
        return tb - ta
      })
      return { success: true, data: merged }
    },
  })

  const { data: capsData } = useQuery({
    queryKey: ['capabilities'],
    queryFn: async () => {
      const res = await fetch('/api/me/capabilities', {
        credentials: 'include',
      })
      if (!res.ok) {
        return {
          success: true,
          data: {
            plan: 'STARTER' as const,
            maxDocumentsPerDay: 10,
            allowedDocumentTypes: [
              'PRESENTATION',
              'DOCUMENT',
              'NOTES',
              'CV_COVER',
            ] as DocType[],
            exportFormats: ['pdf', 'pptx', 'json'] as const,
          },
        }
      }
      return res.json() as Promise<{
        success: boolean
        data: {
          plan: 'STARTER' | 'PRO' | 'ULTIMATE'
          maxDocumentsPerDay: number
          allowedDocumentTypes: DocType[]
          exportFormats: Array<'pdf' | 'pptx' | 'json'>
        }
      }>
    },
  })

  const createMutation = useMutation({
    mutationFn: async () => {
      setError('')
      const res = await fetch('/api/generation/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: topic,
          topic,
          title: title || undefined,
          type,
          detailLevel,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Unable to generate')
      return json as { success: boolean; data: { documentId: string } }
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['studio-documents-list'] })
      await queryClient.invalidateQueries({ queryKey: ['documents'] })
      router.push(`/studio/${data.data.documentId}`)
    },
    onError: (e: unknown) => {
      setError(
        e instanceof Error ? e.message : t('studio.err_generic'),
      )
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (input: {
      id: string
      deleteVia: 'cv' | 'documents'
    }) => {
      const url =
        input.deleteVia === 'cv'
          ? `/api/cv/${input.id}`
          : `/api/documents/${input.id}`
      const res = await fetch(url, { method: 'DELETE', credentials: 'include' })
      const json = (await res.json()) as { success?: boolean; error?: string }
      if (!res.ok || !json.success) {
        throw new Error(json.error ?? 'delete failed')
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['studio-documents-list'] })
    },
  })

  const confirmAndDelete = (doc: Doc) => {
    if (!window.confirm(t('studio.doc_delete_confirm'))) return
    deleteMutation.mutate(
      { id: doc.id, deleteVia: doc.deleteVia },
      {
        onError: () => {
          window.alert(t('studio.doc_delete_error'))
        },
      },
    )
  }

  const docs = docsData?.data ?? []
  const caps = capsData?.data

  const defaultAllowedTypes = useMemo(
    (): DocType[] => ['PRESENTATION', 'DOCUMENT', 'NOTES', 'CV_COVER'],
    [],
  )
  const allowedTypes = caps?.allowedDocumentTypes ?? defaultAllowedTypes

  const canCv = useMemo(
    () => allowedTypes.includes('CV_COVER'),
    [allowedTypes],
  )

  const disabledType = useMemo(
    () => !allowedTypes.includes(type),
    [allowedTypes, type],
  )

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 lg:grid-cols-[360px_1fr]">
        {canCv && (
          <Link
            href="/studio/cv"
            className="lg:col-span-2 flex items-center justify-between gap-4 rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-white p-4 shadow-sm transition hover:border-indigo-200 dark:border-indigo-900/40 dark:from-indigo-950/50 dark:to-slate-900"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                <Contact className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-50">
                  {t('studio.cv_card_title')}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {t('studio.cv_card_sub')}
                </p>
              </div>
            </div>
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
              {t('studio.cv_card_cta')} →
            </span>
          </Link>
        )}
        <Card className="h-fit rounded-3xl border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <p className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-medium text-indigo-700">
              <Sparkles className="h-3.5 w-3.5" />
              {t('studio.badge')}
            </p>
            <h1 className="mt-3 text-xl font-semibold text-slate-900">
              {t('studio.new_title')}
            </h1>
            <p className="mt-1 text-xs text-slate-500">{t('studio.new_sub')}</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                {t('studio.label_topic')}
              </label>
              <Input
                placeholder={t('studio.ph_topic')}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="rounded-xl border-slate-200"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                {t('studio.label_title')}
              </label>
              <Input
                placeholder={t('studio.ph_title')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-xl border-slate-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  {t('studio.label_type')}
                </label>
                <Select value={type} onValueChange={(v) => setType(v as DocType)}>
                  <SelectTrigger className="rounded-xl border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      [
                        'PRESENTATION',
                        'WHITEBOARD',
                        'DOCUMENT',
                        'NOTES',
                        'VISUAL_PAGE',
                        'MARKETING_PRESENTATION',
                      ] as DocType[]
                    ).map((docType) => (
                      <SelectItem key={docType} value={docType}>
                        {typeLabels[docType]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  {t('studio.label_detail')}
                </label>
                <Select
                  value={detailLevel}
                  onValueChange={(v) =>
                    setDetailLevel(v as 'short' | 'medium' | 'detailed')
                  }
                >
                  <SelectTrigger className="rounded-xl border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">{detailLabels.short}</SelectItem>
                    <SelectItem value="medium">{detailLabels.medium}</SelectItem>
                    <SelectItem value="detailed">{detailLabels.detailed}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {caps && (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600">
                <p className="font-medium text-slate-800">
                  {t('studio.plan_line', {
                    plan: caps.plan,
                    max: caps.maxDocumentsPerDay,
                  })}
                </p>
                <p className="mt-1">
                  {t('studio.exports')}: {caps.exportFormats.join(', ').toUpperCase()}
                </p>
              </div>
            )}

            {disabledType && (
              <p className="text-xs text-amber-600">{t('studio.plan_blocked')}</p>
            )}
            {error && <p className="text-xs text-red-500">{error}</p>}

            <Button
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700"
              disabled={!topic.trim() || createMutation.isPending || disabledType}
              onClick={() => createMutation.mutate()}
            >
              <Plus className="mr-2 h-4 w-4" />
              {createMutation.isPending
                ? t('studio.btn_generating')
                : t('studio.btn_open')}
            </Button>
          </div>
        </Card>

        <Card className="rounded-3xl border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                {t('studio.docs_title')}
              </h2>
              <p className="text-xs text-slate-500">{t('studio.docs_sub')}</p>
            </div>
          </div>

          {isLoading ? (
            <p className="text-sm text-slate-500">{t('studio.loading')}</p>
          ) : docs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
              <FileText className="mx-auto mb-2 h-6 w-6 text-slate-300" />
              <p className="text-sm text-slate-500">{t('studio.empty')}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {docs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-stretch gap-2 rounded-2xl border border-slate-100 bg-slate-50 transition hover:border-slate-200 hover:bg-white"
                >
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-center justify-between px-4 py-3 text-left"
                    onClick={() =>
                      router.push(
                        doc.type === 'CV_COVER'
                          ? `/studio/cv/${doc.id}`
                          : `/studio/${doc.id}`,
                      )
                    }
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {doc.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {typeLabels[doc.type]} · {doc._count?.blocks ?? 0}{' '}
                        {t('studio.blocks')}
                      </p>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 pl-2 text-xs text-slate-500">
                      {t('studio.open')}{' '}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </button>
                  <div className="flex shrink-0 items-center border-l border-slate-100 pr-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-xl border-red-200 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
                      disabled={deleteMutation.isPending}
                      onClick={() => confirmAndDelete(doc)}
                    >
                      {t('studio.doc_delete')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
