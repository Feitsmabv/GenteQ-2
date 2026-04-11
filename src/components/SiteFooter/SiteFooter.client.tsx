'use client'

import Link from 'next/link'

export function SiteFooterClient() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-neutral-900 px-5 pb-10 pt-16 md:px-20">
      <div className="grid grid-cols-2 gap-10 md:grid-cols-3">
        <div className="flex flex-col gap-4">
          <span className="text-[15px] font-semibold text-white">GenteQ</span>
          <div className="h-[2px] w-[30px] bg-white/40" />
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-[15px] font-semibold text-white">Juridisch</span>
          <div className="h-[2px] w-[30px] bg-white/40" />
          <Link
            href="/privacy"
            className="text-sm text-white/70 transition-colors hover:text-white"
          >
            Privacybeleid
          </Link>
          <Link
            href="/cookies"
            className="text-sm text-white/70 transition-colors hover:text-white"
          >
            Cookiebeleid
          </Link>
          <Link
            href="/voorwaarden"
            className="text-sm text-white/70 transition-colors hover:text-white"
          >
            Algemene voorwaarden
          </Link>
        </div>
      </div>

      <div className="my-10 h-px w-full bg-white/12" />

      <div className="flex flex-col items-center justify-between gap-4 text-[13px] text-white/55 sm:flex-row">
        <span>© {currentYear} GenteQ. Alle rechten voorbehouden.</span>
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
