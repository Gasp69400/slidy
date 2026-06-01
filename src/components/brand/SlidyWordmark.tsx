import { cn } from '@/lib/utils'

type SlidyWordmarkProps = {
  className?: string
}

/** « Slidy » + « app » orange, même graisse et police que le conteneur. */
export function SlidyWordmark({ className }: SlidyWordmarkProps) {
  return (
    <span className={cn('truncate tracking-tight', className)}>
      Slidy
      <span className="text-brand-500 dark:text-brand-400">app</span>
    </span>
  )
}
