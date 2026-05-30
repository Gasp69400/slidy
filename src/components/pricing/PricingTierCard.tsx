'use client'

import type { KeyboardEvent, ReactNode, Ref } from 'react'
import { Check, Crown, Sparkles, Zap, type LucideIcon } from 'lucide-react'

import type { PricingPlanId } from '@/lib/pricing-tiers'
import { cn } from '@/lib/utils'

export type PricingTierCardData = {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  highlighted: boolean
  planId: PricingPlanId
}

type PricingTierCardProps = {
  tier: PricingTierCardData
  popularLabel: string
  includesLabel: string
  footer: ReactNode
  id?: string
  /** Surlignage actif (prioritaire sur tier.highlighted). */
  selected?: boolean
  selectedLabel?: string
  onSelect?: () => void
  flashHighlight?: boolean
  innerRef?: Ref<HTMLElement>
  className?: string
  /** Icône, bandeau et orbe décoratifs (page /pricing). */
  visual?: PricingPlanId
}

const PLAN_VISUAL: Record<
  PricingPlanId,
  {
    Icon: LucideIcon
    iconWrap: string
    orb: string
    stripe: string
  }
> = {
  starter: {
    Icon: Zap,
    iconWrap:
      'bg-gradient-to-br from-slate-100 to-violet-100 text-violet-600 ring-violet-200/60 dark:from-slate-800 dark:to-violet-950/80 dark:text-violet-300 dark:ring-violet-500/25',
    orb: 'bg-violet-400/25 dark:bg-violet-500/20',
    stripe: 'from-slate-400 via-violet-400 to-fuchsia-400/60',
  },
  pro: {
    Icon: Sparkles,
    iconWrap:
      'bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-700 ring-violet-300/50 dark:from-violet-950 dark:to-fuchsia-950/70 dark:text-violet-200 dark:ring-violet-400/30',
    orb: 'bg-fuchsia-400/30 dark:bg-fuchsia-500/25',
    stripe: 'from-violet-500 via-fuchsia-500 to-violet-400/50',
  },
  ultimate: {
    Icon: Crown,
    iconWrap:
      'bg-gradient-to-br from-amber-50 to-violet-100 text-amber-700 ring-amber-200/60 dark:from-amber-950/80 dark:to-violet-950 dark:text-amber-200 dark:ring-amber-500/25',
    orb: 'bg-amber-400/25 dark:bg-amber-500/15',
    stripe: 'from-amber-400 via-violet-500 to-fuchsia-500/70',
  },
}

export function pricingTierCtaClassName(highlighted: boolean) {
  return cn(
    'flex h-11 w-full items-center justify-center rounded-2xl text-sm font-semibold tracking-tight transition',
    highlighted
      ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg shadow-slate-900/20 hover:from-violet-700 hover:to-fuchsia-600 hover:shadow-violet-500/25 dark:from-white dark:to-slate-100 dark:text-slate-950 dark:hover:from-violet-200 dark:hover:to-fuchsia-100'
      : 'border border-slate-200/95 bg-white/40 text-slate-800 backdrop-blur-sm hover:border-violet-300 hover:bg-white/95 dark:border-white/12 dark:bg-white/[0.04] dark:text-white dark:hover:border-violet-400/35 dark:hover:bg-white/[0.1]',
  )
}

