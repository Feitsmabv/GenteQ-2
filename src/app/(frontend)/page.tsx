import type { Metadata } from 'next'
import { WaveLines } from '@/components/WaveLines'

export const metadata: Metadata = {
  title: 'GenteQ | Energieoplossingen, Vereenvoudigd',
  description: 'B2B energieoplossingen die complexiteit doorbreken. Slimme energie, zonder gedoe.',
}

export default function Home() {
  return (
    <main
      id="main-content"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-carbon-black px-6"
    >
      <WaveLines />

      <div className="relative z-10 flex max-w-lg flex-col items-center text-center">
        <span className="text-[11px] font-medium uppercase tracking-[4px] text-steel-blue">
          Coming Soon
        </span>

        <h1 className="mt-8 text-5xl font-bold tracking-[2px] text-white md:text-7xl">
          GenteQ
        </h1>

        <p className="mt-5 text-base font-light leading-7 text-slate-light">
          Energieoplossingen.
        </p>
      </div>
    </main>
  )
}
