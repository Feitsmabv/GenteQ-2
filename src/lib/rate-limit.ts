import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

// Rate limiter voor formulieren en publieke endpoints.
//
// Strategie:
//  - Productie (Vercel serverless): Upstash Redis via env vars.
//    Elke invocation is een fresh instance, dus in-memory werkt daar NIET.
//  - Lokale dev zonder Upstash vars: in-memory fallback, zodat devs
//    niet geblokkeerd zijn maar wel zien dat er een limiet is.
//
// Env vars:
//   UPSTASH_REDIS_REST_URL
//   UPSTASH_REDIS_REST_TOKEN

const WINDOW = '1 m'
const MAX_REQUESTS = 5

const hasUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN

if (process.env.NODE_ENV === 'production' && !hasUpstash) {
  throw new Error(
    '[rate-limit] UPSTASH_REDIS_REST_URL en UPSTASH_REDIS_REST_TOKEN zijn verplicht in productie. ' +
      'Zonder Upstash is rate-limiting op Vercel serverless effectief uitgeschakeld.',
  )
}

const upstashLimiter = hasUpstash
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(MAX_REQUESTS, WINDOW),
      analytics: true,
      prefix: 'genteq:ratelimit',
    })
  : null

const memoryMap = new Map<string, { count: number; resetTime: number }>()
const MEMORY_WINDOW_MS = 60_000

function memoryLimit(identifier: string): { success: boolean } {
  const now = Date.now()
  const entry = memoryMap.get(identifier)

  if (!entry || now > entry.resetTime) {
    memoryMap.set(identifier, { count: 1, resetTime: now + MEMORY_WINDOW_MS })
    return { success: true }
  }

  if (entry.count >= MAX_REQUESTS) {
    return { success: false }
  }

  entry.count++
  return { success: true }
}

export async function rateLimit(identifier: string): Promise<{ success: boolean }> {
  if (upstashLimiter) {
    const { success } = await upstashLimiter.limit(identifier)
    return { success }
  }

  return memoryLimit(identifier)
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}
