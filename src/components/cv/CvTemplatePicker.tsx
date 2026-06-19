'use client'

import { Check } from 'lucide-react'

import type { CvTemplateSlug } from '@/lib/cv-schema'
import { CV_TEMPLATES, type CvTemplateDef } from '@/lib/cv-templates'
import { useSiteLocale } from '@/lib/site-locale'
import { cn } from '@/lib/utils'

type Props = {
  value: CvTemplateSlug
  onChange: (slug: CvTemplateSlug) => void
  /** `sidebar` : colonne étroite (studio CV) · `wide` : pleine largeur */
  layout?: 'sidebar' | 'wide'
}

function TemplatePreview({ slug, previewClass }: { slug: CvTemplateSlug; previewClass: string }) {
  const line = 'rounded-sm bg-current opacity-[0.14] dark:opacity-[0.22]'
  const lineStrong = 'rounded-sm bg-current opacity-[0.28] dark:opacity-[0.38]'

  return (
    <div
      className={cn(
        'relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-black/[0.06] text-slate-700 dark:border-white/10 dark:text-slate-200',
        previewClass,
      )}
    >
      {slug === 'modern' && (
        <div className="flex h-full p-1.5">
          <div className="w-[28%] space-y-1 rounded-sm bg-black/[0.06] p-1 dark:bg-white/[0.08]">
            <div className={cn(lineStrong, 'h-1 w-full')} />
            <div className={cn(line, 'h-0.5 w-3/4')} />
            <div className={cn(line, 'mt-2 h-0.5 w-full')} />
            <div className={cn(line, 'h-0.5 w-full')} />
          </div>
          <div className="flex-1 space-y-1 pl-1.5 pt-0.5">
            <div className={cn(lineStrong, 'h-1 w-2/3')} />
            <div className={cn(line, 'h-0.5 w-full')} />
            <div className={cn(line, 'h-0.5 w-full')} />
            <div className={cn(line, 'h-0.5 w-4/5')} />
            <div className={cn(line, 'mt-1.5 h-0.5 w-full')} />
            <div className={cn(line, 'h-0.5 w-full')} />
          </div>
        </div>
      )}

      {slug === 'minimalist' && (
        <div className="space-y-1.5 p-2">
          <div className={cn(lineStrong, 'h-1 w-2/3')} />
          <div className={cn(line, 'h-0.5 w-1/2')} />
          <div className="my-1 h-px w-full bg-current opacity-10" />
          <div className={cn(lineStrong, 'h-0.5 w-1/3')} />
          <div className={cn(line, 'h-0.5 w-full')} />
          <div className={cn(line, 'h-0.5 w-full')} />
          <div className={cn(line, 'h-0.5 w-5/6')} />
        </div>
      )}

      {slug === 'creative' && (
        <div className="flex h-full">
          <div className="w-1 bg-brand-500" />
          <div className="flex-1 space-y-1 p-2">
            <div className={cn(lineStrong, 'h-1 w-3/4 bg-white')} />
            <div className={cn(line, 'h-0.5 w-1/2 bg-white')} />
            <div className={cn(line, 'mt-2 h-0.5 w-full bg-white')} />
            <div className={cn(line, 'h-0.5 w-full bg-white')} />
            <div className={cn(line, 'h-0.5 w-4/5 bg-white')} />
          </div>
        </div>
      )}

      {slug === 'professional' && (
        <div className="flex h-full flex-col">
          <div className="space-y-1 bg-black/[0.07] p-1.5 dark:bg-white/[0.08]">
            <div className={cn(lineStrong, 'h-1 w-2/3')} />
            <div className={cn(line, 'h-0.5 w-1/2')} />
          </div>
          <div className="space-y-1 p-1.5">
            <div className={cn(lineStrong, 'h-0.5 w-1/4')} />
            <div className={cn(line, 'h-0.5 w-full')} />
            <div className={cn(line, 'h-0.5 w-full')} />
            <div className={cn(line, 'h-0.5 w-5/6')} />
          </div>
        </div>
      )}

      {slug === 'finance' && (
        <div className="flex h-full flex-col">
          <div className="h-1 bg-slate-700 dark:bg-slate-400" />
          <div className="space-y-1 p-1.5">
            <div className={cn(lineStrong, 'h-1 w-3/4')} />
            <div className={cn(line, 'h-0.5 w-1/2')} />
            <div className={cn(lineStrong, 'mt-1.5 h-0.5 w-1/3')} />
            <div className={cn(line, 'h-0.5 w-full')} />
            <div className={cn(line, 'h-0.5 w-full')} />
            <div className={cn(line, 'h-0.5 w-4/5')} />
          </div>
        </div>
      )}

      {slug === 'ats' && (
        <div className="space-y-1 p-2">
          <div className={cn(lineStrong, 'h-1 w-full')} />
          <div className={cn(line, 'h-0.5 w-full')} />
          <div className={cn(line, 'h-0.5 w-full')} />
          <div className={cn(line, 'h-0.5 w-full')} />
          <div className={cn(line, 'h-0.5 w-full')} />
          <div className={cn(line, 'h-0.5 w-full')} />
        </div>
      )}
    </div>
  )
}

function TemplateCard({
  tpl,
  selected,
  onSelect,
}: {
  tpl: CvTemplateDef
  selected: boolean
  onSelect: () => void
}) {
  const { t } = useSiteLocale()

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'group relative flex flex-col rounded-xl border-2 p-2 text-left transition-all',
        'bg-white shadow-sm dark:bg-slate-800/95',
        selected
          ? 'border-brand-500 shadow-md shadow-brand-500/20'
          : 'border-slate-200/90 hover:border-brand-300/70 dark:border-slate-600 dark:hover:border-brand-500/50',
      )}
    >
      {selected ? (
        <span className="absolute right-1.5 top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-white shadow-sm">
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
      ) : null}

      <TemplatePreview slug={tpl.slug} previewClass={tpl.previewClass} />

      <p className="mt-2 text-[11px] font-semibold leading-tight text-slate-900 dark:text-slate-50">
        {t(tpl.labelKey)}
      </p>
      <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-slate-500 dark:text-slate-400">
        {t(tpl.descriptionKey)}
      </p>
    </button>
  )
}

export function CvTemplatePicker({ value, onChange, layout = 'sidebar' }: Props) {
  return (
    <div
      className={cn(
        'grid gap-2.5',
        layout === 'wide' ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2',
      )}
    >
      {CV_TEMPLATES.map((tpl) => (
        <TemplateCard
          key={tpl.slug}
          tpl={tpl}
          selected={tpl.slug === value}
          onSelect={() => onChange(tpl.slug)}
        />
      ))}
    </div>
  )
}
