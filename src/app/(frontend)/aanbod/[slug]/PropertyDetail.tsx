'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useScrollFadeIn } from '@/hooks/useScrollFadeIn'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { Lightbox } from '@/components/Lightbox'

interface PropertySpec {
  value: string
  label: string
}

interface GalleryImage {
  url: string
  alt?: string
}

interface PropertyDetailProps {
  title: string
  address: string
  price: string
  prijsLabel?: string
  specs: PropertySpec[]
  beschrijving?: SerializedEditorState | null
  features: string[][]
  badge: string
  telefoon?: string
  email?: string
  hoofdafbeeldingUrl?: string
  galerij?: GalleryImage[]
  sidebarTitel?: string
  sidebarTekst?: string
}

function CheckIcon() {
  return (
    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-gold/15">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#9b6800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export function PropertyDetail({
  title,
  address,
  price,
  prijsLabel,
  specs,
  beschrijving,
  features,
  badge,
  telefoon,
  email,
  hoofdafbeeldingUrl,
  galerij,
  sidebarTitel,
  sidebarTekst,
}: PropertyDetailProps) {
  const [formNaam, setFormNaam] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const galleryRef = useScrollFadeIn<HTMLDivElement>({ y: 20 })
  const contentRef = useScrollFadeIn<HTMLDivElement>({ delay: 0.15 })
  const featuresRef = useScrollFadeIn<HTMLDivElement>({ stagger: 0.05, children: true })

  const allImages = [
    ...(hoofdafbeeldingUrl ? [{ url: hoofdafbeeldingUrl, alt: title }] : []),
    ...(galerij || []),
  ]
  const sideImages = allImages.slice(1, 4)
  const extraCount = Math.max(0, allImages.length - 4)

  const handlePlanBezoek = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formNaam || !formEmail) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voornaam: formNaam,
          achternaam: '-',
          email: formEmail,
          telefoon: phone,
          interesse: title,
          bericht: `Bezoek aanvraag voor ${title}`,
          privacy: true,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Verzenden mislukt')
      }
      setSubmitted(true)
    } catch (err) {
      console.error('[PropertyDetail] Fout:', err)
      setError(err instanceof Error ? err.message : 'Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* Gallery */}
      <div ref={galleryRef} className="flex gap-4 bg-white px-5 pt-8 md:px-20">
        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          aria-label={`Open foto galerij voor ${title}`}
          className="relative block flex-1 cursor-zoom-in overflow-hidden rounded-2xl border-0 bg-[#eae7e3] p-0 text-left min-h-[280px] md:min-h-[460px]"
        >
          {hoofdafbeeldingUrl ? (
            <Image
              src={hoofdafbeeldingUrl}
              alt={title}
              fill
              priority
              className="object-cover transition-transform duration-300 hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          ) : null}
          <div className={`absolute left-5 top-5 rounded-full px-4 py-2 text-[13px] font-medium text-white ${
            badge === 'Beschikbaar' ? 'bg-[#2a5138]' : badge === 'Nieuw' ? 'bg-brand-gold' : 'bg-[#bf612e]'
          }`}>
            {badge}
          </div>
        </button>
        {sideImages.length > 0 && (
          <div className="hidden flex-col gap-4 md:flex" style={{ width: 380 }}>
            {sideImages.map((img, i) => (
              <button
                type="button"
                key={`${img.url}-${i}`}
                onClick={() => setLightboxIndex(i + 1)}
                aria-label={`Open foto ${i + 2} van ${allImages.length}`}
                className="relative block h-[142px] cursor-zoom-in overflow-hidden rounded-xl border-0 bg-[#eae7e3] p-0"
              >
                <Image
                  src={img.url}
                  alt={img.alt || `${title} foto ${i + 2}`}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-[1.04]"
                  sizes="380px"
                />
                {i === sideImages.length - 1 && extraCount > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-brand-dark/50">
                    <span className="text-base font-medium text-white">+{extraCount} foto&apos;s</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content + Sidebar */}
      <div ref={contentRef} className="flex flex-col gap-12 bg-white px-5 py-12 md:px-20 lg:flex-row lg:gap-16">
        {/* Main Content (op mobiel order-1, sidebar order-2) */}
        <div className="order-1 flex flex-1 flex-col gap-10">
          {/* Title Row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="font-heading text-[32px] text-brand-dark md:text-[38px]">{title}</h1>
              <p className="text-[15px] text-brand-dark/50">{address}</p>
            </div>
            <div className="flex flex-col items-start gap-1 sm:items-end">
              <span className="text-xs text-brand-dark/50">{prijsLabel || 'Vanaf'}</span>
              <span className="font-heading text-[28px] text-[#c6a355] md:text-[32px]">{price}</span>
            </div>
          </div>

          {/* Quick Specs */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {specs.map((spec) => (
              <div key={spec.label} className="flex min-w-0 flex-col items-center gap-1.5 rounded-xl bg-[#f7f5f2] px-2 py-5 text-center">
                <span className="w-full break-words text-lg font-semibold text-brand-dark md:text-xl">{spec.value}</span>
                <span className="text-xs text-brand-dark/50">{spec.label}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-2xl text-brand-dark">Beschrijving</h2>
            {beschrijving ? (
              <div className="prose prose-base max-w-none text-brand-dark/65">
                <RichText data={beschrijving} />
              </div>
            ) : (
              <p className="text-[15px] leading-[26px] text-brand-dark/65">Neem contact op voor meer informatie over deze woning.</p>
            )}
          </div>

          {/* Features inline op mobiel — boven de sidebar (order-2) */}
          {features.flat().length > 0 && (
            <div className="lg:hidden">
              <h2 className="font-heading text-2xl text-brand-dark">Kenmerken &amp; afwerking</h2>
              <div className="mt-6 grid gap-x-10 gap-y-3">
                {features.flat().map((feature) => (
                  <div key={`mobile-${feature}`} className="flex items-center gap-3">
                    <CheckIcon />
                    <span className="text-[15px] text-brand-dark">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar (op mobiel order-2, dus na de features hierboven) */}
        <div className="order-2 w-full lg:w-[400px] lg:shrink-0">
          <div className="flex flex-col gap-5 rounded-2xl bg-[#f7f5f2] p-8">
            <h3 className="font-heading text-xl text-brand-dark">{sidebarTitel || 'Interesse in deze woning?'}</h3>
            {submitted ? (
              <div className="rounded-xl bg-brand-gold/10 p-4 text-center">
                <p className="text-sm font-semibold text-brand-dark">Bedankt!</p>
                <p className="mt-1 text-xs text-brand-muted">We nemen zo snel mogelijk contact met u op.</p>
              </div>
            ) : (
              <form onSubmit={handlePlanBezoek} className="flex flex-col gap-3">
                <p className="whitespace-pre-line text-sm leading-[22px] text-brand-dark/60">
                  {sidebarTekst || 'Neem contact op voor een vrijblijvend bezoek of meer informatie.'}
                </p>
                <input
                  type="text"
                  required
                  placeholder="Uw naam"
                  value={formNaam}
                  onChange={(e) => setFormNaam(e.target.value)}
                  className="rounded-[10px] border border-[#e0dcd6] bg-white px-4 py-3.5 text-sm text-brand-dark placeholder:text-brand-dark/40 focus:border-brand-gold focus:outline-none"
                />
                <input
                  type="email"
                  required
                  placeholder="Uw e-mailadres"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="rounded-[10px] border border-[#e0dcd6] bg-white px-4 py-3.5 text-sm text-brand-dark placeholder:text-brand-dark/40 focus:border-brand-gold focus:outline-none"
                />
                <input
                  type="tel"
                  placeholder="Telefoon (optioneel)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-[10px] border border-[#e0dcd6] bg-white px-4 py-3.5 text-sm text-brand-dark placeholder:text-brand-dark/40 focus:border-brand-gold focus:outline-none"
                />
                {error && (
                  <p className="text-xs text-red-600" role="alert">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={submitting || !formNaam || !formEmail}
                  className="btn-primary w-full rounded-full bg-brand-gold py-4 text-[15px] font-normal text-white disabled:opacity-60"
                >
                  {submitting ? 'Versturen...' : 'Plan een bezoek'}
                </button>
              </form>
            )}
            <a
              href="#brochure"
              className="btn-outline w-full rounded-full border-[1.5px] border-brand-dark py-4 text-center text-[15px] font-normal text-brand-dark hover:bg-brand-dark hover:text-white"
            >
              Download brochure
            </a>
          </div>

          {(telefoon || email) && (
            <div className="mt-6 flex flex-col gap-3 px-8 text-[13px]">
              {telefoon && (
                <div className="flex gap-2">
                  <span className="text-brand-dark/50">Telefoon:</span>
                  <a href={`tel:${telefoon.replace(/\s/g, '')}`} className="font-medium text-brand-dark hover:text-brand-gold transition-colors">{telefoon}</a>
                </div>
              )}
              {email && (
                <div className="flex gap-2">
                  <span className="text-brand-dark/50">Email:</span>
                  <a href={`mailto:${email}`} className="font-medium text-brand-dark hover:text-brand-gold transition-colors">{email}</a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Features (desktop variant — op mobiel staat 'ie inline boven de sidebar) */}
      {features.flat().length > 0 && (
        <section className="hidden bg-[#f7f5f2] px-5 py-16 md:px-20 lg:block">
          <h2 className="font-heading text-[28px] text-brand-dark">Kenmerken &amp; afwerking</h2>
          <div ref={featuresRef} className="mt-8 grid gap-x-10 gap-y-4 md:grid-cols-2">
            {features.flat().map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <CheckIcon />
                <span className="text-[15px] text-brand-dark">{feature}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={allImages}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </>
  )
}
