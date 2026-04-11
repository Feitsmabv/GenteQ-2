'use client'

import Image from 'next/image'
import { useScrollFadeIn } from '@/hooks/useScrollFadeIn'
import { PropertyCard } from '@/components/PropertyCard'
import type { PropertyCardData } from '@/components/PropertyCard'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { Woningen, Media } from '@/payload-types'

function mapWoningToCard(w: Woningen): PropertyCardData {
  const statusMap: Record<string, string> = {
    beschikbaar: 'Beschikbaar',
    nieuw: 'Nieuw',
    'bijna-volzet': 'Bijna volzet',
    verkocht: 'Verkocht',
  }
  const img = w.hoofdafbeelding as Media | null
  return {
    title: w.titel,
    image: img?.url || '',
    badge: statusMap[w.status] || 'Beschikbaar',
    badgeVariant: w.status,
    bedrooms: w.slaapkamers,
    area: w.oppervlakte,
    price: `€${w.prijs?.toLocaleString('nl-BE')}`,
    href: `/aanbod/${w.slug}`,
  }
}

function DefaultIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.33 16.67V8.33L10 3.33L16.67 8.33V16.67H12.5V11.67H7.5V16.67H3.33Z" stroke="#9b6800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

interface AanbodPreviewProps {
  woningen?: Woningen[] | null
  titel?: string
  tekst?: SerializedEditorState | null
  icoonUrl?: string
}

export function AanbodPreview({ woningen, titel, tekst, icoonUrl }: AanbodPreviewProps) {
  const headerRef = useScrollFadeIn<HTMLDivElement>()
  const cardsRef = useScrollFadeIn<HTMLDivElement>({ stagger: 0.15, children: true })

  const cards = woningen ? woningen.slice(0, 3).map(mapWoningToCard) : []

  if (cards.length === 0) return null

  return (
    <section className="bg-white px-5 py-16 md:px-20 md:py-24">
      <div ref={headerRef} className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <h2 className="font-heading text-[32px] text-brand-dark md:text-[42px] lg:w-[35%] lg:shrink-0">
          {titel || 'Ontdek onze woningtypes'}
        </h2>

        <div className="hidden lg:block lg:w-[15%]" />

        <div className="flex flex-col gap-5 lg:w-[50%]">
          <div className="flex size-10 items-center justify-center rounded-[20px] bg-brand-gold-light">
            {icoonUrl ? (
              <Image src={icoonUrl} alt="" width={20} height={20} />
            ) : (
              <DefaultIcon />
            )}
          </div>
          <div className="max-w-[520px] text-[15px] leading-6 text-brand-dark/60">
            {tekst ? (
              <RichText data={tekst} />
            ) : (
              <p>Ontdek ons exclusieve aanbod van topwoningen. Van moderne appartementen in de stad tot ruime gezinswoningen, wij bieden voor elke levensstijl en elk budget het perfecte thuis.</p>
            )}
          </div>
        </div>
      </div>

      <div ref={cardsRef} className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3 md:mt-24">
        {cards.map((card) => (
          <PropertyCard key={card.href} card={card} />
        ))}
      </div>
    </section>
  )
}
