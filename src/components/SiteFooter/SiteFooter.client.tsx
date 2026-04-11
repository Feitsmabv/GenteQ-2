'use client'

import Link from 'next/link'
import type { ProjectSetting } from '@/payload-types'

interface SiteFooterClientProps {
  settings?: ProjectSetting | null
}

export function SiteFooterClient({ settings }: SiteFooterClientProps) {

  const projectnaam = settings?.projectnaam || 'Projectnaam'
  const telefoon = settings?.telefoon || ''
  const email = settings?.email || ''
  const adres = settings?.adres || ''
  const partners = (settings?.partners as { naam: string; url?: string | null }[]) || []

  const columns = [
    {
      title: projectnaam,
      links: [
        { label: 'Over het project', href: '/#project' },
        { label: 'Woningaanbod', href: '/aanbod' },
        { label: 'Locatie', href: '/#locatie' },
        { label: 'Nieuws', href: '/nieuws' },
      ],
    },
    {
      title: 'Contact',
      links: [
        ...(telefoon ? [{ label: telefoon, href: `tel:${telefoon.replace(/\s/g, '')}` }] : []),
        ...(email ? [{ label: email, href: `mailto:${email}` }] : []),
        ...(adres ? [{ label: adres }] : []),
      ],
    },
    {
      title: 'Juridisch',
      links: [
        { label: 'Privacybeleid', href: '/privacy' },
        { label: 'Cookiebeleid', href: '/cookies' },
        { label: 'Algemene voorwaarden', href: '/voorwaarden' },
      ],
    },
    ...(partners.length > 0
      ? [
          {
            title: 'Partners',
            links: partners.map((p) => ({
              label: p.naam,
              ...(p.url ? { href: p.url } : {}),
            })),
          },
        ]
      : []),
  ]

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-brand-dark px-5 pb-10 pt-16 md:px-20">
      {/* Columns */}
      <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
        {columns.map((col) => (
          <div key={col.title} className="flex flex-col gap-4">
            <span className="text-[15px] font-semibold text-white">{col.title}</span>
            <div className="h-[2px] w-[30px] bg-brand-gold" />
            {col.links.map((link) =>
              'href' in link && link.href ? (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ) : (
                <span key={link.label} className="text-sm text-white/70">
                  {link.label}
                </span>
              ),
            )}
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="my-10 h-px w-full bg-white/12" />

      {/* Bottom */}
      <div className="flex flex-col items-center justify-between gap-4 text-[13px] text-white/55 sm:flex-row">
        <span>© {currentYear} {projectnaam}. Alle rechten voorbehouden.</span>
        <span>
          Website door{' '}
          <a
            href="https://feitsma.be/projectbranding"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 transition-colors hover:text-white hover:underline"
          >
            Feitsma
          </a>
        </span>
      </div>
    </footer>
  )
}
