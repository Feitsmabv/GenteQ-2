'use client'

import Link from 'next/link'
import { usePageFadeIn } from '@/hooks/useScrollFadeIn'

export default function NotFound() {
  const contentRef = usePageFadeIn<HTMLDivElement>({ delay: 0.2, blur: true })

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-brand-black px-5 pt-20">
      <div ref={contentRef} className="flex flex-col items-center gap-6 text-center">
        <span className="text-xs font-medium tracking-[2.4px] text-brand-gold">PAGINA NIET GEVONDEN</span>
        <h1 className="font-heading text-[80px] leading-none text-white md:text-[120px]">404</h1>
        <p className="max-w-md text-base leading-7 text-white/60">
          De pagina die u zoekt bestaat niet of is verplaatst. Ga terug naar de homepage om verder te zoeken.
        </p>
        <div className="mt-4 flex gap-4">
          <Link
            href="/"
            className="btn-primary rounded-full bg-brand-gold px-8 py-4 text-[15px] font-normal text-white"
          >
            Naar homepage
          </Link>
          <Link
            href="/contact"
            className="btn-outline rounded-full border-[1.5px] border-white/40 px-8 py-4 text-[15px] font-normal text-white hover:border-white/70"
          >
            Contact
          </Link>
        </div>
      </div>
    </div>
  )
}
