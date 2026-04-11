import { seoPlugin } from '@payloadcms/plugin-seo'
import { s3Storage } from '@payloadcms/storage-s3'
import { Plugin } from 'payload'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { getServerSideURL } from '@/utilities/getURL'

const generateTitle: GenerateTitle = ({ doc }) => {
  return doc?.title ? `${doc.title}` : ''
}

const generateURL: GenerateURL = ({ doc }) => {
  const url = getServerSideURL()
  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  ...(process.env.S3_ENDPOINT
    ? [
        s3Storage({
          collections: {
            media: {
              prefix: 'payload',
              generateFileURL: ({ filename }) => {
                const projectId = (process.env.S3_ENDPOINT || '').match(/https:\/\/([^.]+)/)?.[1] || ''
                return `https://${projectId}.supabase.co/storage/v1/object/public/media/payload/${filename}`
              },
            },
          },
          bucket: process.env.S3_BUCKET || 'media',
          config: {
            endpoint: process.env.S3_ENDPOINT,
            region: process.env.S3_REGION || 'eu-west-3',
            credentials: {
              accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
            },
            forcePathStyle: true,
          },
        }),
      ]
    : []),
]
