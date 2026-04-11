'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useScrollFadeIn } from '@/hooks/useScrollFadeIn'
import type { Nieuw } from '@/payload-types'

interface Article {
  category: string
  categoryColor: string
  date: string
  title: string
  excerpt: string
  href: string
  image?: { url: string; alt: string } | null
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={article.href}
      className="group flex flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-[0px_4px_16px_-2px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0px_8px_24px_-4px_rgba(0,0,0,0.1)]"
    >
      <div className="relative h-[200px] overflow-hidden bg-[#f0eeea] p-4">
        {article.image && (
          <Image
            src={article.image.url}
            alt={article.image.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        )}
        <span className={`relative inline-block rounded-full px-3 py-1.5 text-xs font-semibold text-white ${article.categoryColor}`}>
          {article.category}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2.5 px-6 pb-6 pt-5">
        <span className="text-[13px] text-[#9b9288]">{article.date}</span>
        <h3 className="text-lg font-semibold leading-[26px] text-brand-dark">{article.title}</h3>
        <p className="text-sm leading-[22px] text-brand-muted">{article.excerpt}</p>
        <span className="text-sm font-semibold text-brand-gold">Lees meer <span className="arrow-slide">→</span></span>
      </div>
    </Link>
  )
}

const categorieColors: Record<string, string> = {
  bouwupdate: 'bg-[#2a5138]',
  evenement: 'bg-brand-gold',
  project: 'bg-[#734d2e]',
}

function mapNieuwsToArticle(n: Nieuw): Article {
  const cat = n.categorie
  const img = typeof n.afbeelding === 'object' && n.afbeelding && 'url' in n.afbeelding ? n.afbeelding : null
  return {
    category: cat.charAt(0).toUpperCase() + cat.slice(1),
    categoryColor: categorieColors[cat] || 'bg-brand-gold',
    date: new Date(n.datum).toLocaleDateString('nl-BE', { day: 'numeric', month: 'long', year: 'numeric' }),
    title: n.titel,
    excerpt: n.samenvatting,
    href: `/nieuws/${n.slug}`,
    image: img?.url ? { url: img.url, alt: img.alt || n.titel } : null,
  }
}

interface NieuwsSectionProps {
  artikelen?: Nieuw[] | null
}

export function NieuwsSection({ artikelen }: NieuwsSectionProps) {
  const headerRef = useScrollFadeIn<HTMLDivElement>()
  const cardsRef = useScrollFadeIn<HTMLDivElement>({ stagger: 0.15, children: true })
  const displayArticles = artikelen ? artikelen.slice(0, 3).map(mapNieuwsToArticle) : []

  if (displayArticles.length === 0) return null

  return (
    <section className="bg-brand-cream px-5 py-16 md:px-20 md:py-24">
      {/* Header */}
      <div ref={headerRef} className="flex items-end justify-between">
        <div className="flex flex-col gap-3">
          <span className="text-xs font-medium tracking-[2.4px] text-brand-gold">
            NIEUWS &amp; UPDATES
          </span>
          <h2 className="font-heading text-[36px] text-brand-dark">Laatste nieuws</h2>
        </div>

        <Link
          href="/nieuws"
          className="btn-outline hidden rounded-full border-[1.5px] border-brand-dark px-7 py-3.5 text-sm font-normal text-brand-dark hover:bg-brand-dark hover:text-white sm:block"
        >
          Alle artikelen
        </Link>
      </div>

      {/* Cards */}
      <div ref={cardsRef} className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {displayArticles.map((article) => (
          <ArticleCard key={article.href} article={article} />
        ))}
      </div>

      {/* Mobile CTA */}
      <div className="mt-8 flex justify-center sm:hidden">
        <Link
          href="/nieuws"
          className="btn-outline rounded-full border-[1.5px] border-brand-dark px-7 py-3.5 text-sm font-normal text-brand-dark hover:bg-brand-dark hover:text-white"
        >
          Alle artikelen
        </Link>
      </div>
    </section>
  )
}
