import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GenteQ',
  description: 'Coming soon.',
}

export default function Home() {
  return (
    <main id="main-content" className="flex min-h-screen items-center justify-center bg-neutral-50 px-5 py-32">
      <div className="max-w-xl text-center">
        <h1 className="font-heading text-5xl tracking-tight text-neutral-900 md:text-6xl">GenteQ</h1>
        <p className="mt-6 text-lg text-neutral-600">Coming soon.</p>
      </div>
    </main>
  )
}
