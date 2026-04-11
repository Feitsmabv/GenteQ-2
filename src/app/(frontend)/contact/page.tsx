export const revalidate = 60

import type { Metadata } from 'next'
import { getProjectSettings, getWoningen } from '@/utilities/payload'
import { PageHero } from '@/components/PageHero'
import { ContactSection } from '@/components/ContactSection'
import { BrochureDownload } from '@/components/BrochureDownload'
import { getPageHeroBackground } from '@/lib/page-hero'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getProjectSettings()
    const naam = settings?.projectnaam || 'Projectnaam'
    return {
      title: `Contact | ${naam}`,
      description: 'Neem contact op voor vragen over het project of om een afspraak te maken.',
    }
  } catch {
    return { title: 'Contact' }
  }
}

export default async function ContactPage() {
  let settings = null
  let woningen = null
  try {
    ;[settings, woningen] = await Promise.all([getProjectSettings(), getWoningen()])
  } catch (error) {
    console.error('[Contact] Fout bij ophalen data:', error)
  }

  return (
    <main>
      <PageHero
        label="CONTACT"
        title="Neem contact op"
        subtitle="Heeft u vragen over het project of wilt u een afspraak maken? Wij staan voor u klaar."
        background={getPageHeroBackground(settings, 'contact')}
      />
      <ContactSection settings={settings} woningen={woningen} />
      <BrochureDownload
        titel={settings?.brochureTitel || undefined}
        omschrijving={settings?.brochureOmschrijving || undefined}
      />
    </main>
  )
}
