import {
  PDFDocument,
  StandardFonts,
  type PDFFont,
  type PDFImage,
  rgb,
} from 'pdf-lib'

import type { CvDesignOptions, CvDocumentMetadata } from '@/lib/cv-schema'

function parseHexColor(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '').slice(0, 6)
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
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
          letter: 'Lettre de motivation',
        }
      : {
          profile: 'Profile',
          experience: 'Professional experience',
          education: 'Education',
          skills: 'Skills',
          interests: 'Activities & interests',
          contact: 'Contact',
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
    design.layoutDensity === 'compact' ? 44 : design.layoutDensity === 'spacious' ? 56 : 50
  const pageW = 595
  const pageH = 842
  const slug = design.templateSlug
  const leftGutter = slug === 'creative' ? 20 : slug === 'modern' ? 8 : 0
  const textX = margin + leftGutter
  const wrapW = pageW - margin - textX

  let page = pdf.addPage([pageW, pageH])
  let y = pageH - margin

  const drawAccentBar = () => {
    if (slug === 'ats') return
    if (slug === 'creative' || slug === 'modern') {
      page.drawRectangle({
        x: 0,
        y: 0,
        width: slug === 'creative' ? 14 : 6,
        height: pageH,
        color: rgb(accent.r, accent.g, accent.b),
      })
    }
  }

  const newPage = () => {
    page = pdf.addPage([pageW, pageH])
    y = pageH - margin
    drawAccentBar()
  }

  drawAccentBar()

  const draw = (
    text: string,
    size: number,
    bold = false,
    color = rgb(0.12, 0.14, 0.18),
  ) => {
    const font = bold ? fontBold : fontRegular
    for (const line of wrapWords(text, wrapW, font, size)) {
      if (y < margin + 24) newPage()
      page.drawText(line, {
        x: textX,
        y,
        size,
        font,
        color,
      })
      y -= size + lineGap * 0.35
    }
  }

  const drawLines = (lines: string[], size: number, bold = false) => {
    const font = bold ? fontBold : fontRegular
    for (const line of lines) {
      if (!line.trim()) {
        y -= lineGap * 0.5
        continue
      }
      if (y < margin + 24) newPage()
      page.drawText(line, {
        x: textX,
        y,
        size,
        font,
        color: rgb(0.15, 0.17, 0.22),
      })
      y -= size + lineGap * 0.35
    }
  }

  const headlineSize = 16

  if (slug === 'ats') {
    const atsW = pageW - 2 * margin
    const atsX = margin
    const accentRgb = rgb(accent.r, accent.g, accent.b)
    const drawAts = (
      text: string,
      size: number,
      bold = false,
      color = rgb(0.12, 0.14, 0.18),
    ) => {
      const font = bold ? fontBold : fontRegular
      for (const line of wrapWords(text, atsW, font, size)) {
        if (y < margin + 26) newPage()
        page.drawText(line, {
          x: atsX,
          y,
          size,
          font,
          color,
        })
        y -= size + lineGap * 0.35
      }
    }
    const drawAtsLines = (lines: string[], size: number) => {
      for (const line of lines) {
        if (!line.trim()) {
          y -= lineGap * 0.5
          continue
        }
        if (y < margin + 26) newPage()
        page.drawText(line, {
          x: atsX,
          y,
          size,
          font: fontRegular,
          color: rgb(0.15, 0.17, 0.22),
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

    page.drawRectangle({
      x: 0,
      y: pageH - 5,
      width: pageW,
      height: 5,
      color: accentRgb,
    })

    const photoImg = await tryEmbedProfilePhoto(pdf, kit.profile.photoUrl)
    if (photoImg) {
      let photoH = 56
      let photoW = (photoImg.width * photoH) / photoImg.height
      const maxW = 100
      if (photoW > maxW) {
        photoW = maxW
        photoH = (photoImg.height * maxW) / photoImg.width
      }
      if (y < margin + photoH + 24) newPage()
      page.drawImage(photoImg, {
        x: atsX,
        y: y - photoH,
        width: photoW,
        height: photoH,
      })
      y -= photoH + 12
    }

    drawAts(kit.profile.fullName, 14, true)
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
      drawAts(kit.profile.searchPeriod.trim(), 9, false, rgb(0.35, 0.37, 0.42))
    }
    y -= 8
    drawAts(H.summary, 11, true, accentRgb)
    drawAtsLines(
      wrapParagraphs(kit.profile.summary, atsW, fontRegular, 10),
      10,
    )
    if (kit.experience.length) {
      y -= 6
      drawAts(H.experience, 11, true, accentRgb)
      for (const ex of kit.experience) {
        drawAts(ex.role, 10, true)
        drawAts(ex.company, 9, true, rgb(0.2, 0.22, 0.28))
        drawAts(ex.period, 9, false, rgb(0.38, 0.4, 0.46))
        for (const b of ex.bullets) {
          drawAts(`- ${b}`, 9)
        }
        y -= 4
      }
    }
    if (kit.education.length) {
      y -= 4
      drawAts(H.education, 11, true, accentRgb)
      for (const ed of kit.education) {
        drawAts(
          `${ed.degree}, ${ed.school}${ed.year ? ` — ${ed.year}` : ''}`,
          9,
        )
      }
    }
    if (kit.skills.length) {
      y -= 4
      drawAts(H.skills, 11, true, accentRgb)
      for (const g of kit.skills) {
        drawAts(`${g.name}: ${g.items.join(', ')}`, 9)
        y -= 2
      }
    }
    y -= 10
    if (y < margin + 120) newPage()
    else {
      y -= 4
      page.drawLine({
        start: { x: margin, y },
        end: { x: pageW - margin, y },
        thickness: 0.5,
        color: rgb(0.88, 0.9, 0.92),
      })
      y -= 18
    }
  } else {
  const headlineLines = wrapWords(
    kit.profile.headline,
    pageW - 2 * margin,
    fontBold,
    headlineSize,
  )
  let hy = y
  for (const line of headlineLines) {
    if (hy < margin + 28) newPage()
    const lw = fontBold.widthOfTextAtSize(line, headlineSize)
    page.drawText(line, {
      x: (pageW - lw) / 2,
      y: hy,
      size: headlineSize,
      font: fontBold,
      color: rgb(accent.r, accent.g, accent.b),
    })
    hy -= headlineSize + lineGap * 0.45
  }
  y = hy - 14

  /** Mise en page CV deux colonnes (sidebar + expériences / profil). */
  const colGap = 12
  const sidebarWContent = 168
  const sidebarX = textX
  const sidebarTextW = Math.max(72, sidebarWContent - 4)
  const mainX = sidebarX + sidebarWContent + colGap
  const mainW = Math.max(120, pageW - margin - mainX)

  let yL = y
  let yR = y

  const newPageCv = () => {
    page = pdf.addPage([pageW, pageH])
    drawAccentBar()
    yL = pageH - margin
    yR = pageH - margin
  }

  const drawL = (
    text: string,
    size: number,
    bold = false,
    color = rgb(0.12, 0.14, 0.18),
  ) => {
    const font = bold ? fontBold : fontRegular
    for (const line of wrapWords(text, sidebarTextW, font, size)) {
      if (yL < margin + 26) newPageCv()
      page.drawText(line, {
        x: sidebarX,
        y: yL,
        size,
        font,
        color,
      })
      yL -= size + lineGap * 0.35
    }
  }

  const drawR = (
    text: string,
    size: number,
    bold = false,
    color = rgb(0.12, 0.14, 0.18),
  ) => {
    const font = bold ? fontBold : fontRegular
    for (const line of wrapWords(text, mainW, font, size)) {
      if (yR < margin + 26) newPageCv()
      page.drawText(line, {
        x: mainX,
        y: yR,
        size,
        font,
        color,
      })
      yR -= size + lineGap * 0.35
    }
  }

  const drawLinesR = (lines: string[], size: number, bold = false) => {
    const font = bold ? fontBold : fontRegular
    for (const line of lines) {
      if (!line.trim()) {
        yR -= lineGap * 0.5
        continue
      }
      if (yR < margin + 26) newPageCv()
      page.drawText(line, {
        x: mainX,
        y: yR,
        size,
        font,
        color: rgb(0.15, 0.17, 0.22),
      })
      yR -= size + lineGap * 0.35
    }
  }

  const drawLinesL = (lines: string[], size: number) => {
    const font = fontRegular
    for (const line of lines) {
      if (!line.trim()) {
        yL -= lineGap * 0.5
        continue
      }
      if (yL < margin + 26) newPageCv()
      page.drawText(line, {
        x: sidebarX,
        y: yL,
        size,
        font,
        color: rgb(0.32, 0.34, 0.4),
      })
      yL -= size + lineGap * 0.35
    }
  }

  const photoImg = await tryEmbedProfilePhoto(pdf, kit.profile.photoUrl)
  const photoTargetH = 56
  let photoW = 0
  let photoH = 0
  if (photoImg) {
    photoH = photoTargetH
    photoW = (photoImg.width * photoTargetH) / photoImg.height
    const maxW = sidebarTextW
    if (photoW > maxW) {
      photoW = maxW
      photoH = (photoImg.height * maxW) / photoImg.width
    }
    if (yL < margin + photoH + 20) newPageCv()
    page.drawImage(photoImg, {
      x: sidebarX,
      y: yL - photoH,
      width: photoW,
      height: photoH,
    })
    yL -= photoH + 10
  }

  const nameParts = kit.profile.fullName.trim().split(/\s+/).filter(Boolean)
  const firstName = nameParts[0] ?? ''
  const lastName = nameParts.slice(1).join(' ')
  if (firstName) drawL(firstName, 12, true)
  if (lastName) drawL(lastName, 11, true)
  if (kit.profile.searchPeriod?.trim()) {
    yL -= 2
    const lab =
      loc === 'fr' ? 'Disponibilité : ' : 'Availability: '
    drawL(lab + kit.profile.searchPeriod.trim(), 8, false, rgb(0.38, 0.4, 0.46))
  }

  yL -= 6
  const locLine = kit.profile.contact?.location?.trim()
  const phLine = kit.profile.contact?.phone?.trim()
  const emLine = kit.profile.contact?.email?.trim()
  const liLine = kit.profile.contact?.linkedin?.trim()
  if (locLine || phLine || emLine || liLine) {
    drawL(L.contact, 9, true, rgb(accent.r, accent.g, accent.b))
    if (locLine) {
      drawL((loc === 'fr' ? 'Adresse : ' : 'Address: ') + locLine, 8, false, rgb(0.22, 0.24, 0.3))
    }
    if (phLine) {
      drawL((loc === 'fr' ? 'Tél. : ' : 'Phone: ') + phLine, 8, false, rgb(0.22, 0.24, 0.3))
    }
    if (emLine) {
      drawL((loc === 'fr' ? 'Email : ' : 'Email: ') + emLine, 8, false, rgb(0.22, 0.24, 0.3))
    }
    if (liLine) {
      drawL((loc === 'fr' ? 'LinkedIn : ' : 'LinkedIn: ') + liLine, 8, false, rgb(0.22, 0.24, 0.3))
    }
  }

  if (kit.skills.length) {
    yL -= 6
    drawL(L.skills, 9, true, rgb(accent.r, accent.g, accent.b))
    for (const g of kit.skills) {
      drawL(g.name, 8, true)
      drawL(g.items.join(' · '), 8, false, rgb(0.32, 0.34, 0.4))
      yL -= 2
    }
  }

  if (kit.education.length) {
    yL -= 6
    drawL(L.education, 9, true, rgb(accent.r, accent.g, accent.b))
    for (const ed of kit.education) {
      drawL(ed.degree, 8, true)
      drawL(
        `${ed.school}${ed.year ? ` · ${ed.year}` : ''}`,
        8,
        false,
        rgb(0.32, 0.34, 0.4),
      )
      yL -= 2
    }
  }

  const interestsRaw = Array.isArray(kit.profile.interests)
  ? kit.profile.interests.join(', ')
  : kit.profile.interests?.trim()
  if (interestsRaw) {
    yL -= 6
    drawL(L.interests, 9, true, rgb(accent.r, accent.g, accent.b))
    drawLinesL(
      wrapParagraphs(interestsRaw, sidebarTextW, fontRegular, 8),
      8,
    )
  }

  drawR(L.profile, 11, true, rgb(accent.r, accent.g, accent.b))
  drawLinesR(wrapParagraphs(kit.profile.summary, mainW, fontRegular, 9), 9)

  if (kit.experience.length) {
    yR -= 8
    drawR(L.experience, 11, true, rgb(accent.r, accent.g, accent.b))
    for (const ex of kit.experience) {
      drawR(ex.role, 10, true)
      drawR(ex.company, 9, true, rgb(0.28, 0.3, 0.36))
      drawR(ex.period, 8, false, rgb(0.45, 0.47, 0.52))
      for (const b of ex.bullets) {
        drawR(`• ${b}`, 9)
      }
      yR -= 6
    }
  }

  y = Math.min(yL, yR) - 14

  if (slug === 'professional') {
    page.drawLine({
      start: { x: margin, y: y + 4 },
      end: { x: pageW - margin, y: y + 4 },
      thickness: 0.6,
      color: rgb(0.85, 0.87, 0.9),
    })
    y -= 10
  }

  if (y < margin + 120) newPage()
  else {
    y -= 6
    page.drawLine({
      start: { x: margin, y },
      end: { x: pageW - margin, y },
      thickness: 0.5,
      color: rgb(0.88, 0.9, 0.92),
    })
    y -= 18
  }

  }

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
