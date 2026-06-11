'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Sparkles, FileText, Contact } from 'lucide-react'

import {
  StudioDocRow,
  StudioEmptyState,
  StudioField,
  StudioHeader,
  StudioPanel,
  StudioQuickLink,
  StudioShell,
  studioInputClass,
  studioSelectTriggerClass,
} from '@/components/studio/studio-ui'
import { Button } from '@/components/ui/button'
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
            maxDocuments: 5,
            documentQuotaPeriod: 'month' as const,
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
          maxDocuments: number
          documentQuotaPeriod: 'day' | 'month'
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
    <StudioShell>
        <StudioHeader
          icon={Sparkles}
          badge={t('studio.badge')}
          title={t('studio.new_title')}
          subtitle={t('studio.new_sub')}
        />

        {canCv ? (
          <div className="mb-6">
            <StudioQuickLink
              href="/studio/cv"
              icon={Contact}
              title={t('studio.cv_card_title')}
              subtitle={t('studio.cv_card_sub')}
              cta={t('studio.cv_card_cta')}
            />
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr] lg:items-start">
          <StudioPanel
            step={1}
            title={t('studio.new_title')}
            description={t('studio.new_sub')}
            className="z-0 lg:sticky lg:top-20 lg:self-start"
          >
            <div className="space-y-4">
              <StudioField label={t('studio.label_topic')}>
                <Input
                  placeholder={t('studio.ph_topic')}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className={studioInputClass}
                />
              </StudioField>

              <StudioField label={t('studio.label_title')}>
                <Input
                  placeholder={t('studio.ph_title')}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={studioInputClass}
                />
              </StudioField>

              <div className="grid grid-cols-2 gap-3">
                <StudioField label={t('studio.label_type')}>
                  <Select value={type} onValueChange={(v) => setType(v as DocType)}>
                    <SelectTrigger className={studioSelectTriggerClass}>
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
                </StudioField>

                <StudioField label={t('studio.label_detail')}>
                  <Select
                    value={detailLevel}
                    onValueChange={(v) =>
                      setDetailLevel(v as 'short' | 'medium' | 'detailed')
                    }
                  >
                    <SelectTrigger className={studioSelectTriggerClass}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">{detailLabels.short}</SelectItem>
                      <SelectItem value="medium">{detailLabels.medium}</SelectItem>
                      <SelectItem value="detailed">{detailLabels.detailed}</SelectItem>
                    </SelectContent>
                  </Select>
                </StudioField>
              </div>

              {caps ? (
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {t('studio.plan_line', {
                      plan: caps.plan,
                      max: caps.maxDocuments,
                      period: t(
                        caps.documentQuotaPeriod === 'month'
                          ? 'studio.quota_period.month'
                          : 'studio.quota_period.day',
                      ),
                    })}
                  </p>
                  <p className="mt-1">
                    {t('studio.exports')}:{' '}
                    {caps.exportFormats.join(', ').toUpperCase()}
                  </p>
                </div>
              ) : null}

              {disabledType ? (
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  {t('studio.plan_blocked')}
                </p>
              ) : null}
              {error ? (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300">
                  {error}
                </p>
              ) : null}

              <Button
                className="h-11 w-full rounded-xl bg-brand-500 shadow-lg shadow-brand-500/25 hover:bg-brand-600"
                disabled={!topic.trim() || createMutation.isPending || disabledType}
                onClick={() => createMutation.mutate()}
              >
                <Plus className="mr-2 h-4 w-4" />
                {createMutation.isPending
                  ? t('studio.btn_generating')
                  : t('studio.btn_open')}
              </Button>
            </div>
          </StudioPanel>

          <StudioPanel
            step={2}
            title={t('studio.docs_title')}
            description={t('studio.docs_sub')}
          >
            {isLoading ? (
              <p className="text-sm text-slate-500">{t('studio.loading')}</p>
            ) : docs.length === 0 ? (
              <StudioEmptyState icon={FileText} message={t('studio.empty')} />
            ) : (
              <div className="space-y-2">
                {docs.map((doc) => (
                  <StudioDocRow
                    key={doc.id}
                    title={doc.title}
                    meta={`${typeLabels[doc.type]} · ${doc._count?.blocks ?? 0} ${t('studio.blocks')}`}
                    openLabel={t('studio.open')}
                    deleteLabel={t('studio.doc_delete')}
                    deleting={deleteMutation.isPending}
                    onOpen={() =>
                      router.push(
                        doc.type === 'CV_COVER'
                          ? `/studio/cv/${doc.id}`
                          : `/studio/${doc.id}`,
                      )
                    }
                    onDelete={() => confirmAndDelete(doc)}
                  />
                ))}
              </div>
            )}
          </StudioPanel>
        </div>
      </StudioShell>
  )
}
