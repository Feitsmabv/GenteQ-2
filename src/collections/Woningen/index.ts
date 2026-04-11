import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'

export const Woningen: CollectionConfig = {
  slug: 'woningen',
  labels: {
    singular: 'Woning',
    plural: 'Woningen',
  },
  admin: {
    useAsTitle: 'titel',
    defaultColumns: ['titel', 'type', 'prijs', 'status', 'updatedAt'],
    group: 'Vastgoed',
  },
  access: {
    create: authenticated,
    read: anyone,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Algemeen',
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
                description: 'Alleen de naam, geen URL! Bv: appartement-a1 (niet de volledige link)',
              },
              hooks: {
                beforeValidate: [
                  async ({ value, operation, req, originalDoc }) => {
                    // Bij create (incl. duplicate) controleren of slug al bestaat,
                    // en zo ja een uniek suffix toevoegen.
                    if (operation !== 'create' || !value) return value
                    const existing = await req.payload.find({
                      collection: 'woningen',
                      where: { slug: { equals: value } },
                      limit: 1,
                      depth: 0,
                    })
                    if (existing.docs.length === 0) return value
                    if (originalDoc && existing.docs[0]?.id === originalDoc.id) return value
                    // Voeg een korte timestamp suffix toe
                    return `${value}-${Date.now().toString(36).slice(-4)}`
                  },
                ],
              },
              validate: (value: string | null | undefined) => {
                if (!value) return 'Slug is verplicht'
                if (value.includes('://')) return 'Vul alleen de naam in, geen volledige URL (bv. appartement-a1)'
                if (value.includes(' ')) return 'Slug mag geen spaties bevatten (gebruik streepjes)'
                return true
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'type',
                  type: 'select',
                  required: true,
                  label: 'Woningtype',
                  options: [
                    { label: 'Appartement', value: 'appartement' },
                    { label: 'Woning', value: 'woning' },
                    { label: 'Penthouse', value: 'penthouse' },
                  ],
                },
                {
                  name: 'status',
                  type: 'select',
                  required: true,
                  label: 'Status',
                  defaultValue: 'beschikbaar',
                  options: [
                    { label: 'Beschikbaar', value: 'beschikbaar' },
                    { label: 'Nieuw', value: 'nieuw' },
                    { label: 'Bijna volzet', value: 'bijna-volzet' },
                    { label: 'Verkocht', value: 'verkocht' },
                  ],
                },
              ],
            },
            {
              name: 'adres',
              type: 'text',
              label: 'Adres',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'prijs',
                  type: 'number',
                  required: true,
                  label: 'Prijs (€)',
                  admin: {
                    description: 'Prijs in euro zonder punten (bv. 245000)',
                  },
                },
                {
                  name: 'prijsLabel',
                  type: 'text',
                  label: 'Prijslabel',
                  defaultValue: 'Vanaf',
                  admin: {
                    description: 'Tekst boven de prijs (bv. "Vanaf", "Vanaf slechts")',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Specificaties',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'slaapkamers',
                  type: 'number',
                  required: true,
                  label: 'Slaapkamers',
                },
                {
                  name: 'badkamers',
                  type: 'number',
                  required: true,
                  label: 'Badkamers',
                },
                {
                  name: 'oppervlakte',
                  type: 'text',
                  required: true,
                  label: 'Oppervlakte',
                  admin: {
                    description: 'Bv. "85 m²"',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'verdieping',
                  type: 'text',
                  label: 'Verdieping',
                  admin: {
                    description: 'Bv. "3de" of "Gelijkvloers"',
                  },
                },
                {
                  name: 'garage',
                  type: 'number',
                  label: 'Garage(s)',
                  defaultValue: 0,
                },
                {
                  name: 'tuin',
                  type: 'select',
                  label: 'Tuin',
                  defaultValue: 'nee',
                  options: [
                    { label: 'Ja', value: 'ja' },
                    { label: 'Nee', value: 'nee' },
                  ],
                },
              ],
            },
            {
              name: 'kenmerken',
              type: 'array',
              label: 'Kenmerken & afwerking',
              labels: {
                singular: 'Kenmerk',
                plural: 'Kenmerken',
              },
              fields: [
                {
                  name: 'kenmerk',
                  type: 'text',
                  required: true,
                  label: 'Kenmerk',
                },
              ],
            },
          ],
        },
        {
          label: 'Beschrijving',
          fields: [
            {
              name: 'beschrijving',
              type: 'richText',
              label: 'Beschrijving',
            },
          ],
        },
        {
          label: "Afbeeldingen",
          fields: [
            {
              name: 'hoofdafbeelding',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Hoofdafbeelding',
            },
            {
              name: 'galerij',
              type: 'array',
              label: 'Galerij',
              labels: {
                singular: 'Foto',
                plural: "Foto's",
              },
              fields: [
                {
                  name: 'afbeelding',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  label: 'Afbeelding',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
