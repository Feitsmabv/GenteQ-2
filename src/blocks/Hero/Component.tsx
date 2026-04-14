import Image from 'next/image'
import Link from 'next/link'
import type { Page, Media } from '@/payload-types'

type HeroBlock = Extract<NonNullable<Page['layout']>[number], { blockType: 'hero' }>

export function HeroBlock({ variant, eyebrow, title, subtitle, media, ctas }: HeroBlock) {
  const image = typeof media === 'object' && media !== null ? (media as Media) : null
  const isSplit = variant === 'split'
  const isCentered = variant === 'centered' || !variant || variant === 'default'

  return (
    <section className="relative overflow-hidden bg-carbon-black px-6 py-24 md:py-32">
      <div
        className={`relative z-10 mx-auto flex max-w-6xl flex-col gap-10 ${
          isSplit ? 'md:flex-row md:items-center md:justify-between' : ''
        } ${isCentered ? 'items-center text-center' : ''}`}
      >
        <div className={`flex flex-col ${isSplit ? 'md:max-w-xl' : 'max-w-2xl'}`}>
          {eyebrow && (
            <span className="text-[11px] font-medium uppercase tracking-[4px] text-steel-blue">
              {eyebrow}
            </span>
          )}
          <h1 className="mt-6 text-5xl font-bold tracking-[1px] text-white md:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 text-base font-light leading-7 text-slate-light md:text-lg">
              {subtitle}
            </p>
          )}
          {ctas && ctas.length > 0 && (
            <div
              className={`mt-8 flex flex-wrap gap-3 ${isCentered ? 'justify-center' : ''}`}
            >
              {ctas.map((cta, i) => (
                <Link
                  key={i}
                  href={cta.url}
                  className={
                    cta.style === 'secondary'
                      ? 'inline-flex items-center rounded-full border border-white/30 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10'
                      : 'inline-flex items-center rounded-full bg-steel-blue px-6 py-3 text-sm font-medium text-white transition hover:opacity-90'
                  }
                >
                  {cta.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {image?.url && isSplit && (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl md:w-1/2">
            <Image
              src={image.url}
              alt={image.alt || ''}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        )}
      </div>
    </section>
  )
}
