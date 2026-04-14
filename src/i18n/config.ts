export const locales = ['nl', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'nl'

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

type SlugMap = Record<Locale, string>

export const routeSlugs = {
  privacy: { nl: 'privacy', en: 'privacy-policy' },
  terms: { nl: 'voorwaarden', en: 'terms' },
  cookies: { nl: 'cookies', en: 'cookies' },
} as const satisfies Record<string, SlugMap>

export type RouteKey = keyof typeof routeSlugs

export function localizedPath(key: RouteKey, locale: Locale): string {
  const slug = routeSlugs[key][locale]
  return locale === defaultLocale ? `/${slug}` : `/${locale}/${slug}`
}

export function homePath(locale: Locale): string {
  return locale === defaultLocale ? '/' : `/${locale}`
}
