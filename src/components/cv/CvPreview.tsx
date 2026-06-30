'use client'

import type { ReactNode } from 'react'

import type { CvDesignOptions, CvKit, CvTemplateSlug } from '@/lib/cv-schema'
import { CV_BG, mixHex, readableAccentHex, withAlphaHex } from '@/lib/cv-color-utils'
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

function withAlpha(hex: string, alpha: number): string {
  return withAlphaHex(hex, alpha)
}

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
  bgHex = CV_BG.white,
}: {
  children: ReactNode
  accent: string
  isDark: boolean
  className?: string
  bgHex?: string
}) {
  const labelColor = readableAccentHex(accent, bgHex, isDark ? 3 : 4.5)
  return (
    <div className={cn('mb-3', className)}>
      <h2
        className="text-[10px] font-bold uppercase tracking-[0.2em]"
        style={{ color: isDark ? '#94a3b8' : labelColor }}
      >
        {children}
      </h2>
      <div
        className="mt-2 h-[2px] w-9 rounded-full"
        style={{
          background: `linear-gradient(90deg, ${accent}, ${withAlpha(accent, 0.15)})`,
        }}
        aria-hidden
      />
    </div>
  )
}

function SkillPills({
  items,
  accent,
  isDark,
  bgHex,
}: {
  items: string[]
  accent: string
  isDark: boolean
  bgHex: string
}) {
  const pillBgHex = mixHex(accent, isDark ? 0.28 : 0.14, bgHex)
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full px-2.5 py-0.5 text-[11px] font-medium leading-snug"
          style={{
            color: readableAccentHex(accent, pillBgHex, 4.5),
            backgroundColor: withAlpha(accent, isDark ? 0.28 : 0.14),
            boxShadow: isDark ? 'none' : `inset 0 0 0 1px ${withAlpha(accent, 0.25)}`,
          }}
        >
          {item}
        </span>
      ))}
    </div>
  )
}

function ProfilePhoto({
  photoUrl,
  accent,
  isDark,
  placeholder,
  rounded = 'xl',
}: {
  photoUrl?: string
  accent: string
  isDark: boolean
  placeholder: string
  rounded?: 'full' | 'xl'
}) {
  const roundClass = rounded === 'full' ? 'rounded-full' : 'rounded-2xl'
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt=""
        className={cn(
          'mb-5 h-28 w-28 shrink-0 object-cover shadow-lg md:h-32 md:w-32',
          roundClass,
        )}
        style={{
          boxShadow: `0 8px 24px -8px ${withAlpha(accent, 0.45)}, 0 0 0 3px ${withAlpha(accent, 0.25)}`,
        }}
      />
    )
  }
  return (
    <div
      className={cn(
        'mb-5 flex h-28 w-28 shrink-0 items-center justify-center border-2 border-dashed text-center text-[10px] leading-snug md:h-32 md:w-32',
        roundClass,
        isDark ? 'border-slate-600 text-slate-500' : 'border-slate-300/80 text-slate-400',
      )}
      style={{ backgroundColor: withAlpha(accent, isDark ? 0.08 : 0.05) }}
    >
      {placeholder}
    </div>
  )
}

