'use client'

import { usePageFadeIn } from '@/hooks/useScrollFadeIn'

interface LegalPageProps {
  label: string
  title: string
  lastUpdated: string
  sections: { heading: string; content: string }[]
}

export function LegalPage({ label, title, lastUpdated, sections }: LegalPageProps) {
  const ref = usePageFadeIn<HTMLDivElement>({ delay: 0.1 })

  return (
    <article className="bg-white px-5 pb-16 pt-32 md:px-20 md:pb-24">
      <div ref={ref} className="mx-auto max-w-[720px]">
        <span className="text-xs font-medium tracking-[2.4px] text-steel-blue">{label}</span>
        <h1 className="mt-4 font-heading text-[32px] text-brand-dark md:text-[40px]">{title}</h1>
        <p className="mt-2 text-sm text-brand-muted">Laatst bijgewerkt: {lastUpdated}</p>

        <div className="mt-12 flex flex-col gap-10">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-lg font-semibold text-brand-dark">{section.heading}</h2>
              <p className="mt-3 text-[15px] leading-[26px] text-brand-dark/65">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}
