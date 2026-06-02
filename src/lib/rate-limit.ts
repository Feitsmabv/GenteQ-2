// Rate limiter voor formulieren en publieke endpoints.
//
// Bewust in-memory, zonder externe dienst:
//  - Geen Upstash/Redis-afhankelijkheid die kan wegvallen (gratis tiers worden
//    bij inactiviteit opgeruimd → host verdwijnt → 500's). Een klantsite mag
//    niet platvallen op een verdwenen rate-limit-backend.
//  - In-memory is op Vercel serverless zwak (tellers worden niet betrouwbaar
//    gedeeld tussen invocations), maar dient hier enkel als lichte rem.
//
// De échte beschermingslagen liggen elders:
//  - Contactformulier: Cloudflare Turnstile + honeypot + minimale invultijd.
//  - Cron-endpoints: CRON_SECRET via timing-safe vergelijking (payload.config).
//
// Wil je later harde, gedeelde rate-limiting terug? Voeg dan een externe store
// toe achter deze functie — de call-sites (rateLimit(...)) blijven gelijk.

const WINDOW_MS = 60_000
const MAX_REQUESTS = 5

const memoryMap = new Map<string, { count: number; resetTime: number }>()

function memoryLimit(identifier: string): { success: boolean } {
  const now = Date.now()
  const entry = memoryMap.get(identifier)

  // Lazy eviction: ruim verlopen entries op zodra de map groot wordt.
  if (memoryMap.size > 1000) {
    for (const [key, value] of memoryMap) {
      if (now > value.resetTime) memoryMap.delete(key)
    }
  }

  if (!entry || now > entry.resetTime) {
    memoryMap.set(identifier, { count: 1, resetTime: now + WINDOW_MS })
    return { success: true }
  }

  if (entry.count >= MAX_REQUESTS) {
    return { success: false }
  }

  entry.count++
  return { success: true }
}

export async function rateLimit(identifier: string): Promise<{ success: boolean }> {
  return memoryLimit(identifier)
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}
