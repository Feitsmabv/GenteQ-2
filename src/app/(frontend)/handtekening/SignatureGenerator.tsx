'use client'

import { useEffect, useMemo, useState } from 'react'

const LOGO_URL =
  'https://genteq-2-git-dev-geoffreyfeitsma-1339s-projects.vercel.app/images/genteq-logo-signature.png'

const TABLE_STYLE =
  'font-family: Arial, Helvetica, sans-serif; color: #1c1c1c; font-size: 13px; line-height: 1.5;'

const STORAGE_KEY = 'genteq:signature:v1'

type Fields = {
  name: string
  role: string
  phone: string
  email: string
}

const DEFAULTS: Fields = {
  name: 'Andy Van Endert',
  role: 'GENTEQ bv',
  phone: '+32 492 99 48 79',
  email: 'andy@genteq.be',
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function phoneHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '')
  return digits ? `tel:${digits}` : '#'
}

function buildHtml(f: Fields): string {
  const name = escapeHtml(f.name.trim())
  const role = escapeHtml(f.role.trim())
  const phone = escapeHtml(f.phone.trim())
  const email = escapeHtml(f.email.trim())
  const tel = phoneHref(f.phone)

  return `<table cellpadding="0" cellspacing="0" border="0" style="${TABLE_STYLE}">
  <tr>
    <td style="padding-right: 18px; vertical-align: top; border-right: 2px solid #375d6f;">
      <img src="${LOGO_URL}" alt="GENTEQ" width="180" height="29" style="display: block; border: 0; outline: none; text-decoration: none;" />
    </td>
    <td style="padding-left: 18px; vertical-align: top;">
      <table cellpadding="0" cellspacing="0" border="0" style="${TABLE_STYLE}">
        <tr>
          <td style="font-size: 15px; font-weight: bold; color: #1c1c1c; padding-bottom: 2px;">${name}</td>
        </tr>
        <tr>
          <td style="font-size: 12px; color: #375d6f; padding-bottom: 8px; letter-spacing: 0.3px;">${role}</td>
        </tr>
        <tr>
          <td style="font-size: 12px; color: #1c1c1c; padding-bottom: 2px;"><a href="${tel}" style="color: #1c1c1c; text-decoration: none;">${phone}</a></td>
        </tr>
        <tr>
          <td style="font-size: 12px; color: #1c1c1c; padding-bottom: 2px;"><a href="mailto:${email}" style="color: #1c1c1c; text-decoration: none;">${email}</a></td>
        </tr>
        <tr>
          <td style="font-size: 12px; color: #1c1c1c; padding-bottom: 8px;"><a href="https://www.genteq.be" style="color: #375d6f; text-decoration: none; font-weight: bold;">www.genteq.be</a></td>
        </tr>
        <tr>
          <td style="font-size: 11px; color: #6b6b6b; line-height: 1.5;">Kleinstraat 13, 3500 Hasselt</td>
        </tr>
      </table>
    </td>
  </tr>
</table>`
}

function stripTags(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

type CopyState = 'idle' | 'copied' | 'error'

const cellBase: React.CSSProperties = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  color: '#1c1c1c',
  fontSize: 13,
  lineHeight: 1.5,
}

