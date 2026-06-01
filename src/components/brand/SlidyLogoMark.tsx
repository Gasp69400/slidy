import { cn } from '@/lib/utils'

export const SLIDY_LOGO_SRC = '/logo-slidyapp.png?v=5'

/** Filtre pour renforcer l’orange (#ff7600) sur la PNG source. */
const LOGO_ORANGE_FILTER =
  'saturate-[1.9] hue-rotate-[-14deg] brightness-[1.04] contrast-[1.12]'

type SlidyLogoMarkProps = {
  /** `wordmark` : même hauteur que le texte parent (navbar / landing) · `xs`/`sm` : compact */
  size?: 'xs' | 'sm' | 'nav' | 'landing' | 'wordmark'
  className?: string
  priority?: boolean
}

/** Carré + coins ~24 % (comme l’ancien logo 140×140, rx 34). */
const SIZE_CLASS: Record<NonNullable<SlidyLogoMarkProps['size']>, string> = {
  xs: 'h-3.5 w-3.5',
  sm: 'h-4 w-4',
  /** @deprecated Préférer `wordmark` dans un conteneur `text-lg` */
  nav: 'h-[1.125rem] w-[1.125rem]',
  /** @deprecated Préférer `wordmark` dans un conteneur `text-lg` */
  landing: 'h-[1.125rem] w-[1.125rem]',
  wordmark: 'h-[1em] w-[1em]',
}

/**
 * Logo Slidy — pastille carrée arrondie (style app icon), PNG recadrée au centre.
 */
export function SlidyLogoMark({
  size = 'nav',
  className,
  priority = false,
}: SlidyLogoMarkProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 select-none overflow-hidden',
        'aspect-square rounded-[24%]',
        'bg-gradient-to-br from-brand-500 to-brand-600',
        'shadow-md shadow-brand-500/30 ring-1 ring-inset ring-white/20',
        SIZE_CLASS[size],
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={SLIDY_LOGO_SRC}
        alt="Slidy"
        width={782}
        height={718}
        decoding="async"
        fetchPriority={priority ? 'high' : undefined}
        className={cn('h-full w-full object-cover object-center', LOGO_ORANGE_FILTER)}
      />
    </span>
  )
}
