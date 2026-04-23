import type { Block } from 'payload'

export const ContactSplit: Block = {
  slug: 'contactSplit',
  labels: {
    singular: 'Contact blok',
    plural: 'Contact blokken',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Linker kolom — info',
          fields: [
            {
              name: 'infoTitle',
              type: 'text',
              localized: true,
              defaultValue: 'Direct contact',
            },
            {
              name: 'infoIntro',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'infoItems',
              type: 'array',
              labels: { singular: 'Info item', plural: 'Info items' },
              maxRows: 6,
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  defaultValue: 'mail',
                  options: [
                    { label: 'E-mail', value: 'mail' },
                    { label: 'Telefoon', value: 'phone' },
                    { label: 'Adres', value: 'map' },
                    { label: 'Openingstijden', value: 'clock' },
                    { label: 'KVK / BTW', value: 'building' },
                  ],
                },
                { name: 'label', type: 'text', required: true, localized: true },
                {
                  name: 'value',
                  type: 'text',
                  required: true,
                  localized: true,
                  admin: { description: 'Zichtbare tekst (bv. "andy@genteq.be").' },
                },
                {
                  name: 'href',
                  type: 'text',
                  admin: {
                    description:
                      'Optioneel: maakt van de waarde een link. Bv. mailto:andy@genteq.be of tel:+32...',
                  },
                },
              ],
            },
            {
              name: 'responsePromise',
              type: 'text',
              localized: true,
              defaultValue: 'We reageren binnen 1 werkdag.',
              admin: { description: 'Kleine regel onder de info, bv. reactietijd.' },
            },
          ],
        },
        {
          label: 'Rechter kolom — formulier',
          fields: [
            {
              name: 'formTitle',
              type: 'text',
              localized: true,
              defaultValue: 'Stuur ons een bericht',
            },
            {
              name: 'formIntro',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'recipientEmail',
              type: 'email',
              required: true,
              defaultValue: 'andy@genteq.be',
              admin: {
                description:
                  'Ontvanger van de contact-mails. Wordt ook gebruikt als afzender-Reply-To.',
              },
            },
            {
              name: 'successTitle',
              type: 'text',
              localized: true,
              defaultValue: 'Bedankt, we hebben je bericht ontvangen.',
            },
            {
              name: 'successMessage',
              type: 'textarea',
              localized: true,
              defaultValue: 'We nemen binnen 1 werkdag contact met je op.',
            },
          ],
        },
      ],
    },
  ],
}
