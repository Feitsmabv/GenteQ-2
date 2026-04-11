import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/utilities/payload'
import { contactSchema } from '@/lib/validation'
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
    const result = contactSchema.safeParse(body)

    if (!result.success) {
      const firstError = result.error.issues[0]?.message || 'Ongeldige invoer.'
      return NextResponse.json({ error: firstError }, { status: 400 })
    }

    const { voornaam, achternaam, email, telefoon, interesse, bericht, marketing } = result.data

    const payload = await getPayloadClient()

    await payload.create({
      collection: 'form-submissions',
      data: {
        type: 'contact',
        naam: `${voornaam} ${achternaam}`,
        email,
        telefoon,
        interesse,
        bericht,
        marketing,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API/contact] Fout:', error)
    return NextResponse.json(
      { error: 'Er ging iets mis bij het verwerken van uw bericht.' },
      { status: 500 },
    )
  }
}
