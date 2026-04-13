'use client'

import Link from 'next/link'

export function SiteFooterClient() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="px-5 pb-10 pt-16 md:px-20"
      style={{ backgroundColor: 'var(--charcoal)' }}
    >
      <div className="grid grid-cols-2 gap-10 md:grid-cols-3">
        <div className="flex flex-col gap-4">
          <span className="text-[15px] font-semibold text-white">GenteQ</span>
          <div className="h-px w-8" style={{ backgroundColor: 'var(--graphite)' }} />
          <span
            className="text-sm"
            style={{ color: 'var(--slate)' }}
          >
            Energieoplossingen, Vereenvoudigd.
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-[15px] font-semibold text-white">Juridisch</span>
          <div className="h-px w-8" style={{ backgroundColor: 'var(--graphite)' }} />
          <Link
            href="/privacy"
            className="text-sm transition-colors hover:text-white"
            style={{ color: 'var(--slate)' }}
          >
            Privacybeleid
          </Link>
          <Link
            href="/cookies"
            className="text-sm transition-colors hover:text-white"
            style={{ color: 'var(--slate)' }}
          >
            Cookiebeleid
          </Link>
          <Link
            href="/voorwaarden"
            className="text-sm transition-colors hover:text-white"
            style={{ color: 'var(--slate)' }}
          >
            Algemene voorwaarden
          </Link>
        </div>
      </div>

      <div
        className="my-10 h-px w-full"
        style={{ backgroundColor: 'var(--graphite)' }}
      />

      <div
        className="flex flex-col items-center justify-between gap-4 text-[13px] sm:flex-row"
        style={{ color: 'var(--ash)' }}
      >
        <span>&copy; {currentYear} GenteQ. Alle rechten voorbehouden.</span>
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
