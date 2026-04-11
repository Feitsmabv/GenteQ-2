'use client'

import { useState } from 'react'
import { useScrollFadeIn } from '@/hooks/useScrollFadeIn'
import type { Faq } from '@/payload-types'

interface FaqCategory {
  title: string
  items: { question: string; answer: string }[]
}

function FaqItem({ question, answer, isOpen, onToggle }: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div
      className="w-full rounded-lg transition-all duration-300"
      style={{
        backgroundColor: isOpen ? 'var(--brand-light)' : 'transparent',
        boxShadow: isOpen ? 'none' : 'inset 0 -1px 0 var(--brand-light)',
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between px-6 py-5"
      >
        <span className="text-left text-[17px] font-semibold text-brand-dark">{question}</span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke={isOpen ? '#9b6800' : '#1a1612'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <p className="px-6 pb-6 text-[15px] leading-[26px] text-brand-muted">{answer}</p>
        </div>
      </div>
    </div>
  )
}

function FaqCategoryBlock({ cat, catIndex, openKey, setOpenKey }: {
  cat: FaqCategory
  catIndex: number
  openKey: string | null
  setOpenKey: (key: string | null) => void
}) {
  const catRef = useScrollFadeIn<HTMLDivElement>({ stagger: 0.06, children: true })

  return (
    <div className={catIndex > 0 ? 'mt-14' : ''}>
      <h2 className="mb-6 text-xs font-medium tracking-[2.4px] text-brand-gold">
        {cat.title.toUpperCase()}
      </h2>
      <div ref={catRef} className="flex flex-col">
        {cat.items.map((item, i) => {
          const key = `${catIndex}-${i}`
          return (
            <FaqItem
              key={key}
              question={item.question}
              answer={item.answer}
              isOpen={openKey === key}
              onToggle={() => setOpenKey(openKey === key ? null : key)}
            />
          )
        })}
      </div>
    </div>
  )
}

const categoryLabels: Record<string, string> = {
  project: 'Over het project',
  woningen: 'Woningen & afwerking',
  praktisch: 'Praktisch & financieel',
}

interface FaqFullProps {
  items?: Faq[] | null
}

export function FaqFull({ items }: FaqFullProps) {
  const [openKey, setOpenKey] = useState<string | null>('0-0')

  if (!items || items.length === 0) {
    return (
      <section className="bg-white px-5 py-16 md:px-20 md:py-24">
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-lg font-semibold text-brand-dark">Nog geen veelgestelde vragen</p>
          <p className="text-sm text-brand-muted">Binnenkort vindt u hier antwoorden op de meest gestelde vragen.</p>
        </div>
      </section>
    )
  }

  const categories: FaqCategory[] = Object.entries(
    items.reduce((acc: Record<string, { question: string; answer: string }[]>, f) => {
      const cat = f.categorie
      if (!acc[cat]) acc[cat] = []
      acc[cat].push({ question: f.vraag, answer: f.antwoord })
      return acc
    }, {})
  ).map(([key, faqItems]) => ({
    title: categoryLabels[key] || key,
    items: faqItems,
  }))

  return (
    <section className="bg-white px-5 py-16 md:px-20 md:py-24">
      <div className="mx-auto max-w-[800px]">
        {categories.map((cat, catIndex) => (
          <FaqCategoryBlock
            key={`${cat.title}-${catIndex}`}
            cat={cat}
            catIndex={catIndex}
            openKey={openKey}
            setOpenKey={setOpenKey}
          />
        ))}
      </div>
    </section>
  )
}
