import type { Metadata } from 'next'
import { SignatureCopyButton } from './SignatureCopyButton'
import { SignatureBlock, SIGNATURE_HTML } from './signature'

export const metadata: Metadata = {
  title: 'E-mailhandtekening — GENTEQ',
  robots: { index: false, follow: false },
}

export default function HandtekeningPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#f4f4f4',
        padding: '48px 24px',
        fontFamily: 'var(--font-poppins), Arial, sans-serif',
        color: '#1c1c1c',
      }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div
          style={{
            background: '#fff',
            padding: '24px 28px',
            borderRadius: 6,
            border: '1px solid #e5e5e5',
            marginBottom: 20,
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          <h1 style={{ fontSize: 20, margin: '0 0 12px', color: '#375d6f' }}>
            E-mailhandtekening
          </h1>
          <p style={{ margin: '0 0 16px' }}>
            Klik op de knop om de handtekening te kopiëren. Open daarna Outlook → <strong>Voorkeuren / Instellingen</strong> → <strong>Handtekeningen</strong>, maak een nieuwe handtekening aan en plak met <strong>Cmd+V</strong> (Mac) of <strong>Ctrl+V</strong> (Windows). Stel &apos;m in als standaard voor nieuwe mails én antwoorden.
          </p>
          <SignatureCopyButton html={SIGNATURE_HTML} />
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
          <SignatureBlock />
        </div>
      </div>
    </main>
  )
}
