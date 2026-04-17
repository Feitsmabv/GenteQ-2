import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { WaveLines } from '@/components/WaveLines'
import { SplineBackground } from '@/components/SplineBackground'
import { isLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/getDictionary'
import { getPayloadClient } from '@/utilities/payload'
import { RenderBlocks } from '@/blocks/RenderBlocks'

async function queryHome(locale: Locale) {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    locale,
    overrideAccess: draft,
    where: { slug: { equals: 'home' } },
  })
  return result.docs[0] ?? null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}

  const page = await queryHome(locale)
  if (page) {
    const meta = (page as { meta?: { title?: string; description?: string } }).meta
    return {
      title: meta?.title || page.title,
      description: meta?.description,
    }
  }

  const t = getDictionary(locale)
  return {
    title: t.home.metaTitle,
    description: t.home.metaDescription,
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const page = await queryHome(locale)
  if (page) {
    return (
      <main id="main-content">
        <RenderBlocks blocks={page.layout} />
      </main>
    )
  }

  const t = getDictionary(locale)

  return (
    <main
      id="main-content"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-carbon-black px-6"
    >
      <SplineBackground scene="https://prod.spline.design/3OehmQIOWEVKdi9w/scene.splinecode" />
      <WaveLines />

      <div className="relative z-10 flex max-w-lg flex-col items-center text-center">
        <span className="text-[11px] font-medium uppercase tracking-[4px] text-steel-blue">
          {t.common.comingSoon}
        </span>

        <h1 className="mt-8 text-5xl font-bold tracking-[2px] text-white md:text-7xl">
          GenteQ
        </h1>

        <p className="mt-5 text-base font-light leading-7 text-slate-light">
          {t.home.tagline}
        </p>
      </div>
    </main>
  )
}
