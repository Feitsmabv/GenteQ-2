import type { GlobalConfig } from 'payload'
import { admin } from '../access/admin'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Navigatie',
  admin: {
    group: 'Instellingen',
  },
  access: {
    read: () => true,
    update: admin,
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
          localized: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'URL',
          admin: {
            description: 'Bv. / of /contact (relatieve paden moeten met / beginnen). Externe URLs (https://) en anchors (#sectie) mogen ook.',
          },
          validate: (value: string | null | undefined) => {
            if (!value) return 'URL is verplicht'
            if (value.startsWith('http') || value.startsWith('#')) return true
            if (!value.startsWith('/')) return 'URL moet beginnen met / (bv. /contact)'
            return true
          },
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'CTA knop',
      admin: {
        description: 'Knop rechts in de navigatiebalk. Uitvinken om te verbergen.',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Tonen',
          defaultValue: true,
        },
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          localized: true,
          defaultValue: 'Offerte aanvragen',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.enabled),
          },
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          defaultValue: '/contact',
          admin: {
            description: 'Bv. /contact, #offerte of https://...',
            condition: (_, siblingData) => Boolean(siblingData?.enabled),
          },
          validate: (value: string | null | undefined, { siblingData }: { siblingData?: { enabled?: boolean } }) => {
            if (!siblingData?.enabled) return true
            if (!value) return 'URL is verplicht'
            if (value.startsWith('http') || value.startsWith('#')) return true
            if (!value.startsWith('/')) return 'URL moet beginnen met / (bv. /contact)'
            return true
          },
        },
      ],
    },
  ],
}
