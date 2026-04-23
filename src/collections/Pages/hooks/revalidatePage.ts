import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath } from 'next/cache'
import type { Page } from '@/payload-types'

// Veilige wrapper: revalidatePath() werkt alleen binnen een Next.js request-
// context. Vanuit CLI-scripts (seeds, bulk updates) crasht hij met
// "static generation store missing" en rolt de hele write terug. Slikken we
// die error in, dan blijven admin/UI-writes gewoon revalideren terwijl
// scripts niet meer sneuvelen.
const safeRevalidate = (path: string) => {
  try {
    revalidatePath(path)
  } catch {
    // no-op: niet in een Next request-context
  }
}

export const revalidatePage: CollectionAfterChangeHook<Page> = ({ doc, previousDoc, req: { payload } }) => {
  if (doc._status === 'published') {
    const path = doc.slug === 'home' ? '/' : `/${doc.slug}`
    payload.logger.info(`Revalidating ${path}`)
    safeRevalidate(path)
  }

  if (previousDoc?._status === 'published' && doc._status !== 'published') {
    const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`
    safeRevalidate(oldPath)
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({ doc }) => {
  const path = doc?.slug === 'home' ? '/' : `/${doc?.slug}`
  safeRevalidate(path)
  return doc
}
