/** Compresse une photo CV pour mobile (évite les requêtes trop volumineuses). */
export async function compressCvPhotoFile(
  file: File,
  maxDim = 720,
  quality = 0.82,
): Promise<string> {
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('PHOTO_TOO_LARGE')
  }

  const bitmap = await createImageBitmap(file)
  try {
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height, 1))
    const width = Math.max(1, Math.round(bitmap.width * scale))
    const height = Math.max(1, Math.round(bitmap.height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('CANVAS_UNAVAILABLE')

    ctx.drawImage(bitmap, 0, 0, width, height)
    return canvas.toDataURL('image/jpeg', quality)
  } finally {
    bitmap.close()
  }
}
