import type { GlobalConfig } from 'payload'
import { admin } from '../access/admin'

function validateUrl(value: string | null | undefined): true | string {
  if (!value) return 'URL is verplicht'
  if (value.startsWith('http') || value.startsWith('#')) return true
  if (!value.startsWith('/')) return 'URL moet beginnen met / (bv. /contact)'
  return true
}

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  admin: {
    group: 'Instellingen',
  },
  access: {
    read: () => true,
    update: admin,
  },
  fields: [
    {
      name: 'company',
      type: 'group',
      label: 'Bedrijf',
      fields: [
        {
          name: 'tagline',
          type: 'text',
          label: 'Tagline',
          localized: true,
          defaultValue: 'Energieoplossingen, vereenvoudigd.',
        },
        {
          name: 'address',
          type: 'textarea',
          label: 'Adres',
          localized: true,
          admin: {
            description: 'Optioneel. Laat leeg om te verbergen.',
          },
        },
      ],
    },
    {
      name: 'columns',
      type: 'array',
      label: 'Link-kolommen',
      labels: { singular: 'Kolom', plural: 'Kolommen' },
      maxRows: 3,
      admin: {
        description: 'Maximaal 3 kolommen met links. Leeg laten om hele footer-nav te verbergen.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titel',
          required: true,
          localized: true,
        },
        {
          name: 'links',
          type: 'array',
          label: 'Links',
          labels: { singular: 'Link', plural: 'Links' },
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Label',
              required: true,
              localized: true,
            },
            {
              name: 'url',
              type: 'text',
              label: 'URL',
              required: true,
              admin: {
                description: 'Bv. / of /contact. Externe URLs (https://) en anchors (#sectie) mogen ook.',
              },
              validate: validateUrl,
            },
          ],
        },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      label: 'Contact',
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'E-mail',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Telefoon',
        },
        {
          name: 'responseTime',
          type: 'text',
          label: 'Reactietijd-belofte',
          localized: true,
          admin: {
            description: 'Bv. "We reageren binnen 24 uur."',
          },
        },
      ],
    },
    {
      name: 'legal',
      type: 'array',
      label: 'Juridische links (bodem-strook)',
      labels: { singular: 'Link', plural: 'Links' },
      maxRows: 6,
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
          localized: true,
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          required: true,
          localized: true,
          admin: {
            description:
              'Bv. /privacy of /cookies. Per taal in te stellen omdat NL en EN andere slugs hebben (/voorwaarden vs /terms).',
          },
          validate: validateUrl,
        },
      ],
    },
    {
      name: 'bottom',
      type: 'group',
      label: 'Bodem-strook',
      fields: [
        {
          name: 'copyrightName',
          type: 'text',
          label: 'Copyright-naam',
          defaultValue: 'GenteQ',
        },
        {
          name: 'showBackToTop',
          type: 'checkbox',
          label: 'Toon "Terug naar boven"-knop',
          defaultValue: true,
        },
      ],
    },
  ],
}
