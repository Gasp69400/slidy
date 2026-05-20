const CV_POST_GENERATE_ATS_STORAGE_KEY = 'cv-post-generate-ats-badge'

/** Entier aléatoire inclusif entre 80 et 98 (affichage décoratif après création CV). */
export function randomAtsBadgePercent(): number {
  return 80 + Math.floor(Math.random() * 19)
}

export function writeCvPostGenerateAtsBadge(pct: number): void {
  sessionStorage.setItem(
    CV_POST_GENERATE_ATS_STORAGE_KEY,
    JSON.stringify({ pct }),
  )
}

export function readAndClearCvPostGenerateAtsBadge(): number | null {
  try {
    const raw = sessionStorage.getItem(CV_POST_GENERATE_ATS_STORAGE_KEY)
    if (!raw) return null
    sessionStorage.removeItem(CV_POST_GENERATE_ATS_STORAGE_KEY)
    const parsed = JSON.parse(raw) as { pct?: unknown }
    const pct =
      typeof parsed.pct === 'number' && Number.isFinite(parsed.pct)
        ? Math.round(parsed.pct)
        : NaN
    if (pct < 80 || pct > 98) return null
    return pct
  } catch {
    try {
      sessionStorage.removeItem(CV_POST_GENERATE_ATS_STORAGE_KEY)
    } catch {
      /* ignore */
    }
    return null
  }
}
