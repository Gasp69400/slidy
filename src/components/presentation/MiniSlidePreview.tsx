'use client'

import { cn } from '@/lib/utils'
import {
  getTemplatePreview,
  type PresentationTemplateSlug,
} from '@/lib/presentation-template-themes'

type Props = {
  slug: PresentationTemplateSlug
  className?: string
}

export function MiniSlidePreview({ slug, className }: Props) {
  const p = getTemplatePreview(slug)
  return (
    <div
      className={cn('aspect-video w-full overflow-hidden', p.frame, className)}
      style={{ fontFamily: p.fontFamily }}
    >
      <div className="flex h-full flex-col">
        <div className={p.header} />
        <div
          className={cn(
            'flex min-h-0 flex-1 items-stretch gap-1.5 p-2',
            p.body,
          )}
        >
          <div className={cn('shrink-0 self-stretch', p.accentBar)} />
          <div className="flex flex-1 flex-col justify-center gap-1.5 py-0.5">
            <div className={p.line1} />
            <div className={p.line2} />
            <div className={cn(p.line2, 'w-[40%] opacity-70')} />
          </div>
        </div>
      </div>
    </div>
  )
}
