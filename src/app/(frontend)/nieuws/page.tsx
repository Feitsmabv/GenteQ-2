export const revalidate = 60

import type { Metadata } from 'next'
import { getNieuws, getProjectSettings } from '@/utilities/payload'
import { PageHero } from '@/components/PageHero'
import { BrochureDownload } from '@/components/BrochureDownload'
import { NieuwsOverview } from './NieuwsOverview'
import { getPageHeroBackground } from '@/lib/page-hero'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getProjectSettings()
    const naam = settings?.projectnaam || 'Projectnaam'
    return {
      title: `Nieuws & Updates | ${naam}`,
      description: 'Volg de voortgang van het project, ontdek evenementen en lees het laatste nieuws.',
    }
  } catch {
    return { title: 'Nieuws & Updates' }
  }
}

export default async function NieuwsPage() {
  let nieuws = null
  let settings = null
  try {
    ;[nieuws, settings] = await Promise.all([getNieuws(), getProjectSettings()])
  } catch (error) {
    console.error('[Nieuws] Fout bij ophalen data:', error)
  }

  return (
    <main>
      <PageHero
        label="NIEUWS & UPDATES"
        title="Blijf op de hoogte"
        subtitle="Volg de voortgang van het project, ontdek evenementen en lees het laatste nieuws."
        background={getPageHeroBackground(settings, 'nieuws')}
      />
      <NieuwsOverview artikelen={nieuws} />
      <BrochureDownload />
    </main>
  )
}
