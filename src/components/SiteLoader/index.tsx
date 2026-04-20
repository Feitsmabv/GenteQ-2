'use client'

import { useEffect, useState } from 'react'

const FALLBACK_TIMEOUT_MS = 6000
const MIN_DISPLAY_MS = 2000

export function SiteLoader() {
  const [hidden, setHidden] = useState(false)
  const [unmounted, setUnmounted] = useState(false)

  useEffect(() => {
    const mountedAt = performance.now()
    let timeoutId: number | undefined

    const hide = () => {
      const elapsed = performance.now() - mountedAt
      const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed)
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(() => setHidden(true), remaining)
    }

    window.addEventListener('spline:loaded', hide)
    const fallback = window.setTimeout(hide, FALLBACK_TIMEOUT_MS)
    return () => {
      window.removeEventListener('spline:loaded', hide)
      window.clearTimeout(fallback)
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    if (!hidden) return
    document.documentElement.dataset.siteReady = 'true'
    const t = window.setTimeout(() => setUnmounted(true), 600)
    return () => window.clearTimeout(t)
  }, [hidden])

  useEffect(() => {
    return () => {
      delete document.documentElement.dataset.siteReady
    }
  }, [])

  useEffect(() => {
    if (unmounted) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [unmounted])

  if (unmounted) return null

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-carbon-black transition-opacity duration-500 ${
        hidden ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <svg
        viewBox="0 0 120 80"
        width="96"
        height="64"
        role="img"
        aria-label="GenteQ loading"
        style={{ ['--gq-path-length' as string]: '420' }}
      >
        <path
          className="gq-loader-path"
          d="M82.8,86l-31.1-31.2h19.6l31.1,31.2h-19.6ZM86.6,34.3v-13.8H19.1v65.2h47.7s-13.8-13.8-13.8-13.8h-20.1v-37.5h53.6,0Z"
          transform="translate(8 -14)"
        />
      </svg>
    </div>
  )
}
