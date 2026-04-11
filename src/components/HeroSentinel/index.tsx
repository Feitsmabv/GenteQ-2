/**
 * Sentinel die net onder de fold geplaatst wordt en door de Header
 * via IntersectionObserver wordt geobserveerd. Zolang de sentinel
 * in beeld is, weet de header dat we nog 'op de hero' zitten.
 *
 * Plaats dit element binnen een hero sectie waar de header
 * transparant moet zijn. Bijvoorbeeld in <Hero /> en <PageHero />.
 */
export function HeroSentinel() {
  return (
    <div
      data-hero-sentinel
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 left-0 h-px w-px"
    />
  )
}
