/** Taille max d’une data-URL photo dans les payloads API (≈350 Ko base64). */
export const CV_PHOTO_DATA_URL_MAX_CHARS = 480_000

export function stripOversizedCvPhotoUrl(photoUrl: string | undefined): string | undefined {
  if (!photoUrl?.trim()) return undefined
  const trimmed = photoUrl.trim()
  if (!trimmed.startsWith('data:')) return trimmed
  if (trimmed.length <= CV_PHOTO_DATA_URL_MAX_CHARS) return trimmed
  return undefined
}

export function shrinkManualPhoto<T extends { photoUrl?: string } | undefined>(
  manual: T,
): T {
  if (!manual?.photoUrl) return manual
  const photoUrl = stripOversizedCvPhotoUrl(manual.photoUrl)
  if (photoUrl === manual.photoUrl) return manual
  return { ...manual, photoUrl }
}
