import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cache } from 'react'

export const getPayloadClient = cache(async () => {
  return getPayload({ config: configPromise })
})

export async function getProjectSettings() {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'project-settings' })
}

export async function getWoningen() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'woningen',
    limit: 100,
    sort: 'titel',
  })
  return result.docs
}

export async function getWoningBySlug(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'woningen',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return result.docs[0] || null
}

export async function getNieuws() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'nieuws',
    limit: 100,
    sort: '-datum',
  })
  return result.docs
}

export async function getNieuwsBySlug(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'nieuws',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return result.docs[0] || null
}

export async function getFaq() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'faq',
    limit: 100,
    sort: 'volgorde',
  })
  return result.docs
}
