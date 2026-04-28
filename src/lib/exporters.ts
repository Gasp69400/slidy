import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import PptxGenJS from 'pptxgenjs'

type BlockPayload = {
  blockType: string
  contentJson: Record<string, any>
}

export async function exportDocumentToPdf(input: {
  title: string
  topic: string
  blocks: BlockPayload[]
}) {
  const pdf = await PDFDocument.create()
  let currentPage = pdf.addPage([842, 595]) // A4 landscape-ish
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const regular = await pdf.embedFont(StandardFonts.Helvetica)

  let y = 560

  currentPage.drawText(input.title, {
    x: 40,
    y,
    size: 24,
    font: bold,
    color: rgb(0.11, 0.14, 0.2),
  })
  y -= 26
  currentPage.drawText(`Topic: ${input.topic}`, {
    x: 40,
    y,
    size: 12,
    font: regular,
    color: rgb(0.39, 0.43, 0.5),
  })
  y -= 28

  for (const block of input.blocks) {
    const lines = blockToLines(block)
    for (const line of lines) {
      if (y < 50) {
        currentPage = pdf.addPage([842, 595])
        y = 560
        currentPage.drawText(line, {
          x: 40,
          y,
          size: 11,
          font: regular,
          color: rgb(0.15, 0.17, 0.22),
        })
      } else {
        currentPage.drawText(line, {
          x: 40,
          y,
          size: 11,
          font: regular,
          color: rgb(0.15, 0.17, 0.22),
        })
      }
      y -= 16
    }
    y -= 4
  }

  return Buffer.from(await pdf.save())
}

export async function exportDocumentToPptx(input: {
  title: string
  topic: string
  blocks: BlockPayload[]
}) {
  const pptx = new PptxGenJS()
  pptx.layout = 'LAYOUT_WIDE'
  pptx.author = 'Slidy'
  pptx.subject = input.topic
  pptx.title = input.title

  const first = pptx.addSlide()
  first.background = { color: 'F8FAFC' }
  first.addText(input.title, {
    x: 0.7,
    y: 0.7,
    w: 11.8,
    h: 0.8,
    fontFace: 'Aptos Display',
    color: '111827',
    bold: true,
    fontSize: 30,
  })
  first.addText(`Topic: ${input.topic}`, {
    x: 0.7,
    y: 1.6,
    w: 11.8,
    h: 0.4,
    color: '64748B',
    fontSize: 14,
  })

  let current = pptx.addSlide()
  current.background = { color: 'FFFFFF' }
  let y = 0.5

  for (const block of input.blocks) {
    const lines = blockToLines(block)
    for (const line of lines) {
      if (y > 6.6) {
        current = pptx.addSlide()
        current.background = { color: 'FFFFFF' }
        y = 0.5
      }
      current.addText(line, {
        x: 0.8,
        y,
        w: 11.3,
        h: 0.35,
        fontFace: 'Aptos',
        color: '1F2937',
        fontSize: 16,
      })
      y += 0.42
    }
    y += 0.08
  }

  const data = (await pptx.write({
    outputType: 'nodebuffer',
  })) as Buffer
  return Buffer.from(data)
}

function blockToLines(block: BlockPayload): string[] {
  const c = block.contentJson ?? {}
  if (block.blockType === 'TITLE') {
    return [`# ${c.title ?? c.text ?? 'Title'}`, c.subtitle ?? '']
  }
  if (block.blockType === 'HEADING') {
    return [`## ${c.text ?? 'Heading'}`]
  }
  if (block.blockType === 'BULLETS') {
    const items = Array.isArray(c.items) ? c.items : []
    return items.map((i: string) => `• ${i}`)
  }
  if (block.blockType === 'QUOTE') {
    return [`“${c.text ?? ''}”`]
  }
  if (block.blockType === 'IMAGE') {
    return [`[Image] ${c.alt ?? c.caption ?? c.url ?? 'Visual block'}`]
  }
  if (block.blockType === 'TEXT' || block.blockType === 'CTA') {
    return [String(c.text ?? '')]
  }
  return [JSON.stringify(c)]
}

