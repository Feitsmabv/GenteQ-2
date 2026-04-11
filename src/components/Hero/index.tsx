'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePageFadeIn } from '@/hooks/useScrollFadeIn'
import { HeroSentinel } from '@/components/HeroSentinel'

interface HeroProps {
  titel?: string
  subtitel?: string
  mediaType?: 'geen' | 'afbeelding' | 'video'
  afbeeldingUrl?: string
  videoUrl?: string
}

export function Hero({ titel, subtitel, mediaType, afbeeldingUrl, videoUrl }: HeroProps) {
  const titleRef = usePageFadeIn<HTMLHeadingElement>({ delay: 0.2, blur: true })
  const subtextRef = usePageFadeIn<HTMLParagraphElement>({ delay: 0.5 })
  const ctaRef = usePageFadeIn<HTMLDivElement>({ delay: 0.8 })

  const hasMedia = (mediaType === 'afbeelding' && afbeeldingUrl) || (mediaType === 'video' && videoUrl)

  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-5 pb-24 pt-36 md:px-20">
      <HeroSentinel />
      {/* Achtergrond */}
      {mediaType === 'video' && videoUrl ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={videoUrl} type={videoUrl.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
        </video>
      ) : mediaType === 'afbeelding' && afbeeldingUrl ? (
        <Image
          src={afbeeldingUrl}
          alt="Hero achtergrond"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      ) : null}

      {/* Overlay voor leesbaarheid bij media */}
      {hasMedia ? (
        <div className="absolute inset-0 bg-brand-black/60" />
      ) : (
        <div className="absolute inset-0 bg-brand-black" />
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <h1
          ref={titleRef}
          className="max-w-4xl text-center font-heading text-5xl leading-tight text-white md:text-7xl md:leading-[84px] lg:text-[82px]"
        >
          {titel || 'Vind uw droomwoning.'}
        </h1>

        <p
          ref={subtextRef}
          className="mt-8 max-w-xl text-center text-[15px] leading-7 text-white/75 md:mt-16 md:text-[17px]"
        >
          {subtitel || 'Woningen met karakter, gebouwd voor nu en de volgende generaties.'}
        </p>

        <div ref={ctaRef} className="mt-8 flex flex-col gap-4 sm:flex-row md:mt-16">
          <Link
            href="/aanbod"
            className="btn-primary rounded-full bg-brand-gold px-8 py-4 text-center text-[15px] font-normal text-white"
          >
            Ontdek het aanbod
          </Link>
          <Link
            href="/contact"
            className="btn-outline rounded-full border-[1.5px] border-white/40 px-8 py-4 text-center text-[15px] font-normal text-white hover:border-white/70"
          >
            Download brochure
          </Link>
        </div>
      </div>
    </section>
  )
}
