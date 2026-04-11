'use client'

import Link from 'next/link'
import Image from 'next/image'
import { SectionLabel } from '@/components/SectionLabel'
import { useScrollFadeIn } from '@/hooks/useScrollFadeIn'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

interface IntroSectionProps {
  titel?: string
  tekst?: SerializedEditorState | null
  afbeeldingUrl?: string
}

export function IntroSection({ titel, tekst, afbeeldingUrl }: IntroSectionProps) {
  const labelRef = useScrollFadeIn<HTMLDivElement>()
  const textRef = useScrollFadeIn<HTMLDivElement>({ delay: 0.15 })
  const imageRef = useScrollFadeIn<HTMLDivElement>({ delay: 0.3 })

  return (
    <section className="rounded-t-[20px] bg-brand-light px-5 py-16 md:px-20 md:py-24">
      <div ref={labelRef} className="flex justify-center">
        <SectionLabel label="OVER DIT PROJECT" />
      </div>

      <div className="mt-16 flex flex-col gap-12 lg:flex-row lg:gap-20">
        <div ref={textRef} className="flex flex-1 flex-col gap-7">
          <h2 className="font-heading text-[32px] leading-[42px] text-brand-dark md:text-[40px] md:leading-[50px]">
            {titel || 'Wonen waar alles samenkomt'}
          </h2>

          {tekst && (
            <div className="prose prose-base max-w-none text-left text-brand-muted [&_*]:text-left">
              <RichText data={tekst} />
            </div>
          )}

          <Link
            href="/aanbod"
            className="arrow-link text-[15px] font-semibold text-brand-gold hover:opacity-80"
          >
            Ontdek het aanbod <span className="arrow-slide">→</span>
          </Link>
        </div>

        <div
          ref={imageRef}
          className="relative flex-1 overflow-hidden rounded-2xl bg-white min-h-[320px] lg:min-h-[420px]"
        >
          {afbeeldingUrl ? (
            <Image
              src={afbeeldingUrl}
              alt={titel || 'Project render'}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-sm font-medium text-[#9b9288]">Project render</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
