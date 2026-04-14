'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { defaultLocale, isLocale } from '@/i18n/config'

export function HtmlLangUpdater() {
  const pathname = usePathname()

  useEffect(() => {
    const first = (pathname || '').split('/').filter(Boolean)[0]
    const locale = first && isLocale(first) ? first : defaultLocale
    if (document.documentElement.lang !== locale) {
      document.documentElement.lang = locale
    }
  }, [pathname])

  return null
}
