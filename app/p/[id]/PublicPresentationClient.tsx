'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Grid, Maximize2, X, Settings } from 'lucide-react'

const SLIDE_COLORS = [
  { bg: 'from-violet-600 to-indigo-700', accent: '#a78bfa', num: 'bg-white/20 text-white' },
  { bg: 'from-rose-500 to-pink-700', accent: '#fb7185', num: 'bg-white/20 text-white' },
  { bg: 'from-amber-500 to-orange-600', accent: '#fcd34d', num: 'bg-white/20 text-white' },
  { bg: 'from-emerald-500 to-teal-700', accent: '#6ee7b7', num: 'bg-white/20 text-white' },
  { bg: 'from-sky-500 to-blue-700', accent: '#7dd3fc', num: 'bg-white/20 text-white' },
  { bg: 'from-fuchsia-500 to-purple-700', accent: '#e879f9', num: 'bg-white/20 text-white' },
]

type TransitionType = 'fade' | 'slide' | 'zoom'

const TRANSITIONS: { id: TransitionType; label: string }[] = [
  { id: 'fade', label: 'Fondu' },
  { id: 'slide', label: 'Glissement' },
  { id: 'zoom', label: 'Zoom' },
]

type Slide = {
  title: string
  content: string[]
  visual?: string
  imageUrl?: string
}

type PresentationData = {
  id: string
  title: string
  topic: string
  audience: string
  presentationType: string
  slideCount: number
  slidesJson: string
  templateSlug: string
}

export default function PublicPresentationClient({
  presentation,
}: {
  presentation: PresentationData
}) {
  const [mode, setMode] = useState<'grid' | 'slideshow'>('grid')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [transition, setTransition] = useState<TransitionType>('slide')
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const [animKey, setAnimKey] = useState(0)
  const [showSettings, setShowSettings] = useState(false)

  const slides: Slide[] = (() => {
    try {
      return JSON.parse(presentation.slidesJson ?? '[]') as Slide[]
    } catch {
      return []
    }
  })()

  const goNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setDirection('next')
      setAnimKey((k) => k + 1)
      setCurrentSlide((s) => s + 1)
    }
  }, [currentSlide, slides.length])

  const goPrev = useCallback(() => {
    if (currentSlide > 0) {
      setDirection('prev')
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
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [mode, goNext, goPrev])

  if (mode === 'slideshow') {
    const theme = SLIDE_COLORS[currentSlide % SLIDE_COLORS.length]
    const slide = slides[currentSlide]

    return (
      <div className={`fixed inset-0 z-50 bg-gradient-to-br ${theme.bg} flex flex-col`}>
        <div className="flex items-center justify-between px-8 py-4 bg-black/20 backdrop-blur-sm">
          <span className="text-white/80 text-sm font-medium">{presentation.title}</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSettings((s) => !s)}
              className="flex items-center gap-1.5 text-white/70 hover:text-white text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              Transition
            </button>
            {showSettings && (
              <div className="absolute top-16 right-16 bg-white rounded-xl shadow-xl p-3 z-50 flex gap-2">
                {TRANSITIONS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setTransition(t.id); setShowSettings(false) }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      transition === t.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={() => setMode('grid')}
              className="text-white/70 hover:text-white p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden">
          <div key={animKey} className="w-full h-full animate-in fade-in duration-500">
            {slide && (
              <div className="relative w-full h-full flex flex-col justify-center px-16 py-12">
                <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-20" style={{ background: theme.accent }} />
                <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10" style={{ background: theme.accent }} />
                <div className="relative z-10">
                  <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold mb-8 ${theme.num}`}>
                    {currentSlide + 1}
                  </span>
                  <h2 className="text-white text-4xl font-bold leading-tight mb-6 tracking-tight max-w-3xl">
                    {slide.title}
                  </h2>
                  <div className="w-16 h-1 bg-white/40 mb-8 rounded-full" />
                  <ul className="space-y-4 max-w-2xl">
                    {slide.content?.map((line, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <span className="mt-2 w-2 h-2 rounded-full flex-shrink-0" style={{ background: theme.accent }} />
                        <span className="text-white/90 text-xl leading-relaxed">{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between px-8 py-5 bg-black/20 backdrop-blur-sm">
          <button
            onClick={goPrev}
            disabled={currentSlide === 0}
            className="flex items-center gap-2 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Précédent</span>
          </button>
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > currentSlide ? 'next' : 'prev'); setAnimKey((k) => k + 1); setCurrentSlide(i) }}
                className={`rounded-full transition-all duration-200 ${i === currentSlide ? 'w-6 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'}`}
              />
            ))}
          </div>
          <button
            onClick={goNext}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center gap-2 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            <span className="text-sm">Suivant</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="text-center pb-3 text-white/30 text-xs">
          ← → Naviguer · Espace Suivant · Échap Quitter
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">{presentation.title}</h1>
            <p className="mt-0.5 text-xs text-slate-500">{presentation.topic} · {presentation.slideCount} slides</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium capitalize text-violet-700">
              {presentation.presentationType}
            </span>
            <button
              onClick={() => { setCurrentSlide(0); setMode('slideshow') }}
              className="flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              Présenter
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 rounded-xl bg-indigo-50 border border-indigo-100 px-4 py-3 text-sm text-indigo-700 flex items-center gap-2">
          🔗 Présentation partagée publiquement
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {slides.map((slide, index) => {
            const theme = SLIDE_COLORS[index % SLIDE_COLORS.length]
            return (
              <button
                key={index}
                onClick={() => { setCurrentSlide(index); setMode('slideshow') }}
                className={`relative rounded-2xl bg-gradient-to-br ${theme.bg} overflow-hidden shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 text-left`}
                style={{ minHeight: '280px' }}
              >
                <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-20" style={{ background: theme.accent }} />
                <div className="relative p-7 flex flex-col h-full">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold mb-4 ${theme.num}`}>
                    {index + 1}
                  </span>
                  <h2 className="text-white text-xl font-bold leading-tight mb-5 tracking-tight">{slide.title}</h2>
                  <div className="w-10 h-0.5 bg-white/40 mb-5 rounded-full" />
                  <ul className="space-y-2.5 flex-1">
                    {slide.content?.map((line, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: theme.accent }} />
                        <span className="text-white/90 text-sm leading-relaxed">{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
