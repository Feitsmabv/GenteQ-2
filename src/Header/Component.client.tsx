'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

interface NavLink {
  label: string
  href: string
}

interface HeaderClientProps {
  projectnaam?: string
  logoUrl?: string
  logoWitUrl?: string
  navLinks: NavLink[]
}

export const HeaderClient: React.FC<HeaderClientProps> = ({
  projectnaam,
  logoUrl,
  logoWitUrl,
  navLinks,
}) => {
  // pathname is alleen na hydration beschikbaar; vóór die tijd zorgt een
  // inline script (zie onder) ervoor dat de juiste nav link al een
  // data-active attribuut heeft, en CSS regelt de styling.
  const pathname = usePathname() || ''
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  // SSR rendert data-hero-state="pending". CSS variabelen in globals.css
  // bepalen of de header transparant of wit is op basis van of de body
  // een [data-hero-sentinel] bevat. Pas wanneer React in de client de
  // sentinel echt observeert, switchen we naar 'on' of 'off' en neemt
  // React het over.
  const [heroState, setHeroState] = useState<'pending' | 'on' | 'off'>('pending')
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null)

  // Sluit mobile menu bij navigatie
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Body scroll lock wanneer mobile menu open is
  useEffect(() => {
    if (mobileMenuOpen) {
      const original = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = original
      }
    }
  }, [mobileMenuOpen])

  // Globale escape: sluit mobile menu en geef focus terug aan knop
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

  // Verplaats focus naar eerste link wanneer mobile menu opent
  useEffect(() => {
    if (mobileMenuOpen) {
      requestAnimationFrame(() => firstMobileLinkRef.current?.focus())
    }
  }, [mobileMenuOpen])

  // Sentinel-based hero detectie via IntersectionObserver
  useEffect(() => {
    const sentinel = document.querySelector('[data-hero-sentinel]')
    if (!sentinel) {
      setHeroState('off')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeroState(entry.isIntersecting ? 'on' : 'off')
      },
      {
        threshold: 0,
        rootMargin: '-80px 0px 0px 0px',
      },
    )
    observer.observe(sentinel)

    return () => observer.disconnect()
  }, [pathname])

  // isOnHero is alleen na hydration relevant; vóór hydration regelen we alles via CSS
  const isOnHero = heroState === 'on'
  // Logo: als er een witte versie is en we op een hero zitten → gebruik die
  const activeLogoUrl = isOnHero && logoWitUrl ? logoWitUrl : logoUrl
  // Invert filter alleen als er geen aparte witte versie is en we op de hero zitten
  const needsLogoInvert = isOnHero && !logoWitUrl
  const isContactPage = pathname === '/contact'

  return (
    <>
      <header
        data-header
        data-hero-state={heroState}
        data-logo-fallback={logoUrl && !logoWitUrl ? 'invert' : undefined}
        className="fixed left-0 right-0 top-0 z-50 transition-all duration-300"
      >
        <div className="flex items-center justify-between px-5 py-4 md:px-20">
          {/* Logo — beide versies renderen, CSS toont de juiste */}
          <Link href="/" aria-label="Naar startpagina" className="flex items-center">
            {logoUrl ? (
              <>
                {/* Donkere logo (zichtbaar op witte header) */}
                <Image
                  src={logoUrl}
                  alt={projectnaam || 'Logo'}
                  width={140}
                  height={40}
                  priority
                  data-logo="dark"
                  className="h-8 w-auto object-contain"
                />
                {/* Witte logo of geinverte donkere — zichtbaar op transparante header */}
                {logoWitUrl ? (
                  <Image
                    src={logoWitUrl}
                    alt=""
                    width={140}
                    height={40}
                    priority
                    data-logo="light"
                    aria-hidden="true"
                    className="h-8 w-auto object-contain"
                  />
                ) : null}
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-md bg-brand-gold" />
                <span
                  className="font-heading text-xl tracking-[1.6px] transition-colors duration-300"
                  style={{ color: 'var(--header-text)' }}
                >
                  {projectnaam || 'Projectnaam'}
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="Hoofdnavigatie" className="hidden items-center gap-10 text-[15px] lg:flex">
            {navLinks.map((link) => {
              // Home matcht alleen exact, andere links matchen ook subpaths
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
                  data-label={link.label}
                  aria-current={isActive ? 'page' : undefined}
                  className="nav-link transition-colors duration-300"
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Desktop CTA — verbergen op contactpagina zelf */}
          {/* Desktop CTA — alleen op lg+ zichtbaar, op mobiel verschijnt 'ie in het uitklapmenu */}
          <Link
            href="/contact"
            prefetch={false}
            aria-hidden={isContactPage || undefined}
            tabIndex={isContactPage ? -1 : undefined}
            data-desktop-cta
            className={`btn-primary btn-no-arrow min-w-[180px] justify-center rounded-full bg-brand-gold px-[22px] py-[11px] text-sm font-normal text-white ${
              isContactPage ? 'pointer-events-none invisible' : ''
            }`}
          >
            Contact opnemen
          </Link>

          {/* Mobile Menu Button */}
          <button
            ref={menuButtonRef}
            type="button"
            className="relative h-10 w-10 lg:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? 'Menu sluiten' : 'Menu openen'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {/* Bovenste lijn — schuift naar midden + roteert 45° */}
            <span
              className={`absolute left-1/2 top-1/2 block h-0.5 w-6 -translate-x-1/2 transition-transform duration-300 ease-out ${
                mobileMenuOpen ? 'rotate-45' : '-translate-y-[6px]'
              }`}
              style={{ backgroundColor: 'var(--header-text)' }}
            />
            {/* Middelste lijn — fade weg */}
            <span
              className={`absolute left-1/2 top-1/2 block h-0.5 w-6 -translate-x-1/2 transition-opacity duration-200 ease-out ${
                mobileMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
              style={{ backgroundColor: 'var(--header-text)' }}
            />
            {/* Onderste lijn — schuift naar midden + roteert -45° */}
            <span
              className={`absolute left-1/2 top-1/2 block h-0.5 w-6 -translate-x-1/2 transition-transform duration-300 ease-out ${
                mobileMenuOpen ? '-rotate-45' : 'translate-y-[6px]'
              }`}
              style={{ backgroundColor: 'var(--header-text)' }}
            />
          </button>
        </div>
      </header>

      {/* Mobile Menu — fullscreen overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-brand-black/40 backdrop-blur-sm lg:hidden"
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
                  className="nav-link-mobile rounded-lg px-3 py-3 text-base font-medium text-brand-muted"
                >
                  {link.label}
                </Link>
              )
            })}
            {!isContactPage && (
              <Link
                href="/contact"
                prefetch={false}
                className="mt-3 w-full rounded-full bg-brand-gold px-[22px] py-3 text-center text-sm font-normal text-white"
              >
                Contact opnemen
              </Link>
            )}
          </nav>
        </>
      )}
    </>
  )
}
