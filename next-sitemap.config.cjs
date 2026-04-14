const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  'https://example.com'

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  // De canonieke routes (/nl/...) draaien intern; alleen de vertaalde
  // browser-paden moeten in de sitemap. Excluden + handmatig toevoegen.
  exclude: ['/admin/*', '/api/*', '/next/*', '/nl', '/nl/*', '/en/privacy', '/en/terms'],
  alternateRefs: [
    { href: `${SITE_URL}`, hreflang: 'nl' },
    { href: `${SITE_URL}/en`, hreflang: 'en' },
  ],
  additionalPaths: async () => [
    { loc: '/', changefreq: 'monthly', priority: 1 },
    { loc: '/privacy', changefreq: 'yearly', priority: 0.3 },
    { loc: '/voorwaarden', changefreq: 'yearly', priority: 0.3 },
    { loc: '/cookies', changefreq: 'yearly', priority: 0.3 },
    { loc: '/en', changefreq: 'monthly', priority: 1 },
    { loc: '/en/privacy-policy', changefreq: 'yearly', priority: 0.3 },
    { loc: '/en/terms', changefreq: 'yearly', priority: 0.3 },
    { loc: '/en/cookies', changefreq: 'yearly', priority: 0.3 },
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/*', '/api/*'],
      },
    ],
  },
}
