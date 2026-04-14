import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { getPayloadClient } from '@/utilities/payload'
import { isLocale } from '@/i18n/config'
import { RenderBlocks } from '@/blocks/RenderBlocks'

async function queryPage(slug: string, locale: 'nl' | 'en') {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    locale,
    overrideAccess: draft,
    where: { slug: { equals: slug } },
  })

  return result.docs[0] ?? null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}

  const page = await queryPage(slug.join('/'), locale)
  if (!page) return {}

  const meta = (page as { meta?: { title?: string; description?: string } }).meta
  return {
    title: meta?.title || page.title,
    description: meta?.description,
  }
}

export default async function PageRoute({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>
}) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const page = await queryPage(slug.join('/'), locale)
  if (!page) notFound()

  return (
    <main id="main-content">
      <RenderBlocks blocks={page.layout} />
    </main>
  )
}