function PreviewBlock({ fields }: { fields: Fields }) {
  return (
    <table cellPadding={0} cellSpacing={0} style={cellBase}>
      <tbody>
        <tr>
          <td
            style={{
              paddingRight: 18,
              verticalAlign: 'top',
              borderRight: '2px solid #375d6f',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_URL}
              alt="GENTEQ"
              width={180}
              height={29}
              style={{ display: 'block', border: 0 }}
            />
          </td>
          <td style={{ paddingLeft: 18, verticalAlign: 'top' }}>
            <table cellPadding={0} cellSpacing={0} style={cellBase}>
              <tbody>
                <tr>
                  <td style={{ fontSize: 15, fontWeight: 'bold', paddingBottom: 2 }}>
                    {fields.name || ' '}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      fontSize: 12,
                      color: '#375d6f',
                      paddingBottom: 8,
                      letterSpacing: 0.3,
                    }}
                  >
                    {fields.role || ' '}
                  </td>
                </tr>
                <tr>
                  <td style={{ fontSize: 12, paddingBottom: 2 }}>
                    <a
                      href={phoneHref(fields.phone)}
                      style={{ color: '#1c1c1c', textDecoration: 'none' }}
                    >
                      {fields.phone || ' '}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style={{ fontSize: 12, paddingBottom: 2 }}>
                    <a
                      href={`mailto:${fields.email}`}
                      style={{ color: '#1c1c1c', textDecoration: 'none' }}
                    >
                      {fields.email || ' '}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style={{ fontSize: 12, paddingBottom: 8 }}>
                    <a
                      href="https://www.genteq.be"
                      style={{
                        color: '#375d6f',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                      }}
                    >
                      www.genteq.be
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style={{ fontSize: 11, color: '#6b6b6b' }}>Kleinstraat 13, 3500 Hasselt</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export function SignatureGenerator() {
  const [fields, setFields] = useState<Fields>(DEFAULTS)
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const url = new URL(window.location.href)
    const params = url.searchParams
    const fromUrl: Partial<Fields> = {}
    for (const key of ['name', 'role', 'phone', 'email'] as const) {
      const v = params.get(key)
      if (v) fromUrl[key] = v
    }

    let stored: Partial<Fields> = {}
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) stored = JSON.parse(raw) as Partial<Fields>
    } catch {
      // ignore
    }

    setFields({ ...DEFAULTS, ...stored, ...fromUrl })
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fields))
    } catch {
      // ignore (private mode etc)
    }
  }, [fields, hydrated])

  const html = useMemo(() => buildHtml(fields), [fields])

  function update<K extends keyof Fields>(key: K, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }))
  }

  function reset() {
    setFields(DEFAULTS)
  }

  async function copy() {
    try {
      const item = new ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([stripTags(html)], { type: 'text/plain' }),
      })
      await navigator.clipboard.write([item])
      setCopyState('copied')
      setTimeout(() => setCopyState('idle'), 2500)
    } catch {
      setCopyState('error')
      setTimeout(() => setCopyState('idle'), 3500)
    }
  }

  const copyLabel =
    copyState === 'copied'
      ? '✓ Gekopieerd — plak nu in Outlook'
      : copyState === 'error'
        ? 'Kopiëren mislukt — selecteer handmatig hieronder'
        : 'Kopieer handtekening'

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div
        style={{
          background: '#fff',
          padding: '24px 28px',
          borderRadius: 6,
          border: '1px solid #e5e5e5',
        }}
      >
        <h2
          style={{
            fontSize: 14,
            textTransform: 'uppercase',
            letterSpacing: 1,
            margin: '0 0 16px',
            color: '#375d6f',
          }}
        >
          Vul je gegevens in
        </h2>
        <div style={{ display: 'grid', gap: 14 }}>
          <Field
            label="Naam"
            value={fields.name}
            onChange={(v) => update('name', v)}
            placeholder="Voornaam Achternaam"
          />
          <Field
            label="Functie"
            value={fields.role}
            onChange={(v) => update('role', v)}
            placeholder="Bv. Sales Manager"
          />
          <Field
            label="Telefoon"
            value={fields.phone}
            onChange={(v) => update('phone', v)}
            placeholder="+32 ..."
            inputMode="tel"
          />
          <Field
            label="E-mail"
            value={fields.email}
            onChange={(v) => update('email', v)}
            placeholder="naam@genteq.be"
            type="email"
          />
        </div>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: 16,
            background: 'transparent',
            border: 'none',
            color: '#888',
            fontSize: 12,
            cursor: 'pointer',
            padding: 0,
            textDecoration: 'underline',
            fontFamily: 'inherit',
          }}
        >
          Standaardwaarden herstellen
        </button>
      </div>

      <div
        style={{
          background: '#fff',
          padding: '24px 28px',
          borderRadius: 6,
          border: '1px solid #e5e5e5',
          fontSize: 14,
          lineHeight: 1.6,
        }}
      >
        <p style={{ margin: '0 0 16px' }}>
          Klik op de knop om de handtekening te kopiëren. Open daarna Outlook →{' '}
          <strong>Voorkeuren / Instellingen</strong> → <strong>Handtekeningen</strong>, maak een
          nieuwe handtekening aan en plak met <strong>Cmd+V</strong> (Mac) of{' '}
          <strong>Ctrl+V</strong> (Windows). Stel &apos;m in als standaard voor nieuwe mails én
          antwoorden.
        </p>
        <button
          type="button"
          onClick={copy}
          style={{
            background: copyState === 'copied' ? '#375d6f' : '#1c1c1c',
            color: '#fff',
            border: 'none',
            padding: '12px 20px',
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 4,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'background 150ms ease',
          }}
        >
          {copyLabel}
        </button>
      </div>

      <div
        style={{
          background: '#fff',
          padding: 32,
          borderRadius: 6,
          border: '1px dashed #375d6f',
        }}
      >
        <div
          style={{
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: 1,
            color: '#888',
            marginBottom: 16,
          }}
        >
          Voorbeeld
        </div>
        <PreviewBlock fields={fields} />
      </div>
    </div>
  )
}

type FieldProps = {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  inputMode?: 'text' | 'tel' | 'email'
}

function Field({ label, value, onChange, placeholder, type = 'text', inputMode }: FieldProps) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span
        style={{
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: 0.6,
          color: '#666',
          fontWeight: 600,
        }}
      >
        {label}
      </span>
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: '10px 12px',
          border: '1px solid #d4d4d4',
          borderRadius: 4,
          fontSize: 14,
          fontFamily: 'inherit',
          color: '#1c1c1c',
          background: '#fafafa',
          outline: 'none',
        }}
      />
    </label>
  )
}
