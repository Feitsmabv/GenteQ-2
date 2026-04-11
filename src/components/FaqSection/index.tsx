'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useScrollFadeIn } from '@/hooks/useScrollFadeIn'
import type { Faq } from '@/payload-types'

interface FaqItem {
  question: string
  answer: string
}

function FaqItemComponent({ item, isOpen, onToggle }: { item: FaqItem; isOpen: boolean; onToggle: () => void }) {
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
        className="flex w-full items-center justify-between px-4 py-5 md:px-6"
      >
        <span className="text-left text-[17px] font-semibold text-brand-dark">
          {item.question}
        </span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
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
      <div
        className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <p className="px-4 pb-5 text-[15px] leading-[26px] text-brand-muted md:px-6 md:pb-6">{item.answer}</p>
        </div>
      </div>
    </div>
  )
}

interface FaqSectionProps {
  items?: Faq[] | null
}

export function FaqSection({ items }: FaqSectionProps) {
  const mappedItems: FaqItem[] = items
    ? items.slice(0, 5).map((f) => ({ question: f.vraag, answer: f.antwoord }))
    : []

  const [openIndex, setOpenIndex] = useState(0)
  const headerRef = useScrollFadeIn<HTMLDivElement>()
  const itemsRef = useScrollFadeIn<HTMLDivElement>({ stagger: 0.08, children: true, delay: 0.15 })

  if (mappedItems.length === 0) return null

  return (
    <section className="bg-white px-5 py-16 md:px-20 md:py-24">
      <div className="mx-auto max-w-[800px]">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col items-center gap-3 text-center">
          <span className="text-xs font-medium tracking-[2.4px] text-brand-gold">
            VEELGESTELDE VRAGEN
          </span>
          <h2 className="font-heading text-[36px] text-brand-dark">Heeft u vragen?</h2>
          <p className="text-base text-brand-muted">
            Hier vindt u antwoorden op de meest gestelde vragen over het project.
          </p>
        </div>

        {/* FAQ Items */}
        <div ref={itemsRef} className="mt-12 flex flex-col">
          {mappedItems.map((item, i) => (
            <FaqItemComponent
              key={item.question}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/faq"
            className="btn-outline rounded-full border-[1.5px] border-brand-dark px-7 py-3.5 text-sm font-normal text-brand-dark hover:bg-brand-dark hover:text-white"
          >
            Bekijk alle vragen
          </Link>
        </div>
      </div>
    </section>
  )
}
