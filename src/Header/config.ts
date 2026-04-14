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
  ],
}
