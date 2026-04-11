import type { ProjectSetting, Media } from '@/payload-types'

type PageKey = 'aanbod' | 'nieuws' | 'faq' | 'contact'

export function getPageHeroBackground(
  settings: ProjectSetting | null | undefined,
  page: PageKey,
) {
  const heroes = (settings?.pageHeroes ?? {}) as Record<string, unknown>
  const type = heroes[`${page}HeroType`] as 'kleur' | 'afbeelding' | undefined
  const kleur = heroes[`${page}HeroKleur`] as string | undefined
  const afbeelding = heroes[`${page}HeroAfbeelding`] as Media | null | undefined

  return {
    type,
    kleur,
    afbeeldingUrl: afbeelding?.url || undefined,
  }
}
