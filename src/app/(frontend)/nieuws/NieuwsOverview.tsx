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

function FeaturedArticle({ article }: { article: Article }) {
  return (
    <Link href={article.href} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0px_4px_16px_-2px_rgba(0,0,0,0.05)] md:flex-row">
      <div className="relative min-h-[280px] overflow-hidden bg-[#f0eeea] p-4 md:w-1/2 md:min-h-[360px]">
        {article.image && (
          <Image
            src={article.image.url}
            alt={article.image.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        )}
        <span className={`relative inline-block rounded-full px-3 py-1.5 text-xs font-semibold text-white ${article.categoryColor}`}>
          {article.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-4 p-8 md:p-10">
        <span className="text-[13px] text-[#9b9288]">{article.date}</span>
        <h2 className="font-heading text-[28px] leading-tight text-brand-dark md:text-[32px]">
          {article.title}
        </h2>
        <p className="text-[15px] leading-[26px] text-brand-muted">
          {article.excerpt}
        </p>
        <span className="text-sm font-semibold text-brand-gold">
          Lees meer <span className="arrow-slide">→</span>
        </span>
      </div>
    </Link>
  )
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={article.href}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0px_4px_16px_-2px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0px_8px_24px_-4px_rgba(0,0,0,0.1)]"
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

function mapNieuws(n: Nieuw): Article {
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

interface NieuwsOverviewProps {
  artikelen?: Nieuw[] | null
}

export function NieuwsOverview({ artikelen }: NieuwsOverviewProps) {
  const featuredRef = useScrollFadeIn<HTMLDivElement>()
  const gridRef = useScrollFadeIn<HTMLDivElement>({ stagger: 0.12, children: true })

  const displayArticles = artikelen ? artikelen.map(mapNieuws) : []

  if (displayArticles.length === 0) {
    return (
      <section className="bg-brand-cream px-5 py-16 md:px-20 md:py-24">
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-lg font-semibold text-brand-dark">Nog geen nieuwsartikelen</p>
          <p className="text-sm text-brand-muted">Binnenkort verschijnen hier de laatste updates over het project.</p>
        </div>
      </section>
    )
  }

  const [featured, ...rest] = displayArticles

  return (
    <section className="bg-brand-cream px-5 py-16 md:px-20 md:py-24">
      {/* Featured */}
      <div ref={featuredRef}>
        <FeaturedArticle article={featured} />
      </div>

      {/* All articles */}
      {rest.length > 0 && (
        <>
          <h3 className="mt-16 text-xs font-medium tracking-[2.4px] text-brand-gold">ALLE ARTIKELEN</h3>
          <div ref={gridRef} className="mt-8 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((article) => (
              <ArticleCard key={article.href} article={article} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
