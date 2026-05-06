import { FC } from 'react'

import { Progress } from '@/components/ui/progress'
import { useSiteLocale } from '@/lib/site-locale'

const GenerationProgress: FC = () => {
  const { t } = useSiteLocale()

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="space-y-1 text-center">
        <p className="text-sm font-medium text-slate-900 dark:text-white">
          {t('create.generating.title')}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t('create.generating.subtitle')}
        </p>
      </div>
      <Progress value={70} className="w-72 max-w-full" />
      <p className="text-[11px] text-slate-400 dark:text-slate-500">
        {t('create.generating.note')}
      </p>
    </div>
  )
}

export default GenerationProgress
