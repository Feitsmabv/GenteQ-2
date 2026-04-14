import type { Locale } from './config'
import { nl } from './dictionaries/nl'
import { en } from './dictionaries/en'

const dictionaries = { nl, en } as const

export function getDictionary(locale: Locale) {
  return dictionaries[locale]
}
