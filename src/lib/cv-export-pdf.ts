import {
  PDFDocument,
  StandardFonts,
  type PDFFont,
  type PDFImage,
  type PDFPage,
  rgb,
  type RGB,
} from 'pdf-lib'

import type { CvDesignOptions, CvDocumentMetadata, CvTemplateSlug } from '@/lib/cv-schema'
import { formatCoverLetterSections } from '@/lib/cv-cover-letter-format'
import {
  CV_BG,
  mixHex,
  parseHexNormalized,
  readableAccentHex,
  rgb255ToHex,
} from '@/lib/cv-color-utils'

type PdfColor = { r: number; g: number; b: number }

function parseHexColor(hex: string): PdfColor {
  return parseHexNormalized(hex)
}

function toRgb(c: PdfColor): RGB {
  return rgb(c.r, c.g, c.b)
}

function mix(fg: PdfColor, alpha: number, bg: PdfColor): PdfColor {
  return {
    r: fg.r * alpha + bg.r * (1 - alpha),
    g: fg.g * alpha + bg.g * (1 - alpha),
    b: fg.b * alpha + bg.b * (1 - alpha),
  }
}

type PdfCvTheme = {
  isDark: boolean
  pageBg: PdfColor
  headerBg: PdfColor
  sidebarBg: PdfColor
  mainBg: PdfColor
  textPrimary: PdfColor
  textSecondary: PdfColor
  textMuted: PdfColor
  textSubtle: PdfColor
  cardBg: PdfColor
  cardBorder: PdfColor
  leftStripeWidth: number
  headlineUsesAccent: boolean
}

function getPdfCvTheme(slug: CvTemplateSlug): PdfCvTheme {
  const white: PdfColor = { r: 1, g: 1, b: 1 }
  const slate50: PdfColor = { r: 0.984, g: 0.984, b: 0.988 }
  const slate100: PdfColor = { r: 0.961, g: 0.969, b: 0.98 }
  const slate950: PdfColor = { r: 0.02, g: 0.04, b: 0.1 }

  switch (slug) {
    case 'creative':
      return {
        isDark: true,
        pageBg: slate950,
        headerBg: { r: 0.07, g: 0.1, b: 0.17 },
        sidebarBg: { r: 0.04, g: 0.06, b: 0.11 },
        mainBg: slate950,
        textPrimary: white,
        textSecondary: { r: 0.88, g: 0.91, b: 0.94 },
        textMuted: { r: 0.72, g: 0.76, b: 0.82 },
        textSubtle: { r: 0.62, g: 0.67, b: 0.74 },
        cardBg: { r: 0.1, g: 0.13, b: 0.2 },
        cardBorder: { r: 0.22, g: 0.26, b: 0.34 },
        leftStripeWidth: 4,
        headlineUsesAccent: false,
      }
    case 'minimalist':
      return {
        isDark: false,
        pageBg: white,
        headerBg: white,
        sidebarBg: slate50,
        mainBg: white,
        textPrimary: { r: 0.06, g: 0.09, b: 0.16 },
        textSecondary: { r: 0.2, g: 0.25, b: 0.33 },
        textMuted: { r: 0.4, g: 0.45, b: 0.52 },
        textSubtle: { r: 0.55, g: 0.58, b: 0.65 },
        cardBg: white,
        cardBorder: { r: 0.88, g: 0.9, b: 0.93 },
        leftStripeWidth: 0,
        headlineUsesAccent: false,
      }
    case 'professional':
      return {
        isDark: false,
        pageBg: white,
        headerBg: slate100,
        sidebarBg: { r: 0.945, g: 0.955, b: 0.97 },
        mainBg: white,
        textPrimary: { r: 0.06, g: 0.09, b: 0.16 },
        textSecondary: { r: 0.22, g: 0.27, b: 0.35 },
        textMuted: { r: 0.42, g: 0.47, b: 0.54 },
        textSubtle: { r: 0.55, g: 0.58, b: 0.65 },
        cardBg: white,
        cardBorder: { r: 0.86, g: 0.88, b: 0.91 },
        leftStripeWidth: 0,
        headlineUsesAccent: true,
      }
    case 'finance':
      return {
        isDark: false,
        pageBg: white,
        headerBg: slate50,
        sidebarBg: slate100,
        mainBg: white,
        textPrimary: { r: 0.06, g: 0.09, b: 0.16 },
        textSecondary: { r: 0.2, g: 0.25, b: 0.33 },
        textMuted: { r: 0.4, g: 0.45, b: 0.52 },
        textSubtle: { r: 0.55, g: 0.58, b: 0.65 },
        cardBg: white,
        cardBorder: { r: 0.82, g: 0.85, b: 0.88 },
        leftStripeWidth: 2,
        headlineUsesAccent: true,
      }
    case 'modern':
    default:
      return {
        isDark: false,
        pageBg: white,
        headerBg: white,
        sidebarBg: { r: 0.975, g: 0.978, b: 0.99 },
        mainBg: white,
        textPrimary: { r: 0.06, g: 0.09, b: 0.16 },
        textSecondary: { r: 0.2, g: 0.25, b: 0.33 },
        textMuted: { r: 0.4, g: 0.45, b: 0.52 },
        textSubtle: { r: 0.55, g: 0.58, b: 0.65 },
        cardBg: white,
        cardBorder: { r: 0.88, g: 0.9, b: 0.93 },
        leftStripeWidth: 0,
        headlineUsesAccent: true,
      }
  }
}

