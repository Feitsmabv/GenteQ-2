import type { Metadata } from 'next'

import { Poppins } from 'next/font/google'
import React from 'react'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

import { ScrollToTop } from '@/components/ScrollToTop'
import { PageTransition } from '@/components/PageTransition'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={poppins.variable} lang="nl">
      <head>
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        {process.env.NEXT_PUBLIC_COOKIEYES_ID && (
          <script
            id="cookieyes"
            src={`https://cdn-cookieyes.com/client_data/${process.env.NEXT_PUBLIC_COOKIEYES_ID}/script.js`}
          />
        )}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              data-cookieyes="cookieyes-analytics"
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              data-cookieyes="cookieyes-analytics"
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}',{anonymize_ip:true});`,
              }}
            />
          </>
        )}
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
