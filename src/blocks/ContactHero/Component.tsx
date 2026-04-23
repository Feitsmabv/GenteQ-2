import type { Page } from '@/payload-types'

type ContactHeroBlock = Extract<
  NonNullable<Page['layout']>[number],
  { blockType: 'contactHero' }
>

export function ContactHeroBlock({ eyebrow, title, subtitle }: ContactHeroBlock) {
  return (
    <section className="relative overflow-hidden bg-carbon-black px-6 pt-40 pb-16 md:pt-44 md:pb-20">
      <div className="pointer-events-none absolute inset-0">
        <div
          aria-hidden
          className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(closest-side, rgba(136,157,173,0.18), rgba(136,157,173,0) 70%)',
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage:
              'radial-gradient(ellipse at 50% 20%, black 40%, transparent 75%)',
            WebkitMaskImage:
              'radial-gradient(ellipse at 50% 20%, black 40%, transparent 75%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        {eyebrow && (
          <span className="hero-fade-in text-[11px] font-medium uppercase tracking-[4px] text-steel-blue">
            {eyebrow}
          </span>
        )}
        <h1
          className={`text-4xl font-semibold leading-[1.1] tracking-tight text-white md:text-6xl ${
            eyebrow ? 'mt-6' : ''
          }`}
        >
          {title.split(' ').map((word, i, arr) => (
            <span
              key={i}
              className="hero-title-word"
              style={{ ['--word-delay' as string]: `${i * 90}ms` }}
            >
              {word}
              {i < arr.length - 1 ? ' ' : ''}
            </span>
          ))}
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
      </div>
    </section>
  )
}
