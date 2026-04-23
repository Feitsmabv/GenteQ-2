import { getPayloadClient } from '@/utilities/payload'
import { getDictionary } from '@/i18n/getDictionary'
import type { Locale } from '@/i18n/config'
import type { Footer as FooterData } from '@/payload-types'
import { FooterClient, type FooterProps } from './Component.client'

function normalizeHref(url: string): string {
  if (!url) return '/'
  if (url.startsWith('/') || url.startsWith('http') || url.startsWith('#')) return url
  return `/${url}`
}

function toLinks(
  links: NonNullable<NonNullable<FooterData['columns']>[number]['links']> | null | undefined,
): FooterProps['columns'][number]['links'] {
  if (!links) return []
  return links.map((link) => ({
    label: link.label,
    href: normalizeHref(link.url),
  }))
}

export async function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  const cookieyesEnabled = Boolean(process.env.NEXT_PUBLIC_COOKIEYES_ID)

  let data: FooterData | null = null
  try {
    const payload = await getPayloadClient()
    data = await payload.findGlobal({ slug: 'footer', locale })
  } catch (error) {
    console.error('[Footer] Fout bij ophalen footer global:', error)
  }

  const columns = (data?.columns ?? []).map((col) => ({
    title: col.title,
    links: toLinks(col.links),
  }))

  const legal = (data?.legal ?? []).map((link) => ({
    label: link.label,
    href: normalizeHref(link.url),
  }))

  const props: FooterProps = {
    labels: t.footer,
    tagline: data?.company?.tagline ?? null,
    address: data?.company?.address ?? null,
    columns,
    contact: {
      email: data?.contact?.email ?? null,
      phone: data?.contact?.phone ?? null,
      responseTime: data?.contact?.responseTime ?? null,
    },
    legal,
    copyrightName: data?.bottom?.copyrightName ?? 'GenteQ',
    showBackToTop: data?.bottom?.showBackToTop ?? true,
    cookieyesEnabled,
  }

  return <FooterClient {...props} />
}
