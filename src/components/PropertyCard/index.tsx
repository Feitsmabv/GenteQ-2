import Image from 'next/image'
import Link from 'next/link'

export type BadgeVariant = 'beschikbaar' | 'nieuw' | 'bijna-volzet' | 'verkocht'

export interface PropertyCardData {
  title: string
  image: string
  badge: string
  badgeVariant: BadgeVariant
  bedrooms?: number
  area?: string
  price?: string
  priceNum?: number
  type?: string
  href: string
}

import { STATUS_COLORS } from '@/lib/constants'

const badgeColors: Record<BadgeVariant, string> = STATUS_COLORS as Record<BadgeVariant, string>

export function PropertyCard({ card }: { card: PropertyCardData }) {
  return (
    <Link href={card.href} className="group relative block h-[340px] overflow-hidden rounded-2xl shadow-[0px_6px_24px_-4px_rgba(0,0,0,0.08)] md:h-[400px] lg:h-[460px]">
      <Image
        src={card.image}
        alt={card.title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Status Badge */}
      <div className={`absolute left-4 top-4 rounded-full px-3.5 py-1.5 ${badgeColors[card.badgeVariant]}`}>
        <span className="text-xs font-semibold text-white">{card.badge}</span>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 flex translate-y-[30%] flex-col justify-end bg-gradient-to-b from-transparent to-black p-6 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
        <h3 className="font-heading text-[22px] text-white">{card.title}</h3>

        <div className="mt-4 flex items-center gap-5">
          {card.bedrooms && (
            <div className="flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10V13.5M14 10V13.5M1.5 10H14.5M2.5 10V7C2.5 6.44772 2.94772 6 3.5 6H12.5C13.0523 6 13.5 6.44772 13.5 7V10M4 6V4.5C4 3.67157 4.67157 3 5.5 3H10.5C11.3284 3 12 3.67157 12 4.5V6" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[13px] text-white">{card.bedrooms} slaapkamers</span>
            </div>
          )}
          {card.area && (
            <div className="flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 13.5L13.5 2.5M2.5 13.5H5.5M2.5 13.5V10.5M13.5 2.5H10.5M13.5 2.5V5.5M5.5 2.5H2.5V5.5M10.5 13.5H13.5V10.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[13px] text-white">{card.area}</span>
            </div>
          )}
        </div>

        {card.price && (
          <div className="mt-4 flex items-center gap-2.5">
            <span className="text-xs text-white">Prijs</span>
            <span className="text-base font-semibold text-white">{card.price}</span>
          </div>
        )}

        <div className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand-gold px-5 py-2.5">
          <span className="text-[13px] font-normal text-white">Details</span>
          <span className="arrow-slide text-[13px] text-white">→</span>
        </div>
      </div>
    </Link>
  )
}
