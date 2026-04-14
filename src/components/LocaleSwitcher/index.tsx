'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  defaultLocale,
  isLocale,
  locales,
  routeSlugs,
  type Locale,
  type RouteKey,
} from '@/i18n/config'

const localeLabels: Record<Locale, string> = {
  nl: 'NL',
  en: 'EN',
}

function pathForLocale(currentPath: string, target: Locale): string {
  const segments = currentPath.split('/').filter(Boolean)
  const currentLocale: Locale =
    segments[0] && isLocale(segments[0]) ? segments[0] : defaultLocale
  const restSegments = isLocale(segments[0] ?? '') ? segments.slice(1) : segments

  const currentRouteSlug = restSegments[0] ?? ''
  const matchedKey = (Object.keys(routeSlugs) as RouteKey[]).find(
    (key) => routeSlugs[key][currentLocale] === currentRouteSlug,
  )

  let translatedSegments = restSegments
  if (matchedKey) {
    translatedSegments = [routeSlugs[matchedKey][target], ...restSegments.slice(1)]
  }

  const prefix = target === defaultLocale ? '' : `/${target}`
  const rest = translatedSegments.length ? `/${translatedSegments.join('/')}` : ''
  return `${prefix}${rest}` || '/'
}

export function LocaleSwitcher({ className = '' }: { className?: string }) {
  const pathname = usePathname() || '/'

  return (
    <nav aria-label="Language" className={`flex items-center gap-2 text-xs ${className}`}>
      {locales.map((locale, index) => (
        <span key={locale} className="flex items-center gap-2">
          {index > 0 && <span aria-hidden className="text-white/30">|</span>}
          <Link
            href={pathForLocale(pathname, locale)}
            hrefLang={locale}
            className="font-medium uppercase tracking-[2px] text-white/60 transition-colors hover:text-white"
          >
            {localeLabels[locale]}
          </Link>
        </span>
      ))}
    </nav>
  )
}
