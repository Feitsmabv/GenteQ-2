import type { Block } from 'payload'

export const FullscreenVideo: Block = {
  slug: 'fullscreenVideo',
  labels: {
    singular: 'Video (volledig scherm)',
    plural: 'Video blocks (volledig scherm)',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      admin: {
        description: 'Titel linksboven op de video, bv. "HUAWEI Baywa".',
      },
    },
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      required: true,
      filterOptions: { mimeType: { contains: 'video' } },
      admin: {
        description:
          'MP4 in 1080p, verkleind voor het web. Start vanzelf zonder geluid zodra het blok in beeld komt.',
      },
    },
    {
      name: 'videoMobile',
      type: 'upload',
      relationTo: 'media',
      label: 'Video, lichtere versie voor telefoons',
      filterOptions: { mimeType: { contains: 'video' } },
      admin: {
        description: 'Optioneel. MP4 in 720p. Wordt gebruikt op smalle schermen.',
      },
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      label: 'Stilstaand beeld',
      filterOptions: { mimeType: { contains: 'image' } },
      admin: {
        description: 'Wordt getoond tot de video start. Neem het eerste beeld van de video.',
      },
    },
  ],
}
