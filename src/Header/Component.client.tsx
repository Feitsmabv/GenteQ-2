'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

interface NavLink {
  label: string
  href: string
}

interface HeaderClientProps {
  navLinks: NavLink[]
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ navLinks }) => {
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
      <header className="fixed left-0 right-0 top-0 z-50 bg-white/95 backdrop-blur transition-all duration-300">
        <div className="flex items-center justify-between px-5 py-4 md:px-10">
          <Link href="/" aria-label="Naar startpagina" className="flex items-center">
            <span className="font-heading text-xl tracking-[1.6px] text-neutral-900">GenteQ</span>
          </Link>

          <nav aria-label="Hoofdnavigatie" className="hidden items-center gap-10 text-[15px] lg:flex">
            {navLinks.map((link) => {
              const isActive = pathname
                ? link.href === '/'
                  ? pathname === '/'
                  : pathname === link.href || pathname.startsWith(`${link.href}/`)
                : false
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-nav-link
                  data-href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className="nav-link transition-colors duration-300"
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <button
            ref={menuButtonRef}
            type="button"
            className="relative h-10 w-10 lg:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? 'Menu sluiten' : 'Menu openen'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span
              className={`absolute left-1/2 top-1/2 block h-0.5 w-6 -translate-x-1/2 bg-neutral-900 transition-transform duration-300 ease-out ${
                mobileMenuOpen ? 'rotate-45' : '-translate-y-[6px]'
              }`}
            />
            <span
              className={`absolute left-1/2 top-1/2 block h-0.5 w-6 -translate-x-1/2 bg-neutral-900 transition-opacity duration-200 ease-out ${
                mobileMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute left-1/2 top-1/2 block h-0.5 w-6 -translate-x-1/2 bg-neutral-900 transition-transform duration-300 ease-out ${
                mobileMenuOpen ? '-rotate-45' : 'translate-y-[6px]'
              }`}
            />
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <nav
            id="mobile-menu"
            aria-label="Mobiel menu"
            className="fixed left-0 right-0 top-[72px] z-50 flex flex-col gap-2 bg-white px-5 py-6 shadow-lg lg:hidden"
          >
            {navLinks.map((link, i) => {
              const isActive = pathname
                ? link.href === '/'
                  ? pathname === '/'
                  : pathname === link.href || pathname.startsWith(`${link.href}/`)
                : false
              return (
                <Link
                  key={link.href}
                  ref={i === 0 ? firstMobileLinkRef : undefined}
                  href={link.href}
                  data-nav-link
                  data-href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className="rounded-lg px-3 py-3 text-base font-medium text-neutral-700"
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </>
      )}
    </>
  )
}
