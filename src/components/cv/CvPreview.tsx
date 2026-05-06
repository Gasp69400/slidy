'use client'

import type { ReactNode } from 'react'

import type { CvDesignOptions, CvKit } from '@/lib/cv-schema'
import { getCvTemplate } from '@/lib/cv-templates'
import { useSiteLocale } from '@/lib/site-locale'
import { cn } from '@/lib/utils'

const densitySidebar = {
  compact: 'p-4 gap-5 text-[13px]',
  normal: 'p-5 md:p-6 gap-6 text-[14px]',
  spacious: 'p-6 md:p-8 gap-7 text-[15px]',
} as const

const densityMain = {
  compact: 'p-4 md:p-6 gap-6 text-[13px]',
  normal: 'p-5 md:p-8 gap-8 text-[14px]',
  spacious: 'p-6 md:p-10 gap-10 text-[15px]',
} as const

function splitName(fullName: string): { first: string; last: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return { first: '', last: '' }
  if (parts.length === 1) return { first: parts[0], last: '' }
  return { first: parts[0], last: parts.slice(1).join(' ') }
}

function SectionHeading({
  children,
  accent,
  isDark,
  className,
}: {
  children: ReactNode
  accent: string
  isDark: boolean
  className?: string
}) {
  return (
    <h2
      className={cn(
        'flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.22em]',
        isDark ? 'text-slate-400' : 'text-slate-600',
        className,
      )}
    >
      <span
        className="h-3 w-0.5 shrink-0 rounded-full"
        style={{ backgroundColor: accent }}
        aria-hidden
      />
      {children}
    </h2>
  )
}

type Props = {
  kit: CvKit
  design: CvDesignOptions
  className?: string
}

/** Titres de section normalisés pour ATS (parsing logiciel). */
const ATS_HEADINGS = {
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
} as const

const atsDensity = {
  compact: 'max-w-3xl mx-auto p-6 gap-4 text-[13px] leading-relaxed',
  normal: 'max-w-3xl mx-auto p-7 gap-5 text-[14px] leading-relaxed',
  spacious: 'max-w-3xl mx-auto p-8 gap-6 text-[15px] leading-relaxed',
} as const

