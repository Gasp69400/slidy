'use client'

import Link from 'next/link'
import type { FC } from 'react'

import type { Template } from '@/api/client-types'
import { MiniSlidePreview } from '@/components/presentation/MiniSlidePreview'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  type PresentationTemplateSlug,
  normalizePresentationTemplateSlug,
} from '@/lib/presentation-template-themes'

type TemplateCardProps = {
  template: Template
  /** Libellé bouton (ex. « Utiliser ») */
  useLabel?: string
}

const TemplateCard: FC<TemplateCardProps> = ({ template, useLabel }) => {
  const {
    id,
    name,
    description,
    category,
    plan_tier,
    preview_image,
    slug,
  } = template

  const isBuiltin = id.startsWith('builtin-')
  const previewSlug = isBuiltin
    ? (normalizePresentationTemplateSlug(slug) as PresentationTemplateSlug)
    : null

  const createHref = `/presentations/create?template=${encodeURIComponent(slug)}`

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-100 transition-all hover:border-slate-200 hover:shadow-md dark:border-slate-800 dark:hover:border-slate-700">
      {isBuiltin && previewSlug ? (
        <Link href={createHref} className="block shrink-0 p-2 pb-0">
          <MiniSlidePreview slug={previewSlug} className="rounded-lg" />
        </Link>
      ) : (
        <Link href={createHref} className="block shrink-0">
          <div
            className={cn(
              'aspect-video w-full bg-slate-100 dark:bg-slate-800',
              !preview_image && 'animate-pulse',
            )}
            style={
              preview_image
                ? {
                    backgroundImage: `url(${preview_image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }
                : undefined
            }
          />
        </Link>
      )}
      <div className="flex flex-1 flex-col space-y-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="line-clamp-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
              {name}
            </p>
            {description && (
              <p className="mt-0.5 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                {description}
              </p>
            )}
          </div>
          {category && (
            <Badge
              variant="outline"
              className="shrink-0 text-[10px] uppercase tracking-wide"
            >
              {category}
            </Badge>
          )}
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <span className="text-[11px] capitalize text-slate-400 dark:text-slate-500">
            {plan_tier} plan
          </span>
          {useLabel && (
            <Button size="sm" variant="secondary" className="h-8 rounded-lg text-xs" asChild>
              <Link href={createHref}>{useLabel}</Link>
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

export default TemplateCard
