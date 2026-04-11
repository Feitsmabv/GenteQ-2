'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useScrollFadeIn, usePageFadeIn } from '@/hooks/useScrollFadeIn'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

interface NieuwsDetailProps {
  category: string
  categoryColor: string
  date: string
  title: string
  inhoud?: SerializedEditorState | null
  afbeeldingUrl?: string
}

export function NieuwsDetail({ category, categoryColor, date, title, inhoud, afbeeldingUrl }: NieuwsDetailProps) {
  const headerRef = usePageFadeIn<HTMLDivElement>({ delay: 0.1 })
  const contentRef = useScrollFadeIn<HTMLDivElement>()

  return (
    <>
      <article className="bg-white px-5 py-12 md:px-20 md:py-16">
        <div className="mx-auto max-w-[780px]">
          {/* Header */}
          <div ref={headerRef} className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <span className={`rounded-full px-3 py-1.5 text-xs font-semibold text-white ${categoryColor}`}>
                {category}
              </span>
              <span className="text-[13px] text-[#9b9288]">{date}</span>
            </div>
            <h1 className="font-heading text-[32px] leading-tight text-brand-dark md:text-[40px]">
              {title}
            </h1>
          </div>

          {/* Featured image */}
          {afbeeldingUrl ? (
            <div className="relative mt-8 h-[300px] overflow-hidden rounded-2xl md:h-[420px]">
              <Image
                src={afbeeldingUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 780px) 100vw, 780px"
              />
            </div>
          ) : (
            <div className="mt-8 h-[300px] rounded-2xl bg-[#f0eeea] md:h-[420px]" />
          )}

          {/* Content */}
          <div ref={contentRef} className="mt-10 prose prose-base max-w-none text-brand-dark/65">
            {inhoud ? (
              <RichText data={inhoud} />
            ) : (
              <p className="text-[15px] leading-[28px] text-brand-dark/65">Geen inhoud beschikbaar.</p>
            )}
          </div>

          {/* Back */}
          <div className="mt-12 flex items-center justify-between border-t border-brand-dark/10 pt-8">
            <Link
              href="/nieuws"
              className="btn-outline btn-no-arrow btn-back rounded-full border-[1.5px] border-brand-dark px-6 py-3 text-sm font-normal text-brand-dark hover:bg-brand-dark hover:text-white"
            >
              <span className="back-arrow mr-2">←</span>Terug naar nieuws
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}
