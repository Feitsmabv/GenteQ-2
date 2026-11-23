'use client'

import { useRef } from 'react'

interface ScrollCueProps {
  label: string
  /** Verschijnt na de rest van de hero, in hetzelfde ritme als titel en knoppen. */
  delayMs: number
}

/**
 * Pijl onderaan de hero: laat zien dat er meer komt en scrolt naar het volgende blok.
 * Zoekt dat blok zelf (de volgende sectie na de hero), dus er zijn geen ankers of ids nodig.
 */
export function ScrollCue({ label, delayMs }: ScrollCueProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const scrollToNext = () => {
    const next = buttonRef.current?.closest('section')?.nextElementSibling
    if (!(next instanceof HTMLElement)) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    next.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' })
  }

  return (
    <div className="scroll-cue hero-fade-in" style={{ ['--word-delay' as string]: `${delayMs}ms` }}>
      <button
        ref={buttonRef}
        type="button"
        className="scroll-cue__button"
        onClick={scrollToNext}
        aria-label={label}
      >
        <svg
          className="scroll-cue__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 5v13M6.5 12.5 12 18l5.5-5.5" />
        </svg>
      </button>
    </div>
  )
}
