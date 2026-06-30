/** Utilitaires couleur / contraste partagés entre aperçu CV et export PDF. */

export type Rgb255 = { r: number; g: number; b: number }

export function parseHexRgb255(hex: string): Rgb255 {
  const h = hex.replace('#', '').slice(0, 6)
  return {
    r: parseInt(h.slice(0, 2), 16) || 0,
    g: parseInt(h.slice(2, 4), 16) || 0,
    b: parseInt(h.slice(4, 6), 16) || 0,
  }
}

export function parseHexNormalized(hex: string): { r: number; g: number; b: number } {
  const c = parseHexRgb255(hex)
  return { r: c.r / 255, g: c.g / 255, b: c.b / 255 }
}

export function rgb255ToHex({ r, g, b }: Rgb255): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)))
  return `#${[clamp(r), clamp(g), clamp(b)].map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

function luminance255({ r, g, b }: Rgb255): number {
  const f = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}

function contrastRatio(fg: Rgb255, bg: Rgb255): number {
  const l1 = luminance255(fg)
  const l2 = luminance255(bg)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

function mix255(fg: Rgb255, alpha: number, bg: Rgb255): Rgb255 {
  return {
    r: fg.r * alpha + bg.r * (1 - alpha),
    g: fg.g * alpha + bg.g * (1 - alpha),
    b: fg.b * alpha + bg.b * (1 - alpha),
  }
}

/** Assombrit ou éclaircit une couleur vers une cible de luminance. */
function shiftLuminance(color: Rgb255, targetLum: number): Rgb255 {
  const current = luminance255(color)
  if (Math.abs(current - targetLum) < 0.02) return color
  const factor = targetLum / Math.max(current, 0.01)
  return {
    r: Math.max(0, Math.min(255, color.r * factor)),
    g: Math.max(0, Math.min(255, color.g * factor)),
    b: Math.max(0, Math.min(255, color.b * factor)),
  }
}

const SLATE_900: Rgb255 = { r: 15, g: 23, b: 42 }
const SLATE_700: Rgb255 = { r: 51, g: 65, b: 85 }
const SLATE_100: Rgb255 = { r: 241, g: 245, b: 249 }
const WHITE: Rgb255 = { r: 255, g: 255, b: 255 }

/**
 * Retourne une variante de la couleur accent lisible sur le fond donné (texte / titres).
 */
export function readableAccentHex(
  accentHex: string,
  backgroundHex: string,
  minRatio = 4.5,
): string {
  const accent = parseHexRgb255(accentHex)
  const bg = parseHexRgb255(backgroundHex)
  if (contrastRatio(accent, bg) >= minRatio) return accentHex

  const bgIsDark = luminance255(bg) < 0.35
  const candidates: Rgb255[] = bgIsDark
    ? [
        accent,
        mix255(accent, 0.7, WHITE),
        mix255(accent, 0.5, WHITE),
        SLATE_100,
        WHITE,
      ]
    : [
        accent,
        shiftLuminance(accent, 0.22),
        shiftLuminance(accent, 0.15),
        SLATE_700,
        SLATE_900,
      ]

  for (const c of candidates) {
    if (contrastRatio(c, bg) >= minRatio) return rgb255ToHex(c)
  }
  return bgIsDark ? '#f1f5f9' : '#0f172a'
}

export function withAlphaHex(hex: string, alpha: number): string {
  const { r, g, b } = parseHexRgb255(hex)
  return `rgba(${r},${g},${b},${alpha})`
}

export function mixHex(fgHex: string, alpha: number, bgHex: string): string {
  return rgb255ToHex(mix255(parseHexRgb255(fgHex), alpha, parseHexRgb255(bgHex)))
}

/** Fond de page / sidebar en hex pour les calculs de contraste. */
export const CV_BG = {
  white: '#ffffff',
  slate50: '#f8fafc',
  slate100: '#f1f5f9',
  slate900: '#0f172a',
  slate950: '#020617',
} as const
