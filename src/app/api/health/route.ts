import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/utilities/payload'

export const dynamic = 'force-dynamic'

/**
 * Health check endpoint — gebruikt door Vercel monitoring en uptime checks.
 * Verifieert dat de Payload + database verbinding werkt.
 */
export async function GET() {
  const startedAt = Date.now()
  try {
    const payload = await getPayloadClient()
    // Lichte query: header global ophalen om DB connectie te verifiëren
    await payload.findGlobal({ slug: 'header', depth: 0 })

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      latencyMs: Date.now() - startedAt,
    })
  } catch (error) {
    console.error('[health] Database verbinding mislukt:', error)
    return NextResponse.json(
      {
        status: 'error',
        database: 'disconnected',
        message: error instanceof Error ? error.message : 'Unknown error',
        latencyMs: Date.now() - startedAt,
      },
      { status: 503 },
    )
  }
}
