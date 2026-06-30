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

type PdfColor = { r: number; g: number; b: number }

function parseHexColor(hex: string): PdfColor {
  const h = hex.replace('#', '').slice(0, 6)
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
  }
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
        textMuted: { r: 0.58, g: 0.64, b: 0.72 },
        textSubtle: { r: 0.45, g: 0.5, b: 0.58 },
        cardBg: { r: 0.07, g: 0.1, b: 0.17 },
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

function formatCoverLetterSections(args: {
  raw: string
  fullName: string
  locale: 'fr' | 'en'
}): {
  greeting: string
  bodyParagraphs: string[]
  closing: string
  signature: string
} {
  const paragraphs = args.raw
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  const fallbackGreeting = args.locale === 'fr' ? 'Madame, Monsieur,' : 'Dear Hiring Manager,'
  const fallbackClosing = args.locale === 'fr' ? 'Cordialement,' : 'Sincerely,'
  const signature = args.fullName.trim() || (args.locale === 'fr' ? 'Prénom Nom' : 'First Last Name')

  if (!paragraphs.length) {
    return {
      greeting: fallbackGreeting,
      bodyParagraphs: [
        args.locale === 'fr'
          ? 'Je vous adresse ma candidature et reste à votre disposition pour un entretien.'
          : 'I am writing to submit my application and remain available for an interview.',
      ],
      closing: fallbackClosing,
      signature,
    }
  }

  const greetingRegex =
    args.locale === 'fr'
      ? /^(madame|monsieur|madame,\s*monsieur|madame,\s*monsieur,|bonjour)/i
      : /^(dear|hello|to whom it may concern)/i

  const greeting = greetingRegex.test(paragraphs[0]) ? paragraphs.shift() ?? fallbackGreeting : fallbackGreeting

  const closingRegex =
    args.locale === 'fr'
      ? /(cordialement|salutations|agréer|bien à vous)$/i
      : /(sincerely|kind regards|best regards|yours faithfully|yours sincerely)$/i

  while (paragraphs.length) {
    const last = paragraphs[paragraphs.length - 1]
    if (closingRegex.test(last) || last.replace(/[.,]/g, '').trim() === signature) {
      paragraphs.pop()
      continue
    }
    break
  }

  return {
    greeting,
    bodyParagraphs: paragraphs.length ? paragraphs : [
      args.locale === 'fr'
        ? 'Je serais ravi(e) d’échanger sur la manière dont mon profil peut répondre à vos besoins.'
        : 'I would welcome the opportunity to discuss how my profile can support your needs.',
    ],
    closing: fallbackClosing,
    signature,
  }
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
): number {
  const size = 7
  page.drawText(title.toUpperCase(), {
    x,
    y,
    size,
    font: fontBold,
    color: toRgb(theme.textSubtle),
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
    const pillBg = mix(accent, theme.isDark ? 0.35 : 0.12, theme.sidebarBg)
    page.drawRectangle({
      x,
      y: rowY - pillH,
      width: pillW,
      height: pillH,
      color: toRgb(pillBg),
      borderColor: toRgb(mix(accent, 0.2, theme.sidebarBg)),
      borderWidth: theme.isDark ? 0 : 0.4,
    })
    page.drawText(item, {
      x: x + 6,
      y: rowY - pillH + 4,
      size,
      font,
      color: toRgb(theme.isDark ? theme.textSecondary : theme.textPrimary),
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

    y = drawSectionHeading(page, atsX, y - 6, H.summary, accent, theme, fontBold)
    drawAtsLines(wrapParagraphs(kit.profile.summary, atsW, fontRegular, 10), 10)

    if (kit.experience.length) {
      y -= 4
      y = drawSectionHeading(page, atsX, y, H.experience, accent, theme, fontBold)
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
      y = drawSectionHeading(page, atsX, y, H.education, accent, theme, fontBold)
      for (const ed of kit.education) {
        drawAts(`${ed.degree}, ${ed.school}${ed.year ? ` (${ed.year})` : ''}`, 9)
      }
    }

    if (kit.skills.length) {
      y -= 2
      y = drawSectionHeading(page, atsX, y, H.skills, accent, theme, fontBold)
      for (const g of kit.skills) {
        drawAts(g.name, 8, true, toRgb(theme.textSubtle))
        y = drawSkillPills(page, g.items, atsX, y, atsW, accent, theme, fontRegular)
      }
    }

    y -= 10
    if (y < margin + 120) newPagePlain()
    else {
      y -= 4
      page.drawLine({
        start: { x: margin, y },
        end: { x: pageW - margin, y },
        thickness: 0.5,
        color: toRgb({ r: 0.88, g: 0.9, b: 0.92 }),
      })
      y -= 18
    }
  } else {
    const theme = getPdfCvTheme(slug)
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
    const headerBottom = headerTop - 68
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
      color: toRgb(theme.textSubtle),
    })

    const headlineColor = theme.headlineUsesAccent
      ? accent
      : theme.isDark
        ? theme.textPrimary
        : theme.textPrimary
    const headlineLines = wrapWords(kit.profile.headline, pageW - 2 * margin - contentInset, fontBold, headlineSize)
    let hy = headerTop - 28
    for (const line of headlineLines) {
      const lw = fontBold.widthOfTextAtSize(line, headlineSize)
      page.drawText(line, {
        x: (pageW - lw) / 2,
        y: hy,
        size: headlineSize,
        font: fontBold,
        color: theme.headlineUsesAccent ? toRgb(accent) : toRgb(headlineColor),
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

    let yL = headerBottom - 16
    let yR = headerBottom - 16
    const contentBottom = margin + 20

    const paintColumnBackgrounds = (topY: number) => {
      page.drawRectangle({
        x: sidebarX - 6,
        y: contentBottom,
        width: sidebarW + 4,
        height: Math.max(0, topY - contentBottom + 24),
        color: toRgb(theme.sidebarBg),
      })
      page.drawRectangle({
        x: mainX - 4,
        y: contentBottom,
        width: mainW + 8,
        height: Math.max(0, topY - contentBottom + 24),
        color: toRgb(theme.mainBg),
      })
      page.drawLine({
        start: { x: sidebarX + sidebarW + colGap / 2, y: contentBottom },
        end: { x: sidebarX + sidebarW + colGap / 2, y: topY + 12 },
        thickness: 0.4,
        color: toRgb(theme.cardBorder),
      })
    }

    const newPageCv = () => {
      page = pdf.addPage([pageW, pageH])
      paintPageShell(page, pageW, pageH, theme, accent)
      yL = pageH - margin - 12
      yR = pageH - margin - 12
      paintColumnBackgrounds(Math.max(yL, yR))
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

    paintColumnBackgrounds(Math.max(yL, yR))

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
      yL -= 8
      const boxPad = 8
      const boxLines = wrapWords(kit.profile.searchPeriod.trim(), sidebarTextW - boxPad * 2, fontRegular, 8)
      const boxH = 28 + boxLines.length * 10
      ensureSidebarSpace(boxH)
      page.drawRectangle({
        x: sidebarX,
        y: yL - boxH,
        width: sidebarTextW,
        height: boxH,
        color: toRgb(mix(accent, theme.isDark ? 0.12 : 0.06, theme.sidebarBg)),
      })
      yL = drawSectionHeading(page, sidebarX + boxPad, yL - boxPad, L.searchPeriod, accent, theme, fontBold)
      for (const line of boxLines) {
        page.drawText(line, {
          x: sidebarX + boxPad,
          y: yL,
          size: 8,
          font: fontRegular,
          color: toRgb(theme.textPrimary),
        })
        yL -= 10
      }
      yL -= 6
    }

    const locLine = kit.profile.contact?.location?.trim()
    const phLine = kit.profile.contact?.phone?.trim()
    const emLine = kit.profile.contact?.email?.trim()
    const liLine = kit.profile.contact?.linkedin?.trim()
    if (locLine || phLine || emLine || liLine) {
      yL -= 4
      yL = drawSectionHeading(page, sidebarX, yL, L.contact, accent, theme, fontBold)
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
      yL = drawSectionHeading(page, sidebarX, yL, L.skills, accent, theme, fontBold)
      for (const g of kit.skills) {
        drawL(g.name, 7.5, true, theme.textMuted)
        ensureSidebarSpace(measureSkillPillsHeight(g.items, sidebarTextW, fontRegular, 8))
        yL = drawSkillPills(page, g.items, sidebarX, yL, sidebarTextW, accent, theme, fontRegular)
      }
    }

    if (kit.education.length) {
      yL -= 6
      yL = drawSectionHeading(page, sidebarX, yL, L.education, accent, theme, fontBold)
      for (const ed of kit.education) {
        page.drawRectangle({
          x: sidebarX,
          y: yL - 28,
          width: 3,
          height: 28,
          color: toRgb(mix(accent, 0.5, theme.sidebarBg)),
        })
        drawL(ed.degree, 8.5, true, theme.textPrimary)
        drawL(`${ed.school}${ed.year ? ` · ${ed.year}` : ''}`, 8, false, theme.textMuted)
        yL -= 4
      }
    }

    const interestsRaw = Array.isArray(kit.profile.interests)
      ? kit.profile.interests.join(', ')
      : kit.profile.interests?.trim()
    if (interestsRaw) {
      yL -= 6
      yL = drawSectionHeading(page, sidebarX, yL, L.interests, accent, theme, fontBold)
      drawLinesL(wrapParagraphs(interestsRaw, sidebarTextW, fontRegular, 8), 8, theme.textMuted)
    }

    // Profil — encadré teinté
    {
      const profilePad = 12
      const profileLines = wrapParagraphs(kit.profile.summary, mainW - profilePad * 2, fontRegular, 9.5)
      const profileH = 36 + profileLines.filter(Boolean).length * 12
      ensureMainSpace(profileH)
      page.drawRectangle({
        x: mainX,
        y: yR - profileH,
        width: mainW,
        height: profileH,
        color: toRgb(mix(accent, theme.isDark ? 0.06 : 0.04, theme.mainBg)),
      })
      let py = yR - profilePad
      py = drawSectionHeading(page, mainX + profilePad, py, L.profile, accent, theme, fontBold)
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
          color: toRgb(theme.isDark ? theme.textSecondary : theme.textSecondary),
        })
        py -= 12
      }
      yR = yR - profileH - 10
    }

    if (kit.experience.length) {
      yR -= 4
      yR = drawSectionHeading(page, mainX, yR, L.experience, accent, theme, fontBold)
      yR -= 4

      for (const ex of kit.experience) {
        const cardPad = 12
        const innerW = mainW - cardPad * 2 - 6
        const roleLines = wrapWords(ex.role, innerW, fontBold, 10.5)
        const companyLines = wrapWords(ex.company, innerW, fontBold, 9)
        const bulletLines = ex.bullets.flatMap((b) =>
          wrapWords(`• ${b}`, innerW - 6, fontRegular, 9),
        )
        const cardH =
          cardPad * 2 +
          roleLines.length * 13 +
          companyLines.length * 11 +
          (ex.period ? 12 : 0) +
          bulletLines.length * 11 +
          6

        ensureMainSpace(cardH + 8)
        const cardBottom = yR - cardH

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

        let cy = yR - cardPad
        for (const line of roleLines) {
          page.drawText(line, {
            x: mainX + cardPad + 4,
            y: cy,
            size: 10.5,
            font: fontBold,
            color: toRgb(theme.textPrimary),
          })
          cy -= 13
        }
        if (ex.period) {
          const periodW = fontBold.widthOfTextAtSize(ex.period.toUpperCase(), 7) + 10
          page.drawRectangle({
            x: mainX + mainW - cardPad - periodW,
            y: yR - cardPad - 10,
            width: periodW,
            height: 12,
            color: toRgb(theme.isDark ? { r: 0.12, g: 0.16, b: 0.22 } : { r: 0.96, g: 0.97, b: 0.98 }),
          })
          page.drawText(ex.period.toUpperCase(), {
            x: mainX + mainW - cardPad - periodW + 5,
            y: yR - cardPad - 8,
            size: 7,
            font: fontBold,
            color: toRgb(theme.textMuted),
          })
        }
        for (const line of companyLines) {
          page.drawText(line, {
            x: mainX + cardPad + 4,
            y: cy,
            size: 9,
            font: fontBold,
            color: theme.isDark ? toRgb(theme.textSecondary) : toRgb(accent),
          })
          cy -= 11
        }
        cy -= 2
        for (const line of bulletLines) {
          page.drawText(line, {
            x: mainX + cardPad + 8,
            y: cy,
            size: 9,
            font: fontRegular,
            color: toRgb(theme.textSecondary),
          })
          cy -= 11
        }
        yR = cardBottom - 8
      }
    }

    y = Math.min(yL, yR) - 14

    if (y < margin + 120) newPagePlain()
    else {
      y -= 4
      page.drawLine({
        start: { x: margin, y },
        end: { x: pageW - margin, y },
        thickness: 0.5,
        color: toRgb({ r: 0.88, g: 0.9, b: 0.92 }),
      })
      y -= 18
    }
  }

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
      if (y < margin + 24) newPagePlain()
      page.drawText(line, { x: textX, y, size, font, color })
      y -= size + lineGap * 0.35
    }
  }

  const drawLines = (lines: string[], size: number) => {
    for (const line of lines) {
      if (!line.trim()) {
        y -= lineGap * 0.5
        continue
      }
      if (y < margin + 24) newPagePlain()
      page.drawText(line, {
        x: textX,
        y,
        size,
        font: fontRegular,
        color: rgb(0.15, 0.17, 0.22),
      })
      y -= size + lineGap * 0.35
    }
  }

  page.drawRectangle({
    x: margin,
    y: y + 6,
    width: 40,
    height: 3,
    color: toRgb(accent),
  })
  draw(L.letter, 14, true)
  y -= 8

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

  y -= lineGap * 3.6

  const letter = formatCoverLetterSections({
    raw: metadata.coverLetter,
    fullName: kit.profile.fullName,
    locale: loc,
  })

  drawLines(wrapParagraphs(letter.greeting, wrapW, fontRegular, 10), 10)
  y -= lineGap * 0.2
  for (const paragraph of letter.bodyParagraphs) {
    drawLines(wrapParagraphs(paragraph, wrapW, fontRegular, 10), 10)
    y -= lineGap * 0.2
  }
  y -= lineGap * 0.2
  drawLines(wrapParagraphs(letter.closing, wrapW, fontRegular, 10), 10)
  y -= lineGap * 1.15
  draw(letter.signature, 10, true)

  return Buffer.from(await pdf.save())
}
