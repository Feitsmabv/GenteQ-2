'use client'

import Link from 'next/link'
import { useState, useRef, useEffect, type FormEvent } from 'react'

type Subject = 'quote' | 'advice' | 'support' | 'other'

type FormState = {
  name: string
  email: string
  phone: string
  subject: Subject
  message: string
  website: string
}

type FieldErrors = Partial<Record<keyof FormState, string>>

type Props = {
  successTitle: string
  successMessage: string
  locale: string
  turnstileSiteKey?: string
}

const initial: FormState = {
  name: '',
  email: '',
  phone: '',
  subject: 'quote',
  message: '',
  website: '',
}

const subjectOptions: { value: Subject; label: string }[] = [
  { value: 'quote', label: 'Offerte aanvragen' },
  { value: 'advice', label: 'Advies / intake' },
  { value: 'support', label: 'Klantondersteuning' },
  { value: 'other', label: 'Overig' },
]

function validate(state: FormState): FieldErrors {
  const errors: FieldErrors = {}
  if (state.name.trim().length < 2) errors.name = 'Vul je naam in.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.trim()))
    errors.email = 'Vul een geldig e-mailadres in.'
  if (state.message.trim().length < 10)
    errors.message = 'Beschrijf kort je vraag (min. 10 tekens).'
  return errors
}

