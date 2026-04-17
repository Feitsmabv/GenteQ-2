'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { GenteQLogo } from './Logo'

export interface NavLink {
  label: string
  href: string
}

export interface NavCta {
  label: string
  href: string
}

interface HeaderClientProps {
  navLinks: NavLink[]
  cta: NavCta | null
}

function isActiveHref(pathname: string, href: string): boolean {
  if (!pathname) return false
  if (href === '/') return pathname === '/' || /^\/[a-z]{2}$/.test(pathname)
  return pathname === href || pathname.startsWith(`${href}/`)
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ navLinks, cta }) => {
  const pathname = usePathname() || ''
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (mobileMenuOpen) {
      const original = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = original
      }
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    if (!mobileMenuOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [mobileMenuOpen])

  useEffect(() => {
    if (mobileMenuOpen) {
      requestAnimationFrame(() => firstMobileLinkRef.current?.focus())
    }
  }, [mobileMenuOpen])

  return (
    <>
      <div
        data-header
        className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 md:top-6"
      >
        <header
          aria-label="Hoofdnavigatie"
          className="nav-pill pointer-events-auto flex w-full max-w-3xl items-center justify-between gap-4 rounded-full py-2 pl-4 pr-2"
        >
          <Link
            href="/"
            aria-label="Naar startpagina"
            className="flex shrink-0 items-center px-1"
          >
            <GenteQLogo className="h-8 w-auto" />
          </Link>

          <nav aria-label="Hoofdnavigatie" className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => {
              const active = isActiveHref(pathname, link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-nav-link
                  data-label={link.label}
                  aria-current={active ? 'page' : undefined}
                  className="nav-pill-link text-[14px]"
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            {cta && (
              <Link
                href={cta.href}
                className="nav-cta hidden items-center rounded-full px-[18px] py-[10px] text-[13px] font-medium text-white md:inline-flex"
              >
                {cta.label}
              </Link>
            )}

            <button
              ref={menuButtonRef}
              type="button"
              className="relative h-9 w-9 md:hidden"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? 'Menu sluiten' : 'Menu openen'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span
                className={`absolute left-1/2 top-1/2 block h-0.5 w-5 -translate-x-1/2 bg-white transition-transform duration-300 ease-out ${
                  mobileMenuOpen ? 'rotate-45' : '-translate-y-[5px]'
                }`}
              />
              <span
                className={`absolute left-1/2 top-1/2 block h-0.5 w-5 -translate-x-1/2 bg-white transition-opacity duration-200 ease-out ${
                  mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute left-1/2 top-1/2 block h-0.5 w-5 -translate-x-1/2 bg-white transition-transform duration-300 ease-out ${
                  mobileMenuOpen ? '-rotate-45' : 'translate-y-[5px]'
                }`}
              />
            </button>
          </div>
        </header>
      </div>

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <nav
            id="mobile-menu"
            aria-label="Mobiel menu"
            className="fixed inset-x-4 top-20 z-50 flex flex-col gap-1 rounded-3xl p-4 shadow-xl md:hidden"
            style={{ backgroundColor: 'var(--charcoal)' }}
          >
            {navLinks.map((link, i) => {
              const active = isActiveHref(pathname, link.href)
              return (
                <Link
                  key={link.href}
                  ref={i === 0 ? firstMobileLinkRef : undefined}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className="nav-link-mobile rounded-lg px-4 py-3 text-base font-medium text-white/70 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              )
            })}
            {cta && (
              <Link
                href={cta.href}
                className="nav-cta mt-2 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium text-white"
              >
                {cta.label}
              </Link>
            )}
          </nav>
        </>
      )}
    </>
  )
}
