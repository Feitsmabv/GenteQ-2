'use client'

import Image from 'next/image'
import { useScrollFadeIn } from '@/hooks/useScrollFadeIn'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { ProjectSetting, Media } from '@/payload-types'

interface LocatieSectionProps {
  settings?: ProjectSetting | null
}

export function LocatieSection({ settings }: LocatieSectionProps) {
  const contentRef = useScrollFadeIn<HTMLDivElement>()
  const pillsRef = useScrollFadeIn<HTMLDivElement>({ stagger: 0.1, children: true, delay: 0.2 })

  const titel = settings?.locatieTitel || ''
  const tekst = settings?.locatieTekst
  const afstanden = (settings?.afstanden as { locatie: string; afstand: string }[]) || []
  const media = settings?.locatieAfbeelding as Media | null
  const mediaUrl = media?.url || ''
  const isVideo = media?.mimeType?.startsWith('video/')

  if (!titel && !tekst && afstanden.length === 0) return null

  return (
    <section id="locatie" className="flex flex-col bg-brand-light lg:flex-row">
      <div className="relative flex min-h-[280px] flex-1 items-center justify-center overflow-hidden bg-brand-dark md:min-h-[400px] lg:min-h-[600px]">
        {isVideo && mediaUrl ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={mediaUrl} type={media?.mimeType || 'video/mp4'} />
          </video>
        ) : mediaUrl ? (
          <Image
            src={mediaUrl}
            alt={titel || 'Locatie'}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <div className="flex size-20 items-center justify-center rounded-full border-2 border-white/30">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5.14v13.72a1 1 0 001.5.86l11-6.86a1 1 0 000-1.72l-11-6.86a1 1 0 00-1.5.86z" fill="white" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-6 p-8 md:p-16 lg:p-20">
        <div ref={contentRef} className="flex flex-col gap-6">
          <span className="text-xs font-medium tracking-[2.4px] text-brand-gold">LOCATIE</span>
          {titel && (
            <h2 className="font-heading text-[28px] leading-[38px] text-brand-dark md:text-[36px] md:leading-[46px]">
              {titel}
            </h2>
          )}
          {tekst && (
            <div className="prose prose-base max-w-none text-brand-muted">
              <RichText data={tekst} />
            </div>
          )}
        </div>

        {afstanden.length > 0 && (
          <div ref={pillsRef} className="flex flex-col gap-3 pt-2">
            {afstanden.map((item) => (
              <div key={item.locatie} className="flex items-center justify-between rounded-[10px] bg-white px-5 py-3.5">
                <span className="text-[15px] font-medium text-brand-dark">{item.locatie}</span>
                <span className="text-[15px] font-semibold text-brand-gold">{item.afstand}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
