'use client'

import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import type { Presentation } from '@/api/client-types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function PresentationsPage() {
  const router = useRouter()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['presentations'],
    queryFn: async () => {
      const res = await fetch('/api/presentations', { credentials: 'include' })
      const json = (await res.json()) as {
        success?: boolean
        data?: Presentation[]
        error?: string
      }
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error ?? 'Failed to load presentations')
      }
      return json.data
    },
  })

  const presentations = data ?? []

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Presentations
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Browse and open your AI-generated slide decks.
          </p>
        </div>
        <Button
          onClick={() => router.push('/presentations/create')}
          className="rounded-xl"
        >
          New presentation
        </Button>
      </div>

      {isLoading && (
        <p className="text-sm text-slate-500">Loading presentations…</p>
      )}

      {isError && (
        <p className="text-sm text-red-500">
          Impossible de charger les présentations. Vérifiez votre session,
          la base de données et les routes API.
        </p>
      )}

      {!isLoading && presentations.length === 0 && (
        <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center text-sm text-slate-500">
          No presentations yet. Start by creating one.
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {presentations.map((p) => (
          <Card
            key={p.id}
            className="p-4 rounded-xl border-slate-100 hover:border-slate-200 cursor-pointer transition-all"
            onClick={() => router.push(`/Presentation?id=${p.id}`)}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 line-clamp-2">
                  {p.title}
                </h2>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                  {p.topic}
                </p>
              </div>
              <Badge variant="outline" className="text-xs capitalize">
                {p.audience}
              </Badge>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span>{p.slide_count} slides</span>
              <span className="capitalize">{p.presentation_type}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

