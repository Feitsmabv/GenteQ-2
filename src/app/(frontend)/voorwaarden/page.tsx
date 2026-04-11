import type { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'

export const metadata: Metadata = {
  title: 'Algemene voorwaarden | GenteQ',
}

export default function VoorwaardenPage() {
  return (
    <LegalPage
      label="JURIDISCH"
      title="Algemene voorwaarden"
      lastUpdated="1 januari 2026"
      sections={[
        {
          heading: '1. Toepassingsgebied',
          content:
            'Deze algemene voorwaarden zijn van toepassing op elk gebruik van de website van GenteQ en op alle overeenkomsten die daaruit voortvloeien.',
        },
        {
          heading: '2. Intellectuele eigendom',
          content:
            "Alle content op deze website (teksten, afbeeldingen, logo's) is eigendom van GenteQ of haar licentiegevers en mag niet worden gereproduceerd zonder schriftelijke toestemming.",
        },
        {
          heading: '3. Aansprakelijkheid',
          content:
            'De informatie op deze website is indicatief en kan wijzigingen ondergaan. GenteQ kan niet aansprakelijk worden gesteld voor eventuele fouten of onvolledigheden in de gepubliceerde informatie.',
        },
        {
          heading: '4. Toepasselijk recht',
          content:
            'Op deze voorwaarden is het Belgisch recht van toepassing. Eventuele geschillen worden voorgelegd aan de bevoegde rechtbanken.',
        },
        {
          heading: '5. Contact',
          content: 'Voor vragen over deze voorwaarden kunt u contact opnemen via [email].',
        },
      ]}
    />
  )
}