export function PricingTierGrid({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'mx-auto grid max-w-5xl grid-cols-1 items-stretch gap-6 sm:grid-cols-3 sm:gap-4 lg:gap-8',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function PricingTierCard({
  tier,
  popularLabel,
  includesLabel,
  footer,
  id,
  selected,
  selectedLabel,
  onSelect,
  flashHighlight = false,
  innerRef,
  className,
  visual,
}: PricingTierCardProps) {
  const accent = selected ?? tier.highlighted
  const planVisual = visual ? PLAN_VISUAL[visual] : null
  const PlanIcon = planVisual?.Icon
  const badgeLabel =
    accent && tier.planId === 'pro' ? popularLabel : selectedLabel

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (!onSelect) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect()
    }
  }

  return (
    <article
      ref={innerRef}
      id={id}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      className={cn(
        'group relative flex h-full scroll-mt-24 flex-col transition-all duration-500 ease-out',
        onSelect && 'cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-violet-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
        accent && 'sm:z-[2] sm:-translate-y-1.5 sm:scale-[1.03]',
        flashHighlight &&
          'z-[3] scale-[1.02] ring-4 ring-violet-500/80 ring-offset-2 ring-offset-transparent',
        className,
      )}
    >
      {accent ? (
        <div
          aria-hidden
          className="absolute -inset-[1px] rounded-[2rem] bg-gradient-to-br from-violet-400/50 via-fuchsia-500/35 to-transparent opacity-85 blur-[2px] dark:from-violet-500/55 dark:via-fuchsia-500/30 dark:opacity-100"
        />
      ) : null}

      <div
        className={cn(
          'relative flex h-full flex-1 flex-col overflow-hidden rounded-[1.9rem]',
          'border border-white/70 bg-white/65 shadow-[0_12px_40px_-20px_rgba(15,23,42,0.18)] backdrop-blur-2xl',
          'transition duration-300',
          !accent &&
            'hover:border-violet-200/60 hover:bg-white/80 hover:shadow-[0_20px_52px_-24px_rgba(109,40,217,0.18)] dark:border-white/[0.09] dark:bg-slate-950/50 dark:hover:border-violet-500/25 dark:hover:bg-slate-950/70',
          accent &&
            'border-white/85 bg-[linear-gradient(165deg,rgba(255,255,255,0.96)_0%,rgba(250,246,255,0.9)_52%,rgba(252,247,253,0.85)_100%)] shadow-[0_24px_70px_-30px_rgba(109,40,217,0.35)] ring-1 ring-violet-200/55 dark:bg-[linear-gradient(165deg,rgba(32,29,48,0.97)_0%,rgba(18,16,28,0.92)_45%,rgba(26,20,40,0.9)_100%)] dark:ring-violet-500/25',
          flashHighlight && 'shadow-xl shadow-violet-500/30',
        )}
      >
        {planVisual ? (
          <div
            aria-hidden
            className={cn(
              'pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r',
              planVisual.stripe,
            )}
          />
        ) : null}

        {planVisual ? (
          <div
            aria-hidden
            className={cn(
              'pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl',
              planVisual.orb,
            )}
          />
        ) : null}

        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-x-0 top-0 h-px',
            accent
              ? 'bg-gradient-to-r from-transparent via-violet-400/70 to-transparent dark:via-violet-300/50'
              : 'bg-gradient-to-r from-transparent via-slate-200/80 to-transparent dark:via-white/12',
          )}
        />

        <div className="relative flex flex-1 flex-col px-6 pb-6 pt-7 sm:px-7 sm:pb-7 sm:pt-8">
          {PlanIcon && planVisual ? (
            <div
              className={cn(
                'mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm ring-1',
                planVisual.iconWrap,
              )}
            >
              <PlanIcon className="h-5 w-5" strokeWidth={2} aria-hidden />
            </div>
          ) : null}

          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
                {tier.name}
              </p>
              <div className="mt-3 flex flex-wrap items-baseline gap-x-1 gap-y-0">
                <span className="text-[2.35rem] font-extralight tabular-nums leading-none tracking-tight text-slate-900 dark:text-white sm:text-[2.5rem]">
                  {tier.price}
                </span>
                <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
                  €
                </span>
                <span className="ml-0.5 text-sm font-normal text-slate-500 dark:text-slate-400">
                  {tier.period}
                </span>
              </div>
            </div>
            {accent && badgeLabel ? (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-violet-200/60 bg-violet-500/[0.08] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-violet-700 shadow-sm shadow-violet-500/10 dark:border-violet-400/25 dark:bg-violet-400/15 dark:text-violet-100">
                <Sparkles className="h-3 w-3" aria-hidden />
                {badgeLabel}
              </span>
            ) : (
              <span
                className="h-px w-8 shrink-0 bg-slate-200/90 dark:bg-white/15"
                aria-hidden
              />
            )}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {tier.description}
          </p>

          <div className="my-7 h-px w-full shrink-0 bg-gradient-to-r from-transparent via-slate-200/90 to-transparent dark:via-white/12" />

          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            {includesLabel}
          </p>
          <ul className="mt-3 flex flex-1 flex-col gap-3">
            {tier.features.map((f) => (
              <li
                key={f}
                className="flex gap-3 text-[13px] leading-snug text-slate-700 dark:text-slate-300"
              >
                <span className="mt-0.5 flex h-[1.375rem] w-[1.375rem] shrink-0 items-center justify-center rounded-full bg-violet-500/[0.1] shadow-inner shadow-violet-500/10 ring-[0.5px] ring-violet-400/20 dark:bg-violet-400/15 dark:ring-violet-400/30">
                  <Check
                    className="h-[10px] w-[10px] text-violet-600 dark:text-violet-300"
                    strokeWidth={3}
                    aria-hidden
                  />
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
            {footer}
          </div>
        </div>
      </div>
    </article>
  )
}