function AtsCvPreview({ kit, design, className }: Props) {
  const accent = design.accentHex
  const fontClass =
    design.fontFamily === 'georgia'
      ? 'font-serif'
      : design.fontFamily === 'source'
        ? 'font-sans tracking-tight'
        : 'font-sans'

  const pad = atsDensity[design.layoutDensity]
  const loc = kit.profile.contact?.location?.trim()
  const em = kit.profile.contact?.email?.trim()
  const ph = kit.profile.contact?.phone?.trim()
  const li = kit.profile.contact?.linkedin?.trim()

  const sectionTitleClass =
    'mt-7 border-b-2 pb-1 text-sm font-bold uppercase tracking-wide'

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm',
        fontClass,
        className,
      )}
    >
      <div
        className="h-1 w-full shrink-0"
        style={{ backgroundColor: accent }}
        aria-hidden
      />
      <div className={cn(pad, 'text-slate-900')}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          {kit.profile.photoUrl ? (
            <img
              src={kit.profile.photoUrl}
              alt=""
              className="h-28 w-28 shrink-0 rounded-xl object-cover shadow-sm sm:h-32 sm:w-32"
              style={{
                boxShadow: `0 0 0 2px ${accent}`,
              }}
            />
          ) : null}
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {kit.profile.fullName}
            </h1>
            <p
              className="mt-1 text-base font-semibold"
              style={{ color: accent }}
            >
              {kit.profile.headline}
            </p>
            <div className="mt-3 space-y-0.5 text-sm text-slate-800">
              {loc ? <p>{loc}</p> : null}
              {ph ? <p>{ph}</p> : null}
              {em ? <p>{em}</p> : null}
              {li ? <p>{li}</p> : null}
            </div>
            {kit.profile.searchPeriod?.trim() ? (
              <p className="mt-2 text-sm text-slate-700">
                {kit.profile.searchPeriod}
              </p>
            ) : null}
          </div>
        </div>

        <h2
          className={cn(sectionTitleClass, 'mt-6')}
          style={{ borderColor: accent, color: accent }}
        >
          {ATS_HEADINGS.summary}
        </h2>
        <p className="mt-2 whitespace-pre-wrap text-slate-800">
          {kit.profile.summary}
        </p>

        {kit.experience.length > 0 ? (
          <>
            <h2
              className={cn(sectionTitleClass, 'mt-7')}
              style={{ borderColor: accent, color: accent }}
            >
              {ATS_HEADINGS.experience}
            </h2>
            <ul className="mt-3 list-none space-y-5 p-0">
              {kit.experience.map((ex, i) => (
                <li key={`${ex.company}-${i}`} className="text-slate-800">
                  <p className="font-bold text-slate-900">{ex.role}</p>
                  <p className="font-semibold text-slate-800">{ex.company}</p>
                  <p className="text-sm text-slate-700">{ex.period}</p>
                  {ex.bullets.length > 0 ? (
                    <ul className="mt-2 list-disc space-y-1 pl-5 marker:text-slate-500">
                      {ex.bullets.map((b, j) => (
                        <li key={j} className="text-sm leading-snug text-slate-800">
                          {b}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {kit.education.length > 0 ? (
          <>
            <h2
              className={cn(sectionTitleClass, 'mt-7')}
              style={{ borderColor: accent, color: accent }}
            >
              {ATS_HEADINGS.education}
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-800 marker:text-slate-500">
              {kit.education.map((ed, i) => (
                <li key={`${ed.school}-${i}`}>
                  <span className="font-semibold">{ed.degree}</span>
                  {', '}
                  {ed.school}
                  {ed.year ? ` — ${ed.year}` : ''}
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {kit.skills.length > 0 ? (
          <>
            <h2
              className={cn(sectionTitleClass, 'mt-7')}
              style={{ borderColor: accent, color: accent }}
            >
              {ATS_HEADINGS.skills}
            </h2>
            <div className="mt-3 space-y-3 text-sm text-slate-800">
              {kit.skills.map((g, i) => (
                <p key={`${g.name}-${i}`}>
                  <span className="font-semibold" style={{ color: accent }}>
                    {g.name}:{' '}
                  </span>
                  {g.items.join(', ')}
                </p>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

export function CvPreview({ kit, design, className }: Props) {
  const { t, locale } = useSiteLocale()

  if (design.templateSlug === 'ats') {
    return <AtsCvPreview kit={kit} design={design} className={className} />
  }
  const tpl = getCvTemplate(design.templateSlug)
  const accent = design.accentHex
  const fontClass =
    design.fontFamily === 'georgia'
      ? 'font-serif'
      : design.fontFamily === 'source'
        ? 'font-sans tracking-tight'
        : 'font-sans'

  const sidePad = densitySidebar[design.layoutDensity]
  const mainPad = densityMain[design.layoutDensity]
  const { first, last } = splitName(kit.profile.fullName)
  const isDark = design.templateSlug === 'creative'

  const mainText = isDark ? 'text-slate-100' : 'text-slate-800'
  const mutedText = isDark ? 'text-slate-400' : 'text-slate-500'
  const subtleText = isDark ? 'text-slate-500' : 'text-slate-400'

  const sidebarClass = cn(
    'flex flex-col border-b md:min-h-[520px] md:border-b-0 md:border-r',
    design.templateSlug === 'creative' &&
      'border-slate-700 bg-slate-950 md:bg-gradient-to-b md:from-slate-900 md:to-slate-950',
    design.templateSlug === 'minimalist' &&
      'border-slate-200/80 bg-slate-100/90 md:shadow-[inset_-1px_0_0_0_rgba(15,23,42,0.06)]',
    design.templateSlug === 'modern' &&
      'border-slate-200 bg-slate-50 md:bg-gradient-to-b md:from-slate-50 md:to-slate-100/80 md:shadow-[inset_-1px_0_0_0_rgba(15,23,42,0.08)]',
    design.templateSlug === 'professional' &&
      'border-slate-300/70 bg-slate-200/40 md:bg-slate-100',
  )

  const loc = kit.profile.contact?.location?.trim()
  const em = kit.profile.contact?.email?.trim()
  const ph = kit.profile.contact?.phone?.trim()
  const li = kit.profile.contact?.linkedin?.trim()
  const interestsLines = Array.isArray(kit.profile.interests)
  ? kit.profile.interests.join(', ')
  : kit.profile.interests?.trim()

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-slate-200 shadow-md',
        tpl.shellClass,
        fontClass,
        className,
      )}
    >
      <div className="relative">
        {design.templateSlug === 'creative' && (
          <div
            className="absolute bottom-0 left-0 top-0 w-1.5"
            style={{ backgroundColor: accent }}
            aria-hidden
          />
        )}

        <header
          className={cn(
            'border-b px-5 py-6 text-center md:px-8 md:py-7',
            isDark ? 'border-slate-700 bg-slate-900/30' : 'border-slate-200 bg-white',
          )}
        >
          <p
            className={cn(
              'text-[10px] font-semibold uppercase tracking-[0.2em]',
              subtleText,
            )}
          >
            {t('cv.cv_object_label')}
          </p>
          <h1
            className={cn(
              'mx-auto mt-2 max-w-3xl text-xl font-bold leading-tight tracking-tight sm:text-2xl md:text-3xl',
              isDark ? 'text-white' : 'text-slate-900',
            )}
            style={
              !isDark
                ? {
                    color:
                      design.templateSlug === 'minimalist' ? '#0f172a' : accent,
                  }
                : undefined
            }
          >
            {kit.profile.headline}
          </h1>
        </header>

        {/* Deux colonnes : sidebar étroite + contenu principal */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(200px,32%)_1fr] md:items-stretch">
          <aside className={cn(sidebarClass, sidePad)}>
            <div className="flex flex-col items-center md:items-stretch">
              {kit.profile.photoUrl ? (
                <img
                  src={kit.profile.photoUrl}
                  alt=""
                  className={cn(
                    'mb-5 h-28 w-28 shrink-0 rounded-xl object-cover shadow-md ring-2 md:h-32 md:w-32',
                    isDark ? 'ring-slate-600' : 'ring-white',
                  )}
                />
              ) : (
                <div
                  className={cn(
                    'mb-5 flex h-28 w-28 shrink-0 items-center justify-center rounded-xl border-2 border-dashed text-center text-[10px] leading-snug md:h-32 md:w-32',
                    isDark
                      ? 'border-slate-600 text-slate-500'
                      : 'border-slate-300 text-slate-400',
                  )}
                >
                  {t('cv.photo')}
                </div>
              )}

              <div className="w-full text-center md:text-left">
                <p
                  className={cn(
                    'text-xl font-bold leading-tight md:text-2xl',
                    isDark ? 'text-white' : 'text-slate-900',
                  )}
                >
                  {first}
                </p>
                <p
                  className={cn(
                    'text-lg font-semibold leading-tight md:text-xl',
                    isDark ? 'text-slate-200' : 'text-slate-800',
                  )}
                >
                  {last}
                </p>
              </div>
            </div>

            {kit.profile.searchPeriod?.trim() ? (
              <div className="mt-5 border-t border-slate-200/50 pt-5 dark:border-slate-700/60">
                <SectionHeading accent={accent} isDark={isDark}>
                  {t('cv.search_period')}
                </SectionHeading>
                <p className={cn('mt-2 text-sm font-medium leading-snug', mainText)}>
                  {kit.profile.searchPeriod}
                </p>
              </div>
            ) : null}

            <div className="mt-5 space-y-3 border-t border-slate-200/50 pt-5 dark:border-slate-700/60">
              <SectionHeading accent={accent} isDark={isDark}>
                {t('cv.sidebar.contact')}
              </SectionHeading>
              <ul className="space-y-2.5">
                {loc ? (
                  <li className="text-sm leading-snug">
                    <span className={cn('block text-[10px] font-semibold uppercase tracking-wide', subtleText)}>
                      {locale === 'fr' ? 'Adresse' : 'Address'}
                    </span>
                    <span className={cn('break-words', mainText)}>{loc}</span>
                  </li>
                ) : null}
                {ph ? (
                  <li className="text-sm leading-snug">
                    <span className={cn('block text-[10px] font-semibold uppercase tracking-wide', subtleText)}>
                      {locale === 'fr' ? 'Téléphone' : 'Phone'}
                    </span>
                    <span className={mainText}>{ph}</span>
                  </li>
                ) : null}
                {em ? (
                  <li className="text-sm leading-snug break-all">
                    <span className={cn('block text-[10px] font-semibold uppercase tracking-wide', subtleText)}>
                      Email
                    </span>
                    <span className={mainText}>{em}</span>
                  </li>
                ) : null}
                {li ? (
                  <li className="text-sm leading-snug break-all">
                    <span className={cn('block text-[10px] font-semibold uppercase tracking-wide', subtleText)}>
                      LinkedIn
                    </span>
                    <span className={mainText}>{li}</span>
                  </li>
                ) : null}
                {!loc && !ph && !em && !li ? (
                  <li className={cn('text-sm italic', mutedText)}>
                    {locale === 'fr' ? 'Coordonnées à compléter' : 'Add contact details'}
                  </li>
                ) : null}
              </ul>
            </div>

            {kit.skills.length > 0 ? (
              <div className="mt-6 border-t border-slate-200/50 pt-6 dark:border-slate-700/60">
                <SectionHeading accent={accent} isDark={isDark} className="mb-3">
                  {t('cv.sec.skills')}
                </SectionHeading>
                <div className="space-y-4">
                  {kit.skills.map((g, i) => (
                    <div key={`${g.name}-${i}`}>
                      <p className={cn('text-sm font-semibold', mainText)}>{g.name}</p>
                      <p className={cn('mt-1 text-sm leading-relaxed', mutedText)}>
                        {g.items.join(' · ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {kit.education.length > 0 ? (
              <div className="mt-6 border-t border-slate-200/50 pt-6 dark:border-slate-700/60">
                <SectionHeading accent={accent} isDark={isDark} className="mb-3">
                  {t('cv.sec.education')}
                </SectionHeading>
                <ul
                  className={cn(
                    'space-y-3 text-sm leading-relaxed',
                    isDark ? 'text-slate-300' : 'text-slate-700',
                  )}
                >
                  {kit.education.map((ed, i) => (
                    <li key={`${ed.school}-${i}`} className="border-l-2 border-slate-300/60 pl-3 dark:border-slate-600">
                      <span className="font-semibold text-current">{ed.degree}</span>
                      <span className={cn('block text-sm', mutedText)}>{ed.school}</span>
                      {ed.year ? (
                        <span className={cn('text-xs', subtleText)}>{ed.year}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {interestsLines ? (
              <div className="mt-6 border-t border-slate-200/50 pt-6 dark:border-slate-700/60">
                <SectionHeading accent={accent} isDark={isDark} className="mb-3">
                  {t('cv.sidebar.interests')}
                </SectionHeading>
                <div
                  className={cn(
                    'whitespace-pre-line text-sm leading-relaxed',
                    mutedText,
                  )}
                >
                  {interestsLines}
                </div>
              </div>
            ) : null}
          </aside>

          <main
            className={cn(
              mainPad,
              isDark ? 'bg-slate-900/20 md:bg-transparent' : 'bg-white',
            )}
          >
            <section>
              <SectionHeading accent={accent} isDark={isDark} className="mb-3">
                {t('cv.sec.profile')}
              </SectionHeading>
              <p
                className={cn(
                  'max-w-prose leading-relaxed',
                  isDark ? 'text-slate-300' : 'text-slate-700',
                )}
              >
                {kit.profile.summary}
              </p>
            </section>

            {kit.experience.length > 0 ? (
              <section className="mt-8 md:mt-10">
                <SectionHeading accent={accent} isDark={isDark} className="mb-4 md:mb-5">
                  {t('cv.sec.experience')}
                </SectionHeading>
                <ul className="space-y-5 md:space-y-6">
                  {kit.experience.map((ex, i) => (
                    <li
                      key={`${ex.company}-${i}`}
                      className={cn(
                        'rounded-xl border p-4 md:p-5',
                        isDark
                          ? 'border-slate-700 bg-slate-900/35'
                          : 'border-slate-200/90 bg-slate-50/60 shadow-sm',
                      )}
                    >
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <h3
                          className={cn(
                            'text-base font-bold leading-snug md:text-[17px]',
                            isDark ? 'text-white' : 'text-slate-900',
                          )}
                        >
                          {ex.role}
                        </h3>
                        {ex.period ? (
                          <p
                            className={cn(
                              'shrink-0 text-xs font-semibold uppercase tracking-wide sm:text-right',
                              mutedText,
                            )}
                          >
                            {ex.period}
                          </p>
                        ) : null}
                      </div>
                      <p
                        className={cn(
                          'mt-1 text-sm font-semibold',
                          isDark ? 'text-slate-300' : 'text-slate-700',
                        )}
                      >
                        {ex.company}
                      </p>
                      {ex.bullets.length > 0 ? (
                        <ul
                          className={cn(
                            'mt-3 space-y-2 border-t border-slate-200/70 pt-3 dark:border-slate-700',
                          )}
                        >
                          {ex.bullets.map((b, j) => (
                            <li
                              key={j}
                              className={cn(
                                'flex gap-2 text-sm leading-relaxed',
                                isDark ? 'text-slate-300' : 'text-slate-600',
                              )}
                            >
                              <span
                                className="mt-2 h-1 w-1 shrink-0 rounded-full bg-current opacity-50"
                                aria-hidden
                              />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  )
}
