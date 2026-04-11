'use client'

import { useState } from 'react'
import { usePageFadeIn } from '@/hooks/useScrollFadeIn'

const sections = [
  {
    id: 'inloggen',
    title: 'Inloggen',
    content: [
      { type: 'steps', items: [
        'Ga naar **uwdomein.be/admin**',
        'Log in met uw e-mailadres en wachtwoord',
        'U ziet het dashboard met alle beschikbare secties',
      ]},
    ],
  },
  {
    id: 'woningen',
    title: 'Woningen beheren',
    content: [
      { type: 'subtitle', text: 'Een nieuwe woning toevoegen' },
      { type: 'steps', items: [
        'Klik op **Woningen** in het menu',
        'Klik op de **+** knop',
      ]},
      { type: 'subtitle', text: 'Tabblad: Algemeen' },
      { type: 'table', rows: [
        ['Titel', 'Naam van de woning (bv. "Appartement A1")'],
        ['Slug', 'URL-naam zonder spaties (bv. "appartement-a1")'],
        ['Woningtype', 'Kies: Appartement, Woning of Penthouse'],
        ['Status', 'Kies: Beschikbaar, Nieuw, Bijna volzet of Verkocht'],
        ['Adres', 'Het adres van de woning'],
        ['Prijs', 'Bedrag zonder euroteken of punten (bv. 245000)'],
        ['Prijslabel', 'Tekst boven de prijs (standaard "Vanaf")'],
      ]},
      { type: 'subtitle', text: 'Tabblad: Specificaties' },
      { type: 'paragraph', text: 'Vul het aantal slaapkamers, badkamers, oppervlakte, verdieping, garage(s) en tuin in.' },
      { type: 'paragraph', text: 'Bij **Kenmerken & afwerking** kunt u items toevoegen zoals "Vloerverwarming", "Driedubbel glas", "Zonnepanelen", etc.' },
      { type: 'subtitle', text: 'Tabblad: Beschrijving' },
      { type: 'paragraph', text: 'Schrijf een uitgebreide beschrijving. U kunt tekst vet of cursief maken en links toevoegen.' },
      { type: 'subtitle', text: 'Tabblad: Afbeeldingen' },
      { type: 'table', rows: [
        ['Hoofdafbeelding', 'De foto die als eerste getoond wordt en op de kaart verschijnt'],
        ['Galerij', 'Extra foto\'s die in de fotogalerij verschijnen'],
      ]},
      { type: 'subtitle', text: 'Status wijzigen' },
      { type: 'paragraph', text: 'Wanneer een woning verkocht is: open de woning, wijzig Status naar "Verkocht" en sla op. De woning verschijnt dan met een "Verkocht" label.' },
    ],
  },
  {
    id: 'nieuws',
    title: 'Nieuws publiceren',
    content: [
      { type: 'subtitle', text: 'Een nieuw artikel schrijven' },
      { type: 'steps', items: [
        'Klik op **Nieuws** in het menu',
        'Klik op de **+** knop',
      ]},
      { type: 'table', rows: [
        ['Titel', 'De titel van het artikel'],
        ['Slug', 'URL-naam (bv. "bouwstart-fase-2")'],
        ['Categorie', 'Kies: Bouwupdate, Evenement of Project'],
        ['Publicatiedatum', 'De datum die op de website getoond wordt'],
        ['Samenvatting', 'Korte tekst (2-3 zinnen) voor de overzichtspagina'],
        ['Afbeelding', 'Een afbeelding bij het artikel (optioneel)'],
        ['Inhoud', 'Het volledige artikel met opmaak'],
      ]},
      { type: 'subtitle', text: 'Tips' },
      { type: 'list', items: [
        'Houd de samenvatting kort en wervend (max 2 zinnen)',
        'Gebruik een aantrekkelijke foto',
        'Publiceer regelmatig om bezoekers betrokken te houden',
      ]},
    ],
  },
  {
    id: 'faq',
    title: 'Veelgestelde vragen beheren',
    content: [
      { type: 'steps', items: [
        'Klik op **Veelgestelde vragen** in het menu',
        'Klik op de **+** knop',
      ]},
      { type: 'table', rows: [
        ['Vraag', 'De vraag zoals bezoekers die zouden stellen'],
        ['Antwoord', 'Het antwoord op de vraag'],
        ['Categorie', 'Over het project, Woningen & afwerking, of Praktisch & financieel'],
        ['Volgorde', 'Lager nummer = hoger op de pagina (0 = bovenaan)'],
      ]},
    ],
  },
  {
    id: 'instellingen',
    title: 'Projectinstellingen',
    content: [
      { type: 'paragraph', text: 'Klik op **Projectinstellingen** in het menu om de algemene informatie aan te passen.' },
      { type: 'subtitle', text: 'Algemeen' },
      { type: 'table', rows: [
        ['Projectnaam', 'Verschijnt in de navigatie en footer'],
        ['Logo', 'Upload het logo van het project'],
        ['Hero titel', 'De grote titel op de homepage'],
        ['Hero subtitel', 'De tekst onder de titel'],
      ]},
      { type: 'subtitle', text: 'Contact' },
      { type: 'table', rows: [
        ['Telefoonnummer', 'Verschijnt op de contactpagina en in de footer'],
        ['E-mailadres', 'Verschijnt op de contactpagina en in de footer'],
        ['Adres', 'Het adres van het verkoopkantoor'],
        ['Kantooruren', 'De openingsuren'],
      ]},
      { type: 'subtitle', text: 'Brochure' },
      { type: 'table', rows: [
        ['Brochure PDF', 'Upload de projectbrochure (max 10 MB)'],
        ['Brochure titel', 'De titel boven het download-formulier'],
        ['Brochure omschrijving', 'De tekst onder de titel'],
      ]},
      { type: 'subtitle', text: 'Locatie' },
      { type: 'paragraph', text: 'Pas de locatie-titel en omschrijving aan, en voeg afstanden toe (bv. "Stadscentrum" — "5 min").' },
      { type: 'subtitle', text: 'Partners' },
      { type: 'paragraph', text: 'Voeg partners toe met hun naam en optioneel een website-URL.' },
    ],
  },
  {
    id: 'media',
    title: "Foto's en bestanden",
    content: [
      { type: 'steps', items: [
        'Klik op **Media** in het menu',
        'Klik op de **+** knop',
        'Sleep een bestand of klik om te bladeren',
        'Vul de **Alt tekst** in (beschrijving van de afbeelding)',
        'Klik op **Opslaan**',
      ]},
      { type: 'subtitle', text: 'Aanbevolen formaten' },
      { type: 'table', rows: [
        ['Woning foto\'s', 'JPG of WebP — 1920 x 1280 px'],
        ['Nieuws afbeeldingen', 'JPG of WebP — 1200 x 800 px'],
        ['Logo', 'SVG of PNG — transparante achtergrond'],
        ['Brochure', 'PDF — max 10 MB'],
      ]},
      { type: 'subtitle', text: 'Tips' },
      { type: 'list', items: [
        'Gebruik altijd horizontale foto\'s (liggend formaat)',
        'Comprimeer grote foto\'s voordat u ze uploadt',
        'Geef elke foto een beschrijvende alt-tekst',
      ]},
    ],
  },
  {
    id: 'hulp',
    title: 'Veelvoorkomende vragen',
    content: [
      { type: 'faq', items: [
        { q: 'Ik zie mijn wijzigingen niet op de website', a: 'De website cachet pagina\'s voor snelheid. Wijzigingen kunnen tot 60 seconden duren. Probeer een hard refresh (Cmd+Shift+R).' },
        { q: 'Ik ben mijn wachtwoord vergeten', a: 'Neem contact op met uw websitebeheerder om uw wachtwoord te resetten.' },
        { q: 'Kan ik de indeling van de website aanpassen?', a: 'Het design staat vast en kan niet via het beheerpaneel worden aangepast. Neem contact op met uw websitebeheerder.' },
        { q: 'Hoe verwijder ik een woning of artikel?', a: 'Open het item en klik op de rode Verwijderen knop onderaan de pagina.' },
        { q: 'Kan ik meerdere gebruikers aanmaken?', a: 'Ja, ga naar Users in het menu en maak een nieuw account aan.' },
      ]},
    ],
  },
]

