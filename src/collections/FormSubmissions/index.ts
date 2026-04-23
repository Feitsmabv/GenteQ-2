import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  labels: {
    singular: 'Formulier inzending',
    plural: 'Formulier inzendingen',
  },
  access: {
    create: () => true,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    group: 'Inzendingen',
    defaultColumns: ['form', 'name', 'email', 'subject', 'createdAt'],
    useAsTitle: 'email',
    listSearchableFields: ['name', 'email', 'message', 'subject'],
  },
  fields: [
    {
      name: 'form',
      type: 'select',
      required: true,
      defaultValue: 'contact',
      options: [
        { label: 'Contact', value: 'contact' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'subject',
      type: 'select',
      required: true,
      options: [
        { label: 'Offerte aanvragen', value: 'quote' },
        { label: 'Advies / intake', value: 'advice' },
        { label: 'Klantondersteuning', value: 'support' },
        { label: 'Overig', value: 'other' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'meta',
      type: 'group',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'ip', type: 'text' },
        { name: 'userAgent', type: 'text' },
        { name: 'locale', type: 'text' },
        { name: 'referrer', type: 'text' },
      ],
    },
  ],
  timestamps: true,
}
