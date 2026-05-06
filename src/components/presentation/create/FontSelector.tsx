import { FC } from 'react'
import { useQuery } from '@tanstack/react-query'

import { cn } from '@/lib/utils'
import { useSiteLocale } from '@/lib/site-locale'
import type { SiteStrKey } from '@/lib/site-messages'

type PlanTier = 'starter' | 'pro' | 'ultimate'

type SubscriptionStatus =
  | 'TRIAL'
  | 'ACTIVE'
  | 'PAST_DUE'
  | 'CANCELED'
  | 'UNPAID'

type FontTier = {
  id: string
  heading: string
  body: string
  labelKey: SiteStrKey
  minPlan: PlanTier
}

const PLAN_ORDER: Record<PlanTier, number> = {
  starter: 1,
  pro: 2,
  ultimate: 3,
}

const mapSubscriptionToPlan = (
  status: SubscriptionStatus | undefined,
): PlanTier => {
  if (status === 'ACTIVE') return 'ultimate'
  if (status === 'TRIAL') return 'pro'
  return 'starter'
}

export const FONT_PAIRS: FontTier[] = [
  {
    id: 'inter',
    heading: 'Inter',
    body: 'Inter',
    labelKey: 'create.font.inter',
    minPlan: 'starter',
  },
  {
    id: 'serif',
    heading: 'Playfair Display',
    body: 'Source Serif Pro',
    labelKey: 'create.font.serif',
    minPlan: 'starter',
  },
  {
    id: 'mono',
    heading: 'JetBrains Mono',
    body: 'Inter',
    labelKey: 'create.font.mono',
    minPlan: 'starter',
  },
  {
    id: 'rounded',
    heading: 'Nunito',
    body: 'Nunito',
    labelKey: 'create.font.rounded',
    minPlan: 'pro',
  },
  {
    id: 'display',
    heading: 'Poppins',
    body: 'Inter',
    labelKey: 'create.font.display',
    minPlan: 'pro',
  },
  {
    id: 'classic-serif',
    heading: 'Merriweather',
    body: 'Merriweather',
    labelKey: 'create.font.classic-serif',
    minPlan: 'pro',
  },
  {
    id: 'luxury',
    heading: 'Cormorant Garamond',
    body: 'Source Sans Pro',
    labelKey: 'create.font.luxury',
    minPlan: 'ultimate',
  },
  {
    id: 'tech',
    heading: 'Space Grotesk',
    body: 'Inter',
    labelKey: 'create.font.tech',
    minPlan: 'ultimate',
  },
  {
    id: 'playful',
    heading: 'Baloo 2',
    body: 'Inter',
    labelKey: 'create.font.playful',
    minPlan: 'ultimate',
  },
]

export async function loadFontPair(_id: string): Promise<void> {
  return
}

type FontSelectorProps = {
  selected: string
  onSelect: (id: string) => void
}

const FontSelector: FC<FontSelectorProps> = ({
  selected,
  onSelect,
}) => {
  const { t } = useSiteLocale()
  const { data } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await fetch('/api/me')
      if (!res.ok) throw new Error('Failed to load user')
      return res.json() as Promise<{
        success: boolean
        data: { subscriptionStatus: SubscriptionStatus }
      }>
    },
  })

  const plan: PlanTier = mapSubscriptionToPlan(
    data?.data.subscriptionStatus,
  )
  const allowedRank = PLAN_ORDER[plan]

  const availableFonts = FONT_PAIRS.filter(
    (font) => PLAN_ORDER[font.minPlan] <= allowedRank,
  )

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {t('create.font_style')}
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {t('create.font_export_hint')}
        </span>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        {availableFonts.map((font) => (
          <button
            key={font.id}
            type="button"
            onClick={() => onSelect(font.id)}
            className={cn(
              'rounded-xl border p-3 text-left transition-all',
              selected === font.id
                ? 'border-indigo-300 bg-indigo-50 dark:border-indigo-600 dark:bg-indigo-950/40'
                : 'border-slate-100 hover:border-slate-200 dark:border-slate-700 dark:hover:border-slate-600',
            )}
          >
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              {font.heading}
            </div>
            <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              {t(font.labelKey)}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default FontSelector
