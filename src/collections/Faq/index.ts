import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'

export const Faq: CollectionConfig = {
  slug: 'faq',
  labels: {
    singular: 'Vraag',
    plural: 'Veelgestelde vragen',
  },
  admin: {
    useAsTitle: 'vraag',
    defaultColumns: ['vraag', 'categorie', 'volgorde'],
    group: 'Content',
  },
  access: {
    create: authenticated,
    read: anyone,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'vraag',
      type: 'text',
      required: true,
      label: 'Vraag',
    },
    {
      name: 'antwoord',
      type: 'textarea',
      required: true,
      label: 'Antwoord',
    },
    {
      name: 'categorie',
      type: 'select',
      required: true,
      label: 'Categorie',
      options: [
        { label: 'Over het project', value: 'project' },
        { label: 'Woningen & afwerking', value: 'woningen' },
        { label: 'Praktisch & financieel', value: 'praktisch' },
      ],
    },
    {
      name: 'volgorde',
      type: 'number',
      label: 'Volgorde',
      defaultValue: 0,
      admin: {
        description: 'Lagere nummers verschijnen eerst',
      },
    },
  ],
}
