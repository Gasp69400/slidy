'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { authInputClass } from '@/lib/auth-form-classes'
import { useSiteLocale } from '@/lib/site-locale'
import { cn } from '@/lib/utils'

type Props = Omit<React.ComponentProps<typeof Input>, 'type'>

export function AuthPasswordInput({ className, ...props }: Props) {
  const { t } = useSiteLocale()
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Input
        {...props}
        type={visible ? 'text' : 'password'}
        className={cn(authInputClass, 'pr-10', className)}
      />
      <button
        type="button"
        className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? t('auth.password.hide') : t('auth.password.show')}
        aria-pressed={visible}
      >
        {visible ? (
          <EyeOff className="h-4 w-4 shrink-0" aria-hidden />
        ) : (
          <Eye className="h-4 w-4 shrink-0" aria-hidden />
        )}
      </button>
    </div>
  )
}
