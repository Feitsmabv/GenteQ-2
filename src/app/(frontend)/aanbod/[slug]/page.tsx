import type { Metadata } from 'next'
import { getWoningen, getWoningBySlug, getProjectSettings } from '@/utilities/payload'
import { Breadcrumb } from '@/components/Breadcrumb'
import { BrochureDownload } from '@/components/BrochureDownload'
import { PropertyDetail } from './PropertyDetail'
import { notFound } from 'next/navigation'
import type { Media } from '@/payload-types'
import { STATUS_MAP } from '@/lib/constants'
import { generatePropertyJsonLd, generateBreadcrumbJsonLd } from '@/lib/structured-data'
import { getServerSideURL } from '@/utilities/getURL'

export async function generateStaticParams() {
  const woningen = await getWoningen()
  return woningen.map((w) => ({ slug: w.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const [woning, settings] = await Promise.all([getWoningBySlug(slug), getProjectSettings()])
    if (!woning) return { title: 'Woning niet gevonden' }
    const naam = settings?.projectnaam || 'Projectnaam'
    return {
      title: `${woning.titel} | ${naam}`,
      description: `${woning.type} met ${woning.slaapkamers} slaapkamers, ${woning.oppervlakte} — ${STATUS_MAP[woning.status] || 'Beschikbaar'}`,
    }
  } catch {
    return { title: 'Woning' }
  }
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let woning = null
  let settings = null
  try {
    ;[woning, settings] = await Promise.all([getWoningBySlug(slug), getProjectSettings()])
  } catch (error) {
    console.error('[PropertyPage] Fout bij ophalen data:', error)
  }

  if (!woning) notFound()

  const kenmerken = (woning.kenmerken as { kenmerk: string }[] | undefined) || []
  const half = Math.ceil(kenmerken.length / 2)
  const hoofdafbeelding = woning.hoofdafbeelding as Media | null
  const galerij = (woning.galerij as { afbeelding: Media | number }[] | undefined) || []
  const galerijImages = galerij
    .map((g) => {
      const img = g.afbeelding as Media | null
      return img?.url ? { url: img.url, alt: img.alt || '' } : null
    })
    .filter((g) => g !== null)

  const baseUrl = getServerSideURL()
  const breadcrumbItems = [{ label: 'Home', href: '/' }, { label: 'Aanbod', href: '/aanbod' }, { label: woning.titel }]

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generatePropertyJsonLd(woning, baseUrl)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbJsonLd(breadcrumbItems, baseUrl)) }}
      />
      <Breadcrumb items={breadcrumbItems} />
      <PropertyDetail
        title={woning.titel}
        address={woning.adres || ''}
        price={`€${woning.prijs?.toLocaleString('nl-BE')}`}
        prijsLabel={woning.prijsLabel || undefined}
        badge={STATUS_MAP[woning.status] || 'Beschikbaar'}
        specs={[
          { value: String(woning.slaapkamers), label: 'Slaapkamers' },
          { value: String(woning.badkamers), label: 'Badkamers' },
          { value: woning.oppervlakte, label: 'Oppervlakte' },
          { value: woning.verdieping || '-', label: 'Verdieping' },
          { value: String(woning.garage ?? 0), label: 'Garage' },
          { value: woning.tuin === 'ja' ? 'Ja' : 'Nee', label: 'Tuin' },
        ]}
        beschrijving={woning.beschrijving}
        features={[
          kenmerken.slice(0, half).map((k) => k.kenmerk),
          kenmerken.slice(half).map((k) => k.kenmerk),
        ]}
        telefoon={settings?.telefoon || undefined}
        email={settings?.email || undefined}
        hoofdafbeeldingUrl={hoofdafbeelding?.url || undefined}
        galerij={galerijImages}
        sidebarTitel={settings?.propertySidebarTitel || undefined}
        sidebarTekst={settings?.propertySidebarTekst || undefined}
      />
      <BrochureDownload
        titel={settings?.brochureTitel || undefined}
        omschrijving={settings?.brochureOmschrijving || undefined}
      />
    </main>
  )
}