function wrapWords(
  text: string,
  maxW: number,
  font: PDFFont,
  size: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    const trial = cur ? `${cur} ${w}` : w
    if (font.widthOfTextAtSize(trial, size) <= maxW) cur = trial
    else {
      if (cur) lines.push(cur)
      cur = w
    }
  }
  if (cur) lines.push(cur)
  return lines.length ? lines : ['']
}

function wrapParagraphs(
  text: string,
  maxW: number,
  font: PDFFont,
  size: number,
): string[] {
  const paras = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  const out: string[] = []
  for (const p of paras) {
    for (const line of p.split('\n')) {
      out.push(...wrapWords(line, maxW, font, size))
      out.push('')
    }
  }
  while (out.length && out[out.length - 1] === '') out.pop()
  return out
}

async function tryEmbedProfilePhoto(
  pdf: PDFDocument,
  photoUrl?: string,
): Promise<PDFImage | null> {
  const raw = photoUrl?.trim()
  if (!raw) return null
  try {
    if (raw.startsWith('data:image/png')) {
      const b64 = raw.split(',')[1]
      if (!b64) return null
      const bytes = Uint8Array.from(Buffer.from(b64, 'base64'))
      return pdf.embedPng(bytes)
    }
    if (raw.startsWith('data:image/jpeg') || raw.startsWith('data:image/jpg')) {
      const b64 = raw.split(',')[1]
      if (!b64) return null
      const bytes = Uint8Array.from(Buffer.from(b64, 'base64'))
      try {
        return await pdf.embedJpg(bytes)
      } catch {
        return null
      }
    }
    if (raw.startsWith('data:image/webp')) {
      const b64 = raw.split(',')[1]
      if (!b64) return null
      const bytes = Uint8Array.from(Buffer.from(b64, 'base64'))
      try {
        return await pdf.embedPng(bytes)
      } catch {
        return null
      }
    }
    if (raw.startsWith('http://') || raw.startsWith('https://')) {
      const res = await fetch(raw)
      if (!res.ok) return null
      const buf = new Uint8Array(await res.arrayBuffer())
      try {
        return await pdf.embedPng(buf)
      } catch {
        return await pdf.embedJpg(buf)
      }
    }
  } catch {
    return null
  }
  return null
}

function themeToBgHex(theme: PdfCvTheme, area: 'page' | 'sidebar' | 'main' | 'header' | 'card'): string {
  const pick = (c: PdfColor) => rgb255ToHex({
    r: c.r * 255,
    g: c.g * 255,
    b: c.b * 255,
  })
  if (area === 'page') return pick(theme.pageBg)
  if (area === 'sidebar') return pick(theme.sidebarBg)
  if (area === 'main') return pick(theme.mainBg)
  if (area === 'header') return pick(theme.headerBg)
  return pick(theme.cardBg)
}

function paintPageShell(
  page: PDFPage,
  pageW: number,
  pageH: number,
  theme: PdfCvTheme,
  accent: PdfColor,
) {
  page.drawRectangle({
    x: 0,
    y: 0,
    width: pageW,
    height: pageH,
    color: toRgb(theme.pageBg),
  })
  page.drawRectangle({
    x: 0,
    y: pageH - 6,
    width: pageW,
    height: 6,
    color: toRgb(accent),
  })
  if (theme.leftStripeWidth > 0) {
    page.drawRectangle({
      x: 0,
      y: 0,
      width: theme.leftStripeWidth,
      height: pageH,
      color: toRgb(accent),
    })
  }
}

function drawSectionHeading(
  page: PDFPage,
  x: number,
  y: number,
  title: string,
  accent: PdfColor,
  theme: PdfCvTheme,
  fontBold: PDFFont,
  accentHex: string,
  bgHex: string,
): number {
  const size = 7
  const labelColor = readableAccentHex(
    accentHex,
    bgHex,
    theme.isDark ? 3 : 4.5,
  )
  page.drawText(title.toUpperCase(), {
    x,
    y,
    size,
    font: fontBold,
    color: toRgb(parseHexNormalized(labelColor)),
  })
  page.drawRectangle({
    x,
    y: y - 10,
    width: 32,
    height: 2,
    color: toRgb(accent),
  })
  return y - 18
}

function measureSkillPillsHeight(
  items: string[],
  maxW: number,
  font: PDFFont,
  size: number,
): number {
  const pillH = 14
  const gap = 4
  let x = 0
  let rows = 1
  for (const item of items) {
    const pillW = font.widthOfTextAtSize(item, size) + 12
    if (x > 0 && x + pillW > maxW) {
      rows += 1
      x = 0
    }
    x += pillW + gap
  }
  return rows * pillH + (rows - 1) * gap
}

