'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { LayoutTemplate, Plus } from 'lucide-react'

import type { Presentation } from '@/api/client-types'
import {
  StudioEmptyState,
  StudioHeader,
  StudioPanel,
  StudioShell,
} from '@/components/studio/studio-ui'
import { Button } from '@/components/ui/button'
import { useSiteLocale } from '@/lib/site-locale'

export default function PresentationsPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { t } = useSiteLocale()

  const { data, isLoading } = useQuery({
    queryKey: ['presentations'],
    queryFn: async () => {
      const res = await fetch('/api/presentations', { credentials: 'include' })
      const json = await res.json() as { success?: boolean; data?: Presentation[] }
      return json.data ?? []
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/presentations/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const json = (await res.json()) as { success?: boolean; error?: string }
      if (!res.ok || !json.success) {
        throw new Error(json.error ?? 'delete failed')
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['presentations'] })
    },
  })

  const confirmAndDelete = (id: string) => {
    if (!window.confirm(t('presentations.delete_confirm'))) return
    deleteMutation.mutate(id, {
      onError: () => {
        window.alert(t('presentations.delete_error'))
      },
    })
  }

  if (isLoading) {
    return (
      <StudioShell>
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        </div>
      </StudioShell>
    )
  }

  return (
    <StudioShell>
      <StudioHeader
        icon={LayoutTemplate}
        badge={t('studio.badge')}
        title={t('nav.presentations')}
        subtitle="Retrouvez toutes vos présentations générées."
        actions={
          <Button
            asChild
            className="rounded-xl bg-brand-500 shadow-md shadow-brand-500/25 hover:bg-brand-600"
          >
            <a href="/presentations/create" className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle présentation
            </a>
          </Button>
        }
      />

      <StudioPanel>
        {!data?.length ? (
          <StudioEmptyState
            icon={LayoutTemplate}
            message="Créez votre première présentation en quelques secondes."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((p) => (
              <article
                key={p.id}
                className="group flex flex-col rounded-2xl border border-slate-100/90 bg-white/70 p-5 transition hover:border-brand-200/70 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-brand-500/30"
              >
                <button
                  type="button"
                  onClick={() => router.push(`/Presentation?id=${p.id}`)}
                  className="min-w-0 flex-1 text-left"
                >
                  <h3 className="truncate font-semibold text-slate-900 dark:text-white">
                    {p.title}
                  </h3>
                  <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                    {p.topic}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                    <span>{p.slideCount} slides</span>
                    <span>·</span>
                    <span className="capitalize">{p.presentationType}</span>
                  </div>
                </button>
                <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 flex-1 rounded-lg text-xs"
                    onClick={() => router.push(`/Presentation?id=${p.id}`)}
                  >
                    {t('presentations.view')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 flex-1 rounded-lg border-red-200 text-xs text-red-600 hover:bg-red-50 dark:border-red-900/60 dark:text-red-400"
                    disabled={deleteMutation.isPending}
                    onClick={() => confirmAndDelete(p.id)}
                  >
                    {t('presentations.delete')}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </StudioPanel>
    </StudioShell>
  )
}
