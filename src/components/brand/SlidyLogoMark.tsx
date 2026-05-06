import { cn } from '@/lib/utils'

type SlidyLogoMarkProps = {
  /** `xs` : pastille compacte · `sm` / `md` : logos */
  size?: 'xs' | 'sm' | 'md'
  className?: string
}

/**
 * Monogramme Slidy : « S » dans le carré dégradé (charte violet → fuchsia).
 */
export function SlidyLogoMark({ size = 'md', className }: SlidyLogoMarkProps) {
  const sizeClass =
    size === 'xs' ?
      'h-6 w-6 rounded-md text-xs leading-none'
    : size === 'sm' ?
      'h-8 w-8 rounded-lg text-[15px] leading-none'
    : 'h-9 w-9 rounded-xl text-[17px] leading-none'

  return (
    <span
      className={cn(
        'inline-flex shrink-0 select-none items-center justify-center',
        'bg-gradient-to-br from-violet-600 via-violet-600 to-fuchsia-500',
        'text-white shadow-sm ring-1 ring-inset ring-white/15',
        sizeClass,
        className,
      )}
      aria-hidden
    >
      <span className="translate-y-px font-black italic tracking-[-0.06em] text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.18)]">
        S
      </span>
    </span>
  )
}
