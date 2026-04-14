'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { usePageFadeIn } from '@/hooks/useScrollFadeIn'
import { defaultLocale, homePath, isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/getDictionary'

export default function NotFound() {
  const params = useParams<{ locale?: string }>()
  const locale = params?.locale && isLocale(params.locale) ? params.locale : defaultLocale
  const t = getDictionary(locale)
  const contentRef = usePageFadeIn<HTMLDivElement>({ delay: 0.2, blur: true })

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-brand-black px-5 pt-20">
      <div ref={contentRef} className="flex flex-col items-center gap-6 text-center">
        <span className="text-xs font-medium tracking-[2.4px] text-steel-blue">
          {t.notFound.label}
        </span>
        <h1 className="font-heading text-[80px] leading-none text-white md:text-[120px]">
          {t.notFound.title}
        </h1>
        <p className="max-w-md text-base leading-7 text-white/60">{t.notFound.description}</p>
        <div className="mt-4 flex gap-4">
          <Link
            href={homePath(locale)}
            className="btn-primary rounded-full bg-steel-blue px-8 py-4 text-[15px] font-normal text-white"
          >
            {t.notFound.homeCta}
          </Link>
        </div>
      </div>
    </div>
  )
}
