'use client'

import { FC } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Lock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { MiniSlidePreview } from '@/components/presentation/MiniSlidePreview'
import { useSiteLocale } from '@/lib/site-locale'
import type { SiteStrKey } from '@/lib/site-messages'
import {
  PRESENTATION_TEMPLATES_META,
  type PresentationTemplateSlug,
} from '@/lib/presentation-template-themes'

type TemplateSelectorProps = {
  selected: string
  onSelect: (slug: string) => void
}

const PLAN_ORDER: Record<string, number> = {
  starter: 1,
  pro: 2,
  ultimate: 3,
}

const PLAN_LABELS: Record<string, string> = {
  starter: 'Starter',
  pro: 'Pro',
  ultimate: 'Ultimate',
}

function getUserPlanTier(plan: string): string {
  const p = plan.toLowerCase()
  if (p === 'ultimate' || p === 'team') return 'ultimate'
  if (p === 'pro') return 'pro'
  return 'starter'
}

const TemplateSelector: FC<TemplateSelectorProps> = ({ selected, onSelect }) => {
  const { t } = useSiteLocale()
  const router = useRouter()
  const { data: capData } = useQuery({
    queryKey: ['me-capabilities'],
    queryFn: async () => {
      const res = await fetch('/api/me/capabilities', { credentials: 'include' })
      const json = await res.json() as { success?: boolean; data?: { plan?: string } }
      return json.data
    },
  })

  const userPlanTier = getUserPlanTier(capData?.plan ?? 'STARTER')
  const userPlanLevel = PLAN_ORDER[userPlanTier] ?? 1

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
          Inclus dans votre plan
        </span>
        <span className="flex items-center gap-1">
          <Lock className="h-3 w-3 text-slate-400 dark:text-slate-500" />
          Plan superieur requis
        </span>
      </div>

      {/* Grid par tier */}
      {['starter', 'pro', 'ultimate'].map((tier) => {
        const tierTemplates = PRESENTATION_TEMPLATES_META.filter(
          (t) => t.plan_tier === tier,
        )
        const tierLevel = PLAN_ORDER[tier] ?? 1
        const tierLocked = tierLevel > userPlanLevel

        return (
          <div key={tier}>
            <div className="flex items-center gap-2 mb-3">
              <span
                className={cn(
                  'text-xs font-bold px-2 py-0.5 rounded-full',
                  tier === 'starter' &&
                    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
                  tier === 'pro' &&
                    'bg-violet-100 text-violet-700 dark:bg-violet-950/80 dark:text-violet-200',
                  tier === 'ultimate' &&
                    'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200',
                )}
              >
                {PLAN_LABELS[tier]}
              </span>
              {tierLocked && (
                <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <Lock className="w-3 h-3" />
                  Passez au plan {PLAN_LABELS[tier]} pour debloquer
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {tierTemplates.map((tpl) => {
                const slug = tpl.slug as PresentationTemplateSlug
                const isActive = selected === slug
                const isLocked = (PLAN_ORDER[tpl.plan_tier] ?? 1) > userPlanLevel

                return (
                  <button
                    key={slug}
                    type="button"
                    onClick={() => {
                      if (isLocked) {
                        router.push('/pricing')
                      } else {
                        onSelect(slug)
                      }
                    }}
                    className={cn(
                      'text-left w-full',
                      isLocked ? 'cursor-pointer opacity-60' : 'cursor-pointer',
                    )}
                  >
                    <Card
                      className={cn(
                        'relative h-full overflow-hidden rounded-xl border bg-card p-0 transition-all',
                        isActive && !isLocked
                          ? 'border-indigo-400 bg-indigo-50/60 shadow-md ring-2 ring-indigo-300/50 dark:border-indigo-500 dark:bg-indigo-950/40 dark:ring-indigo-500/40'
                          : 'border-slate-100 dark:border-slate-700',
                        !isLocked &&
                          'hover:border-slate-200 hover:shadow-sm dark:hover:border-slate-600',
                      )}
                    >
                      {/* Cadenas overlay */}
                      {isLocked && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-white/75 backdrop-blur-[2px] dark:bg-slate-950/85">
                          <Lock className="mb-1 h-5 w-5 text-slate-600 dark:text-slate-400" />
                          <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                            Plan {PLAN_LABELS[tpl.plan_tier]}
                          </span>
                        </div>
                      )}

                      <div className="p-2 pb-0">
                        <MiniSlidePreview slug={slug} />
                      </div>
                      <div className="space-y-1 p-3 pt-2">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                          {t(`create.tpl.${slug}.name` as SiteStrKey)}
                        </div>
                        <div className="text-xs leading-snug text-slate-500 dark:text-slate-400">
                          {t(`create.tpl.${slug}.desc` as SiteStrKey)}
                        </div>
                        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 dark:text-slate-500">
                          <span>
                            {t(`create.tpl.category.${tpl.category}` as SiteStrKey)}
                          </span>
                          {!isLocked && (
                            <span className="font-medium text-emerald-600 dark:text-emerald-400">
                              Inclus
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default TemplateSelector