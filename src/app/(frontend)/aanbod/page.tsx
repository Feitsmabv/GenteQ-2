export const revalidate = 60

import type { Metadata } from 'next'
import { getWoningen, getProjectSettings } from '@/utilities/payload'
import { PageHero } from '@/components/PageHero'
import { BrochureDownload } from '@/components/BrochureDownload'
import { ContactSection } from '@/components/ContactSection'
import { AanbodGrid } from './AanbodGrid'
import { generatePropertyListJsonLd } from '@/lib/structured-data'
import { getServerSideURL } from '@/utilities/getURL'
import { getPageHeroBackground } from '@/lib/page-hero'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getProjectSettings()
    const naam = settings?.projectnaam || 'Projectnaam'
    return {
      title: `Woningaanbod | ${naam}`,
      description: 'Ontdek ons volledige aanbod van appartementen, woningen en penthouses.',
    }
  } catch {
    return { title: 'Woningaanbod', description: 'Ontdek ons volledige aanbod.' }
  }
}

export default async function AanbodPage() {
  let woningen = null
  let settings = null
  try {
    ;[woningen, settings] = await Promise.all([getWoningen(), getProjectSettings()])
  } catch (error) {
    console.error('[Aanbod] Fout bij ophalen data:', error)
  }

  const baseUrl = getServerSideURL()

  return (
    <main>
      {woningen && woningen.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generatePropertyListJsonLd(woningen, baseUrl)) }}
        />
      )}
      <PageHero
        label="WONINGAANBOD"
        title="Ontdek ons volledige aanbod"
        subtitle="Van moderne appartementen tot ruime penthouses — vind de woning die bij u past."
        background={getPageHeroBackground(settings, 'aanbod')}
      />
      <AanbodGrid woningen={woningen} />
      <BrochureDownload />
      <ContactSection settings={settings} woningen={woningen} />
    </main>
  )
}
