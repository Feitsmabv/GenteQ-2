import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { Poppins, Marcellus } from 'next/font/google'
import React from 'react'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

const marcellus = Marcellus({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-marcellus',
  display: 'swap',
})

import { Header } from '@/Header/Component'
import { SiteFooter } from '@/components/SiteFooter'
import { CookieBanner } from '@/components/CookieBanner'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
import { ScrollToTop } from '@/components/ScrollToTop'
import { PageTransition } from '@/components/PageTransition'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { getProjectSettings } from '@/utilities/payload'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={cn(poppins.variable, marcellus.variable)} lang="nl">
      <head>
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-gold focus:px-4 focus:py-2 focus:text-white"
        >
          Ga naar inhoud
        </a>
        <PageTransition />
        <ScrollToTop />
        <Header />
        {/*
          Synchroon script dat vóór React hydration de actieve nav link
          markeert op basis van location.pathname. Voorkomt flash zonder
          de pagina's dynamic te maken (geen headers() / cookies()).
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=location.pathname;var ls=document.querySelectorAll('[data-nav-link]');for(var i=0;i<ls.length;i++){var h=ls[i].getAttribute('data-href');var a=(h==='/')?(p==='/'):(p===h||p.indexOf(h+'/')===0);if(a)ls[i].setAttribute('aria-current','page');}}catch(e){}})();`,
          }}
        />
        {children}
        <SiteFooter />
        <CookieBanner />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  let projectnaam = 'Projectnaam'
  try {
    const settings = await getProjectSettings()
    if (settings?.projectnaam) projectnaam = settings.projectnaam
  } catch (error) {
    console.error('[Layout] Fout bij ophalen projectnaam:', error)
  }

  return {
    metadataBase: new URL(getServerSideURL()),
    openGraph: {
      type: 'website',
      siteName: projectnaam,
    },
  }
}
