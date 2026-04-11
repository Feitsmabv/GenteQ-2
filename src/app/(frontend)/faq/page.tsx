export const revalidate = 60

import type { Metadata } from 'next'
import { getFaq, getProjectSettings, getWoningen } from '@/utilities/payload'
import { PageHero } from '@/components/PageHero'
import { BrochureDownload } from '@/components/BrochureDownload'
import { ContactSection } from '@/components/ContactSection'
import { FaqFull } from './FaqFull'
import { getPageHeroBackground } from '@/lib/page-hero'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getProjectSettings()
    const naam = settings?.projectnaam || 'Projectnaam'
    return {
      title: `Veelgestelde vragen | ${naam}`,
      description: 'Antwoorden op de meest gestelde vragen over het project, de woningen en het aankoopproces.',
    }
  } catch {
    return { title: 'Veelgestelde vragen' }
  }
}

export default async function FaqPage() {
  let faq = null
  let settings = null
  let woningen = null
  try {
    ;[faq, settings, woningen] = await Promise.all([getFaq(), getProjectSettings(), getWoningen()])
  } catch (error) {
    console.error('[FAQ] Fout bij ophalen data:', error)
  }

  return (
    <main>
      <PageHero
        label="VEELGESTELDE VRAGEN"
        title="Heeft u vragen?"
        subtitle="Hier vindt u antwoorden op de meest gestelde vragen over het project, de woningen en het aankoopproces."
        background={getPageHeroBackground(settings, 'faq')}
      />
      <FaqFull items={faq} />
      <BrochureDownload
        titel={settings?.brochureTitel || undefined}
        omschrijving={settings?.brochureOmschrijving || undefined}
      />
      <ContactSection settings={settings} woningen={woningen} />
    </main>
  )
}
