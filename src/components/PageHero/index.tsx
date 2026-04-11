'use client'

import Image from 'next/image'
import { usePageFadeIn } from '@/hooks/useScrollFadeIn'
import { HeroSentinel } from '@/components/HeroSentinel'

interface PageHeroProps {
  label: string
  title: string
  subtitle: string
  background?: {
    type?: 'kleur' | 'afbeelding'
    kleur?: string
    afbeeldingUrl?: string
  }
}

export function PageHero({ label, title, subtitle, background }: PageHeroProps) {
  const labelRef = usePageFadeIn<HTMLSpanElement>({ delay: 0.1 })
  const titleRef = usePageFadeIn<HTMLHeadingElement>({ delay: 0.3, blur: true })
  const subtitleRef = usePageFadeIn<HTMLParagraphElement>({ delay: 0.5 })

  const useImage = background?.type === 'afbeelding' && background.afbeeldingUrl
  const bgColor = background?.kleur || undefined

  return (
    <section
      className="relative flex flex-col items-center justify-center overflow-hidden px-5 py-20 pt-32 md:px-20"
      style={!useImage ? { backgroundColor: bgColor || '#1a1612' } : undefined}
    >
      <HeroSentinel />
      {useImage && (
        <>
          <Image
            src={background!.afbeeldingUrl!}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-brand-black/55" />
        </>
      )}
      <span ref={labelRef} className="relative z-10 text-xs font-medium tracking-[2.4px] text-[#c6a355]">
        {label}
      </span>
      <h1
        ref={titleRef}
        className="relative z-10 mt-5 max-w-3xl text-center font-heading text-4xl text-white md:text-[52px]"
      >
        {title}
      </h1>
      <p
        ref={subtitleRef}
        className="relative z-10 mt-5 max-w-[560px] text-center text-base leading-7 text-white/70"
      >
        {subtitle}
      </p>
    </section>
  )
}
