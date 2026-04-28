'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd'
import {
  ArrowLeft,
  Crown,
  Download,
  Eye,
  GripVertical,
  Image as ImageIcon,
  Lock,
  Palette,
  Plus,
  Sparkles,
  TextCursorInput,
  Type,
  Heading,
  List,
  Trash2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { SiteStrKey } from '@/lib/site-messages'
import { useSiteLocale } from '@/lib/site-locale'
import { cn } from '@/lib/utils'

type BlockType =
  | 'TITLE'
  | 'HEADING'
  | 'TEXT'
  | 'BULLETS'
  | 'IMAGE'
  | 'CHART'
  | 'QUOTE'
  | 'CTA'
  | 'DIVIDER'

type DocBlock = {
  id: string
  blockType: BlockType
  position: number
  contentJson: Record<string, any>
  styleJson?: Record<string, any> | null
}

type Doc = {
  id: string
  title: string
  topic: string
  type: string
  designOptions?: Record<string, any> | null
  blocks: DocBlock[]
}

export default function StudioEditorPage() {
  const { t } = useSiteLocale()
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const blockRefs = useRef<Map<string, HTMLDivElement | null>>(new Map())
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [design, setDesign] = useState({
    fontFamily: 'Aptos',
    colorPalette: 'indigo',
    density: 'comfortable',
    layoutStyle: 'balanced',
  })
  const [blockStyle, setBlockStyle] = useState({
    align: 'left',
    emphasis: 'normal',
    spacing: 'normal',
  })
  const [error, setError] = useState('')

  const id = params.id

  const blockPalette = useMemo(
    (): Array<{ type: BlockType; label: string; icon: JSX.Element }> => [
      { type: 'TITLE', label: t('editor.block.title'), icon: <Type className="h-4 w-4" /> },
      {
        type: 'HEADING',
        label: t('editor.block.heading'),
        icon: <Heading className="h-4 w-4" />,
      },
      {
        type: 'TEXT',
        label: t('editor.block.text'),
        icon: <TextCursorInput className="h-4 w-4" />,
      },
      {
        type: 'BULLETS',
        label: t('editor.block.bullets'),
        icon: <List className="h-4 w-4" />,
      },
      {
        type: 'IMAGE',
        label: t('editor.block.image'),
        icon: <ImageIcon className="h-4 w-4" />,
      },
    ],
    [t],
  )

  const { data: docData, isLoading } = useQuery({
    queryKey: ['document', id],
    queryFn: async () => {
      const res = await fetch(`/api/documents/${id}`)
      if (!res.ok) throw new Error('Failed to load document')
      return res.json() as Promise<{ success: boolean; data: Doc }>
    },
  })

  const { data: capsData } = useQuery({
    queryKey: ['capabilities'],
    queryFn: async () => {
      const res = await fetch('/api/me/capabilities')
      if (!res.ok) throw new Error('Failed to load capabilities')
      return res.json() as Promise<{
        success: boolean
        data: {
          plan: 'STARTER' | 'PRO' | 'TEAM'
          maxBlocksPerDocument: number
          exportFormats: Array<'pdf' | 'pptx' | 'json'>
        }
      }>
    },
  })

  const document = docData?.data

  useEffect(() => {
    if (!document?.designOptions) return
    setDesign((prev) => ({
      ...prev,
      fontFamily: document.designOptions?.fontFamily ?? prev.fontFamily,
      colorPalette: document.designOptions?.colorPalette ?? prev.colorPalette,
      density: document.designOptions?.density ?? prev.density,
      layoutStyle: document.designOptions?.layoutStyle ?? prev.layoutStyle,
    }))
  }, [document?.designOptions])

  const blocks = useMemo(
    () => [...(document?.blocks ?? [])].sort((a, b) => a.position - b.position),
    [document?.blocks],
  )

  const slides = useMemo(() => groupBlocksIntoSlides(blocks), [blocks])

  useEffect(() => {
    if (!selectedBlockId) return
    const idx = slides.findIndex((slide) => slide.some((b) => b.id === selectedBlockId))
    if (idx >= 0) setActiveSlideIndex(idx)
  }, [selectedBlockId, slides])

  useEffect(() => {
    if (slides.length === 0) {
      setActiveSlideIndex(0)
      return
    }
    setActiveSlideIndex((i) => Math.min(i, slides.length - 1))
  }, [slides.length])
  const selectedBlock = useMemo(
    () => blocks.find((b) => b.id === selectedBlockId) ?? null,
    [blocks, selectedBlockId],
  )

  useEffect(() => {
    if (!selectedBlock) return
    setBlockStyle({
      align: selectedBlock.styleJson?.align ?? 'left',
      emphasis: selectedBlock.styleJson?.emphasis ?? 'normal',
      spacing: selectedBlock.styleJson?.spacing ?? 'normal',
    })
  }, [selectedBlock])

  const addBlock = useMutation({
    mutationFn: async (type: BlockType) => {
      const defaults: Record<BlockType, Record<string, any>> = {
        TITLE: { title: 'Untitled section', subtitle: 'Add context' },
        HEADING: { text: 'New heading' },
        TEXT: {
          text: 'Write your content here. Keep it simple, direct and visual.',
        },
        BULLETS: {
          items: ['First key point', 'Second key point', 'Third key point'],
        },
        IMAGE: { url: '', alt: 'Visual', caption: 'Add image URL or upload' },
        CHART: { text: 'Chart placeholder' },
        QUOTE: { text: 'Quote placeholder' },
        CTA: { text: 'Call to action' },
        DIVIDER: { text: '---' },
      }

      const res = await fetch(`/api/documents/${id}/blocks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockType: type,
          contentJson: defaults[type],
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Unable to add block')
      return json
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['document', id] })
    },
    onError: (e: any) => setError(e.message),
  })

  const updateBlock = useMutation({
    mutationFn: async ({
      blockId,
      contentJson,
      styleJson,
    }: {
      blockId: string
      contentJson: Record<string, any>
      styleJson?: Record<string, any> | null
    }) => {
      const res = await fetch(`/api/documents/${id}/blocks/${blockId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentJson, styleJson }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Unable to update block')
      return json
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['document', id] })
    },
    onError: (e: any) => setError(e.message),
  })

  const deleteBlock = useMutation({
    mutationFn: async (blockId: string) => {
      const res = await fetch(`/api/documents/${id}/blocks/${blockId}`, {
        method: 'DELETE',
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Unable to delete block')
      return json
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['document', id] })
    },
    onError: (e: any) => setError(e.message),
  })

  const reorderBlocks = useMutation({
    mutationFn: async (orderedBlockIds: string[]) => {
      const res = await fetch(`/api/documents/${id}/blocks/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedBlockIds }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Unable to reorder blocks')
      return json
    },
    onError: (e: any) => setError(e.message),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['document', id] })
    },
  })

  const uploadImage = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Upload failed')
      return json as {
        success: boolean
        data: { storageUrl: string; title?: string }
      }
    },
    onSuccess: async (asset) => {
      await addBlock.mutateAsync('IMAGE')
      const latest = await fetch(`/api/documents/${id}`)
      const latestJson = (await latest.json()) as { data: Doc }
      const imageBlock = [...latestJson.data.blocks]
        .sort((a, b) => b.position - a.position)
        .find((b) => b.blockType === 'IMAGE')
      if (!imageBlock) return
      await updateBlock.mutateAsync({
        blockId: imageBlock.id,
        contentJson: {
          url: asset.data.storageUrl,
          alt: asset.data.title ?? 'Uploaded image',
          caption: asset.data.title ?? 'Uploaded visual',
        },
      })
    },
    onError: (e: any) => setError(e.message),
  })

  const canAddBlock =
    blocks.length < (capsData?.data.maxBlocksPerDocument ?? 999)
  const hasPptx = (capsData?.data.exportFormats ?? []).includes('pptx')
  const plan = capsData?.data.plan ?? 'STARTER'

  const { data: mediaListData } = useQuery({
    queryKey: ['media', 'library'],
    queryFn: async () => {
      const res = await fetch('/api/media')
      if (!res.ok) throw new Error('Failed to load media library')
      return res.json() as Promise<{
        success: boolean
        data: Array<{
          id: string
          storageUrl: string
          thumbnailUrl?: string | null
          title?: string | null
          altText?: string | null
        }>
      }>
    },
  })

  const insertFromGallery = useMutation({
    mutationFn: async (asset: {
      storageUrl: string
      title?: string | null
      altText?: string | null
    }) => {
      const alt = asset.altText ?? asset.title ?? 'Image'
      const caption = asset.title ?? alt

      if (selectedBlock?.blockType === 'IMAGE') {
        await updateBlock.mutateAsync({
          blockId: selectedBlock.id,
          contentJson: {
            ...selectedBlock.contentJson,
            url: asset.storageUrl,
            alt,
            caption,
          },
        })
        return
      }

      if (!canAddBlock) {
        throw new Error(t('editor.err_limit'))
      }

      await addBlock.mutateAsync('IMAGE')
      const latest = await fetch(`/api/documents/${id}`)
      const latestJson = (await latest.json()) as { data: Doc }
      const imageBlock = [...latestJson.data.blocks]
        .sort((a, b) => b.position - a.position)
        .find((b) => b.blockType === 'IMAGE')
      if (!imageBlock) throw new Error(t('editor.err_image_block'))

      await updateBlock.mutateAsync({
        blockId: imageBlock.id,
        contentJson: {
          url: asset.storageUrl,
          alt,
          caption,
        },
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['document', id] })
    },
    onError: (e: unknown) =>
      setError(e instanceof Error ? e.message : t('editor.insert_failed')),
  })

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return
    const reordered = Array.from(blocks)
    const [removed] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, removed)
    await reorderBlocks.mutateAsync(reordered.map((b) => b.id))
  }

  const saveDesign = useMutation({
    mutationFn: async (payload: typeof design) => {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          designOptions: payload,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Unable to save style')
      return json
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['document', id] })
    },
    onError: (e: any) => setError(e.message),
  })

  const saveBlockStyle = useMutation({
    mutationFn: async () => {
      if (!selectedBlock) throw new Error('No block selected')
      return updateBlock.mutateAsync({
        blockId: selectedBlock.id,
        contentJson: selectedBlock.contentJson,
        styleJson: blockStyle,
      })
    },
    onError: (e: any) => setError(e.message),
  })

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-6">
      <div className="mx-auto grid max-w-[1380px] gap-4 px-4 xl:grid-cols-[280px_1fr_340px]">
        <aside className="space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start rounded-xl border-slate-200"
            onClick={() => router.push('/studio')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('editor.back')}
          </Button>

          <Card className="rounded-2xl border-slate-100 p-4">
            <p className="text-xs text-slate-500">{t('editor.document')}</p>
            <h1 className="mt-1 text-sm font-semibold text-slate-900">
              {document?.title ?? '...'}
            </h1>
            <p className="mt-1 text-xs text-slate-500">{document?.topic}</p>
          </Card>

          <Card className="rounded-2xl border-slate-100 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
              {t('editor.add_blocks')}
            </p>
            <div className="space-y-2">
              {blockPalette.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => addBlock.mutate(item.type)}
                  disabled={!canAddBlock || addBlock.isPending}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-left text-xs text-slate-700 transition hover:border-slate-200 hover:bg-white disabled:opacity-50"
                >
                  <span className="inline-flex items-center gap-2">
                    {item.icon}
                    {item.label}
                  </span>
                  <Plus className="h-3.5 w-3.5 text-slate-400" />
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              className="mt-3 w-full rounded-xl border-slate-200"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              {t('editor.upload_image')}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                uploadImage.mutate(file)
                e.currentTarget.value = ''
              }}
            />
          </Card>

          <Card className="rounded-2xl border-slate-100 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
              {t('editor.media_title')}
            </p>
            <p className="mb-3 text-xs text-slate-500">{t('editor.media_help')}</p>
            <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
              {!mediaListData ? (
                <p className="text-xs text-slate-500">{t('editor.loading_short')}</p>
              ) : mediaListData.data.length === 0 ? (
                <p className="text-xs text-slate-500">{t('editor.no_media')}</p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {mediaListData.data.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() =>
                        insertFromGallery.mutate({
                          storageUrl: m.storageUrl,
                          title: m.title,
                          altText: m.altText,
                        })
                      }
                      className="group relative aspect-square overflow-hidden rounded-xl border border-slate-100 bg-slate-100 text-left transition hover:border-indigo-200 hover:shadow-sm disabled:opacity-50"
                      disabled={insertFromGallery.isPending}
                      title={m.title ?? t('editor.media_alt')}
                    >
                      <img
                        src={m.thumbnailUrl ?? m.storageUrl}
                        alt={m.altText ?? m.title ?? t('editor.media_alt')}
                        className="h-full w-full object-cover transition group-hover:scale-[1.03]"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <Card className="rounded-2xl border-slate-100 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
              {t('editor.export')}
            </p>
            <div className="space-y-2">
              <ExportButton id={id} format="pdf" />
              {hasPptx && (
                <ExportButton id={id} format="pptx" />
              )}
              {!hasPptx && (
                <LockedFeature
                  title={t('editor.locked_pptx_title')}
                  description={t('editor.locked_pptx_desc')}
                />
              )}
            </div>
          </Card>
        </aside>

        <main>
          <Card className="rounded-3xl border-slate-100 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  {t('editor.block_editor')}
                </h2>
                <p className="text-xs text-slate-500">{t('editor.block_editor_sub')}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                {t('editor.blocks_count', { n: blocks.length })}
              </span>
            </div>

            {!isLoading && slides.length > 0 && (
              <div className="mb-4">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  {t('editor.slides')}
                </p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {slides.map((slide, slideIndex) => {
                    const first = slide[0]
                    const label = previewText(first, t)
                    const isActive = slideIndex === activeSlideIndex
                    return (
                      <button
                        key={`slide-${slideIndex}`}
                        type="button"
                        onClick={() => {
                          setActiveSlideIndex(slideIndex)
                          const targetId = slide[0]?.id
                          if (!targetId) return
                          setSelectedBlockId(targetId)
                          const el = blockRefs.current.get(targetId)
                          el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }}
                        className={cn(
                          'min-w-[112px] max-w-[140px] rounded-2xl border px-2 py-2 text-left transition',
                          isActive
                            ? 'border-indigo-300 bg-indigo-50'
                            : 'border-slate-100 bg-slate-50 hover:border-slate-200',
                        )}
                      >
                        <p className="text-[10px] font-semibold text-slate-500">
                          {t('editor.slide_label')} {slideIndex + 1}
                        </p>
                        <p className="mt-1 line-clamp-3 text-[11px] text-slate-700">
                          {label}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-400">
                          {t('editor.slide_blocks', { n: slide.length })}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {isLoading ? (
              <p className="text-sm text-slate-500">{t('editor.loading_editor')}</p>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="doc-blocks">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-2"
                    >
                      {blocks.map((block, index) => (
                        <Draggable
                          key={block.id}
                          draggableId={block.id}
                          index={index}
                        >
                          {(dragProvided, snapshot) => (
                            <div
                              ref={(node) => {
                                dragProvided.innerRef(node)
                                if (node) blockRefs.current.set(block.id, node)
                                else blockRefs.current.delete(block.id)
                              }}
                              {...dragProvided.draggableProps}
                              className={cn(
                                'rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 transition-all duration-200 hover:-translate-y-0.5',
                                snapshot.isDragging &&
                                  'border-indigo-300 bg-indigo-50 shadow-sm',
                                selectedBlockId === block.id &&
                                  'border-indigo-300 bg-white',
                                styleContainerClass(block.styleJson),
                              )}
                              onClick={() => setSelectedBlockId(block.id)}
                            >
                              <div className="mb-2 flex items-center justify-between">
                                <span
                                  {...dragProvided.dragHandleProps}
                                  className="inline-flex cursor-grab items-center gap-1 text-[11px] uppercase tracking-[0.11em] text-slate-400"
                                >
                                  <GripVertical className="h-3.5 w-3.5" />
                                  {block.blockType}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => deleteBlock.mutate(block.id)}
                                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <InlineEditor
                                block={block}
                                onSave={(contentJson) =>
                                  updateBlock.mutate({
                                    blockId: block.id,
                                    contentJson,
                                  })
                                }
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </Card>

          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
        </main>

        <aside className="space-y-4">
          <Card className="rounded-2xl border-slate-100 p-4">
            <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
              <Palette className="h-3.5 w-3.5" />
              {t('editor.design')}
            </p>
            <div className="space-y-3">
              <ControlRow
                label={t('editor.typography')}
                value={design.fontFamily}
                options={['Aptos', 'Inter', 'Poppins', 'Merriweather']}
                onChange={(v) =>
                  setDesign((p) => ({ ...p, fontFamily: v }))
                }
              />
              <ControlRow
                label={t('editor.palette')}
                value={design.colorPalette}
                options={['indigo', 'slate', 'emerald', 'rose']}
                onChange={(v) =>
                  setDesign((p) => ({ ...p, colorPalette: v }))
                }
              />
              <ControlRow
                label={t('editor.density')}
                value={design.density}
                options={['compact', 'comfortable', 'airy']}
                onChange={(v) => setDesign((p) => ({ ...p, density: v }))}
              />
              <ControlRow
                label={t('editor.layout')}
                value={design.layoutStyle}
                options={['balanced', 'minimal', 'bold']}
                onChange={(v) =>
                  setDesign((p) => ({ ...p, layoutStyle: v }))
                }
              />
              <Button
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700"
                onClick={() => saveDesign.mutate(design)}
                disabled={saveDesign.isPending}
              >
                {saveDesign.isPending ? t('editor.saving_style') : t('editor.apply_style')}
              </Button>
            </div>
          </Card>

          <Card className="rounded-2xl border-slate-100 p-4">
            <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
              <Type className="h-3.5 w-3.5" />
              {t('editor.block_style')}
            </p>
            {!selectedBlock ? (
              <p className="text-xs text-slate-500">{t('editor.select_block')}</p>
            ) : (
              <div className="space-y-3">
                <ControlRow
                  label={t('editor.alignment')}
                  value={blockStyle.align}
                  options={['left', 'center', 'right']}
                  onChange={(v) => setBlockStyle((p) => ({ ...p, align: v }))}
                />
                <ControlRow
                  label={t('editor.emphasis')}
                  value={blockStyle.emphasis}
                  options={['normal', 'strong']}
                  onChange={(v) =>
                    setBlockStyle((p) => ({ ...p, emphasis: v }))
                  }
                />
                <ControlRow
                  label={t('editor.spacing')}
                  value={blockStyle.spacing}
                  options={['tight', 'normal', 'relaxed']}
                  onChange={(v) =>
                    setBlockStyle((p) => ({ ...p, spacing: v }))
                  }
                />
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-slate-200"
                  onClick={() => saveBlockStyle.mutate()}
                  disabled={saveBlockStyle.isPending}
                >
                  {saveBlockStyle.isPending
                    ? t('editor.applying')
                    : t('editor.apply_block_style')}
                </Button>
              </div>
            )}
          </Card>

          <Card className="rounded-2xl border-slate-100 p-4">
            <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
              <Eye className="h-3.5 w-3.5" />
              {t('editor.live_preview')}
            </p>
            <LivePreview
              title={document?.title ?? t('editor.untitled')}
              topic={document?.topic ?? ''}
              blocks={blocks}
              design={design}
            />
          </Card>

          <Card className="rounded-2xl border-slate-100 p-4">
            <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
              <List className="h-3.5 w-3.5" />
              {t('editor.slide_grouping')}
            </p>
            <SlideGroupingPreview blocks={blocks} />
          </Card>

          {plan === 'STARTER' && (
            <Card className="rounded-2xl border-amber-200 bg-amber-50 p-4">
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                <Crown className="h-3.5 w-3.5" />
                {t('editor.plan_starter')}
              </p>
              <p className="mt-1 text-xs text-amber-800">{t('editor.plan_starter_desc')}</p>
              <Button
                variant="outline"
                className="mt-3 w-full rounded-xl border-amber-300 bg-white text-amber-800 hover:bg-amber-100"
              >
                {t('editor.upgrade')}
              </Button>
            </Card>
          )}
        </aside>
      </div>
    </div>
  )
}

function InlineEditor({
  block,
  onSave,
}: {
  block: DocBlock
  onSave: (contentJson: Record<string, any>) => void
}) {
  if (block.blockType === 'TITLE') {
    return (
      <div className="space-y-2">
        <Input
          defaultValue={block.contentJson.title ?? ''}
          onBlur={(e) =>
            onSave({
              ...block.contentJson,
              title: e.target.value,
            })
          }
          className="rounded-xl border-slate-200 bg-white text-sm font-semibold"
          placeholder="Section title"
        />
        <Input
          defaultValue={block.contentJson.subtitle ?? ''}
          onBlur={(e) =>
            onSave({
              ...block.contentJson,
              subtitle: e.target.value,
            })
          }
          className="rounded-xl border-slate-200 bg-white text-xs"
          placeholder="Subtitle"
        />
      </div>
    )
  }

  if (block.blockType === 'BULLETS') {
    const initial = Array.isArray(block.contentJson.items)
      ? block.contentJson.items.join('\n')
      : ''
    return (
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) =>
          onSave({
            ...block.contentJson,
            items: e.currentTarget.innerText
              .split('\n')
              .map((v) => v.trim())
              .filter(Boolean),
          })
        }
        className="min-h-[70px] whitespace-pre-wrap rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 outline-none"
      >
        {initial}
      </div>
    )
  }

  if (block.blockType === 'IMAGE') {
    return (
      <div className="space-y-2">
        <Input
          defaultValue={block.contentJson.url ?? ''}
          onBlur={(e) =>
            onSave({
              ...block.contentJson,
              url: e.target.value,
            })
          }
          className="rounded-xl border-slate-200 bg-white text-xs"
          placeholder="Image URL"
        />
        <Input
          defaultValue={block.contentJson.caption ?? ''}
          onBlur={(e) =>
            onSave({
              ...block.contentJson,
              caption: e.target.value,
            })
          }
          className="rounded-xl border-slate-200 bg-white text-xs"
          placeholder="Caption"
        />
      </div>
    )
  }

  const text = block.contentJson.text ?? ''
  return (
    <div
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) =>
        onSave({
          ...block.contentJson,
          text: e.currentTarget.innerText,
        })
      }
      className="min-h-[52px] whitespace-pre-wrap rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 outline-none"
    >
      {text}
    </div>
  )
}

function ExportButton({ id, format }: { id: string; format: 'pdf' | 'pptx' }) {
  const { t } = useSiteLocale()
  const label =
    format === 'pdf' ? t('editor.export_pdf') : t('editor.export_pptx')
  return (
    <a
      href={`/api/documents/${id}/export?format=${format}`}
      className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
    >
      <Download className="mr-2 h-3.5 w-3.5" />
      {label}
    </a>
  )
}

function ControlRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-medium text-slate-500">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition focus:border-indigo-300"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

function LivePreview({
  title,
  topic,
  blocks,
  design,
}: {
  title: string
  topic: string
  blocks: DocBlock[]
  design: {
    fontFamily: string
    colorPalette: string
    density: string
    layoutStyle: string
  }
}) {
  const { t } = useSiteLocale()
  const palette =
    design.colorPalette === 'emerald'
      ? 'from-emerald-500 to-teal-500'
      : design.colorPalette === 'rose'
      ? 'from-rose-500 to-pink-500'
      : design.colorPalette === 'slate'
      ? 'from-slate-600 to-slate-800'
      : 'from-indigo-500 to-sky-500'

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-2">
      <div
        className={cn(
          'rounded-xl bg-white p-4 transition-all',
          design.density === 'compact' && 'space-y-2',
          design.density === 'comfortable' && 'space-y-3',
          design.density === 'airy' && 'space-y-4',
        )}
        style={{ fontFamily: design.fontFamily }}
      >
        <div className={cn('rounded-lg bg-gradient-to-r p-3 text-white', palette)}>
          <p className="text-[11px] opacity-90">{topic || t('editor.topic_placeholder')}</p>
          <p className="text-sm font-semibold">{title}</p>
        </div>
        <div className="space-y-2">
          {blocks.slice(0, 4).map((b) => (
            <div key={b.id} className="rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-2">
              <p className="text-[10px] uppercase tracking-[0.11em] text-slate-400">
                {b.blockType}
              </p>
              <p className="line-clamp-2 text-xs text-slate-700">
                {previewText(b, t)}
              </p>
            </div>
          ))}
          {blocks.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-200 p-3 text-center text-xs text-slate-400">
              {t('editor.preview_empty')}
            </div>
          )}
        </div>
        <p className="inline-flex items-center gap-1 text-[10px] text-slate-400">
          <Sparkles className="h-3 w-3" />
          {t('editor.auto_layout')} {design.layoutStyle}
        </p>
      </div>
    </div>
  )
}

function SlideGroupingPreview({ blocks }: { blocks: DocBlock[] }) {
  const { t } = useSiteLocale()
  const slides = useMemo(() => groupBlocksIntoSlides(blocks), [blocks])

  if (slides.length === 0) {
    return (
      <p className="text-xs text-slate-500">{t('editor.slide_grouping_empty')}</p>
    )
  }

  return (
    <div className="space-y-2">
      {slides.map((slide, i) => (
        <div
          key={i}
          className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"
        >
          <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">
            {t('editor.slide_label')} {i + 1}
          </p>
          <p className="text-xs text-slate-700">
            {t('editor.slide_row', {
              n: slide.length,
              types: slide.map((b) => b.blockType).join(' / '),
            })}
          </p>
        </div>
      ))}
    </div>
  )
}

function groupBlocksIntoSlides(blocks: DocBlock[]): DocBlock[][] {
  const grouped: DocBlock[][] = []
  let current: DocBlock[] = []

  for (const block of blocks) {
    const shouldStartNew = block.blockType === 'TITLE' && current.length > 0
    if (shouldStartNew || current.length >= 4) {
      grouped.push(current)
      current = []
    }
    current.push(block)
  }

  if (current.length > 0) grouped.push(current)
  return grouped
}

type TranslateFn = (
  key: SiteStrKey,
  vars?: Record<string, string | number>,
) => string

function previewText(block: DocBlock, t: TranslateFn): string {
  if (block.blockType === 'TITLE') {
    return (
      block.contentJson.title ??
      block.contentJson.subtitle ??
      t('editor.fallback_title')
    )
  }
  if (block.blockType === 'BULLETS') {
    return Array.isArray(block.contentJson.items)
      ? block.contentJson.items.join(' • ')
      : t('editor.fallback_bullets')
  }
  if (block.blockType === 'IMAGE') {
    return block.contentJson.caption ?? block.contentJson.alt ?? t('editor.fallback_image')
  }
  return block.contentJson.text ?? t('editor.block.text')
}

function LockedFeature({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
      <p className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
        <Lock className="h-3.5 w-3.5" />
        {title}
      </p>
      <p className="mt-1 text-[11px] text-amber-800">{description}</p>
    </div>
  )
}

function styleContainerClass(styleJson?: Record<string, any> | null) {
  if (!styleJson) return ''
  const align =
    styleJson.align === 'center'
      ? 'text-center'
      : styleJson.align === 'right'
      ? 'text-right'
      : 'text-left'
  const emphasis = styleJson.emphasis === 'strong' ? 'font-medium' : ''
  const spacing =
    styleJson.spacing === 'tight'
      ? 'space-y-1'
      : styleJson.spacing === 'relaxed'
      ? 'space-y-3'
      : 'space-y-2'
  return `${align} ${emphasis} ${spacing}`
}

