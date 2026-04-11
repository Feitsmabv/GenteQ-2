import type { Woningen, Media } from '@/payload-types'
import { STATUS_MAP } from './constants'

interface BreadcrumbItem {
  label: string
  href?: string
}

export function generateBreadcrumbJsonLd(items: BreadcrumbItem[], baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${baseUrl}${item.href}` } : {}),
    })),
  }
}

export function generatePropertyJsonLd(woning: Woningen, baseUrl: string) {
  const img = woning.hoofdafbeelding as Media | null

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: woning.titel,
    url: `${baseUrl}/aanbod/${woning.slug}`,
    description: `${woning.type} met ${woning.slaapkamers} slaapkamers, ${woning.oppervlakte}`,
    ...(img?.url ? { image: img.url } : {}),
    offers: {
      '@type': 'Offer',
      price: woning.prijs,
      priceCurrency: 'EUR',
      availability:
        woning.status === 'verkocht'
          ? 'https://schema.org/SoldOut'
          : 'https://schema.org/InStock',
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Slaapkamers', value: woning.slaapkamers },
      { '@type': 'PropertyValue', name: 'Badkamers', value: woning.badkamers },
      { '@type': 'PropertyValue', name: 'Oppervlakte', value: woning.oppervlakte },
      ...(woning.adres ? [{ '@type': 'PropertyValue', name: 'Adres', value: woning.adres }] : []),
    ],
  }
}

export function generatePropertyListJsonLd(woningen: Woningen[], baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: woningen.map((w, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${baseUrl}/aanbod/${w.slug}`,
      name: w.titel,
    })),
  }
}
