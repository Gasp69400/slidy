'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import type { Presentation } from '@/api/client-types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  getSlideCardTheme,
  normalizePresentationTemplateSlug,
} from '@/lib/presentation-template-themes'

export default function PresentationDetailPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const enabled = useMemo(() => Boolean(id), [id])

  const { data, isLoading, isError } = useQuery({
    queryKey: ['presentation', id],
    queryFn: async () => {
      const res = await fetch(`/api/presentations/${id as string}`, {
        credentials: 'include',
      })
      const json = (await res.json()) as {
        success?: boolean
        data?: Presentation
        error?: string
      }
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error ?? 'Failed to load presentation')
      }
      return json.data
    },
    enabled,
  })

  if (!id) {
    return (
      <div className="p-6 lg:p-10">
        <p className="text-sm text-red-500">
          No presentation id provided.
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-6 lg:p-10">
        <p className="text-sm text-slate-500">
          Loading presentation…
        </p>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="p-6 lg:p-10">
        <p className="text-sm text-red-500">
          Impossible de charger cette présentation. Vérifiez votre session,
          la base de données et les routes API.
        </p>
      </div>
    )
  }

  const slides: Array<{
    title: string
    content: string[]
    visual?: string
    imageUrl?: string
  }> = (() => {
    try {
      return JSON.parse(data.slides_json ?? '[]')
    } catch {
      return []
    }
  })()

  const slideTheme = getSlideCardTheme(data.template)
  const templateLabel = normalizePresentationTemplateSlug(data.template)

  return (
    <div className="p-6 lg:p-10 max-w-5xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {data.title}
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl">
            {data.topic}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <Badge variant="outline" className="capitalize">
              {data.audience}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {data.presentation_type}
            </Badge>
            <span>{data.slide_count} slides</span>
            {data.template && (
              <span className="text-slate-400">
                Template: {templateLabel}
              </span>
            )}
          </div>
        </div>
        {data.file_url && (
          <Button
            asChild
            className="rounded-xl"
            variant="outline"
          >
            <a href={data.file_url} target="_blank" rel="noreferrer">
              Download PPTX
            </a>
          </Button>
        )}
      </div>

        <div className="space-y-3">
        <h2 className={cn('text-sm font-semibold', slideTheme.sectionHeading)}>
          Slides preview
        </h2>
        <div className="grid md:grid-cols-2 gap-3">
          {slides.map((slide, index) => (
            <Card
              key={index}
              className={cn('rounded-xl border p-4', slideTheme.card)}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className={cn('text-sm', slideTheme.title)}>
                  {index + 1}. {slide.title}
                </h3>
              </div>
              <ul
                className={cn(
                  'mt-2 space-y-1 text-xs',
                  slideTheme.bullet,
                )}
              >
                {slide.content?.map((line, i) => (
                  <li key={i} className="list-disc list-inside">
                    {line}
                  </li>
                ))}
              </ul>
              {slide.imageUrl ? (
                <div className="mt-3 overflow-hidden rounded-lg border border-slate-200/80 bg-slate-50">
                  <img
                    src={slide.imageUrl}
                    alt=""
                    className="max-h-48 w-full object-contain"
                  />
                </div>
              ) : null}
              {slide.visual && (
                <p className={cn('mt-2 text-[11px]', slideTheme.visual)}>
                  Visual suggestion: {slide.visual}
                </p>
              )}
            </Card>
          ))}
          {slides.length === 0 && (
            <p className="text-xs text-slate-500">
              No slide content available (check `slides_json`).
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

