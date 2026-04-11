import type { GlobalConfig } from 'payload'

export const ProjectSettings: GlobalConfig = {
  slug: 'project-settings',
  label: 'Projectinstellingen',
  admin: {
    group: 'Instellingen',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Algemeen',
          fields: [
            {
              name: 'projectnaam',
              type: 'text',
              required: true,
              label: 'Projectnaam',
              defaultValue: 'Projectnaam',
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo (donker)',
              admin: {
                description: 'Standaard logo (gebruikt op witte achtergrond, in navigatie en footer)',
              },
            },
            {
              name: 'logoWit',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo (wit)',
              admin: {
                description: 'Witte versie van het logo voor donkere hero achtergronden. Optioneel — laat leeg als je donkere logo monochroom is.',
              },
            },
            {
              name: 'heroTitel',
              type: 'text',
              label: 'Hero titel',
              defaultValue: 'Vind uw droomwoning.',
              admin: {
                description: 'Hoofdtitel op de homepage',
              },
            },
            {
              name: 'heroSubtitel',
              type: 'text',
              label: 'Hero subtitel',
              defaultValue: 'Woningen met karakter, gebouwd voor nu en de volgende generaties.',
            },
            {
              name: 'heroMediaType',
              type: 'select',
              label: 'Hero achtergrond type',
              defaultValue: 'geen',
              options: [
                { label: 'Geen (donkere achtergrond)', value: 'geen' },
                { label: 'Afbeelding', value: 'afbeelding' },
                { label: 'Video', value: 'video' },
              ],
              admin: {
                description: 'Kies of de hero een afbeelding, video of standaard donkere achtergrond toont.',
              },
            },
            {
              name: 'heroAfbeelding',
              type: 'upload',
              relationTo: 'media',
              label: 'Hero afbeelding',
              admin: {
                description: 'Aanbevolen formaat: 1920×1080px of breder. Wordt getoond als achtergrond van de hero.',
                condition: (data) => data?.heroMediaType === 'afbeelding',
              },
            },
            {
              name: 'heroVideo',
              type: 'upload',
              relationTo: 'media',
              label: 'Hero video',
              admin: {
                description: 'Upload een MP4 of WebM video. Wordt automatisch afgespeeld zonder geluid als achtergrond.',
                condition: (data) => data?.heroMediaType === 'video',
              },
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              name: 'telefoon',
              type: 'text',
              label: 'Telefoonnummer',
              defaultValue: '+32 9 000 00 00',
            },
            {
              name: 'email',
              type: 'email',
              label: 'E-mailadres',
              defaultValue: 'info@projectnaam.be',
            },
            {
              name: 'adres',
              type: 'text',
              label: 'Adres',
              defaultValue: 'Voorbeeldstraat 1, 1000 Stad',
            },
            {
              name: 'kantooruren',
              type: 'text',
              label: 'Kantooruren',
              defaultValue: 'Ma-Vr: 9:00 - 17:00',
            },
            {
              name: 'contactIntro',
              type: 'textarea',
              label: 'Intro tekst contactsectie',
              defaultValue: 'Heeft u vragen over het project of wilt u een afspraak maken? Neem gerust contact met ons op.',
              admin: {
                description: 'Tekst boven het contactformulier (op homepage, contactpagina, etc.)',
              },
            },
            {
              name: 'propertySidebarTitel',
              type: 'text',
              label: 'Woning detail — sidebar titel',
              defaultValue: 'Interesse in deze woning?',
              admin: {
                description: 'Titel van het contactblok op de detailpagina van een woning',
              },
            },
            {
              name: 'propertySidebarTekst',
              type: 'textarea',
              label: 'Woning detail — sidebar tekst',
              defaultValue: 'Neem contact op voor een vrijblijvend bezoek of meer informatie.',
            },
          ],
        },
        {
          label: "Pagina hero's",
          fields: [
            {
              name: 'pageHeroes',
              type: 'group',
              label: "Achtergronden van pagina hero's",
              admin: {
                description: 'Stel per subpagina de achtergrond in (kleur of afbeelding).',
              },
              fields: [
                ...['aanbod', 'nieuws', 'faq', 'contact'].flatMap((page) => {
                  const labelMap: Record<string, string> = {
                    aanbod: 'Aanbod',
                    nieuws: 'Nieuws',
                    faq: 'FAQ',
                    contact: 'Contact',
                  }
                  return [
                    {
                      type: 'collapsible' as const,
                      label: labelMap[page],
                      fields: [
                        {
                          name: `${page}HeroType`,
                          type: 'select' as const,
                          label: 'Achtergrond type',
                          defaultValue: 'kleur',
                          options: [
                            { label: 'Kleur', value: 'kleur' },
                            { label: 'Afbeelding', value: 'afbeelding' },
                          ],
                        },
                        {
                          name: `${page}HeroKleur`,
                          type: 'text' as const,
                          label: 'Achtergrondkleur',
                          defaultValue: '#1a1612',
                          admin: {
                            description: 'Hex kleur (bv. #1a1612)',
                            condition: (data: { pageHeroes?: Record<string, string> }) => data?.pageHeroes?.[`${page}HeroType`] === 'kleur',
                          },
                        },
                        {
                          name: `${page}HeroAfbeelding`,
                          type: 'upload' as const,
                          relationTo: 'media' as const,
                          label: 'Achtergrondafbeelding',
                          admin: {
                            description: 'Aanbevolen: 1920×600px',
                            condition: (data: { pageHeroes?: Record<string, string> }) => data?.pageHeroes?.[`${page}HeroType`] === 'afbeelding',
                          },
                        },
                      ],
                    },
                  ]
                }),
              ],
            },
          ],
        },
        {
          label: 'Aanbod',
          fields: [
            {
              name: 'aanbodTitel',
              type: 'text',
              label: 'Aanbod sectie titel',
              defaultValue: 'Ontdek onze woningtypes',
              admin: {
                description: 'Titel van de aanbod-sectie op de homepage',
              },
            },
            {
              name: 'aanbodTekst',
              type: 'richText',
              label: 'Aanbod sectie tekst',
            },
            {
              name: 'aanbodIcoon',
              type: 'upload',
              relationTo: 'media',
              label: 'Aanbod sectie icoon',
              admin: {
                description: 'Klein icoon (SVG of PNG) dat naast de tekst wordt getoond. Laat leeg voor het standaard huisje-icoon.',
              },
            },
          ],
        },
        {
          label: 'Brochure',
          fields: [
            {
              name: 'brochure',
              type: 'upload',
              relationTo: 'media',
              label: 'Brochure PDF',
              admin: {
                description: 'Upload de projectbrochure (PDF). Bezoekers kunnen deze downloaden via het formulier.',
              },
            },
            {
              name: 'brochureTitel',
              type: 'text',
              label: 'Brochure sectie titel',
              defaultValue: 'Download de projectbrochure',
            },
            {
              name: 'brochureOmschrijving',
              type: 'richText',
              label: 'Brochure sectie omschrijving',
            },
          ],
        },
        {
          label: 'Over het project',
          fields: [
            {
              name: 'introTitel',
              type: 'text',
              label: 'Intro titel',
              defaultValue: 'Wonen waar alles samenkomt',
            },
            {
              name: 'introTekst',
              type: 'richText',
              label: 'Intro tekst',
              admin: {
                description: 'Tekst in de "Over het project" sectie op de homepage',
              },
            },
            {
              name: 'introAfbeelding',
              type: 'upload',
              relationTo: 'media',
              label: 'Intro afbeelding',
              admin: {
                description: 'Afbeelding naast de intro tekst (bv. project render). Aanbevolen: 800×600px of groter.',
              },
            },
          ],
        },
        {
          label: 'Locatie',
          fields: [
            {
              name: 'locatieTitel',
              type: 'text',
              label: 'Locatie titel',
              defaultValue: 'Een toplocatie in het hart van de stad',
            },
            {
              name: 'locatieTekst',
              type: 'richText',
              label: 'Locatie omschrijving',
            },
            {
              name: 'locatieAfbeelding',
              type: 'upload',
              relationTo: 'media',
              label: 'Locatie afbeelding of video',
              admin: {
                description: 'Upload een afbeelding of video voor de locatie-sectie. Wordt links van de tekst getoond.',
              },
            },
            {
              name: 'afstanden',
              type: 'array',
              label: 'Afstanden',
              labels: {
                singular: 'Afstand',
                plural: 'Afstanden',
              },
              fields: [
                {
                  name: 'locatie',
                  type: 'text',
                  required: true,
                  label: 'Locatie',
                  admin: { description: 'Bv. "Stadscentrum"' },
                },
                {
                  name: 'afstand',
                  type: 'text',
                  required: true,
                  label: 'Afstand',
                  admin: { description: 'Bv. "5 min"' },
                },
              ],
            },
          ],
        },
        {
          label: 'Partners',
          fields: [
            {
              name: 'partners',
              type: 'array',
              label: 'Partners',
              labels: {
                singular: 'Partner',
                plural: 'Partners',
              },
              fields: [
                {
                  name: 'naam',
                  type: 'text',
                  required: true,
                  label: 'Naam',
                },
                {
                  name: 'url',
                  type: 'text',
                  label: 'Website URL',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
