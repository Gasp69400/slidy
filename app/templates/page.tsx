'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import type { Template } from '@/api/client-types'
import TemplateCard from '@/components/templates/TemplateCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSiteLocale } from '@/lib/site-locale'
import type { SiteStrKey } from '@/lib/site-messages'
import {
  PRESENTATION_TEMPLATES_META,
  PRESENTATION_TEMPLATE_SLUGS,
} from '@/lib/presentation-template-themes'

const TAB_VALUES = [
  'all',
  'business',
  'creative',
  'tech',
  'education',
  'marketing',
] as const

type TabValue = (typeof TAB_VALUES)[number]

function tabLabelKey(v: TabValue): SiteStrKey {
  if (v === 'all') return 'templates.cat.all'
  return `templates.cat.${v}` as SiteStrKey
}

function buildBuiltinTemplates(t: (k: SiteStrKey) => string): Template[] {
  return PRESENTATION_TEMPLATES_META.map((m) => ({
    id: `builtin-${m.slug}`,
    slug: m.slug,
    name: t(`create.tpl.${m.slug}.name` as SiteStrKey),
    description: t(`create.tpl.${m.slug}.desc` as SiteStrKey),
    category: m.category,
    plan_tier: m.plan_tier,
    is_featured: m.slug === 'modern',
  }))
}

function mergeTemplateLists(builtIn: Template[], api: Template[]): Template[] {
  const builtinSlugs = new Set(
    PRESENTATION_TEMPLATE_SLUGS as unknown as string[],
  )
  const extra = api.filter((a) => !builtinSlugs.has(a.slug))
  return [...builtIn, ...extra.sort((a, b) => a.name.localeCompare(b.name))]
}

export default function TemplatesPage() {
  const { t } = useSiteLocale()
  const [category, setCategory] = useState<TabValue>('all')

  const { data: apiTemplates = [], isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const res = await fetch('/api/templates', { credentials: 'include' })
      const json = (await res.json()) as {
        success?: boolean
        data?: Template[]
        error?: string
      }
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error ?? 'Failed to load templates')
      }
      return json.data
    },
  })

  const builtInTemplates = useMemo(() => buildBuiltinTemplates(t), [t])

  const allTemplates = useMemo(
    () => mergeTemplateLists(builtInTemplates, apiTemplates),
    [builtInTemplates, apiTemplates],
  )

  const filtered = useMemo(() => {
    if (category === 'all') return allTemplates
    return allTemplates.filter((tpl) => tpl.category === category)
  }, [allTemplates, category])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
          {t('templates.page_title')}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400 sm:text-base">
          {t('templates.page_sub')}
        </p>
      </div>

      <Tabs
        value={category}
        onValueChange={(v) => setCategory(v as TabValue)}
        className="mb-8"
      >
        <TabsList className="h-auto min-h-10 flex-wrap justify-start gap-1 bg-slate-100 p-1 dark:bg-slate-800/80">
          {TAB_VALUES.map((v) => (
            <TabsTrigger
              key={v}
              value={v}
              className="rounded-lg px-3 py-1.5 text-xs sm:text-sm"
            >
              {t(tabLabelKey(v))}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800"
            >
              <Skeleton className="aspect-video w-full" />
              <div className="space-y-2 p-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((tpl) => (
            <TemplateCard
              key={tpl.id}
              template={tpl}
              useLabel={t('templates.use')}
            />
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          {t('templates.empty_api')}
        </p>
      )}
    </div>
  )
}
