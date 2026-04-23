import { getPayloadClient } from '@/utilities/payload'
import { HeaderClient, type NavCta, type NavLink } from './Component.client'

const defaultNavLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Over ons', href: '/over-ons' },
]
const defaultCta: NavCta = { label: 'Contact opnemen', href: '/contact' }

function normalizeHref(url: string): string {
  if (!url) return '/'
  if (url.startsWith('/') || url.startsWith('http') || url.startsWith('#')) return url
  return `/${url}`
}

export async function Header() {
  let navLinks = defaultNavLinks
  let cta: NavCta | null = defaultCta

  try {
    const payload = await getPayloadClient()
    const header = await payload.findGlobal({ slug: 'header' })

    const items = header?.navItems as { label: string; url: string }[] | undefined
    if (items && items.length > 0) {
      navLinks = items.map((item) => ({
        label: item.label,
        href: normalizeHref(item.url),
      }))
    }

    const ctaData = header?.cta as
      | { enabled?: boolean; label?: string; url?: string }
      | undefined
    if (ctaData?.enabled === false) {
      cta = null
    } else if (ctaData?.label && ctaData?.url) {
      cta = { label: ctaData.label, href: normalizeHref(ctaData.url) }
    }
  } catch (error) {
    console.error('[Header] Fout bij ophalen navigatie:', error)
  }

  return <HeaderClient navLinks={navLinks} cta={cta} />
}
