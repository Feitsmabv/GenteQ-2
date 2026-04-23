'use client'

import Link from 'next/link'
import { useCallback } from 'react'

export interface FooterLink {
  label: string
  href: string
}

export interface FooterColumn {
  title: string
  links: FooterLink[]
}

export interface FooterLabels {
  landmark: string
  contactHeading: string
  emailLabel: string
  phoneLabel: string
  backToTop: string
  cookieSettings: string
  credit: string
}

export interface FooterProps {
  labels: FooterLabels
  tagline: string | null
  address: string | null
  columns: FooterColumn[]
  contact: {
    email: string | null
    phone: string | null
    responseTime: string | null
  }
  legal: FooterLink[]
  copyrightName: string
  showBackToTop: boolean
  cookieyesEnabled: boolean
}

type CookieYesTag = { revisit?: () => void }
declare global {
  interface Window {
    getCookieYesTag?: () => CookieYesTag | undefined
  }
}

function isExternal(href: string): boolean {
  return href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')
}

function FooterNavLink({ link }: { link: FooterLink }) {
  const external = isExternal(link.href)
  const className =
    'footer-link text-sm text-slate-light transition-colors hover:text-white focus-visible:text-white'

  if (external) {
    return (
      <a
        href={link.href}
        className={className}
        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
        target={link.href.startsWith('http') ? '_blank' : undefined}
      >
        {link.label}
      </a>
    )
  }
  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  )
}

export function FooterClient({
  labels,
  tagline,
  address,
  columns,
  contact,
  legal,
  copyrightName,
  showBackToTop,
  cookieyesEnabled,
}: FooterProps) {
  const currentYear = new Date().getFullYear()
  const hasContactDetails = Boolean(contact.email || contact.phone || contact.responseTime)

  const handleBackToTop = useCallback(() => {
    if (typeof window === 'undefined') return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }, [])

  const handleCookieSettings = useCallback(() => {
    if (typeof window === 'undefined') return
    window.getCookieYesTag?.()?.revisit?.()
  }, [])

  return (
    <footer
      aria-label={labels.landmark}
      className="bg-carbon-black px-5 pb-10 pt-16 text-slate-light md:px-12 lg:px-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <span className="text-[15px] font-semibold text-white">GenteQ</span>
            <div className="h-px w-8 bg-graphite" />
            {tagline && <p className="text-sm leading-relaxed">{tagline}</p>}
            {address && (
              <address className="whitespace-pre-line text-sm not-italic leading-relaxed">
                {address}
              </address>
            )}
          </div>

          {columns.map((column, index) => (
            <nav
              key={`${column.title}-${index}`}
              aria-label={column.title}
              className="flex flex-col gap-4"
            >
              <span className="text-[15px] font-semibold text-white">{column.title}</span>
              <div className="h-px w-8 bg-graphite" />
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <FooterNavLink link={link} />
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {hasContactDetails && (
            <div className="flex flex-col gap-4">
              <span className="text-[15px] font-semibold text-white">
                {labels.contactHeading}
              </span>
              <div className="h-px w-8 bg-graphite" />
              <ul className="flex flex-col gap-3 text-sm">
                {contact.email && (
                  <li>
                    <a
                      href={`mailto:${contact.email}`}
                      aria-label={`${labels.emailLabel}: ${contact.email}`}
                      className="footer-link transition-colors hover:text-white focus-visible:text-white"
                    >
                      {contact.email}
                    </a>
                  </li>
                )}
                {contact.phone && (
                  <li>
                    <a
                      href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                      aria-label={`${labels.phoneLabel}: ${contact.phone}`}
                      className="footer-link transition-colors hover:text-white focus-visible:text-white"
                    >
                      {contact.phone}
                    </a>
                  </li>
                )}
                {contact.responseTime && (
                  <li className="text-ash">{contact.responseTime}</li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="my-10 h-px w-full bg-graphite" />

        <div className="flex flex-col gap-4 text-[13px] text-ash md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>
              &copy; {currentYear} {copyrightName}.
            </span>
            {legal.length > 0 && (
              <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {legal.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <FooterNavLink link={link} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {cookieyesEnabled && (
              <button
                type="button"
                onClick={handleCookieSettings}
                className="footer-link transition-colors hover:text-white focus-visible:text-white"
              >
                {labels.cookieSettings}
              </button>
            )}
            <span>
              {labels.credit}{' '}
              <a
                href="https://feitsma.be"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 transition-colors hover:text-white hover:underline focus-visible:text-white focus-visible:underline"
              >
                Feitsma
              </a>
            </span>
            {showBackToTop && (
              <button
                type="button"
                onClick={handleBackToTop}
                aria-label={labels.backToTop}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-graphite text-slate-light transition-colors hover:border-steel-blue hover:text-white focus-visible:border-steel-blue focus-visible:text-white"
              >
                <svg
                  aria-hidden="true"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 11V3M7 3L3 7M7 3L11 7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
