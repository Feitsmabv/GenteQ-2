import Image from 'next/image'
import Link from 'next/link'
import type { Page, Media } from '@/payload-types'
import { SplineBackground } from '@/components/SplineBackground'

type HeroBlock = Extract<NonNullable<Page['layout']>[number], { blockType: 'hero' }>

export function HeroBlock({
  variant,
  eyebrow,
  title,
  subtitle,
  media,
  splineScene,
  splineFallback,
  ctas,
}: HeroBlock) {
  const image = typeof media === 'object' && media !== null ? (media as Media) : null
  const fallback =
    typeof splineFallback === 'object' && splineFallback !== null
      ? (splineFallback as Media)
      : null
  const isSplit = variant === 'split'
  const isCentered = variant === 'centered' || !variant || variant === 'default'
  const hasSpline = typeof splineScene === 'string' && splineScene.trim().length > 0

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-carbon-black px-6 py-24">
      {hasSpline && (
        <SplineBackground
          scene={splineScene!}
          fallbackImage={fallback?.url ?? undefined}
        />
      )}
      <div
        className={`relative z-10 mx-auto flex max-w-6xl flex-col gap-10 ${
          isSplit ? 'md:flex-row md:items-center md:justify-between' : ''
        } ${isCentered ? 'items-center text-center' : ''}`}
      >
        <div
          className={`flex flex-col ${
            isSplit ? 'md:max-w-xl' : 'w-full max-w-4xl'
          } ${isCentered ? 'items-center' : ''}`}
        >
          {eyebrow && (
            <span className="text-[11px] font-medium uppercase tracking-[4px] text-steel-blue">
              {eyebrow}
            </span>
          )}
          <h1
            className={`text-4xl font-semibold leading-[1.1] tracking-tight text-white md:text-6xl ${
              eyebrow ? 'mt-6' : ''
            }`}
          >
            {(() => {
              const words = title.split(' ')
              return words.map((word, i) => (
                <span
                  key={i}
                  className="hero-title-word"
                  style={{ ['--word-delay' as string]: `${i * 90}ms` }}
                >
                  {word}
                  {i < words.length - 1 ? '\u00A0' : ''}
                </span>
              ))
            })()}
          </h1>
          {subtitle && (
            <p
              className="hero-fade-in mt-6 max-w-xl text-sm font-light leading-6 text-slate-light md:text-base md:leading-7"
              style={{
                ['--word-delay' as string]: `${title.split(' ').length * 90 + 200}ms`,
              }}
            >
              {subtitle}
            </p>
          )}
          {ctas && ctas.length > 0 && (
            <div
              className={`hero-fade-in mt-10 flex flex-wrap gap-3 ${isCentered ? 'justify-center' : ''}`}
              style={{
                ['--word-delay' as string]: `${title.split(' ').length * 90 + 450}ms`,
              }}
            >
              {ctas.map((cta, i) => {
                const base = 'rounded-full text-sm font-medium text-white'
                const variantClass =
                  cta.style === 'ghost'
                    ? 'btn-ghost border border-[rgba(200,222,237,0.3)] bg-white/[0.04] px-[22px] py-[14px] backdrop-blur-sm'
                    : cta.style === 'secondary'
                      ? 'btn-outline border border-white/30 px-6 py-3'
                      : 'btn-primary bg-steel-blue px-6 py-3'
                return (
                  <Link key={i} href={cta.url} className={`${base} ${variantClass}`}>
                    {cta.label}
                  </Link>
                )
              })}
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
