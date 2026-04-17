import { NextRequest, NextResponse } from 'next/server'

type UtmLink = {
  path?: string
  source: string
  medium: string
  campaign: string
  content?: string
}

const links: Record<string, UtmLink> = {
  'linkedin': {
    source: 'linkedin',
    medium: 'social',
    campaign: 'launch',
    content: 'post-geoffrey',
  },
  'linkedin-company': {
    source: 'linkedin',
    medium: 'social',
    campaign: 'launch',
    content: 'post-company',
  },
  'email': {
    source: 'email',
    medium: 'signature',
    campaign: 'evergreen',
  },
  'newsletter': {
    source: 'email',
    medium: 'newsletter',
    campaign: 'launch-announce',
  },
  'google-business': {
    source: 'google-business',
    medium: 'listing',
    campaign: 'evergreen',
  },
  'card': {
    source: 'businesscard',
    medium: 'qr',
    campaign: 'evergreen',
  },
  'folder-zon': {
    path: '/diensten/zonnepanelen',
    source: 'folder',
    medium: 'qr',
    campaign: 'zonnepanelen-2026',
  },
  'feitsma': {
    source: 'feitsma',
    medium: 'referral',
    campaign: 'portfolio',
  },
}

export function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const link = links[params.slug]
  const origin = new URL(request.url).origin

  if (!link) {
    return NextResponse.redirect(origin, 302)
  }

  const target = new URL(link.path ?? '/', origin)
  target.searchParams.set('utm_source', link.source)
  target.searchParams.set('utm_medium', link.medium)
  target.searchParams.set('utm_campaign', link.campaign)
  if (link.content) target.searchParams.set('utm_content', link.content)

  return NextResponse.redirect(target, 302)
}
