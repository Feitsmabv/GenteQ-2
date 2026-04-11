import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/utilities/payload'
import { brochureSchema } from '@/lib/validation'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    const { success } = rateLimit(ip)
    if (!success) {
      return NextResponse.json(
        { error: 'Te veel verzoeken. Probeer het later opnieuw.' },
        { status: 429 },
      )
    }

    const body = await request.json()
    const result = brochureSchema.safeParse(body)

    if (!result.success) {
      const firstError = result.error.issues[0]?.message || 'Ongeldige invoer.'
      return NextResponse.json({ error: firstError }, { status: 400 })
    }

    const { naam, email } = result.data

    const payload = await getPayloadClient()

    await payload.create({
      collection: 'form-submissions',
      data: {
        type: 'brochure',
        naam,
        email,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API/brochure] Fout:', error)
    return NextResponse.json(
      { error: 'Er ging iets mis bij het verwerken van uw aanvraag.' },
      { status: 500 },
    )
  }
}
