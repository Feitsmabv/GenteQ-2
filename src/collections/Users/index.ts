import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { admin } from '../../access/admin'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: admin,
    delete: admin,
    read: authenticated,
    update: ({ req: { user }, id }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      // Editors mogen alleen hun eigen profiel bewerken
      return user.id === id
    },
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        // Alleen admins mogen rollen wijzigen
        update: ({ req: { user } }) => user?.role === 'admin',
      },
      admin: {
        description: 'Admin: volledige toegang. Editor: kan alleen content beheren.',
      },
    },
  ],
  timestamps: true,
}
