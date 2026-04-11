'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

interface GoogleAnalyticsProps {
  gaId: string
}

export function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  const [consent, setConsent] = useState<'accepted' | 'declined' | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('cookie-consent')
    if (stored === 'accepted' || stored === 'declined') {
      setConsent(stored)
    }

    const handleConsentChange = (e: Event) => {
      const detail = (e as CustomEvent<'accepted' | 'declined'>).detail
      setConsent(detail)
    }

    window.addEventListener('cookie-consent-change', handleConsentChange)
    return () => window.removeEventListener('cookie-consent-change', handleConsentChange)
  }, [])

  if (consent !== 'accepted') return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  )
}
