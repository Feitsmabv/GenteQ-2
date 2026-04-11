'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollFadeInOptions {
  y?: number
  duration?: number
  delay?: number
  stagger?: number
  children?: boolean
}

export function useScrollFadeIn<T extends HTMLElement>(options: ScrollFadeInOptions = {}) {
  const ref = useRef<T>(null)
  const { y = 30, duration = 0.8, delay = 0, stagger = 0, children = false } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const targets = children ? el.children : el
    const triggerId = `scroll-${Math.random().toString(36).slice(2)}`

    gsap.set(targets, { opacity: 0, y })

    const tween = gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: 'power2.out',
      stagger: stagger || undefined,
      scrollTrigger: {
        id: triggerId,
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    })

    return () => {
      tween.kill()
      const st = ScrollTrigger.getById(triggerId)
      if (st) st.kill()
    }
  }, [y, duration, delay, stagger, children])

  return ref
}

export function usePageFadeIn<T extends HTMLElement>(options: { delay?: number; blur?: boolean } = {}) {
  const ref = useRef<T>(null)
  const { delay = 0, blur = false } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    gsap.set(el, {
      opacity: 0,
      y: 20,
      ...(blur ? { filter: 'blur(12px)' } : {}),
    })

    const tween = gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: blur ? 1.4 : 0.9,
      delay,
      ease: 'power2.out',
      ...(blur ? { filter: 'blur(0px)' } : {}),
    })

    return () => {
      tween.kill()
    }
  }, [delay, blur])

  return ref
}
