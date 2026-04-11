import type { Metadata } from 'next'
import { getNieuws, getNieuwsBySlug, getProjectSettings } from '@/utilities/payload'
import { Breadcrumb } from '@/components/Breadcrumb'
import { BrochureDownload } from '@/components/BrochureDownload'
import { NieuwsDetail } from './NieuwsDetail'
import { notFound } from 'next/navigation'
import type { Media } from '@/payload-types'
import { generateBreadcrumbJsonLd } from '@/lib/structured-data'
import { getServerSideURL } from '@/utilities/getURL'

export async function generateStaticParams() {
  const artikelen = await getNieuws()
  return artikelen.map((a) => ({ slug: a.slug }))
}

const categorieColors: Record<string, string> = {
  bouwupdate: 'bg-[#2a5138]',
  evenement: 'bg-brand-gold',
  project: 'bg-[#734d2e]',
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const [artikel, settings] = await Promise.all([getNieuwsBySlug(slug), getProjectSettings()])
    if (!artikel) return { title: 'Artikel niet gevonden' }
    const naam = settings?.projectnaam || 'Projectnaam'
    return {
      title: `${artikel.titel} | ${naam}`,
      description: artikel.samenvatting,
    }
  } catch {
    return { title: 'Nieuws' }
  }
}

export default async function NieuwsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const artikel = await getNieuwsBySlug(slug)
  if (!artikel) notFound()

  const cat = artikel.categorie as string
  const afbeelding = artikel.afbeelding as Media | null

  const baseUrl = getServerSideURL()
  const breadcrumbItems = [{ label: 'Home', href: '/' }, { label: 'Nieuws', href: '/nieuws' }, { label: artikel.titel }]

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbJsonLd(breadcrumbItems, baseUrl)) }}
      />
      <Breadcrumb items={breadcrumbItems} />
      <NieuwsDetail
        category={cat.charAt(0).toUpperCase() + cat.slice(1)}
        categoryColor={categorieColors[cat] || 'bg-brand-gold'}
        date={new Date(artikel.datum).toLocaleDateString('nl-BE', { day: 'numeric', month: 'long', year: 'numeric' })}
        title={artikel.titel}
        inhoud={artikel.inhoud}
        afbeeldingUrl={afbeelding?.url || undefined}
      />
      <BrochureDownload />
    </main>
  )
}
