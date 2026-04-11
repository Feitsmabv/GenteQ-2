import type { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'
import { getProjectSettings } from '@/utilities/payload'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getProjectSettings()
    return { title: `Cookiebeleid | ${settings?.projectnaam || 'Projectnaam'}` }
  } catch {
    return { title: 'Cookiebeleid' }
  }
}

export default async function CookiesPage() {
  let settings = null
  try {
    settings = await getProjectSettings()
  } catch {}

  const email = settings?.email || '[email]'

  return (
    <LegalPage
      label="JURIDISCH"
      title="Cookiebeleid"
      lastUpdated="1 januari 2025"
      sections={[
        {
          heading: '1. Wat zijn cookies?',
          content: 'Cookies zijn kleine tekstbestanden die door uw browser worden opgeslagen wanneer u een website bezoekt. Ze helpen de website om u te herkennen bij een volgend bezoek en om uw voorkeuren te onthouden.',
        },
        {
          heading: '2. Welke cookies gebruiken wij?',
          content: 'Wij gebruiken functionele cookies die noodzakelijk zijn voor de werking van de website (zoals uw cookievoorkeuren). Optioneel gebruiken wij analytische cookies om het websitegebruik te meten en te verbeteren.',
        },
        {
          heading: '3. Functionele cookies',
          content: 'Deze cookies zijn noodzakelijk voor de basisfunctionaliteit van de website. Ze onthouden bijvoorbeeld uw cookiekeuze. Deze cookies worden niet gebruikt voor marketingdoeleinden.',
        },
        {
          heading: '4. Analytische cookies',
          content: 'Met uw toestemming gebruiken wij analytische cookies om inzicht te krijgen in het gebruik van onze website. Deze gegevens worden geanonimiseerd verwerkt.',
        },
        {
          heading: '5. Cookies beheren',
          content: 'U kunt uw cookievoorkeuren op elk moment aanpassen via de cookie-instellingen onderaan de website, of door de cookies in uw browser te verwijderen.',
        },
        {
          heading: '6. Contact',
          content: `Voor vragen over ons cookiebeleid kunt u contact opnemen via ${email}.`,
        },
      ]}
    />
  )
}
