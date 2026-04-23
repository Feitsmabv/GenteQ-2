import type { Block } from 'payload'

export const ContactHero: Block = {
  slug: 'contactHero',
  labels: {
    singular: 'Contact hero',
    plural: 'Contact hero blocks',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
      admin: {
        description: 'Kleine label boven de titel, bv. "Contact".',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
      localized: true,
    },
  ],
}
