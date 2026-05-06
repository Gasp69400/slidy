'use client'

import { useMemo, useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Maximize2, X, Settings } from 'lucide-react'
import type { Presentation } from '@/api/client-types'
import { Button } from '@/components/ui/button'
import { getSlideCardTheme, type SlideCardTheme } from '@/lib/presentation-template-themes'

type TransitionType = 'fade' | 'slide' | 'zoom' | 'flip'

const TRANSITIONS: { id: TransitionType; label: string }[] = [
  { id: 'fade', label: 'Fondu' },
  { id: 'slide', label: 'Glissement' },
  { id: 'zoom', label: 'Zoom' },
  { id: 'flip', label: 'Retournement' },
]

type Slide = {
  title: string
  content: string[]
  visual?: string
  imageUrl?: string
}

function SlideView({ slide, index, theme, total }: { slide: Slide; index: number; theme: SlideCardTheme; total: number }) {
  return (
    <div className={`relative w-full h-full flex flex-col bg-gradient-to-br ${theme.bg}`}>
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-20" style={{ background: theme.accentColor }} />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10" style={{ background: theme.decorColor }} />

      <div className="relative z-10 flex flex-col h-full justify-center px-16 py-12">
        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold mb-8 self-start ${theme.numBg}`}>
          {index + 1}
        </span>
        <h2 className={`${theme.titleColor} text-4xl font-bold leading-tight mb-6 tracking-tight max-w-3xl`}>
          {slide.title}
        </h2>
        <div className="w-16 h-1 mb-8 rounded-full opacity-40" style={{ background: theme.accentColor }} />
        <ul className="space-y-4 max-w-2xl">
          {slide.content?.map((line, i) => (
            <li key={i} className="flex items-start gap-4">
              <span className="mt-2 w-2 h-2 rounded-full flex-shrink-0" style={{ background: theme.accentColor }} />
              <span className={`${theme.bulletColor} text-xl leading-relaxed`}>{line}</span>
            </li>
          ))}
        </ul>
        {slide.imageUrl && (
          <div className="mt-8 rounded-2xl overflow-hidden border border-white/20 max-w-lg">
            <img src={slide.imageUrl} alt="" className="w-full max-h-56 object-cover" />
          </div>
        )}
        {slide.visual && (
          <p className="mt-6 text-sm opacity-40 italic">{slide.visual}</p>
        )}
      </div>

      {/* Slide counter bottom right */}
      <div className="absolute bottom-6 right-8 text-xs opacity-40 font-medium" style={{ color: theme.accentColor }}>
        {index + 1} / {total}
      </div>
    </div>
  )
}

function SlideCardGrid({ slide, index, theme, onClick }: { slide: Slide; index: number; theme: SlideCardTheme; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-2xl bg-gradient-to-br ${theme.bg} overflow-hidden shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 text-left`}
      style={{ minHeight: '280px' }}
    >
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-20" style={{ background: theme.accentColor }} />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10" style={{ background: theme.decorColor }} />
      <div className="relative p-7 flex flex-col h-full">
        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold mb-4 ${theme.numBg}`}>
          {index + 1}
        </span>
        <h2 className={`${theme.titleColor} text-xl font-bold leading-tight mb-5 tracking-tight`}>
          {slide.title}
        </h2>
        <div className="w-10 h-0.5 mb-5 rounded-full opacity-40" style={{ background: theme.accentColor }} />
        <ul className="space-y-2.5 flex-1">
          {slide.content?.map((line, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: theme.accentColor }} />
              <span className={`${theme.bulletColor} text-sm leading-relaxed`}>{line}</span>
            </li>
          ))}
        </ul>
        {slide.imageUrl && (
          <div className="mt-4 rounded-xl overflow-hidden border border-white/20">
            <img src={slide.imageUrl} alt="" className="w-full max-h-40 object-cover" />
          </div>
        )}
      </div>
    </button>
  )
}

export default function PresentationDetailPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const enabled = useMemo(() => Boolean(id), [id])

  const [mode, setMode] = useState<'grid' | 'slideshow'>('grid')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [transition, setTransition] = useState<TransitionType>('slide')
  const [animKey, setAnimKey] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [isPublic, setIsPublic] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['presentation', id],
    queryFn: async () => {
      const res = await fetch(`/api/presentations/${id as string}`, { credentials: 'include' })
      const json = (await res.json()) as { success?: boolean; data?: Presentation; error?: string }
      if (!res.ok || !json.success || !json.data) throw new Error(json.error ?? 'Failed to load')
      const presentation = json.data
      setIsPublic(presentation?.isPublic ?? false)
      return presentation
    },
    enabled,
  })

  const slides: Slide[] = useMemo(() => {
    try { return JSON.parse(data?.slidesJson ?? '[]') as Slide[] }
    catch { return [] }
  }, [data])

  // Thème basé sur le vrai template choisi
  const theme = useMemo(() => getSlideCardTheme(data?.templateSlug), [data?.templateSlug])

  const goNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setAnimKey((k) => k + 1)
      setCurrentSlide((s) => s + 1)
    }
  }, [currentSlide, slides.length])

  const goPrev = useCallback(() => {
    if (currentSlide > 0) {
      setAnimKey((k) => k + 1)
      setCurrentSlide((s) => s - 1)
    }
  }, [currentSlide])

  useEffect(() => {
    if (mode !== 'slideshow') return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goNext() }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev() }
      if (e.key === 'Escape') setMode('grid')
      if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) {
          void document.documentElement.requestFullscreen()
        } else {
          void document.exitFullscreen()
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [mode, goNext, goPrev])

  if (!id) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4 px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100">
            <span className="text-3xl">🎯</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Aucune présentation sélectionnée</h2>
          <p className="max-w-xs text-sm text-slate-500">Créez une nouvelle présentation depuis votre tableau de bord.</p>
          <a href="/presentations/create" className="mt-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
            Créer une présentation
          </a>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
          <p className="text-sm font-medium text-slate-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-red-600">Impossible de charger cette présentation.</p>
      </div>
    )
  }

  // MODE SLIDESHOW
  if (mode === 'slideshow') {
    return (
      <div className={`fixed inset-0 z-50 bg-gradient-to-br ${theme.bg} flex flex-col`}>
        <div className="flex items-center justify-between px-8 py-4 bg-black/20 backdrop-blur-sm">
          <span className="text-sm font-medium opacity-80" style={{ color: theme.accentColor }}>{data.title}</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSettings((s) => !s)}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors opacity-70 hover:opacity-100"
              style={{ color: theme.accentColor }}
            >
              <Settings className="w-3.5 h-3.5" />
              Transition
            </button>
            {showSettings && (
              <div className="absolute top-16 right-32 bg-white rounded-xl shadow-xl p-3 z-50 flex gap-2">
                {TRANSITIONS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setTransition(t.id); setShowSettings(false) }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${transition === t.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={() => { setMode('grid'); if (document.fullscreenElement) void document.exitFullscreen() }}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors opacity-70 hover:opacity-100"
              style={{ color: theme.accentColor }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slide */}
        <div className="flex-1 relative overflow-hidden">
          <div key={animKey} className="w-full h-full animate-in fade-in duration-500">
            {slides[currentSlide] && (
              <SlideView
                slide={slides[currentSlide]}
                index={currentSlide}
                theme={theme}
                total={slides.length}
              />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between px-8 py-5 bg-black/20 backdrop-blur-sm">
          <button
            onClick={goPrev}
            disabled={currentSlide === 0}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            style={{ color: theme.accentColor }}
          >
            <ChevronLeft className="w-5 h-5" />
            Précédent
          </button>
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => { setAnimKey((k) => k + 1); setCurrentSlide(i) }}
                className="rounded-full transition-all duration-200"
                style={{
                  width: i === currentSlide ? '24px' : '10px',
                  height: '10px',
                  background: i === currentSlide ? theme.accentColor : `${theme.accentColor}50`,
                }}
              />
            ))}
          </div>
          <button
            onClick={goNext}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            style={{ color: theme.accentColor }}
          >
            Suivant
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="text-center pb-3 text-xs opacity-30" style={{ color: theme.accentColor }}>
          Fleches pour naviguer · Espace Suivant · F Plein ecran · Echap Quitter
        </div>
      </div>
    )
  }

  // MODE GRILLE
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">{data.title}</h1>
            <p className="mt-0.5 text-xs text-slate-500">{data.topic} · {data.slideCount} slides · {data.templateSlug}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium capitalize text-violet-700">{data.presentationType}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">{data.audience}</span>
            <Button onClick={() => { setCurrentSlide(0); setMode('slideshow') }} size="sm" className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 gap-1.5">
              <Maximize2 className="w-3.5 h-3.5" />
              Presenter
            </Button>
            <Button onClick={() => setShowShareModal(true)} size="sm" variant="outline" className="rounded-full text-xs px-4 gap-1.5">
              {isPublic ? 'Partage' : 'Partager'}
            </Button>
            {data.fileUrl && (
              <Button asChild size="sm" variant="outline" className="rounded-full text-xs px-4">
                <a href={data.fileUrl} target="_blank" rel="noreferrer">Telecharger</a>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {slides.length === 0 ? (
          <div className="py-20 text-center text-slate-500">Aucun contenu disponible.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {slides.map((slide, index) => (
              <SlideCardGrid
                key={index}
                slide={slide}
                index={index}
                theme={theme}
                onClick={() => { setCurrentSlide(index); setMode('slideshow') }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal Partage */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Partager la presentation</h2>
              <button onClick={() => setShowShareModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Lien public</p>
                  <p className="text-xs text-slate-500 mt-0.5">Tout le monde peut voir cette presentation</p>
                </div>
                <button
                  onClick={async () => {
                    const res = await fetch(`/api/presentations/${id}/share`, { method: 'POST', credentials: 'include' })
                    const json = await res.json() as { success?: boolean; data?: { isPublic: boolean } }
                    if (json.success) setIsPublic(json.data?.isPublic ?? false)
                  }}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${isPublic ? 'bg-indigo-600' : 'bg-slate-300'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${isPublic ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
              {isPublic && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 truncate flex-1">
                    {typeof window !== 'undefined' ? `${window.location.origin}/p/${id}` : ''}
                  </span>
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/p/${id}`
                      void navigator.clipboard.writeText(url)
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    }}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 whitespace-nowrap"
                  >
                    {copied ? 'Copie !' : 'Copier'}
                  </button>
                </div>
              )}
              <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold text-slate-700">Envoyer par mail</p>
                <div className="flex gap-2">
                  <input
                    id="share-email"
                    type="email"
                    placeholder="adresse@mail.com"
                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-400"
                  />
                  <button
                    onClick={() => {
                      const email = (document.getElementById('share-email') as HTMLInputElement)?.value
                      if (!email) return
                      const url = `${window.location.origin}/p/${id}`
                      const subject = encodeURIComponent(`Presentation : ${data.title}`)
                      const body = encodeURIComponent(`Voici ma presentation "${data.title}" :\n\n${url}`)
                      window.open(`mailto:${email}?subject=${subject}&body=${body}`)
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors"
                  >
                    Envoyer
                  </button>
                </div>
              </div>
              {data.fileUrl && (
                <a
                  href={data.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 transition-all"
                >
                  <span className="text-2xl">📥</span>
                  <span className="text-sm font-medium text-slate-700">Telecharger la presentation</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
