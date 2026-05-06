'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import type { Presentation } from '@/api/client-types'
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
      <div className="flex min-h-[50vh] items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent dark:border-violet-400" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl p-6 text-slate-900 dark:text-white lg:p-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('nav.presentations')}
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-300">
            Retrouvez toutes vos présentations générées.
          </p>
        </div>
        <a
          href="/presentations/create"
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          + Nouvelle présentation
        </a>
      </div>

      {!data?.length ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 dark:ring-1 dark:ring-indigo-500/30">
            <span className="text-3xl">🎯</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            Aucune présentation
          </h2>
          <p className="max-w-xs text-sm text-slate-500 dark:text-slate-300">
            Créez votre première présentation en quelques secondes.
          </p>
          <a
            href="/presentations/create"
            className="mt-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            Créer une présentation
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((p) => (
            <div
              key={p.id}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-indigo-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-600 dark:hover:shadow-indigo-950/20"
            >
              <button
                type="button"
                onClick={() => router.push(`/Presentation?id=${p.id}`)}
                className="min-w-0 flex-1 text-left"
              >
                <h3 className="truncate font-semibold text-slate-900 dark:text-white">
                  {p.title}
                </h3>
                <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-300">
                  {p.topic}
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-300">
                  <span>{p.slideCount} slides</span>
                  <span>·</span>
                  <span className="capitalize">{p.presentationType}</span>
                </div>
              </button>
              <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3 dark:border-slate-700">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 flex-1 rounded-lg border-slate-300 text-xs font-medium text-black hover:bg-slate-50 hover:text-black dark:border-slate-400 dark:bg-white dark:text-black dark:hover:bg-slate-100 dark:hover:text-black"
                  onClick={() => router.push(`/Presentation?id=${p.id}`)}
                >
                  {t('presentations.view')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 flex-1 rounded-lg text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
                  disabled={deleteMutation.isPending}
                  onClick={() => confirmAndDelete(p.id)}
                >
                  {t('presentations.delete')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
