export const revalidate = 60 // Herlaad data elke 60 seconden

import type { Metadata } from 'next'
import type { Woningen, Nieuw, Faq, ProjectSetting, Media } from '@/payload-types'
import { getProjectSettings, getWoningen, getNieuws, getFaq } from '@/utilities/payload'
import { Hero } from '@/components/Hero'
import { IntroSection } from '@/components/IntroSection'
import { AanbodPreview } from '@/components/AanbodPreview'
import { LocatieSection } from '@/components/LocatieSection'
import { FaqSection } from '@/components/FaqSection'
import { BrochureDownload } from '@/components/BrochureDownload'
import { NieuwsSection } from '@/components/NieuwsSection'
import { ContactSection } from '@/components/ContactSection'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getProjectSettings()
    const naam = settings?.projectnaam || 'Projectnaam'
    const subtitel = settings?.heroSubtitel || 'Woningen met karakter, gebouwd voor nu en de volgende generaties.'
    return {
      title: `${naam} | ${settings?.heroTitel || 'Vind uw droomwoning'}`,
      description: subtitel,
    }
  } catch {
    return {
      title: 'Vind uw droomwoning',
      description: 'Ontdek ons exclusieve vastgoedproject.',
    }
  }
}

export default async function Home() {
  let settings: ProjectSetting | null = null
  let woningen: Woningen[] | null = null
  let nieuws: Nieuw[] | null = null
  let faq: Faq[] | null = null

  try {
    ;[settings, woningen, nieuws, faq] = await Promise.all([
      getProjectSettings(),
      getWoningen(),
      getNieuws(),
      getFaq(),
    ])
  } catch (error) {
    console.error('[Home] Fout bij ophalen data:', error)
  }

  return (
    <main id="main-content">
      <Hero
        titel={settings?.heroTitel || undefined}
        subtitel={settings?.heroSubtitel || undefined}
        mediaType={(settings?.heroMediaType as 'geen' | 'afbeelding' | 'video') || 'geen'}
        afbeeldingUrl={(settings?.heroAfbeelding as Media)?.url || undefined}
        videoUrl={(settings?.heroVideo as Media)?.url || undefined}
      />
      <IntroSection
        titel={settings?.introTitel || undefined}
        tekst={settings?.introTekst || undefined}
        afbeeldingUrl={(settings?.introAfbeelding as Media)?.url || undefined}
      />
      <AanbodPreview
        woningen={woningen}
        titel={settings?.aanbodTitel || undefined}
        tekst={settings?.aanbodTekst || undefined}
        icoonUrl={(settings?.aanbodIcoon as Media)?.url || undefined}
      />
      <LocatieSection settings={settings} />
      <FaqSection items={faq} />
      <NieuwsSection artikelen={nieuws} />
      <BrochureDownload
        titel={settings?.brochureTitel || undefined}
        omschrijving={settings?.brochureOmschrijving || undefined}
      />
      <ContactSection settings={settings} woningen={woningen} />
    </main>
  )
}
