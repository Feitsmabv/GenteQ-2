import type { Locale } from '@/i18n/config'

export type LegalContent = {
  metaTitle: string
  title: string
  lastUpdated: string
  sections: { heading: string; content: string }[]
}

type LegalKey = 'privacy' | 'terms' | 'cookies'

const lastUpdatedNl = '1 januari 2026'
const lastUpdatedEn = 'January 1, 2026'

export const legalContent: Record<LegalKey, Record<Locale, LegalContent>> = {
  privacy: {
    nl: {
      metaTitle: 'Privacybeleid | GenteQ',
      title: 'Privacybeleid',
      lastUpdated: lastUpdatedNl,
      sections: [
        {
          heading: '1. Wie zijn wij?',
          content:
            'GenteQ is verantwoordelijk voor de verwerking van persoonsgegevens zoals beschreven in dit privacybeleid.',
        },
        {
          heading: '2. Welke gegevens verzamelen wij?',
          content:
            'Wij verzamelen gegevens die u ons vrijwillig verstrekt via formulieren op onze website: naam, e-mailadres, telefoonnummer en uw bericht. Daarnaast verzamelen wij automatisch geanonimiseerde gegevens over uw websitebezoek via cookies.',
        },
        {
          heading: '3. Waarvoor gebruiken wij uw gegevens?',
          content:
            'Uw persoonsgegevens worden uitsluitend gebruikt om uw verzoek te beantwoorden en om onze website te verbeteren. Wij delen uw gegevens niet met derden zonder uw toestemming.',
        },
        {
          heading: '4. Bewaartermijn',
          content:
            'Wij bewaren uw persoonsgegevens niet langer dan noodzakelijk voor het doel waarvoor ze zijn verzameld, met een maximum van 2 jaar na uw laatste contact.',
        },
        {
          heading: '5. Uw rechten',
          content:
            'U heeft het recht om uw persoonsgegevens in te zien, te corrigeren of te verwijderen. Neem hiervoor contact op via [email].',
        },
        {
          heading: '6. Contact',
          content: 'Voor vragen over dit privacybeleid kunt u contact opnemen via [email].',
        },
      ],
    },
    en: {
      metaTitle: 'Privacy Policy | GenteQ',
      title: 'Privacy Policy',
      lastUpdated: lastUpdatedEn,
      sections: [
        {
          heading: '1. Who are we?',
          content:
            'GenteQ is responsible for the processing of personal data as described in this privacy policy.',
        },
        {
          heading: '2. What data do we collect?',
          content:
            'We collect data you voluntarily provide via forms on our website: name, email address, phone number and your message. We also automatically collect anonymised data about your visit via cookies.',
        },
        {
          heading: '3. How do we use your data?',
          content:
            'Your personal data is used solely to respond to your request and to improve our website. We do not share your data with third parties without your consent.',
        },
        {
          heading: '4. Retention period',
          content:
            'We do not retain your personal data longer than necessary for the purpose for which it was collected, with a maximum of 2 years after your last contact.',
        },
        {
          heading: '5. Your rights',
          content:
            'You have the right to access, correct or delete your personal data. To do so, please contact us at [email].',
        },
        {
          heading: '6. Contact',
          content: 'For questions about this privacy policy, please contact us at [email].',
        },
      ],
    },
  },
  terms: {
    nl: {
      metaTitle: 'Algemene voorwaarden | GenteQ',
      title: 'Algemene voorwaarden',
      lastUpdated: lastUpdatedNl,
      sections: [
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
      ],
    },
    en: {
      metaTitle: 'Terms & Conditions | GenteQ',
      title: 'Terms & Conditions',
      lastUpdated: lastUpdatedEn,
      sections: [
        {
          heading: '1. Scope',
          content:
            'These terms and conditions apply to any use of the GenteQ website and to all agreements arising from it.',
        },
        {
          heading: '2. Intellectual property',
          content:
            'All content on this website (texts, images, logos) is the property of GenteQ or its licensors and may not be reproduced without written permission.',
        },
        {
          heading: '3. Liability',
          content:
            'The information on this website is indicative and subject to change. GenteQ cannot be held liable for any errors or omissions in the published information.',
        },
        {
          heading: '4. Applicable law',
          content:
            'Belgian law applies to these terms. Any disputes will be submitted to the competent courts.',
        },
        {
          heading: '5. Contact',
          content: 'For questions about these terms, please contact us at [email].',
        },
      ],
    },
  },
  cookies: {
    nl: {
      metaTitle: 'Cookiebeleid | GenteQ',
      title: 'Cookiebeleid',
      lastUpdated: lastUpdatedNl,
      sections: [
        {
          heading: '1. Wat zijn cookies?',
          content:
            'Cookies zijn kleine tekstbestanden die door uw browser worden opgeslagen wanneer u een website bezoekt. Ze helpen de website om u te herkennen bij een volgend bezoek en om uw voorkeuren te onthouden.',
        },
        {
          heading: '2. Welke cookies gebruiken wij?',
          content:
            'Wij gebruiken functionele cookies die noodzakelijk zijn voor de werking van de website (zoals uw cookievoorkeuren). Optioneel gebruiken wij analytische cookies om het websitegebruik te meten en te verbeteren.',
        },
        {
          heading: '3. Functionele cookies',
          content:
            'Deze cookies zijn noodzakelijk voor de basisfunctionaliteit van de website. Ze onthouden bijvoorbeeld uw cookiekeuze. Deze cookies worden niet gebruikt voor marketingdoeleinden.',
        },
        {
          heading: '4. Analytische cookies',
          content:
            'Met uw toestemming gebruiken wij analytische cookies om inzicht te krijgen in het gebruik van onze website. Deze gegevens worden geanonimiseerd verwerkt.',
        },
        {
          heading: '5. Cookies beheren',
          content:
            'U kunt uw cookievoorkeuren op elk moment aanpassen via de cookie-instellingen onderaan de website, of door de cookies in uw browser te verwijderen.',
        },
        {
          heading: '6. Contact',
          content: 'Voor vragen over ons cookiebeleid kunt u contact opnemen via [email].',
        },
      ],
    },
    en: {
      metaTitle: 'Cookie Policy | GenteQ',
      title: 'Cookie Policy',
      lastUpdated: lastUpdatedEn,
      sections: [
        {
          heading: '1. What are cookies?',
          content:
            'Cookies are small text files stored by your browser when you visit a website. They help the website recognise you on a return visit and remember your preferences.',
        },
        {
          heading: '2. Which cookies do we use?',
          content:
            'We use functional cookies necessary for the website to work (such as your cookie preferences). With your consent, we also use analytical cookies to measure and improve website usage.',
        },
        {
          heading: '3. Functional cookies',
          content:
            'These cookies are necessary for the basic functionality of the website. They remember, for example, your cookie choice. They are not used for marketing purposes.',
        },
        {
          heading: '4. Analytical cookies',
          content:
            'With your consent, we use analytical cookies to gain insight into how our website is used. This data is processed anonymously.',
        },
        {
          heading: '5. Managing cookies',
          content:
            'You can change your cookie preferences at any time via the cookie settings at the bottom of the website, or by deleting cookies in your browser.',
        },
        {
          heading: '6. Contact',
          content: 'For questions about our cookie policy, please contact us at [email].',
        },
      ],
    },
  },
}