type Props = {
  kit: CvKit
  design: CvDesignOptions
  className?: string
}

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
    'mt-8 border-b pb-1.5 text-xs font-bold uppercase tracking-[0.14em]'

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/40 ring-1 ring-slate-100',
        fontClass,
        className,
      )}
    >
      <div
        className="h-1.5 w-full shrink-0"
        style={{
          background: `linear-gradient(90deg, ${accent}, ${withAlpha(accent, 0.5)})`,
        }}
        aria-hidden
      />
      <div className={cn(pad, 'text-slate-900')}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          {kit.profile.photoUrl ? (
            <img
              src={kit.profile.photoUrl}
              alt=""
              className="h-28 w-28 shrink-0 rounded-2xl object-cover shadow-md sm:h-32 sm:w-32"
              style={{ boxShadow: `0 0 0 3px ${withAlpha(accent, 0.3)}` }}
            />
          ) : null}
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {kit.profile.fullName}
            </h1>
            <p className="mt-1.5 text-base font-semibold" style={{ color: readableAccentHex(accent, CV_BG.white, 4.5) }}>
              {kit.profile.headline}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
              {loc ? <span>{loc}</span> : null}
              {ph ? <span>{ph}</span> : null}
              {em ? <span className="break-all">{em}</span> : null}
              {li ? <span className="break-all">{li}</span> : null}
            </div>
          </div>
        </div>

        <h2
          className={cn(sectionTitleClass, 'mt-8')}
          style={{ borderColor: withAlpha(accent, 0.35), color: accent }}
        >
          {ATS_HEADINGS.summary}
        </h2>
        <p className="mt-3 whitespace-pre-wrap leading-relaxed text-slate-700">
          {kit.profile.summary}
        </p>

        {kit.experience.length > 0 ? (
          <>
            <h2
              className={sectionTitleClass}
              style={{ borderColor: withAlpha(accent, 0.35), color: accent }}
            >
              {ATS_HEADINGS.experience}
            </h2>
            <ul className="mt-4 list-none space-y-6 p-0">
              {kit.experience.map((ex, i) => (
                <li
                  key={`${ex.company}-${i}`}
                  className="border-l-[3px] pl-4 text-slate-800"
                  style={{ borderColor: withAlpha(accent, 0.45) }}
                >
                  <p className="font-bold text-slate-900">{ex.role}</p>
                  <p className="text-sm font-semibold text-slate-700">{ex.company}</p>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {ex.period}
                  </p>
                  {ex.bullets.length > 0 ? (
                    <ul className="mt-2 space-y-1.5 pl-0">
                      {ex.bullets.map((b, j) => (
                        <li key={j} className="flex gap-2 text-sm leading-snug text-slate-700">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                          <span>{b}</span>
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
              className={sectionTitleClass}
              style={{ borderColor: withAlpha(accent, 0.35), color: accent }}
            >
              {ATS_HEADINGS.education}
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {kit.education.map((ed, i) => (
                <li key={`${ed.school}-${i}`}>
                  <span className="font-semibold text-slate-900">{ed.degree}</span>
                  {' · '}
                  {ed.school}
                  {ed.year ? ` (${ed.year})` : ''}
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {kit.skills.length > 0 ? (
          <>
            <h2
              className={sectionTitleClass}
              style={{ borderColor: withAlpha(accent, 0.35), color: accent }}
            >
              {ATS_HEADINGS.skills}
            </h2>
            <div className="mt-4 space-y-4">
              {kit.skills.map((g, i) => (
                <div key={`${g.name}-${i}`}>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    {g.name}
                  </p>
                  <div className="mt-2">
                    <SkillPills items={g.items} accent={accent} isDark={false} bgHex={CV_BG.slate50} />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

function sidebarStyles(slug: CvTemplateSlug, isDark: boolean) {
  return cn(
    'flex flex-col border-b md:min-h-[520px] md:border-b-0 md:border-r',
    slug === 'creative' &&
      'border-slate-700/80 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950',
    slug === 'minimalist' &&
      'border-slate-200/70 bg-gradient-to-b from-white to-slate-50/90',
    slug === 'modern' &&
      cn(
        'border-slate-200/80',
        !isDark && 'bg-gradient-to-b from-slate-50/95 to-white',
      ),
    slug === 'professional' &&
      'border-slate-300/60 bg-gradient-to-b from-slate-100/80 to-slate-50/50',
    slug === 'finance' &&
      'border-slate-300/70 bg-gradient-to-b from-slate-100 to-white',
  )
}

function headerStyles(slug: CvTemplateSlug, isDark: boolean) {
  return cn(
    'relative overflow-hidden border-b px-5 py-7 text-center md:px-10 md:py-8',
    isDark ? 'border-slate-700/80' : 'border-slate-200/80',
    slug === 'creative' && 'bg-slate-900/50',
    slug === 'modern' && !isDark && 'bg-white',
    slug === 'minimalist' && 'bg-white',
    slug === 'professional' && 'bg-slate-100/90',
    slug === 'finance' && 'bg-gradient-to-r from-slate-50 via-white to-slate-50',
  )
}

export function CvPreview({ kit, design, className }: Props) {
  const { t, locale } = useSiteLocale()

  if (design.templateSlug === 'ats') {
    return <AtsCvPreview kit={kit} design={design} className={className} />
  }

  const tpl = getCvTemplate(design.templateSlug)
  const slug = design.templateSlug
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
  const isDark = slug === 'creative'
  const photoRound = slug === 'modern' || slug === 'minimalist' ? 'full' : 'xl'
  const sidebarBgHex = isDark
    ? CV_BG.slate950
    : slug === 'professional' || slug === 'finance'
      ? CV_BG.slate100
      : CV_BG.slate50
  const mainBgHex = isDark ? CV_BG.slate950 : CV_BG.white
  const headerBgHex =
    slug === 'professional'
      ? CV_BG.slate100
      : slug === 'finance'
        ? CV_BG.slate50
        : isDark
          ? CV_BG.slate900
          : CV_BG.white
  const headlineAccent = readableAccentHex(
    accent,
    slug === 'minimalist' ? CV_BG.white : headerBgHex,
    4.5,
  )
  const companyAccent = readableAccentHex(accent, mainBgHex, 4.5)

  const mainText = isDark ? 'text-slate-100' : 'text-slate-800'
  const mutedText = isDark ? 'text-slate-400' : 'text-slate-500'
  const subtleText = isDark ? 'text-slate-500' : 'text-slate-400'

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
        'overflow-hidden rounded-2xl shadow-xl ring-1',
        isDark
          ? 'shadow-black/30 ring-slate-700/80'
          : 'shadow-slate-300/25 ring-slate-200/90',
        tpl.shellClass,
        fontClass,
        className,
      )}
    >
      <div
        className="h-1.5 w-full shrink-0"
        style={{
          background:
            slug === 'creative'
              ? `linear-gradient(90deg, ${accent}, ${withAlpha(accent, 0.2)})`
              : `linear-gradient(90deg, ${accent} 0%, ${withAlpha(accent, 0.55)} 55%, ${withAlpha(accent, 0.15)} 100%)`,
        }}
        aria-hidden
      />

      <div className="relative">
        {(slug === 'creative' || slug === 'finance') && (
          <div
            className={cn(
              'absolute bottom-0 left-0 top-1.5',
              slug === 'creative' ? 'w-1' : 'w-0.5',
            )}
            style={{ backgroundColor: accent }}
            aria-hidden
          />
        )}

        <header className={headerStyles(slug, isDark)}>
          <div
            className="pointer-events-none absolute inset-0 opacity-100"
            style={{
              background: isDark
                ? `radial-gradient(ellipse 80% 120% at 50% -20%, ${withAlpha(accent, 0.2)}, transparent 55%)`
                : `radial-gradient(ellipse 90% 80% at 50% 0%, ${withAlpha(accent, 0.1)}, transparent 65%)`,
            }}
            aria-hidden
          />
          <div className="relative">
            <p
              className={cn(
                'text-[10px] font-semibold uppercase tracking-[0.22em]',
                subtleText,
              )}
            >
              {t('cv.cv_object_label')}
            </p>
            <h1
              className={cn(
                'mx-auto mt-2 max-w-3xl text-xl font-bold leading-tight tracking-tight sm:text-2xl md:text-[1.75rem]',
                isDark ? 'text-white' : 'text-slate-900',
              )}
              style={
                !isDark && slug !== 'minimalist'
                  ? { color: headlineAccent }
                  : undefined
              }
            >
              {kit.profile.headline}
            </h1>
            {!isDark && slug === 'minimalist' ? (
              <div
                className="mx-auto mt-3 h-px w-12 rounded-full"
                style={{ backgroundColor: accent }}
                aria-hidden
              />
            ) : null}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(210px,31%)_1fr] md:items-stretch">
          <aside className={cn(sidebarStyles(slug, isDark), sidePad)}>
            <div className="flex flex-col items-center md:items-stretch">
              <ProfilePhoto
                photoUrl={kit.profile.photoUrl}
                accent={accent}
                isDark={isDark}
                placeholder={t('cv.photo')}
                rounded={photoRound}
              />

              <div className="w-full text-center md:text-left">
                <p
                  className={cn(
                    'text-xl font-bold leading-none tracking-tight md:text-2xl',
                    isDark ? 'text-white' : 'text-slate-900',
                  )}
                >
                  {first}
                </p>
                {last ? (
                  <p
                    className={cn(
                      'mt-1 text-lg font-semibold leading-tight tracking-tight md:text-xl',
                      isDark ? 'text-slate-200' : 'text-slate-700',
                    )}
                  >
                    {last}
                  </p>
                ) : null}
              </div>
            </div>

            {kit.profile.searchPeriod?.trim() ? (
              <div
                className="mt-6 rounded-xl px-3 py-2.5"
                style={{ backgroundColor: withAlpha(accent, isDark ? 0.12 : 0.06) }}
              >
                <SectionHeading accent={accent} isDark={isDark} bgHex={sidebarBgHex}>
                  {t('cv.search_period')}
                </SectionHeading>
                <p className={cn('text-sm font-medium leading-snug', mainText)}>
                  {kit.profile.searchPeriod}
                </p>
              </div>
            ) : null}

            <div className="mt-6 space-y-3">
              <SectionHeading accent={accent} isDark={isDark} bgHex={sidebarBgHex}>
                {t('cv.sidebar.contact')}
              </SectionHeading>
              <ul className="space-y-3">
                {loc ? (
                  <li className="text-sm leading-snug">
                    <span className={cn('block text-[10px] font-bold uppercase tracking-wider', isDark ? 'text-slate-400' : 'text-slate-500')}>
                      {locale === 'fr' ? 'Adresse' : 'Address'}
                    </span>
                    <span className={cn('break-words', mainText)}>{loc}</span>
                  </li>
                ) : null}
                {ph ? (
                  <li className="text-sm leading-snug">
                    <span className={cn('block text-[10px] font-bold uppercase tracking-wider', isDark ? 'text-slate-400' : 'text-slate-500')}>
                      {locale === 'fr' ? 'Téléphone' : 'Phone'}
                    </span>
                    <span className={mainText}>{ph}</span>
                  </li>
                ) : null}
                {em ? (
                  <li className="break-all text-sm leading-snug">
                    <span className={cn('block text-[10px] font-bold uppercase tracking-wider', isDark ? 'text-slate-400' : 'text-slate-500')}>
                      Email
                    </span>
                    <span className={mainText}>{em}</span>
                  </li>
                ) : null}
                {li ? (
                  <li className="break-all text-sm leading-snug">
                    <span className={cn('block text-[10px] font-bold uppercase tracking-wider', isDark ? 'text-slate-400' : 'text-slate-500')}>
                      LinkedIn
                    </span>
                    <span className={mainText}>{li}</span>
                  </li>
                ) : null}
              </ul>
            </div>

            {kit.skills.length > 0 ? (
              <div className="mt-7">
                <SectionHeading accent={accent} isDark={isDark} bgHex={sidebarBgHex}>
                  {t('cv.sec.skills')}
                </SectionHeading>
                <div className="space-y-4">
                  {kit.skills.map((g, i) => (
                    <div key={`${g.name}-${i}`}>
                      <p className={cn('text-xs font-bold uppercase tracking-wide', mutedText)}>
                        {g.name}
                      </p>
                      <div className="mt-2">
                        <SkillPills items={g.items} accent={accent} isDark={isDark} bgHex={sidebarBgHex} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {kit.education.length > 0 ? (
              <div className="mt-7">
                <SectionHeading accent={accent} isDark={isDark} bgHex={sidebarBgHex}>
                  {t('cv.sec.education')}
                </SectionHeading>
                <ul className="mt-1 space-y-3">
                  {kit.education.map((ed, i) => (
                    <li
                      key={`${ed.school}-${i}`}
                      className="rounded-lg border-l-[3px] pl-3 py-0.5"
                      style={{ borderColor: withAlpha(accent, 0.5) }}
                    >
                      <span className={cn('text-sm font-semibold', mainText)}>{ed.degree}</span>
                      <span className={cn('mt-0.5 block text-sm', mutedText)}>{ed.school}</span>
                      {ed.year ? (
                        <span className={cn('text-xs font-medium', subtleText)}>{ed.year}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {interestsLines ? (
              <div className="mt-7">
                <SectionHeading accent={accent} isDark={isDark} bgHex={sidebarBgHex}>
                  {t('cv.sidebar.interests')}
                </SectionHeading>
                <p className={cn('text-sm leading-relaxed', mutedText)}>{interestsLines}</p>
              </div>
            ) : null}
          </aside>

          <main
            className={cn(
              mainPad,
              isDark ? 'bg-slate-900/60 md:bg-slate-900/40' : 'bg-white',
            )}
          >
            <section
              className="rounded-2xl p-4 md:p-5"
              style={{
                backgroundColor: withAlpha(accent, isDark ? 0.08 : 0.05),
              }}
            >
              <SectionHeading accent={accent} isDark={isDark} bgHex={mainBgHex}>
                {t('cv.sec.profile')}
              </SectionHeading>
              <p
                className={cn(
                  'max-w-prose text-[15px] leading-[1.65]',
                  isDark ? 'text-slate-300' : 'text-slate-700',
                )}
              >
                {kit.profile.summary}
              </p>
            </section>

            {kit.experience.length > 0 ? (
              <section className="mt-8 md:mt-10">
                <SectionHeading accent={accent} isDark={isDark} bgHex={mainBgHex} className="mb-5">
                  {t('cv.sec.experience')}
                </SectionHeading>
                <ul className="relative space-y-5 md:space-y-6">
                  {kit.experience.map((ex, i) => (
                    <li
                      key={`${ex.company}-${i}`}
                      className={cn(
                        'relative rounded-2xl border p-4 pl-5 md:p-5',
                        isDark
                          ? 'border-slate-700/80 bg-slate-900/40'
                          : 'border-slate-200/80 bg-white shadow-sm shadow-slate-200/50',
                      )}
                      style={{
                        borderLeftWidth: 3,
                        borderLeftColor: accent,
                      }}
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
                          <span
                            className={cn(
                              'inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                              isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600',
                            )}
                          >
                            {ex.period}
                          </span>
                        ) : null}
                      </div>
                      <p
                        className={cn(
                          'mt-1 text-sm font-semibold',
                          isDark ? 'text-slate-300' : 'text-slate-600',
                        )}
                        style={{ color: !isDark ? companyAccent : undefined }}
                      >
                        {ex.company}
                      </p>
                      {ex.bullets.length > 0 ? (
                        <ul className="mt-3 space-y-2">
                          {ex.bullets.map((b, j) => (
                            <li
                              key={j}
                              className={cn(
                                'flex gap-2.5 text-sm leading-relaxed',
                                isDark ? 'text-slate-300' : 'text-slate-600',
                              )}
                            >
                              <span
                                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                                style={{ backgroundColor: accent }}
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
