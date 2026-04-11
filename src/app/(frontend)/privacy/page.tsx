import type { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'
import { getProjectSettings } from '@/utilities/payload'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getProjectSettings()
    return { title: `Privacybeleid | ${settings?.projectnaam || 'Projectnaam'}` }
  } catch {
    return { title: 'Privacybeleid' }
  }
}

export default async function PrivacyPage() {
  let settings = null
  try {
    settings = await getProjectSettings()
  } catch {}

  const naam = settings?.projectnaam || '[Projectnaam]'
  const adres = settings?.adres || '[Adres]'
  const email = settings?.email || '[email]'
  const telefoon = settings?.telefoon || '[telefoonnummer]'

  return (
    <LegalPage
      label="JURIDISCH"
      title="Privacybeleid"
      lastUpdated="1 januari 2025"
      sections={[
        {
          heading: '1. Wie zijn wij?',
          content: `${naam}, gevestigd te ${adres}, is verantwoordelijk voor de verwerking van persoonsgegevens zoals beschreven in dit privacybeleid.`,
        },
        {
          heading: '2. Welke gegevens verzamelen wij?',
          content: 'Wij verzamelen gegevens die u ons vrijwillig verstrekt via het contactformulier op onze website: naam, e-mailadres, telefoonnummer en uw bericht. Daarnaast verzamelen wij automatisch geanonimiseerde gegevens over uw websitebezoek via cookies.',
        },
        {
          heading: '3. Waarvoor gebruiken wij uw gegevens?',
          content: 'Uw persoonsgegevens worden uitsluitend gebruikt om uw verzoek te beantwoorden, u te informeren over het project en om onze website te verbeteren. Wij delen uw gegevens niet met derden zonder uw toestemming.',
        },
        {
          heading: '4. Bewaartermijn',
          content: 'Wij bewaren uw persoonsgegevens niet langer dan noodzakelijk voor het doel waarvoor ze zijn verzameld, met een maximum van 2 jaar na uw laatste contact.',
        },
        {
          heading: '5. Uw rechten',
          content: `U heeft het recht om uw persoonsgegevens in te zien, te corrigeren of te verwijderen. Neem hiervoor contact op via ${email}.`,
        },
        {
          heading: '6. Contact',
          content: `Voor vragen over dit privacybeleid kunt u contact opnemen via ${email} of ${telefoon}.`,
        },
      ]}
    />
  )
}
