import type { Metadata } from 'next'

import { Poppins } from 'next/font/google'
import React from 'react'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

import { CookieBanner } from '@/components/CookieBanner'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
import { ScrollToTop } from '@/components/ScrollToTop'
import { PageTransition } from '@/components/PageTransition'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={poppins.variable} lang="nl">
      <head>
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:px-4 focus:py-2 focus:text-white"
          style={{ backgroundColor: 'var(--steel-blue)' }}
        >
          Ga naar inhoud
        </a>
        <PageTransition />
        <ScrollToTop />
        {/* Header en Footer staan uit tijdens de coming soon fase.
            Zet ze terug wanneer de site secties krijgt. */}
        {children}
        <CookieBanner />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  )
}

export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL(getServerSideURL()),
    openGraph: {
      type: 'website',
      siteName: 'GenteQ',
    },
  }
}
