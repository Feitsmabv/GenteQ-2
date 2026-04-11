'use client'

import { useState } from 'react'
import { PropertyFilter } from '@/components/PropertyFilter'
import { PropertyCard } from '@/components/PropertyCard'
import { useScrollFadeIn } from '@/hooks/useScrollFadeIn'
import type { PropertyCardData } from '@/components/PropertyCard'
import type { Woningen, Media } from '@/payload-types'

import { STATUS_MAP } from '@/lib/constants'

function mapWoning(w: Woningen): PropertyCardData {
  const img = w.hoofdafbeelding as Media | null
  return {
    title: w.titel,
    image: img?.url || '',
    badge: STATUS_MAP[w.status] || 'Beschikbaar',
    badgeVariant: w.status,
    bedrooms: w.slaapkamers,
    area: w.oppervlakte,
    price: `€${w.prijs?.toLocaleString('nl-BE')}`,
    priceNum: w.prijs,
    type: w.type,
    href: `/aanbod/${w.slug}`,
  }
}

interface AanbodGridProps {
  woningen?: Woningen[] | null
}

interface FilterState {
  woningtype: string
  slaapkamers: string
  prijsTot: string
  status: string
}

export function AanbodGrid({ woningen }: AanbodGridProps) {
  const gridRef = useScrollFadeIn<HTMLDivElement>({ stagger: 0.1, children: true })

  const allCards = woningen ? woningen.map(mapWoning) : []

  const [filters, setFilters] = useState<FilterState>({
    woningtype: '',
    slaapkamers: '',
    prijsTot: '',
    status: '',
  })

  const filtered = allCards.filter((card) => {
    if (filters.woningtype && card.type !== filters.woningtype) return false
    if (filters.slaapkamers) {
      const min = parseInt(filters.slaapkamers)
      if (min === 4) {
        if ((card.bedrooms || 0) < 4) return false
      } else {
        if (card.bedrooms !== min) return false
      }
    }
    if (filters.prijsTot) {
      const max = parseInt(filters.prijsTot)
      if ((card.priceNum || 0) > max) return false
    }
    if (filters.status && card.badgeVariant !== filters.status) return false
    return true
  })

  return (
    <>
      <PropertyFilter onFilter={setFilters} />
      <section className="bg-white px-5 py-16 md:px-20 md:py-24">
        <p className="mb-8 text-sm text-brand-muted">
          <span className="font-semibold text-brand-dark">{filtered.length}</span> woningen gevonden
        </p>
        {filtered.length > 0 ? (
          <div ref={gridRef} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((card) => (
              <PropertyCard key={card.href} card={card} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-lg font-semibold text-brand-dark">Geen woningen gevonden</p>
            <p className="text-sm text-brand-muted">Pas uw filters aan om meer resultaten te zien.</p>
          </div>
        )}
      </section>
    </>
  )
}
