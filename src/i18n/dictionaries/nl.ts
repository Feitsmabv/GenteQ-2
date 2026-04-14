export const nl = {
  common: {
    skipToContent: 'Ga naar inhoud',
    comingSoon: 'Coming Soon',
    languageSwitcher: 'Taal',
  },
  home: {
    metaTitle: 'GenteQ | Energieoplossingen, Vereenvoudigd',
    metaDescription:
      'B2B energieoplossingen die complexiteit doorbreken. Slimme energie, zonder gedoe.',
    tagline: 'Energieoplossingen.',
  },
  notFound: {
    label: 'PAGINA NIET GEVONDEN',
    title: '404',
    description:
      'De pagina die u zoekt bestaat niet of is verplaatst. Ga terug naar de homepage om verder te zoeken.',
    homeCta: 'Naar homepage',
    contactCta: 'Contact',
  },
  legal: {
    label: 'JURIDISCH',
  },
} as const

export type Dictionary = typeof nl
