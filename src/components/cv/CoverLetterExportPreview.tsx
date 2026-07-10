'use client'

import type { CvDesignOptions, CvKit } from '@/lib/cv-schema'
import { CV_BG, readableAccentHex } from '@/lib/cv-color-utils'
import { formatCoverLetterSections } from '@/lib/cv-cover-letter-format'
import { cn } from '@/lib/utils'

type Props = {
  kit: CvKit
  design: CvDesignOptions
  coverLetter: string
  locale: 'fr' | 'en'
  className?: string
}

export function CoverLetterExportPreview({
  kit,
  design,
  coverLetter,
  locale,
  className,
}: Props) {
  const accent = design.accentHex
  const accentText = readableAccentHex(accent, CV_BG.white, 4.5)
  const fontClass =
    design.fontFamily === 'georgia'
      ? 'font-serif'
      : design.fontFamily === 'source'
        ? 'font-sans tracking-tight'
        : 'font-sans'

  const writingDate = new Intl.DateTimeFormat(
    locale === 'fr' ? 'fr-FR' : 'en-US',
    { day: '2-digit', month: 'long', year: 'numeric' },
  ).format(new Date())

  const letter = formatCoverLetterSections({
    raw: coverLetter,
    fullName: kit.profile.fullName,
    locale,
  })

  const title = locale === 'fr' ? 'Lettre de motivation' : 'Cover letter'

  return (
    <div
      data-cv-export-clone
      className={cn(
        'overflow-hidden bg-white text-slate-900 shadow-none',
        fontClass,
        className,
      )}
    >
      <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: accent }} aria-hidden />
      <div className="px-10 py-10">
        <h1
          className="text-[22px] font-bold leading-tight"
          style={{ color: accentText }}
        >
          {title}
        </h1>
        <div className="mt-2 h-[3px] w-12 rounded-full" style={{ backgroundColor: accent }} />

        <div className="mt-6 border-b border-slate-200 pb-5">
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-1 text-sm text-slate-800">
              <p className="font-bold text-[15px]">
                {kit.profile.fullName.trim() ||
                  (locale === 'fr' ? 'Prénom Nom' : 'First Last Name')}
              </p>
              <p>{kit.profile.contact?.phone?.trim() || (locale === 'fr' ? 'Téléphone : —' : 'Phone: —')}</p>
              <p className="break-all">
                {kit.profile.contact?.email?.trim() || (locale === 'fr' ? 'Email : —' : 'Email: —')}
              </p>
            </div>
            <p className="shrink-0 text-[13px] text-slate-600">{writingDate}</p>
          </div>
        </div>

        <div className="mt-8 space-y-5 text-[14px] leading-[1.7] text-slate-800">
          <p>{letter.greeting}</p>
          {letter.bodyParagraphs.map((paragraph, index) => (
            <p key={index} className="whitespace-pre-wrap">
              {paragraph}
            </p>
          ))}
          <p className="pt-2">{letter.closing}</p>
          <p className="font-semibold">{letter.signature}</p>
        </div>
      </div>
    </div>
  )
}
