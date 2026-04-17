import type { Block } from 'payload'

export const Hero: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero',
    plural: 'Hero blocks',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Split (tekst links, media rechts)', value: 'split' },
        { label: 'Centered', value: 'centered' },
      ],
    },
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
      admin: {
        description: 'Kleine label boven de titel, bv. "Coming soon".',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'splineScene',
      type: 'text',
      label: '3D achtergrond (Spline scene URL)',
      admin: {
        description:
          'Optioneel. Plak hier een .splinecode URL van Spline (bv. https://prod.spline.design/XXXX/scene.splinecode) om een 3D animatie als achtergrond te tonen.',
      },
    },
    {
      name: 'splineFallback',
      type: 'upload',
      relationTo: 'media',
      label: '3D achtergrond — fallback afbeelding',
      admin: {
        description:
          'Optioneel. Export een PNG van dezelfde Spline scene. Wordt direct getoond terwijl de 3D animatie laadt.',
        condition: (data, siblingData) =>
          typeof siblingData?.splineScene === 'string' &&
          siblingData.splineScene.trim().length > 0,
      },
    },
    {
      name: 'ctas',
      type: 'array',
      labels: { singular: 'CTA', plural: 'CTAs' },
      maxRows: 2,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'style',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'Primary (blauw)', value: 'primary' },
            { label: 'Secondary (outline wit)', value: 'secondary' },
            { label: 'Ghost (subtiel, blauwe border)', value: 'ghost' },
          ],
        },
      ],
    },
  ],
}
