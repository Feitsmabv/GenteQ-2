import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cache } from 'react'

export const getPayloadClient = cache(async () => {
  return getPayload({ config: configPromise })
})
