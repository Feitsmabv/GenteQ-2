import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  labels: {
    singular: 'Formulierinzending',
    plural: 'Formulierinzendingen',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['type', 'email', 'naam', 'createdAt'],
    group: 'Content',
  },
  access: {
    create: () => true,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Type',
      options: [
        { label: 'Contact', value: 'contact' },
        { label: 'Brochure', value: 'brochure' },
      ],
    },
    {
      name: 'naam',
      type: 'text',
      required: true,
      label: 'Naam',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'E-mailadres',
    },
    {
      name: 'telefoon',
      type: 'text',
      label: 'Telefoonnummer',
    },
    {
      name: 'interesse',
      type: 'text',
      label: 'Geïnteresseerd in',
    },
    {
      name: 'bericht',
      type: 'textarea',
      label: 'Bericht',
    },
    {
      name: 'marketing',
      type: 'checkbox',
      label: 'Marketing toestemming',
      defaultValue: false,
    },
  ],
}
