import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Navigatie',
  admin: {
    group: 'Instellingen',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      label: 'Navigatie items',
      labels: {
        singular: 'Item',
        plural: 'Items',
      },
      maxRows: 6,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Label',
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'URL',
          admin: {
            description: 'Bv. /aanbod, /nieuws, /faq, /contact (begint met een /)',
          },
          validate: (value: string | null | undefined) => {
            if (!value) return 'URL is verplicht'
            // Externe URLs en anchors zijn ok
            if (value.startsWith('http') || value.startsWith('#')) return true
            // Relatieve URLs moeten beginnen met /
            if (!value.startsWith('/')) return 'URL moet beginnen met / (bv. /aanbod)'
            return true
          },
        },
      ],
    },
  ],
}
