'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export function CookieBanner() {
  // null = nog niet bepaald (server render), true/false = client decided
  const [visible, setVisible] = useState<boolean | null>(null)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    setVisible(!consent)
  }, [])

  const setConsent = (value: 'accepted' | 'declined') => {
    localStorage.setItem('cookie-consent', value)
    window.dispatchEvent(new CustomEvent('cookie-consent-change', { detail: value }))
    setVisible(false)
  }

  const accept = () => setConsent('accepted')
  const decline = () => setConsent('declined')

  if (visible !== true) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl bg-brand-dark p-6 shadow-[0px_8px_32px_rgba(0,0,0,0.25)] sm:flex-row sm:items-center sm:justify-between md:p-8">
        <div className="flex-1">
          <p className="text-sm leading-6 text-white/80">
            Wij gebruiken cookies om uw ervaring te verbeteren. Door verder te gaan stemt u in met ons{' '}
            <Link href="/cookies" className="underline text-white hover:text-steel-blue transition-colors">
              cookiebeleid
            </Link>.
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={decline}
            className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-normal text-white transition-colors hover:border-white/60"
          >
            Weigeren
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-full bg-steel-blue px-5 py-2.5 text-sm font-normal text-white transition-opacity hover:opacity-90"
          >
            Accepteren
          </button>
        </div>
      </div>
    </div>
  )
}
