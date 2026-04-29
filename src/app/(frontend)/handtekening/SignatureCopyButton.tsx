'use client'

import { useState } from 'react'

type State = 'idle' | 'copied' | 'error'

export function SignatureCopyButton({ html }: { html: string }) {
  const [state, setState] = useState<State>('idle')

  async function copy() {
    try {
      const blob = new Blob([html], { type: 'text/html' })
      const text = new Blob([stripTags(html)], { type: 'text/plain' })
      const item = new ClipboardItem({
        'text/html': blob,
        'text/plain': text,
      })
      await navigator.clipboard.write([item])
      setState('copied')
      setTimeout(() => setState('idle'), 2500)
    } catch {
      setState('error')
      setTimeout(() => setState('idle'), 3500)
    }
  }

  const label =
    state === 'copied'
      ? '✓ Gekopieerd — plak nu in Outlook'
      : state === 'error'
        ? 'Kopiëren mislukt — selecteer handmatig hieronder'
        : 'Kopieer handtekening'

  return (
    <button
      type="button"
      onClick={copy}
      style={{
        background: state === 'copied' ? '#375d6f' : '#1c1c1c',
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
      {label}
    </button>
  )
}

function stripTags(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}
