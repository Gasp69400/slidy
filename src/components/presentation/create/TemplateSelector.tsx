'use client'

import { FC } from 'react'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useSiteLocale } from '@/lib/site-locale'
import type { SiteStrKey } from '@/lib/site-messages'
import { MiniSlidePreview } from '@/components/presentation/MiniSlidePreview'
import {
  PRESENTATION_TEMPLATES_META,
  type PresentationTemplateSlug,
} from '@/lib/presentation-template-themes'

type TemplateSelectorProps = {
  selected: string
  onSelect: (slug: string) => void
}

function tplNameKey(slug: PresentationTemplateSlug): SiteStrKey {
  return `create.tpl.${slug}.name` as SiteStrKey
}

function tplDescKey(slug: PresentationTemplateSlug): SiteStrKey {
  return `create.tpl.${slug}.desc` as SiteStrKey
}

function categoryKey(
  category: string,
): SiteStrKey {
  if (category === 'creative') return 'create.tpl.category.creative'
  if (category === 'marketing') return 'create.tpl.category.marketing'
  return 'create.tpl.category.business'
}

function planKey(tier: string): SiteStrKey {
  if (tier === 'pro') return 'create.plan.pro'
  if (tier === 'team') return 'create.plan.team'
  return 'create.plan.starter'
}

const TemplateSelector: FC<TemplateSelectorProps> = ({
  selected,
  onSelect,
}) => {
  const { t } = useSiteLocale()

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {PRESENTATION_TEMPLATES_META.map((tpl) => {
        const slug = tpl.slug
        const isActive = selected === slug
        return (
          <button
            key={tpl.slug}
            type="button"
            onClick={() => onSelect(tpl.slug)}
            className="text-left"
          >
            <Card
              className={cn(
                'h-full overflow-hidden rounded-xl border p-0 transition-all',
                isActive
                  ? 'border-indigo-400 bg-indigo-50/60 shadow-md ring-2 ring-indigo-300/50'
                  : 'border-slate-100 hover:border-slate-200 hover:shadow-sm',
              )}
            >
              <div className="p-2 pb-0">
                <MiniSlidePreview slug={slug} />
              </div>
              <div className="space-y-1 p-3 pt-2">
                <div className="text-sm font-semibold text-slate-900">
                  {t(tplNameKey(slug))}
                </div>
                <div className="text-xs leading-snug text-slate-500">
                  {t(tplDescKey(slug))}
                </div>
                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                  {tpl.category && (
                    <span>{t(categoryKey(tpl.category))}</span>
                  )}
                  <span>
                    {t('create.tpl.plan_line', {
                      plan: t(planKey(tpl.plan_tier)),
                    })}
                  </span>
                </div>
              </div>
            </Card>
          </button>
        )
      })}
    </div>
  )
}

export default TemplateSelector
