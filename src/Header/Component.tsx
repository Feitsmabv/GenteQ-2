import { getProjectSettings } from '@/utilities/payload'
import { getPayloadClient } from '@/utilities/payload'
import { HeaderClient } from './Component.client'
import type { Media } from '@/payload-types'

const defaultNavLinks = [
  { label: 'Home', href: '/' },
  { label: 'Aanbod', href: '/aanbod' },
  { label: 'Nieuws', href: '/nieuws' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
]

export async function Header() {
  let projectnaam = ''
  let logoUrl: string | undefined
  let logoWitUrl: string | undefined
  let navLinks = defaultNavLinks

  try {
    const [settings, payload] = await Promise.all([
      getProjectSettings(),
      getPayloadClient(),
    ])
    projectnaam = settings?.projectnaam || ''
    const logo = settings?.logo as Media | null
    const logoWit = settings?.logoWit as Media | null
    logoUrl = logo?.url || undefined
    logoWitUrl = logoWit?.url || undefined

    const header = await payload.findGlobal({ slug: 'header' })
    const items = header?.navItems as { label: string; url: string }[] | undefined
    if (items && items.length > 0) {
      navLinks = items.map((item) => {
        // Normaliseer URL: voeg leading slash toe als die ontbreekt (relative path)
        // Externe URLs (http://...) en anchors (#...) blijven onveranderd
        let href = item.url
        if (href && !href.startsWith('/') && !href.startsWith('http') && !href.startsWith('#')) {
          href = `/${href}`
        }
        return { label: item.label, href }
      })
    }
  } catch (error) {
    console.error('[Header] Fout bij ophalen navigatie:', error)
  }

  return (
    <HeaderClient
      projectnaam={projectnaam}
      logoUrl={logoUrl}
      logoWitUrl={logoWitUrl}
      navLinks={navLinks}
    />
  )
}
