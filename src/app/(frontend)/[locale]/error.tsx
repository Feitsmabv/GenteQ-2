'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-brand-black px-5 pt-20">
      <div className="flex flex-col items-center gap-6 text-center">
        <span className="text-xs font-medium tracking-[2.4px] text-steel-blue">FOUT</span>
        <h1 className="font-heading text-[80px] leading-none text-white md:text-[120px]">Oeps</h1>
        <p className="max-w-md text-base leading-7 text-white/60">
          Er ging iets mis bij het laden van deze pagina. Probeer het opnieuw.
        </p>
        <div className="mt-4 flex gap-4">
          <button
            onClick={reset}
            className="btn-primary rounded-full bg-steel-blue px-8 py-4 text-[15px] font-normal text-white"
          >
            Opnieuw proberen
          </button>
          <Link
            href="/"
            className="rounded-full border border-white/20 px-8 py-4 text-[15px] font-normal text-white"
          >
            Naar home
          </Link>
        </div>
      </div>
    </div>
  )
}