function drawSkillPills(
  page: PDFPage,
  items: string[],
  xStart: number,
  yTop: number,
  maxW: number,
  accent: PdfColor,
  theme: PdfCvTheme,
  font: PDFFont,
  accentHex: string,
  sidebarBgHex: string,
): number {
  const size = 8
  const pillH = 14
  const gap = 4
  let x = xStart
  let rowY = yTop

  for (const item of items) {
    const pillW = font.widthOfTextAtSize(item, size) + 12
    if (x > xStart && x + pillW > xStart + maxW) {
      x = xStart
      rowY -= pillH + gap
    }
    const pillBgHex = mixHex(accentHex, theme.isDark ? 0.28 : 0.14, sidebarBgHex)
    const pillTextHex = readableAccentHex(accentHex, pillBgHex, 4.5)
    page.drawRectangle({
      x,
      y: rowY - pillH,
      width: pillW,
      height: pillH,
      color: toRgb(parseHexNormalized(pillBgHex)),
      borderColor: toRgb(parseHexNormalized(mixHex(accentHex, 0.25, sidebarBgHex))),
      borderWidth: theme.isDark ? 0 : 0.4,
    })
    page.drawText(item, {
      x: x + 6,
      y: rowY - pillH + 4,
      size,
      font,
      color: toRgb(parseHexNormalized(pillTextHex)),
    })
    x += pillW + gap
  }
  return rowY - pillH - 6
}

