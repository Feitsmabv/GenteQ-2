'use client'

// Custom global error boundary om de Next.js 16.2.1 prerender bug
// ('Invariant: Expected workStore to be initialized') te omzeilen.
// De default _global-error page faalt tijdens static export onder Turbopack.
// Onze eigen variant is een client component zonder server context, dus
// raakt de bug niet en buildt schoon.

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="nl">
      <body>
        <div
          style={{
            display: 'flex',
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            fontFamily: 'system-ui, sans-serif',
            background: '#fafafa',
            color: '#171717',
          }}
        >
          <div style={{ maxWidth: '480px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.75rem' }}>
              Er ging iets mis
            </h1>
            <p style={{ color: '#525252', marginBottom: '1.5rem' }}>
              Er is een onverwachte fout opgetreden. Probeer de pagina opnieuw te laden.
            </p>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                padding: '0.625rem 1.25rem',
                background: '#171717',
                color: '#ffffff',
                border: 0,
                borderRadius: '9999px',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Probeer opnieuw
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
