'use client'

import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export const studioInputClass =
  'rounded-xl border-slate-200/90 bg-white shadow-sm focus-visible:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900/80'

export const studioSelectTriggerClass =
  'rounded-xl border-slate-200/90 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900/80'

export function StudioShell({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative min-h-[calc(100vh-4rem)] overflow-x-hidden',
        'bg-[linear-gradient(180deg,#f8f7f4_0%,#f1f5f9_38%,#eef2ff_100%)]',
        'dark:bg-[linear-gradient(180deg,#0c0a09_0%,#0f172a_42%,#111827_100%)]',
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-brand-400/15 blur-3xl dark:bg-brand-500/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-brand-300/10 blur-3xl dark:bg-brand-600/10"
      />
      <div className="relative z-0 mx-auto max-w-6xl px-3 py-5 pb-24 sm:px-6 sm:py-8 lg:py-10 xl:pb-10">
        {children}
      </div>
    </div>
  )
}

export function StudioHeader({
  icon: Icon,
  title,
  subtitle,
  badge,
  actions,
}: {
  icon?: LucideIcon
  title: string
  subtitle?: string
  badge?: string
  actions?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3 sm:gap-4">
        {Icon ? (
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/30 ring-1 ring-white/20 sm:h-12 sm:w-12 sm:rounded-2xl">
            <Icon className="h-5 w-5" strokeWidth={2.25} />
          </span>
        ) : null}
        <div>
          {badge ? (
            <p className="mb-2 inline-flex items-center rounded-full border border-brand-200/70 bg-brand-50/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-700 dark:border-brand-500/30 dark:bg-brand-950/50 dark:text-brand-300">
              {badge}
            </p>
          ) : null}
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-[1.75rem]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  )
}

export function StudioPanel({
  children,
  className,
  title,
  description,
  step,
}: {
  children: ReactNode
  className?: string
  title?: string
  description?: string
  step?: number | string
}) {
  return (
    <section
      className={cn(
        'rounded-[1.35rem] border border-white/70 bg-white/80 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-xl',
        'dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/30',
        'sm:rounded-[1.75rem] sm:p-6',
        className,
      )}
    >
      {title ? (
        <header className="mb-5 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-start gap-3">
            {step !== undefined ? (
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-xs font-bold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
                {step}
              </span>
            ) : null}
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                {title}
              </h2>
              {description ? (
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {description}
                </p>
              ) : null}
            </div>
          </div>
        </header>
      ) : null}
      {children}
    </section>
  )
}

export function StudioField({
  label,
  hint,
  children,
  className,
}: {
  label: ReactNode
  hint?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          {label}
        </p>
        {hint ? (
          <p className="mt-0.5 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
            {hint}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  )
}

export function StudioQuickLink({
  href,
  icon: Icon,
  title,
  subtitle,
  cta,
}: {
  href: string
  icon: LucideIcon
  title: string
  subtitle: string
  cta: string
}) {
  return (
    <a
      href={href}
      className="group flex items-center justify-between gap-4 rounded-[1.75rem] border border-brand-200/60 bg-gradient-to-r from-brand-50/90 via-white to-white p-4 shadow-sm transition hover:border-brand-300 hover:shadow-md dark:border-brand-500/25 dark:from-brand-950/40 dark:via-slate-900/80 dark:to-slate-900/80"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-md shadow-brand-500/25">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-slate-900 dark:text-white">{title}</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">{subtitle}</p>
        </div>
      </div>
      <span className="shrink-0 text-sm font-medium text-brand-700 transition group-hover:translate-x-0.5 dark:text-brand-300">
        {cta} →
      </span>
    </a>
  )
}

export function StudioEmptyState({
  icon: Icon,
  message,
}: {
  icon: LucideIcon
  message: string
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200/90 bg-slate-50/60 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-800/30">
      <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm dark:bg-slate-800 dark:text-slate-500">
        <Icon className="h-5 w-5" />
      </span>
      <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  )
}

export function StudioDocRow({
  title,
  meta,
  onOpen,
  onDelete,
  deleteLabel,
  openLabel,
  deleting,
}: {
  title: string
  meta: string
  onOpen: () => void
  onDelete: () => void
  deleteLabel: string
  openLabel: string
  deleting?: boolean
}) {
  return (
    <div className="group flex items-stretch gap-2 rounded-2xl border border-slate-100/90 bg-white/70 p-1 transition hover:border-brand-200/70 hover:bg-white hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-brand-500/30">
      <button
        type="button"
        className="flex min-w-0 flex-1 items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left"
        onClick={onOpen}
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
            {title}
          </p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            {meta}
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-brand-700 sm:opacity-0 sm:transition group-hover:sm:opacity-100 dark:text-brand-300">
          {openLabel}
        </span>
      </button>
      <div className="flex shrink-0 items-center pr-1">
        <button
          type="button"
          className="rounded-xl px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
          disabled={deleting}
          onClick={onDelete}
        >
          {deleteLabel}
        </button>
      </div>
    </div>
  )
}

/** Barre d’action fixe en bas sur mobile (safe-area iOS). */
export function StudioMobileActionBar({
  children,
  className,
  hideFrom = 'lg',
}: {
  children: ReactNode
  className?: string
  /** Breakpoint à partir duquel la barre disparaît (layout desktop). */
  hideFrom?: 'lg' | 'xl'
}) {
  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/90 bg-white/95 p-3 backdrop-blur-md',
        'pb-[max(0.75rem,env(safe-area-inset-bottom))] dark:border-slate-800 dark:bg-slate-950/95',
        hideFrom === 'xl' ? 'xl:hidden' : 'lg:hidden',
        className,
      )}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </div>
  )
}
