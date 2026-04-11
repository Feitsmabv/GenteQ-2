'use client'

import { useState } from 'react'
import { useScrollFadeIn } from '@/hooks/useScrollFadeIn'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

interface BrochureDownloadProps {
  titel?: string
  omschrijving?: SerializedEditorState | null
}

export function BrochureDownload({ titel, omschrijving }: BrochureDownloadProps) {
  const [email, setEmail] = useState('')
  const [naam, setNaam] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const ref = useScrollFadeIn<HTMLDivElement>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Honeypot check
    if (website) {
      setSubmitted(true)
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/brochure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ naam, email, website }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Verzenden mislukt')
      }
      setSubmitted(true)
    } catch (err) {
      console.error('[BrochureDownload] Fout:', err)
      setError(err instanceof Error ? err.message : 'Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="brochure" className="bg-brand-brown px-5 py-16 md:px-20 md:py-24">
      <div ref={ref} className="mx-auto max-w-3xl">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-medium tracking-[2.4px] text-brand-gold">
            GRATIS BROCHURE
          </span>
          <h2 className="mt-4 font-heading text-[28px] leading-[38px] text-white md:text-[32px] md:leading-[42px]">
            {titel || 'Download de projectbrochure'}
          </h2>
          <div className="mt-3 max-w-lg text-base leading-[26px] text-white/65">
            {omschrijving ? (
              <RichText data={omschrijving} />
            ) : (
              <p>Vul uw gegevens in en ontvang de brochure met plannen, prijzen en afwerkingsniveaus direct in uw mailbox.</p>
            )}
          </div>
        </div>

        {submitted ? (
          <div className="mt-10 rounded-2xl bg-white/10 p-8 text-center">
            <p className="text-lg font-semibold text-white">Bedankt!</p>
            <p className="mt-2 text-sm text-white/65">
              De brochure is verstuurd naar uw e-mailadres. Controleer eventueel uw spam folder.
            </p>
          </div>
        ) : (
          <>
            {error && (
              <p className="mt-4 text-center text-sm text-red-400" role="alert">{error}</p>
            )}
            <form onSubmit={handleSubmit} className="relative mt-10 flex flex-col gap-4 sm:flex-row">
              {/* Honeypot */}
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
              <input
                type="text"
                required
                placeholder="Uw naam"
                value={naam}
                onChange={(e) => setNaam(e.target.value)}
                className="h-12 flex-1 rounded-full border border-white/20 bg-white/10 px-5 text-[15px] text-white placeholder:text-white/40 focus:border-brand-gold focus:outline-none"
              />
              <input
                type="email"
                required
                placeholder="Uw e-mailadres"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 flex-1 rounded-full border border-white/20 bg-white/10 px-5 text-[15px] text-white placeholder:text-white/40 focus:border-brand-gold focus:outline-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary h-12 shrink-0 rounded-full bg-brand-gold px-8 text-[15px] font-normal text-white disabled:opacity-60"
              >
                {submitting ? 'Versturen...' : 'Download brochure'}
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  )
}
