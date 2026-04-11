import { getPayloadClient } from '@/utilities/payload'
import { HeaderClient } from './Component.client'

const defaultNavLinks = [{ label: 'Home', href: '/' }]

export async function Header() {
  let navLinks = defaultNavLinks

  try {
    const payload = await getPayloadClient()
    const header = await payload.findGlobal({ slug: 'header' })
    const items = header?.navItems as { label: string; url: string }[] | undefined
    if (items && items.length > 0) {
      navLinks = items.map((item) => {
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

  return <HeaderClient navLinks={navLinks} />
}
