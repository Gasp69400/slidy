import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297
/** Largeur fixe A4 (~96 dpi) pour un rendu identique à l’aperçu desktop. */
export const CV_EXPORT_WIDTH_PX = 794

async function waitForImages(root: HTMLElement): Promise<void> {
  const images = Array.from(root.querySelectorAll('img'))
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve()
            return
          }
          img.addEventListener('load', () => resolve(), { once: true })
          img.addEventListener('error', () => resolve(), { once: true })
        }),
    ),
  )
}

async function elementToCanvas(element: HTMLElement): Promise<HTMLCanvasElement> {
  await document.fonts.ready
  await waitForImages(element)

  return html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: false,
    logging: false,
    backgroundColor: '#ffffff',
    width: CV_EXPORT_WIDTH_PX,
    windowWidth: CV_EXPORT_WIDTH_PX,
    onclone: (doc) => {
      const cloned = doc.querySelector('[data-cv-export-clone]') as HTMLElement | null
      if (cloned) {
        cloned.style.width = `${CV_EXPORT_WIDTH_PX}px`
        cloned.style.maxWidth = `${CV_EXPORT_WIDTH_PX}px`
      }
    },
  })
}

function appendCanvasToPdf(
  pdf: jsPDF,
  canvas: HTMLCanvasElement,
  options: { newPageFirst: boolean },
): void {
  const imgData = canvas.toDataURL('image/jpeg', 0.92)
  const imgWidth = A4_WIDTH_MM
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  let heightLeft = imgHeight
  let position = 0
  let pageOpen = !options.newPageFirst

  while (heightLeft > 0) {
    if (!pageOpen) {
      pdf.addPage()
    }
    pageOpen = false
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
    heightLeft -= A4_HEIGHT_MM
    position -= A4_HEIGHT_MM
  }
}

export async function exportCvCoverLetterClientPdf(args: {
  cvElement: HTMLElement
  letterElement: HTMLElement
  filename: string
}): Promise<void> {
  const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4', compress: true })

  const cvCanvas = await elementToCanvas(args.cvElement)
  appendCanvasToPdf(pdf, cvCanvas, { newPageFirst: false })

  const letterCanvas = await elementToCanvas(args.letterElement)
  appendCanvasToPdf(pdf, letterCanvas, { newPageFirst: true })

  pdf.save(args.filename)
}