function renderBold(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold text-brand-dark">{part}</strong> : part
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ContentBlock({ block }: { block: any }) {
  switch (block.type) {
    case 'paragraph':
      return <p className="text-[15px] leading-7 text-brand-dark/65">{renderBold(block.text)}</p>
    case 'subtitle':
      return <h3 className="mt-8 text-lg font-semibold text-brand-dark">{block.text}</h3>
    case 'steps':
      return (
        <ol className="flex flex-col gap-3">
          {block.items.map((item: string, i: number) => (
            <li key={i} className="flex gap-3 text-[15px] leading-7 text-brand-dark/65">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-gold text-xs font-semibold text-white">
                {i + 1}
              </span>
              <span>{renderBold(item)}</span>
            </li>
          ))}
        </ol>
      )
    case 'list':
      return (
        <ul className="flex flex-col gap-2">
          {block.items.map((item: string, i: number) => (
            <li key={i} className="flex gap-3 text-[15px] leading-7 text-brand-dark/65">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-gold" />
              <span>{renderBold(item)}</span>
            </li>
          ))}
        </ul>
      )
    case 'table':
      return (
        <div className="overflow-hidden rounded-xl border border-brand-dark/10">
          {block.rows.map((row: string[], i: number) => (
            <div
              key={i}
              className={`flex gap-4 px-5 py-3.5 text-[14px] ${i % 2 === 0 ? 'bg-[#f7f5f2]' : 'bg-white'}`}
            >
              <span className="w-[110px] shrink-0 font-medium text-brand-dark md:w-[180px]">{row[0]}</span>
              <span className="text-brand-dark/65">{row[1]}</span>
            </div>
          ))}
        </div>
      )
    case 'faq':
      return (
        <div className="flex flex-col gap-4">
          {block.items.map((item: { q: string; a: string }, i: number) => (
            <div key={i} className="rounded-xl bg-[#f7f5f2] p-5">
              <p className="text-[15px] font-semibold text-brand-dark">{item.q}</p>
              <p className="mt-2 text-[14px] leading-6 text-brand-dark/65">{item.a}</p>
            </div>
          ))}
        </div>
      )
    default:
      return null
  }
}

export function HandleidingContent() {
  const [activeSection, setActiveSection] = useState('inloggen')
  const headerRef = usePageFadeIn<HTMLDivElement>({ delay: 0.1 })

  const current = sections.find((s) => s.id === activeSection) || sections[0]

  return (
    <div className="bg-white px-5 pb-16 pt-32 md:px-20 md:pb-24">
      <div ref={headerRef} className="mx-auto max-w-5xl">
        <span className="text-xs font-medium tracking-[2.4px] text-brand-gold">HANDLEIDING</span>
        <h1 className="mt-4 font-heading text-[32px] text-brand-dark md:text-[40px]">
          Website beheren
        </h1>
        <p className="mt-2 text-base text-brand-muted">
          Leer hoe u de content van uw projectwebsite kunt aanpassen.
        </p>

        <div className="mt-12 flex flex-col gap-8 lg:flex-row lg:gap-16">
          {/* Sidebar nav */}
          <nav className="flex flex-row gap-2 overflow-x-auto pb-2 lg:w-[220px] lg:shrink-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-left text-[14px] transition-colors ${
                  activeSection === section.id
                    ? 'bg-brand-gold/10 font-medium text-brand-gold'
                    : 'text-brand-dark/60 hover:bg-brand-light hover:text-brand-dark'
                }`}
              >
                {section.title}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="flex flex-1 flex-col gap-5">
            <h2 className="font-heading text-[28px] text-brand-dark">{current.title}</h2>
            {current.content.map((block, i) => (
              <ContentBlock key={i} block={block} />
            ))}

            {/* Footer */}
            <div className="mt-8 rounded-xl bg-brand-brown p-8">
              <p className="text-lg font-semibold text-white">Hulp nodig?</p>
              <p className="mt-2 text-sm text-white/65">
                Neem contact op met uw websitebeheerder voor verdere hulp.
              </p>
              <div className="mt-4 flex flex-col gap-1 text-sm">
                <span className="font-medium text-white">Feitsma Digital</span>
                <span className="text-white/65">info@feitsma.be</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
