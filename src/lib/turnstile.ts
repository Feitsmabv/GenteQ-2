const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY

  // Lokaal ontwikkelen zonder keys: alleen door als SKIP_TURNSTILE expliciet aan staat.
  // Anders fail-closed, ook in dev — dan merk je meteen dat je env mist.
  if (!secret) {
    if (process.env.NODE_ENV !== 'production' && process.env.SKIP_TURNSTILE === '1') {
      return true
    }
    return false
  }

  const res = await fetch(VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token }),
  })

  const data = await res.json()
  return data.success === true
}