export function ContactForm({ successTitle, successMessage, locale, turnstileSiteKey }: Props) {
  const [state, setState] = useState<FormState>(initial)
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const startTime = useRef(Date.now())
  const successHeadingRef = useRef<HTMLHeadingElement>(null)
  const turnstileContainerRef = useRef<HTMLDivElement>(null)
  const turnstileWidgetId = useRef<string | null>(null)

  const errors = validate(state)

  useEffect(() => {
    if (submitted) {
      successHeadingRef.current?.focus()
    }
  }, [submitted])

  useEffect(() => {
    if (!turnstileSiteKey) return

    const scriptId = 'cf-turnstile-script'
    const render = () => {
      const container = turnstileContainerRef.current
      if (!container || !window.turnstile || turnstileWidgetId.current) return
      turnstileWidgetId.current = window.turnstile.render(container, {
        sitekey: turnstileSiteKey,
        theme: 'dark',
        callback: (token) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(null),
      })
    }

    if (window.turnstile) {
      render()
      return
    }
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
      script.async = true
      script.defer = true
      script.onload = render
      document.head.appendChild(script)
    } else {
      const interval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(interval)
          render()
        }
      }, 100)
      return () => clearInterval(interval)
    }
  }, [turnstileSiteKey])

  const resetTurnstile = () => {
    setTurnstileToken(null)
    if (window.turnstile && turnstileWidgetId.current) {
      window.turnstile.reset(turnstileWidgetId.current)
    }
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((s) => ({ ...s, [key]: value }))
  }

  function onBlur(key: keyof FormState) {
    setTouched((t) => ({ ...t, [key]: true }))
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setTouched({
      name: true,
      email: true,
      phone: true,
      subject: true,
      message: true,
    })
    if (Object.keys(errors).length > 0) {
      // Focus het eerste veld met een error zodat toetsenbord-gebruikers
      // meteen weten wat er mist.
      const first = (['name', 'email', 'message'] as const).find((k) => errors[k])
      if (first) document.getElementById(`cf-${first}`)?.focus()
      return
    }

    setSubmitting(true)
    setServerError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...state,
          locale,
          elapsedMs: Date.now() - startTime.current,
          turnstileToken,
        }),
      })
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(body.error || `Er ging iets mis (${res.status}).`)
      }
      setSubmitted(true)
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Er ging iets mis. Probeer het opnieuw.',
      )
      resetTurnstile()
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-steel-blue/20 text-steel-blue">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
            <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3
          ref={successHeadingRef}
          tabIndex={-1}
          className="text-xl font-semibold text-white outline-none"
        >
          {successTitle}
        </h3>
        <p className="text-sm leading-relaxed text-slate-light">{successMessage}</p>
      </div>
    )
  }

  const show = (key: keyof FormState) => touched[key] && errors[key]

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm md:p-8"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Naam"
          error={show('name') ? errors.name : undefined}
          htmlFor="cf-name"
        >
          {(ids) => (
            <input
              id="cf-name"
              type="text"
              autoComplete="name"
              required
              value={state.name}
              onChange={(e) => update('name', e.target.value)}
              onBlur={() => onBlur('name')}
              aria-invalid={show('name') ? true : undefined}
              aria-describedby={ids}
              className={inputClass(Boolean(show('name')))}
            />
          )}
        </Field>
        <Field
          label="E-mailadres"
          error={show('email') ? errors.email : undefined}
          htmlFor="cf-email"
        >
          {(ids) => (
            <input
              id="cf-email"
              type="email"
              autoComplete="email"
              required
              value={state.email}
              onChange={(e) => update('email', e.target.value)}
              onBlur={() => onBlur('email')}
              aria-invalid={show('email') ? true : undefined}
              aria-describedby={ids}
              className={inputClass(Boolean(show('email')))}
            />
          )}
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Telefoon (optioneel)" htmlFor="cf-phone">
          {() => (
            <input
              id="cf-phone"
              type="tel"
              autoComplete="tel"
              value={state.phone}
              onChange={(e) => update('phone', e.target.value)}
              onBlur={() => onBlur('phone')}
              className={inputClass(false)}
            />
          )}
        </Field>
        <Field label="Onderwerp" htmlFor="cf-subject">
          {() => (
            <div className="relative">
              <select
                id="cf-subject"
                value={state.subject}
                onChange={(e) => update('subject', e.target.value as Subject)}
                className={`${inputClass(false)} appearance-none pr-10`}
              >
                {subjectOptions.map((o) => (
                  <option key={o.value} value={o.value} className="bg-carbon-black">
                    {o.label}
                  </option>
                ))}
              </select>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-light"
                aria-hidden
              >
                <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </Field>
      </div>

      <Field
        label="Bericht"
        error={show('message') ? errors.message : undefined}
        htmlFor="cf-message"
      >
        {(ids) => (
          <textarea
            id="cf-message"
            required
            rows={6}
            value={state.message}
            onChange={(e) => update('message', e.target.value)}
            onBlur={() => onBlur('message')}
            aria-invalid={show('message') ? true : undefined}
            aria-describedby={ids}
            className={`${inputClass(Boolean(show('message')))} min-h-[140px] resize-y`}
          />
        )}
      </Field>

      {/* Honeypot — onzichtbaar voor echte gebruikers */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input
          id="cf-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={state.website}
          onChange={(e) => update('website', e.target.value)}
        />
      </div>

      {turnstileSiteKey && (
        <div ref={turnstileContainerRef} className="flex justify-start" />
      )}

      {serverError && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-error/50 bg-error/10 px-4 py-3 text-sm text-white"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 h-4 w-4 shrink-0 text-error" aria-hidden>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4" strokeLinecap="round" />
            <circle cx="12" cy="16" r="0.5" fill="currentColor" />
          </svg>
          {serverError}
        </p>
      )}

      <div className="flex flex-col items-start gap-3 pt-2 md:flex-row md:items-center md:justify-between md:gap-6">
        <p className="max-w-xs text-xs text-slate-light/70">
          Door te versturen ga je akkoord met onze{' '}
          <Link href="/privacy" className="underline hover:text-white">
            privacyverklaring
          </Link>
          .
        </p>
        <button
          type="submit"
          aria-busy={submitting || undefined}
          disabled={submitting || (Boolean(turnstileSiteKey) && !turnstileToken)}
          className="btn-primary shrink-0 rounded-full bg-steel-blue px-6 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" aria-hidden>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.25" />
                <path d="M21 12a9 9 0 0 1-9 9" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
              Versturen…
            </span>
          ) : (
            'Verstuur'
          )}
        </button>
      </div>
    </form>
  )
}

function inputClass(hasError: boolean) {
  return [
    'w-full rounded-xl border bg-white/[0.02] px-4 py-3 text-sm text-white placeholder:text-slate-light/50',
    'transition-colors focus:outline-none focus:ring-2 focus:ring-steel-blue/60 focus:ring-offset-0',
    hasError ? 'border-error/70 focus:ring-error/40' : 'border-white/10 focus:border-steel-blue/60',
  ].join(' ')
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  children: (describedByIds: string | undefined) => React.ReactNode
}) {
  const errorId = error ? `${htmlFor}-error` : undefined
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-medium uppercase tracking-[1.5px] text-slate-light">
        {label}
      </label>
      {children(errorId)}
      {error && (
        <p id={errorId} className="flex items-center gap-1.5 text-xs text-error">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 shrink-0" aria-hidden>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4" strokeLinecap="round" />
            <circle cx="12" cy="16" r="0.5" fill="currentColor" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}
