import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'

export const Nieuws: CollectionConfig = {
  slug: 'nieuws',
  labels: {
    singular: 'Artikel',
    plural: 'Nieuws',
  },
  admin: {
    useAsTitle: 'titel',
    defaultColumns: ['titel', 'categorie', 'datum', 'updatedAt'],
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
      name: 'titel',
      type: 'text',
      required: true,
      label: 'Titel',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      label: 'Slug',
      admin: {
        description: 'Alleen de naam, geen URL! Bv: funderingswerken-afgerond',
      },
      hooks: {
        beforeValidate: [
          async ({ value, operation, req, originalDoc }) => {
            if (operation !== 'create' || !value) return value
            const existing = await req.payload.find({
              collection: 'nieuws',
              where: { slug: { equals: value } },
              limit: 1,
              depth: 0,
            })
            if (existing.docs.length === 0) return value
            if (originalDoc && existing.docs[0]?.id === originalDoc.id) return value
            return `${value}-${Date.now().toString(36).slice(-4)}`
          },
        ],
      },
      validate: (value: string | null | undefined) => {
        if (!value) return 'Slug is verplicht'
        if (value.includes('://')) return 'Vul alleen de naam in, geen volledige URL'
        if (value.includes(' ')) return 'Slug mag geen spaties bevatten (gebruik streepjes)'
        return true
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'categorie',
          type: 'select',
          required: true,
          label: 'Categorie',
          options: [
            { label: 'Bouwupdate', value: 'bouwupdate' },
            { label: 'Evenement', value: 'evenement' },
            { label: 'Project', value: 'project' },
          ],
        },
        {
          name: 'datum',
          type: 'date',
          required: true,
          label: 'Publicatiedatum',
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'd MMMM yyyy',
            },
          },
        },
      ],
    },
    {
      name: 'samenvatting',
      type: 'textarea',
      required: true,
      label: 'Samenvatting',
      admin: {
        description: 'Korte tekst voor de kaart op de overzichtspagina',
      },
    },
    {
      name: 'afbeelding',
      type: 'upload',
      relationTo: 'media',
      label: 'Afbeelding',
    },
    {
      name: 'inhoud',
      type: 'richText',
      required: true,
      label: 'Inhoud',
    },
  ],
}
