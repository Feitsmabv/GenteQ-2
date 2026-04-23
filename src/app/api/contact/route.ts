import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/utilities/payload'
import { getClientIp, rateLimit } from '@/lib/rate-limit'
import { verifyTurnstileToken } from '@/lib/turnstile'

export const runtime = 'nodejs'

type Subject = 'quote' | 'advice' | 'support' | 'other'

const subjectLabels: Record<Subject, string> = {
  quote: 'Offerte aanvragen',
  advice: 'Advies / intake',
  support: 'Klantondersteuning',
  other: 'Overig',
}

type Payload = {
  name?: unknown
  email?: unknown
  phone?: unknown
  subject?: unknown
  message?: unknown
  website?: unknown
  locale?: unknown
  elapsedMs?: unknown
  turnstileToken?: unknown
}

function asString(v: unknown, max = 2000): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

function isSubject(v: string): v is Subject {
  return v === 'quote' || v === 'advice' || v === 'support' || v === 'other'
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(request: Request) {
  const ip = getClientIp(request)

  const { success: rateOk } = await rateLimit(`contact:${ip}`)
  if (!rateOk) {
    return NextResponse.json(
      { error: 'Te veel aanvragen. Probeer het over een minuut opnieuw.' },
      { status: 429 },
    )
  }

  let body: Payload
  try {
    body = (await request.json()) as Payload
  } catch {
    return NextResponse.json({ error: 'Ongeldige aanvraag.' }, { status: 400 })
  }

  // Honeypot: bots vullen dit verborgen veld vaak in. Stil falen.
  if (asString(body.website)) {
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  // Minimum submit-tijd: formulier invullen kost realistisch >1.5s.
  const elapsed = typeof body.elapsedMs === 'number' ? body.elapsedMs : 0
  if (elapsed > 0 && elapsed < 1500) {
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  const name = asString(body.name, 200)
  const email = asString(body.email, 200)
  const phone = asString(body.phone, 50)
  const subjectRaw = asString(body.subject, 20)
  const message = asString(body.message, 5000)
  const locale = asString(body.locale, 10) || 'nl'

  if (name.length < 2) return NextResponse.json({ error: 'Naam is verplicht.' }, { status: 400 })
  if (!isEmail(email))
    return NextResponse.json({ error: 'Geldig e-mailadres is verplicht.' }, { status: 400 })
  if (!isSubject(subjectRaw))
    return NextResponse.json({ error: 'Kies een geldig onderwerp.' }, { status: 400 })
  if (message.length < 10)
    return NextResponse.json({ error: 'Bericht is te kort.' }, { status: 400 })

  const subject = subjectRaw

  // Turnstile: verplicht als site-key + secret gezet zijn.
  // Lokaal zonder keys: skip alleen als SKIP_TURNSTILE=1.
  if (process.env.TURNSTILE_SECRET_KEY) {
    const token = asString(body.turnstileToken, 4000)
    if (!token) {
      return NextResponse.json(
        { error: 'Beveiligingscheck ontbreekt. Herlaad de pagina.' },
        { status: 400 },
      )
    }
    const ok = await verifyTurnstileToken(token)
    if (!ok) {
      return NextResponse.json(
        { error: 'Beveiligingscheck mislukt. Probeer opnieuw.' },
        { status: 400 },
      )
    }
  }

  const payload = await getPayloadClient()

  await payload.create({
    collection: 'form-submissions',
    data: {
      form: 'contact',
      name,
      email,
      phone: phone || undefined,
      subject,
      message,
      meta: {
        ip,
        userAgent: request.headers.get('user-agent') || undefined,
        locale,
        referrer: request.headers.get('referer') || undefined,
      },
    },
  })

  const recipient = process.env.CONTACT_RECIPIENT_EMAIL || 'geoffrey.feitsma@gmail.com'
  const html = [
    `<h2 style="font-family:system-ui,sans-serif;margin:0 0 16px;color:#1C1C1C;">Nieuw contactformulier</h2>`,
    `<table style="font-family:system-ui,sans-serif;border-collapse:collapse;font-size:14px;color:#1C1C1C;">`,
    row('Onderwerp', subjectLabels[subject]),
    row('Naam', escapeHtml(name)),
    row('E-mail', escapeHtml(email)),
    phone ? row('Telefoon', escapeHtml(phone)) : '',
    row('Bericht', `<div style="white-space:pre-wrap;">${escapeHtml(message)}</div>`),
    `</table>`,
    `<p style="font-family:system-ui,sans-serif;font-size:12px;color:#777;margin-top:24px;">IP: ${escapeHtml(ip)} · locale: ${escapeHtml(locale)}</p>`,
  ].join('\n')

  try {
    await payload.sendEmail({
      to: recipient,
      replyTo: email,
      subject: `[GenteQ contact] ${subjectLabels[subject]} — ${name}`,
      html,
    })
  } catch (err) {
    // Log maar faal niet — inzending staat al in de DB.
    payload.logger.error({ err }, '[contact] sendEmail error')
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}

function row(label: string, value: string): string {
  return `<tr><td style="padding:6px 16px 6px 0;color:#777;vertical-align:top;">${label}</td><td style="padding:6px 0;">${value}</td></tr>`
}