export async function exportCvCoverToPdf(input: {
  design: CvDesignOptions
  metadata: CvDocumentMetadata
}): Promise<Buffer> {
  const pdf = await PDFDocument.create()
  const { design, metadata } = input
  const kit = metadata.cvKit
  const accent = parseHexColor(design.accentHex)
  const accentHex = design.accentHex
  const loc = metadata.locale ?? 'fr'
  const L =
    loc === 'fr'
      ? {
          profile: 'Profil',
          experience: 'Expérience professionnelle',
          education: 'Formation',
          skills: 'Compétences',
          interests: 'Activités & centres d’intérêt',
          contact: 'Coordonnées',
          searchPeriod: 'Disponibilité',
          cvLabel: 'Curriculum Vitae',
          letter: 'Lettre de motivation',
        }
      : {
          profile: 'Profile',
          experience: 'Professional experience',
          education: 'Education',
          skills: 'Skills',
          interests: 'Activities & interests',
          contact: 'Contact',
          searchPeriod: 'Availability',
          cvLabel: 'Curriculum Vitae',
          letter: 'Cover letter',
        }
  const writingDate = new Intl.DateTimeFormat(
    loc === 'fr' ? 'fr-FR' : 'en-US',
    { day: '2-digit', month: 'long', year: 'numeric' },
  ).format(new Date())

  const useSerif = design.fontFamily === 'georgia'
  const fontRegular = await pdf.embedFont(
    useSerif ? StandardFonts.TimesRoman : StandardFonts.Helvetica,
  )
  const fontBold = await pdf.embedFont(
    useSerif ? StandardFonts.TimesRomanBold : StandardFonts.HelveticaBold,
  )

  const lineGap =
    design.layoutDensity === 'compact'
      ? 11
      : design.layoutDensity === 'spacious'
        ? 16
        : 13
  const margin =
    design.layoutDensity === 'compact' ? 40 : design.layoutDensity === 'spacious' ? 52 : 46
  const pageW = 595
  const pageH = 842
  const slug = design.templateSlug

  let page = pdf.addPage([pageW, pageH])
  let y = pageH - margin

  const newPagePlain = () => {
    page = pdf.addPage([pageW, pageH])
    page.drawRectangle({
      x: 0,
      y: 0,
      width: pageW,
      height: pageH,
      color: rgb(1, 1, 1),
    })
    y = pageH - margin
  }

  if (slug === 'ats') {
    const atsW = pageW - 2 * margin
    const atsX = margin
    const accentRgb = toRgb(accent)
    const theme = getPdfCvTheme('modern')

    paintPageShell(page, pageW, pageH, theme, accent)

    const drawAts = (
      text: string,
      size: number,
      bold = false,
      color = toRgb({ r: 0.12, g: 0.14, b: 0.18 }),
    ) => {
      const font = bold ? fontBold : fontRegular
      for (const line of wrapWords(text, atsW, font, size)) {
        if (y < margin + 26) {
          newPagePlain()
          paintPageShell(page, pageW, pageH, theme, accent)
        }
        page.drawText(line, { x: atsX, y, size, font, color })
        y -= size + lineGap * 0.35
      }
    }

    const drawAtsLines = (lines: string[], size: number) => {
      for (const line of lines) {
        if (!line.trim()) {
          y -= lineGap * 0.5
          continue
        }
        if (y < margin + 26) {
          newPagePlain()
          paintPageShell(page, pageW, pageH, theme, accent)
        }
        page.drawText(line, {
          x: atsX,
          y,
          size,
          font: fontRegular,
          color: toRgb({ r: 0.15, g: 0.17, b: 0.22 }),
        })
        y -= size + lineGap * 0.35
      }
    }

    const H = {
      summary: 'Professional Summary',
      experience: 'Work Experience',
      education: 'Education',
      skills: 'Skills',
    }

    y = pageH - margin - 8

    const photoImg = await tryEmbedProfilePhoto(pdf, kit.profile.photoUrl)
    if (photoImg) {
      let photoH = 64
      let photoW = (photoImg.width * photoH) / photoImg.height
      const maxW = 100
      if (photoW > maxW) {
        photoW = maxW
        photoH = (photoImg.height * maxW) / photoImg.width
      }
      page.drawRectangle({
        x: atsX - 3,
        y: y - photoH - 3,
        width: photoW + 6,
        height: photoH + 6,
        color: toRgb(mix(accent, 0.3, theme.pageBg)),
      })
      page.drawImage(photoImg, { x: atsX, y: y - photoH, width: photoW, height: photoH })
      y -= photoH + 14
    }

    drawAts(kit.profile.fullName, 16, true)
    drawAts(kit.profile.headline, 11, false, accentRgb)
    y -= 2
    const la = kit.profile.contact?.location?.trim()
    const pb = kit.profile.contact?.phone?.trim()
    const ea = kit.profile.contact?.email?.trim()
    const ld = kit.profile.contact?.linkedin?.trim()
    if (la) drawAts(la, 9)
    if (pb) drawAts(pb, 9)
    if (ea) drawAts(ea, 9)
    if (ld) drawAts(ld, 9)
    if (kit.profile.searchPeriod?.trim()) {
      y -= 2
      drawAts(kit.profile.searchPeriod.trim(), 9, false, toRgb(theme.textMuted))
    }

    y = drawSectionHeading(page, atsX, y - 6, H.summary, accent, theme, fontBold, accentHex, CV_BG.white)
    drawAtsLines(wrapParagraphs(kit.profile.summary, atsW, fontRegular, 10), 10)

    if (kit.experience.length) {
      y -= 4
      y = drawSectionHeading(page, atsX, y, H.experience, accent, theme, fontBold, accentHex, CV_BG.white)
      for (const ex of kit.experience) {
        page.drawRectangle({
          x: atsX,
          y: y - 2,
          width: 3,
          height: 48,
          color: toRgb(mix(accent, 0.45, theme.pageBg)),
        })
        drawAts(ex.role, 10, true)
        drawAts(ex.company, 9, true, toRgb({ r: 0.2, g: 0.22, b: 0.28 }))
        drawAts(ex.period, 8, false, toRgb(theme.textMuted))
        for (const b of ex.bullets) drawAts(`• ${b}`, 9)
        y -= 6
      }
    }

    if (kit.education.length) {
      y -= 2
      y = drawSectionHeading(page, atsX, y, H.education, accent, theme, fontBold, accentHex, CV_BG.white)
      for (const ed of kit.education) {
        drawAts(`${ed.degree}, ${ed.school}${ed.year ? ` (${ed.year})` : ''}`, 9)
      }
    }

    if (kit.skills.length) {
      y -= 2
      y = drawSectionHeading(page, atsX, y, H.skills, accent, theme, fontBold, accentHex, CV_BG.white)
      for (const g of kit.skills) {
        drawAts(g.name, 8, true, toRgb(theme.textMuted))
        y = drawSkillPills(page, g.items, atsX, y, atsW, accent, theme, fontRegular, accentHex, CV_BG.white)
      }
    }

    y -= 10
  } else {
    const theme = getPdfCvTheme(slug)
    const sidebarBgHex = themeToBgHex(theme, 'sidebar')
    const mainBgHex = themeToBgHex(theme, 'main')
    const headerBgHex = themeToBgHex(theme, 'header')
    const accentOnHeader = readableAccentHex(
      accentHex,
      headerBgHex,
      theme.isDark ? 3 : 4.5,
    )
    const accentOnMain = readableAccentHex(accentHex, mainBgHex, 4.5)
    const contentInset = theme.leftStripeWidth > 0 ? theme.leftStripeWidth + 10 : 0
    const sidebarW = 172
    const colGap = 14
    const sidebarX = margin + contentInset
    const sidebarTextW = sidebarW - 8
    const mainX = sidebarX + sidebarW + colGap
    const mainW = pageW - margin - mainX
    const headlineSize = 15

    paintPageShell(page, pageW, pageH, theme, accent)

    const headerTop = pageH - 6 - 12
    const headlineLines = wrapWords(
      kit.profile.headline,
      pageW - 2 * margin - contentInset,
      fontBold,
      headlineSize,
    )
    const headerH = 52 + headlineLines.length * (headlineSize + 6) + (slug === 'minimalist' ? 8 : 0)
    const headerBottom = headerTop - headerH

    page.drawRectangle({
      x: contentInset,
      y: headerBottom,
      width: pageW - contentInset,
      height: headerTop - headerBottom,
      color: toRgb(theme.headerBg),
    })
    page.drawLine({
      start: { x: contentInset, y: headerBottom },
      end: { x: pageW, y: headerBottom },
      thickness: 0.5,
      color: toRgb(theme.cardBorder),
    })

    const cvLabelW = fontBold.widthOfTextAtSize(L.cvLabel.toUpperCase(), 7)
    page.drawText(L.cvLabel.toUpperCase(), {
      x: (pageW - cvLabelW) / 2,
      y: headerTop - 14,
      size: 7,
      font: fontBold,
      color: toRgb(parseHexNormalized(readableAccentHex(accentHex, headerBgHex, 3))),
    })

    let hy = headerTop - 28
    for (const line of headlineLines) {
      const lw = fontBold.widthOfTextAtSize(line, headlineSize)
      page.drawText(line, {
        x: (pageW - lw) / 2,
        y: hy,
        size: headlineSize,
        font: fontBold,
        color: toRgb(
          parseHexNormalized(
            theme.headlineUsesAccent ? accentOnHeader : theme.isDark ? '#ffffff' : '#0f172a',
          ),
        ),
      })
      hy -= headlineSize + 6
    }

    if (slug === 'minimalist') {
      page.drawRectangle({
        x: (pageW - 36) / 2,
        y: hy + 2,
        width: 36,
        height: 1.5,
        color: toRgb(accent),
      })
    }

    const columnsTop = headerBottom - 14
    let yL = columnsTop
    let yR = columnsTop
    const contentBottom = margin + 16

    const paintColumnBackgrounds = (topY: number) => {
      const colH = Math.max(0, topY - contentBottom)
      page.drawRectangle({
        x: sidebarX - 6,
        y: contentBottom,
        width: sidebarW + 4,
        height: colH,
        color: toRgb(theme.sidebarBg),
      })
      page.drawRectangle({
        x: mainX - 4,
        y: contentBottom,
        width: mainW + 8,
        height: colH,
        color: toRgb(theme.mainBg),
      })
      page.drawLine({
        start: { x: sidebarX + sidebarW + colGap / 2, y: contentBottom },
        end: { x: sidebarX + sidebarW + colGap / 2, y: topY },
        thickness: 0.4,
        color: toRgb(theme.cardBorder),
      })
    }

    paintColumnBackgrounds(columnsTop)

    const newPageCv = () => {
      page = pdf.addPage([pageW, pageH])
      paintPageShell(page, pageW, pageH, theme, accent)
      const contTop = pageH - margin - 12
      yL = contTop
      yR = contTop
      paintColumnBackgrounds(contTop)
    }

    const ensureSidebarSpace = (needed: number) => {
      if (yL - needed < contentBottom) newPageCv()
    }
    const ensureMainSpace = (needed: number) => {
      if (yR - needed < contentBottom) newPageCv()
    }

    const drawL = (
      text: string,
      size: number,
      bold = false,
      color = theme.textPrimary,
    ) => {
      const font = bold ? fontBold : fontRegular
      for (const line of wrapWords(text, sidebarTextW, font, size)) {
        ensureSidebarSpace(size + 4)
        page.drawText(line, {
          x: sidebarX,
          y: yL,
          size,
          font,
          color: toRgb(color),
        })
        yL -= size + lineGap * 0.32
      }
    }

    const drawLinesL = (lines: string[], size: number, color = theme.textMuted) => {
      for (const line of lines) {
        if (!line.trim()) {
          yL -= lineGap * 0.4
          continue
        }
        ensureSidebarSpace(size + 4)
        page.drawText(line, {
          x: sidebarX,
          y: yL,
          size,
          font: fontRegular,
          color: toRgb(color),
        })
        yL -= size + lineGap * 0.32
      }
    }

    const drawR = (
      text: string,
      size: number,
      bold = false,
      color = theme.textPrimary,
    ) => {
      const font = bold ? fontBold : fontRegular
      for (const line of wrapWords(text, mainW - 16, font, size)) {
        ensureMainSpace(size + 4)
        page.drawText(line, {
          x: mainX,
          y: yR,
          size,
          font,
          color: toRgb(color),
        })
        yR -= size + lineGap * 0.32
      }
    }

    const drawLinesR = (lines: string[], size: number, color = theme.textSecondary) => {
      for (const line of lines) {
        if (!line.trim()) {
          yR -= lineGap * 0.4
          continue
        }
        ensureMainSpace(size + 4)
        page.drawText(line, {
          x: mainX,
          y: yR,
          size,
          font: fontRegular,
          color: toRgb(color),
        })
        yR -= size + lineGap * 0.32
      }
    }

    const photoImg = await tryEmbedProfilePhoto(pdf, kit.profile.photoUrl)
    if (photoImg) {
      let photoH = 68
      let photoW = (photoImg.width * photoH) / photoImg.height
      if (photoW > sidebarTextW) {
        photoW = sidebarTextW
        photoH = (photoImg.height * sidebarTextW) / photoImg.width
      }
      ensureSidebarSpace(photoH + 16)
      page.drawRectangle({
        x: sidebarX - 3,
        y: yL - photoH - 3,
        width: photoW + 6,
        height: photoH + 6,
        color: toRgb(mix(accent, 0.25, theme.sidebarBg)),
      })
      page.drawImage(photoImg, {
        x: sidebarX,
        y: yL - photoH,
        width: photoW,
        height: photoH,
      })
      yL -= photoH + 12
    }

    const nameParts = kit.profile.fullName.trim().split(/\s+/).filter(Boolean)
    const firstName = nameParts[0] ?? ''
    const lastName = nameParts.slice(1).join(' ')
    if (firstName) drawL(firstName, 13, true, theme.textPrimary)
    if (lastName) drawL(lastName, 11, true, theme.textSecondary)

    if (kit.profile.searchPeriod?.trim()) {
      yL -= 10
      const boxPad = 10
      const boxLines = wrapWords(
        kit.profile.searchPeriod.trim(),
        sidebarTextW - boxPad * 2,
        fontRegular,
        8.5,
      )
      const boxH = boxPad * 2 + 18 + boxLines.length * 11
      ensureSidebarSpace(boxH + 4)
      const boxBottom = yL - boxH
      page.drawRectangle({
        x: sidebarX,
        y: boxBottom,
        width: sidebarTextW,
        height: boxH,
        color: toRgb(parseHexNormalized(mixHex(accentHex, theme.isDark ? 0.12 : 0.06, sidebarBgHex))),
      })
      let by = yL - boxPad
      by = drawSectionHeading(
        page,
        sidebarX + boxPad,
        by,
        L.searchPeriod,
        accent,
        theme,
        fontBold,
        accentHex,
        sidebarBgHex,
      )
      for (const line of boxLines) {
        page.drawText(line, {
          x: sidebarX + boxPad,
          y: by,
          size: 8.5,
          font: fontRegular,
          color: toRgb(theme.textPrimary),
        })
        by -= 11
      }
      yL = boxBottom - 10
    }

    const locLine = kit.profile.contact?.location?.trim()
    const phLine = kit.profile.contact?.phone?.trim()
    const emLine = kit.profile.contact?.email?.trim()
    const liLine = kit.profile.contact?.linkedin?.trim()
    if (locLine || phLine || emLine || liLine) {
      yL -= 6
      yL = drawSectionHeading(page, sidebarX, yL, L.contact, accent, theme, fontBold, accentHex, sidebarBgHex)
      if (locLine) {
        page.drawText((loc === 'fr' ? 'ADRESSE' : 'ADDRESS'), {
          x: sidebarX, y: yL, size: 6.5, font: fontBold, color: toRgb(theme.textSubtle),
        })
        yL -= 9
        drawL(locLine, 8, false, theme.textPrimary)
      }
      if (phLine) {
        page.drawText((loc === 'fr' ? 'TÉLÉPHONE' : 'PHONE'), {
          x: sidebarX, y: yL, size: 6.5, font: fontBold, color: toRgb(theme.textSubtle),
        })
        yL -= 9
        drawL(phLine, 8, false, theme.textPrimary)
      }
      if (emLine) {
        page.drawText('EMAIL', {
          x: sidebarX, y: yL, size: 6.5, font: fontBold, color: toRgb(theme.textSubtle),
        })
        yL -= 9
        drawL(emLine, 8, false, theme.textPrimary)
      }
      if (liLine) {
        page.drawText('LINKEDIN', {
          x: sidebarX, y: yL, size: 6.5, font: fontBold, color: toRgb(theme.textSubtle),
        })
        yL -= 9
        drawL(liLine, 8, false, theme.textPrimary)
      }
    }

    if (kit.skills.length) {
      yL -= 6
      yL = drawSectionHeading(page, sidebarX, yL, L.skills, accent, theme, fontBold, accentHex, sidebarBgHex)
      for (const g of kit.skills) {
        drawL(g.name, 7.5, true, theme.textMuted)
        ensureSidebarSpace(measureSkillPillsHeight(g.items, sidebarTextW, fontRegular, 8))
        yL = drawSkillPills(
          page,
          g.items,
          sidebarX,
          yL,
          sidebarTextW,
          accent,
          theme,
          fontRegular,
          accentHex,
          sidebarBgHex,
        )
      }
    }

    if (kit.education.length) {
      yL -= 6
      yL = drawSectionHeading(page, sidebarX, yL, L.education, accent, theme, fontBold, accentHex, sidebarBgHex)
      for (const ed of kit.education) {
        const degreeLines = wrapWords(ed.degree, sidebarTextW - 8, fontBold, 8.5)
        const schoolLine = `${ed.school}${ed.year ? ` · ${ed.year}` : ''}`
        const schoolLines = wrapWords(schoolLine, sidebarTextW - 8, fontRegular, 8)
        const itemH = degreeLines.length * 11 + schoolLines.length * 10 + 8
        ensureSidebarSpace(itemH)
        const itemBottom = yL - itemH
        page.drawRectangle({
          x: sidebarX,
          y: itemBottom,
          width: 3,
          height: itemH,
          color: toRgb(parseHexNormalized(mixHex(accentHex, 0.5, sidebarBgHex))),
        })
        let ey = yL
        for (const line of degreeLines) {
          page.drawText(line, {
            x: sidebarX + 8,
            y: ey,
            size: 8.5,
            font: fontBold,
            color: toRgb(theme.textPrimary),
          })
          ey -= 11
        }
        for (const line of schoolLines) {
          page.drawText(line, {
            x: sidebarX + 8,
            y: ey,
            size: 8,
            font: fontRegular,
            color: toRgb(theme.textMuted),
          })
          ey -= 10
        }
        yL = itemBottom - 6
      }
    }

    const interestsRaw = Array.isArray(kit.profile.interests)
      ? kit.profile.interests.join(', ')
      : kit.profile.interests?.trim()
    if (interestsRaw) {
      yL -= 6
      yL = drawSectionHeading(page, sidebarX, yL, L.interests, accent, theme, fontBold, accentHex, sidebarBgHex)
      drawLinesL(wrapParagraphs(interestsRaw, sidebarTextW, fontRegular, 8), 8, theme.textMuted)
    }

    // Profil — encadré teinté
    {
      const profilePad = 12
      const profileLines = wrapParagraphs(
        kit.profile.summary,
        mainW - profilePad * 2,
        fontRegular,
        9.5,
      )
      const textLineCount = profileLines.filter(Boolean).length
      const profileH = profilePad * 2 + 18 + textLineCount * 12 + 4
      ensureMainSpace(profileH + 6)
      const profileBottom = yR - profileH
      const profileBgHex = mixHex(accentHex, theme.isDark ? 0.08 : 0.05, mainBgHex)
      page.drawRectangle({
        x: mainX,
        y: profileBottom,
        width: mainW,
        height: profileH,
        color: toRgb(parseHexNormalized(profileBgHex)),
        borderColor: toRgb(parseHexNormalized(mixHex(accentHex, 0.15, mainBgHex))),
        borderWidth: 0.4,
      })
      let py = yR - profilePad
      py = drawSectionHeading(
        page,
        mainX + profilePad,
        py,
        L.profile,
        accent,
        theme,
        fontBold,
        accentHex,
        profileBgHex,
      )
      for (const line of profileLines) {
        if (!line.trim()) {
          py -= 6
          continue
        }
        page.drawText(line, {
          x: mainX + profilePad,
          y: py,
          size: 9.5,
          font: fontRegular,
          color: toRgb(theme.textSecondary),
        })
        py -= 12
      }
      yR = profileBottom - 12
    }

    if (kit.experience.length) {
      yR -= 2
      yR = drawSectionHeading(
        page,
        mainX,
        yR,
        L.experience,
        accent,
        theme,
        fontBold,
        accentHex,
        mainBgHex,
      )
      yR -= 6

      for (const ex of kit.experience) {
        const cardPad = 12
        const innerW = mainW - cardPad * 2 - 8
        const roleLines = wrapWords(ex.role, innerW, fontBold, 10.5)
        const companyLines = wrapWords(ex.company, innerW, fontBold, 9)
        const bulletLines = ex.bullets.flatMap((b) =>
          wrapWords(`• ${b}`, innerW - 4, fontRegular, 9),
        )
        const cardH =
          cardPad * 2 +
          roleLines.length * 13 +
          companyLines.length * 11 +
          bulletLines.length * 11 +
          8

        ensureMainSpace(cardH + 10)
        const cardBottom = yR - cardH
        const cardTop = yR

        page.drawRectangle({
          x: mainX,
          y: cardBottom,
          width: mainW,
          height: cardH,
          color: toRgb(theme.cardBg),
          borderColor: toRgb(theme.cardBorder),
          borderWidth: 0.5,
        })
        page.drawRectangle({
          x: mainX,
          y: cardBottom,
          width: 3,
          height: cardH,
          color: toRgb(accent),
        })

        if (ex.period) {
          const periodLabel = ex.period.toUpperCase()
          const periodW = fontBold.widthOfTextAtSize(periodLabel, 7) + 12
          const badgeBg = theme.isDark ? '#1e293b' : '#f1f5f9'
          page.drawRectangle({
            x: mainX + mainW - cardPad - periodW,
            y: cardTop - cardPad - 12,
            width: periodW,
            height: 12,
            color: toRgb(parseHexNormalized(badgeBg)),
          })
          page.drawText(periodLabel, {
            x: mainX + mainW - cardPad - periodW + 6,
            y: cardTop - cardPad - 10,
            size: 7,
            font: fontBold,
            color: toRgb(theme.textMuted),
          })
        }

        let cy = cardTop - cardPad
        for (const line of roleLines) {
          page.drawText(line, {
            x: mainX + cardPad + 6,
            y: cy,
            size: 10.5,
            font: fontBold,
            color: toRgb(theme.textPrimary),
          })
          cy -= 13
        }
        for (const line of companyLines) {
          page.drawText(line, {
            x: mainX + cardPad + 6,
            y: cy,
            size: 9,
            font: fontBold,
            color: toRgb(parseHexNormalized(accentOnMain)),
          })
          cy -= 11
        }
        cy -= 2
        for (const line of bulletLines) {
          page.drawText(line, {
            x: mainX + cardPad + 10,
            y: cy,
            size: 9,
            font: fontRegular,
            color: toRgb(theme.textSecondary),
          })
          cy -= 11
        }
        yR = cardBottom - 10
      }
    }
  }

  /** Lettre de motivation — toujours sur une page dédiée, séparée du CV. */
  const startCoverLetterPage = () => {
    page = pdf.addPage([pageW, pageH])
    page.drawRectangle({
      x: 0,
      y: 0,
      width: pageW,
      height: pageH,
      color: rgb(1, 1, 1),
    })
    page.drawRectangle({
      x: 0,
      y: pageH - 6,
      width: pageW,
      height: 6,
      color: toRgb(accent),
    })
    y = pageH - margin - 10
  }

  startCoverLetterPage()

  const textX = margin
  const wrapW = pageW - 2 * margin

  const draw = (
    text: string,
    size: number,
    bold = false,
    color = rgb(0.12, 0.14, 0.18),
  ) => {
    const font = bold ? fontBold : fontRegular
    for (const line of wrapWords(text, wrapW, font, size)) {
      if (y < margin + 24) startCoverLetterPage()
      page.drawText(line, { x: textX, y, size, font, color })
      y -= size + lineGap * 0.35
    }
  }

  const drawLetterLines = (lines: string[], size: number) => {
    for (const line of lines) {
      if (!line.trim()) {
        y -= lineGap * 0.55
        continue
      }
      if (y < margin + 24) startCoverLetterPage()
      page.drawText(line, {
        x: textX,
        y,
        size,
        font: fontRegular,
        color: rgb(0.15, 0.17, 0.22),
      })
      y -= size + lineGap * 0.4
    }
  }

  const letterTitleSize = 18
  page.drawText(L.letter, {
    x: textX,
    y,
    size: letterTitleSize,
    font: fontBold,
    color: toRgb(parseHexNormalized(readableAccentHex(accentHex, CV_BG.white, 4.5))),
  })
  page.drawRectangle({
    x: textX,
    y: y - 10,
    width: 48,
    height: 3,
    color: toRgb(accent),
  })
  y -= letterTitleSize + 20

  page.drawLine({
    start: { x: textX, y },
    end: { x: pageW - margin, y },
    thickness: 0.5,
    color: toRgb({ r: 0.9, g: 0.91, b: 0.93 }),
  })
  y -= 22

  const leftHeaderLines = [
    kit.profile.fullName.trim() || (loc === 'fr' ? 'Prénom Nom' : 'First Last Name'),
    kit.profile.contact?.phone?.trim() || (loc === 'fr' ? 'Téléphone : —' : 'Phone: —'),
    kit.profile.contact?.email?.trim() || (loc === 'fr' ? 'Email : —' : 'Email: —'),
  ]

  const headerRight = writingDate
  const rightFontSize = 10
  const rightTextW = fontRegular.widthOfTextAtSize(headerRight, rightFontSize)
  page.drawText(headerRight, {
    x: pageW - margin - rightTextW,
    y,
    size: rightFontSize,
    font: fontRegular,
    color: rgb(0.2, 0.22, 0.28),
  })

  for (let index = 0; index < leftHeaderLines.length; index += 1) {
    const line = leftHeaderLines[index]
    page.drawText(line, {
      x: textX,
      y: y - index * (lineGap + 1),
      size: index === 0 ? 11 : 10,
      font: index === 0 ? fontBold : fontRegular,
      color: rgb(0.15, 0.17, 0.22),
    })
  }

  y -= lineGap * 4

  const letter = formatCoverLetterSections({
    raw: metadata.coverLetter,
    fullName: kit.profile.fullName,
    locale: loc,
  })

  drawLetterLines(wrapParagraphs(letter.greeting, wrapW, fontRegular, 10.5), 10.5)
  y -= lineGap * 0.35
  for (const paragraph of letter.bodyParagraphs) {
    drawLetterLines(wrapParagraphs(paragraph, wrapW, fontRegular, 10.5), 10.5)
    y -= lineGap * 0.35
  }
  y -= lineGap * 0.25
  drawLetterLines(wrapParagraphs(letter.closing, wrapW, fontRegular, 10.5), 10.5)
  y -= lineGap * 1.4
  draw(letter.signature, 10.5, true)

  return Buffer.from(await pdf.save())
}
