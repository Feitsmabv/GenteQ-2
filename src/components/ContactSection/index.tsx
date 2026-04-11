'use client'

import { useState, useRef, useEffect } from 'react'
import { useScrollFadeIn } from '@/hooks/useScrollFadeIn'

function buildContactDetails(settings?: ContactSectionProps['settings']) {
  const tel = settings?.telefoon || ''
  const email = settings?.email || ''
  const details: { label: string; value: string; href?: string }[] = []

  if (tel) details.push({ label: 'Telefoon', value: tel, href: `tel:${tel.replace(/\s/g, '')}` })
  if (email) details.push({ label: 'Email', value: email, href: `mailto:${email}` })
  if (settings?.adres) details.push({ label: 'Adres', value: settings.adres })
  if (settings?.kantooruren) details.push({ label: 'Kantooruren', value: settings.kantooruren })

  return details
}

function InteresseDropdown({ value, onChange, options }: {
  value: string
  onChange: (value: string) => void
  options: string[]
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] font-medium text-brand-dark">
        Ik ben geïnteresseerd in een<span className="text-brand-gold">*</span>
      </label>
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-required="true"
          className={`flex h-11 w-full items-center justify-between rounded-full border bg-white px-4 text-[15px] transition-colors ${
            open ? 'border-brand-gold' : 'border-[#e5e0d8]'
          }`}
        >
          <span className={value ? 'text-brand-dark' : 'text-[#9b9288]'}>
            {value || 'Selecteer een woning'}
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          >
            <path d="M3 4.5L6 7.5L9 4.5" stroke="#1a1612" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
          </svg>
        </button>
        {open && (
          <div className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-2xl border border-[#e5e0d8] bg-white shadow-[0px_8px_24px_-4px_rgba(0,0,0,0.08)]">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt)
                  setOpen(false)
                }}
                className={`flex w-full items-center px-4 py-3 text-[14px] transition-colors ${
                  opt === value
                    ? 'bg-brand-gold/8 font-medium text-brand-gold'
                    : 'text-brand-dark/70 hover:bg-brand-light'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
        {/* Verborgen required input voor form validation — leest uit dezelfde state */}
        <input
          type="text"
          required
          value={value}
          readOnly
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
        />
      </div>
    </div>
  )
}

interface ContactSectionProps {
  settings?: { projectnaam?: string | null; telefoon?: string | null; email?: string | null; adres?: string | null; kantooruren?: string | null; contactIntro?: string | null } | null
  woningen?: { titel: string }[] | null
}

export function ContactSection({ settings, woningen }: ContactSectionProps) {
  const projectnaam = settings?.projectnaam || 'Projectnaam'
  const contactDetails = buildContactDetails(settings)
  const woningenNamen = woningen && woningen.length > 0
    ? woningen.map((w) => w.titel)
    : []

  const infoRef = useScrollFadeIn<HTMLDivElement>()
  const formRef = useScrollFadeIn<HTMLDivElement>({ delay: 0.2 })

  const [formData, setFormData] = useState({
    voornaam: '',
    achternaam: '',
    email: '',
    telefoon: '',
    interesse: '',
    bericht: '',
    marketing: false,
    privacy: false,
    website: '', // honeypot
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  // woningen namen komen van props

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Honeypot check — als bot het invult, doe alsof het succesvol is
    if (formData.website) {
      setSubmitted(true)
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Verzenden mislukt')
      }
      setSubmitted(true)
      setFormData({ voornaam: '', achternaam: '', email: '', telefoon: '', interesse: '', bericht: '', marketing: false, privacy: false, website: '' })
    } catch (err) {
      console.error('[ContactSection] Fout:', err)
      setError(err instanceof Error ? err.message : 'Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="bg-brand-cream px-5 py-16 md:px-20 md:py-24">
      <div className="flex flex-col gap-12 lg:flex-row lg:gap-20">
        {/* Left: Contact Info */}
        <div ref={infoRef} className="flex flex-1 flex-col gap-7">
          <span className="text-xs font-medium tracking-[2.4px] text-brand-gold">CONTACT</span>
          <h2 className="font-heading text-[36px] text-brand-dark">Neem contact op</h2>
          <p className="whitespace-pre-line text-base leading-7 text-brand-muted">
            {settings?.contactIntro ||
              'Heeft u vragen over het project of wilt u een afspraak maken? Neem gerust contact met ons op.'}
          </p>

          <div className="flex flex-col gap-7">
            {contactDetails.map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <span className="text-[13px] font-medium text-[#9b9288]">{item.label}</span>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-base font-semibold text-brand-dark hover:text-brand-gold transition-colors"
                  >
                    {item.value}
                  </a>
                ) : (
                  <span className="text-base font-semibold text-brand-dark">{item.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Form */}
        <div ref={formRef} className="flex-1">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 rounded-2xl bg-white p-8 shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.06)] md:p-10"
          >
            <h3 className="text-xl font-semibold text-brand-dark">Stuur ons een bericht</h3>

                {/* Honeypot — hidden from real users */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>

            {submitted ? (
              <div className="rounded-2xl bg-brand-light p-8 text-center">
                <p className="text-lg font-semibold text-brand-dark">Bedankt voor uw bericht!</p>
                <p className="mt-2 text-sm text-brand-muted">We nemen zo snel mogelijk contact met u op.</p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="flex flex-1 flex-col gap-2">
                    <label htmlFor="voornaam" className="text-[13px] font-medium text-brand-dark">Voornaam</label>
                    <input
                      id="voornaam"
                      type="text"
                      required
                      placeholder="Voornaam"
                      value={formData.voornaam}
                      onChange={(e) => setFormData({ ...formData, voornaam: e.target.value })}
                      className="h-11 rounded-full border border-[#e5e0d8] bg-white px-4 text-[15px] text-brand-dark placeholder:text-[#9b9288] focus:border-brand-gold focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <label htmlFor="achternaam" className="text-[13px] font-medium text-brand-dark">Achternaam</label>
                    <input
                      id="achternaam"
                      type="text"
                      required
                      placeholder="Achternaam"
                      value={formData.achternaam}
                      onChange={(e) => setFormData({ ...formData, achternaam: e.target.value })}
                      className="h-11 rounded-full border border-[#e5e0d8] bg-white px-4 text-[15px] text-brand-dark placeholder:text-[#9b9288] focus:border-brand-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-[13px] font-medium text-brand-dark">E-mailadres</label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="E-mailadres"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-11 rounded-full border border-[#e5e0d8] bg-white px-4 text-[15px] text-brand-dark placeholder:text-[#9b9288] focus:border-brand-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="telefoon" className="text-[13px] font-medium text-brand-dark">Telefoonnummer</label>
                  <input
                    id="telefoon"
                    type="tel"
                    placeholder="Telefoonnummer"
                    value={formData.telefoon}
                    onChange={(e) => setFormData({ ...formData, telefoon: e.target.value })}
                    className="h-11 rounded-full border border-[#e5e0d8] bg-white px-4 text-[15px] text-brand-dark placeholder:text-[#9b9288] focus:border-brand-gold focus:outline-none"
                  />
                </div>

                {woningenNamen.length > 0 && (
                  <InteresseDropdown
                    value={formData.interesse}
                    onChange={(v) => setFormData({ ...formData, interesse: v })}
                    options={[...woningenNamen, 'Algemene vraag']}
                  />
                )}

                <div className="flex flex-col gap-2">
                  <label htmlFor="bericht" className="text-[13px] font-medium text-brand-dark">Bericht</label>
                  <textarea
                    id="bericht"
                    required
                    placeholder="Uw bericht..."
                    rows={4}
                    value={formData.bericht}
                    onChange={(e) => setFormData({ ...formData, bericht: e.target.value })}
                    className="resize-none rounded-[20px] border border-[#e5e0d8] bg-white px-4 py-3 text-[15px] text-brand-dark placeholder:text-[#9b9288] focus:border-brand-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.marketing}
                      onChange={(e) => setFormData({ ...formData, marketing: e.target.checked })}
                      className="mt-0.5 size-4 shrink-0 accent-brand-gold"
                    />
                    <span className="text-[13px] leading-5 text-brand-muted">
                      Ik ga ermee akkoord om andere berichten te ontvangen van {projectnaam}.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.privacy}
                      onChange={(e) => setFormData({ ...formData, privacy: e.target.checked })}
                      className="mt-0.5 size-4 shrink-0 accent-brand-gold"
                    />
                    <span className="text-[13px] leading-5 text-brand-muted">
                      Ik geef toestemming aan {projectnaam} om mijn persoonlijke gegevens op te slaan en te verwerken.<span className="text-brand-gold">*</span>
                    </span>
                  </label>
                </div>

                {error && (
                  <p className="text-sm text-red-600" role="alert">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full rounded-full bg-brand-gold py-4 text-base font-normal text-white disabled:opacity-60"
                >
                  {submitting ? 'Versturen...' : 'Verstuur bericht'}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
