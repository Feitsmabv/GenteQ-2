import type { Metadata } from 'next'
import { SignatureGenerator } from './SignatureGenerator'

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
        <h1 style={{ fontSize: 22, margin: '0 0 8px', color: '#375d6f' }}>E-mailhandtekening</h1>
        <p style={{ margin: '0 0 24px', fontSize: 14, color: '#555', lineHeight: 1.6 }}>
          Pas hieronder je naam, functie, telefoon en e-mailadres aan. Het voorbeeld update
          automatisch. Daarna kopieer je de handtekening en plak je &apos;m in Outlook.
        </p>
        <SignatureGenerator />
      </div>
    </main>
  )
}
