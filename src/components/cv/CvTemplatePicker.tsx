'use client'

import type { CvTemplateSlug } from '@/lib/cv-schema'
import { CV_TEMPLATES } from '@/lib/cv-templates'
import { useSiteLocale } from '@/lib/site-locale'
import { cn } from '@/lib/utils'

type Props = {
  value: CvTemplateSlug
  onChange: (slug: CvTemplateSlug) => void
}

export function CvTemplatePicker({ value, onChange }: Props) {
  const { t } = useSiteLocale()

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {CV_TEMPLATES.map((tpl) => {
        const selected = tpl.slug === value
        return (
          <button
            key={tpl.slug}
            type="button"
            onClick={() => onChange(tpl.slug)}
            className={cn(
              'rounded-2xl border p-2 text-left transition',
              selected
                ? 'border-indigo-500 ring-2 ring-indigo-500/30'
                : 'border-slate-200 hover:border-slate-300',
            )}
          >
            <div
              className={cn(
                'mb-2 h-20 w-full overflow-hidden rounded-xl border border-slate-100',
                tpl.previewClass,
              )}
            />
            <p className="text-xs font-semibold text-slate-900">
              {t(tpl.labelKey)}
            </p>
            <p className="mt-0.5 line-clamp-2 text-[10px] text-slate-500">
              {t(tpl.descriptionKey)}
            </p>
          </button>
        )
      })}
    </div>
  )
}
