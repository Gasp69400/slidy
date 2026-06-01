'use client'

import { useEffect, useRef } from 'react'

/**
 * Déclenche `onView` une seule fois quand la section entre dans le viewport.
 */
export function useSectionViewOnce(sectionId: string, onView: () => void) {
  const fired = useRef(false)
  const onViewRef = useRef(onView)
  onViewRef.current = onView

  useEffect(() => {
    const el = document.getElementById(sectionId)
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || fired.current) return
        fired.current = true
        onViewRef.current()
        observer.disconnect()
      },
      { threshold: 0.2, rootMargin: '0px 0px -5% 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [sectionId])
}
