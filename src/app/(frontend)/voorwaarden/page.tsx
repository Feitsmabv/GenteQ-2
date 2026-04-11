import type { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'
import { getProjectSettings } from '@/utilities/payload'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getProjectSettings()
    return { title: `Algemene voorwaarden | ${settings?.projectnaam || 'Projectnaam'}` }
  } catch {
    return { title: 'Algemene voorwaarden' }
  }
}

export default async function VoorwaardenPage() {
  let settings = null
  try {
    settings = await getProjectSettings()
  } catch {}

  const naam = settings?.projectnaam || '[Projectnaam]'
  const email = settings?.email || '[email]'
  const telefoon = settings?.telefoon || '[telefoonnummer]'

  return (
    <LegalPage
      label="JURIDISCH"
      title="Algemene voorwaarden"
      lastUpdated="1 januari 2025"
      sections={[
        {
          heading: '1. Toepassingsgebied',
          content: `Deze algemene voorwaarden zijn van toepassing op elk gebruik van de website van ${naam} en op alle overeenkomsten die daaruit voortvloeien.`,
        },
        {
          heading: '2. Intellectuele eigendom',
          content: `Alle content op deze website (teksten, afbeeldingen, renders, logo's) is eigendom van ${naam} of haar licentiegevers en mag niet worden gereproduceerd zonder schriftelijke toestemming.`,
        },
        {
          heading: '3. Aansprakelijkheid',
          content: `De informatie op deze website is indicatief en kan wijzigingen ondergaan. ${naam} kan niet aansprakelijk worden gesteld voor eventuele fouten of onvolledigheden in de gepubliceerde informatie.`,
        },
        {
          heading: '4. Prijzen en beschikbaarheid',
          content: 'Alle vermelde prijzen zijn indicatief en onder voorbehoud van wijzigingen. De beschikbaarheid van woningen kan veranderen zonder voorafgaande kennisgeving.',
        },
        {
          heading: '5. Toepasselijk recht',
          content: 'Op deze voorwaarden is het Belgisch recht van toepassing. Eventuele geschillen worden voorgelegd aan de bevoegde rechtbanken.',
        },
        {
          heading: '6. Contact',
          content: `Voor vragen over deze voorwaarden kunt u contact opnemen via ${email} of ${telefoon}.`,
        },
      ]}
    />
  )
}
