'use client'

import type { Application } from '@splinetool/runtime'
import { Suspense, lazy, useEffect, useRef, useState } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineBackgroundProps {
  scene: string
  fallbackImage?: string
  className?: string
}

/**
 * Onder dit deel in beeld staat de scène stil. Een smalle strook bovenaan,
 * terwijl de bezoeker naar iets anders kijkt, hoeft niet te bewegen.
 */
const MIN_VISIBLE_RATIO = 0.15

export function SplineBackground({ scene, fallbackImage, className }: SplineBackgroundProps) {
  const [loaded, setLoaded] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<Application | null>(null)
  const visibleRef = useRef(true)

  // Pauzeer de 3D-scène zodra ze uit beeld is. Anders tekent ze op volle snelheid
  // door en concurreert ze met video en scrollen lager op de pagina (haperingen).
  // Gestopt blijft het laatste beeld gewoon op het canvas staan.
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio > MIN_VISIBLE_RATIO
        visibleRef.current = visible
        const app = appRef.current
        if (!app) return
        if (visible) {
          if (app.isStopped) app.play()
        } else if (!app.isStopped) {
          app.stop()
        }
      },
      { threshold: [0, MIN_VISIBLE_RATIO, MIN_VISIBLE_RATIO + 0.01] },
    )
    observer.observe(wrapper)
    return () => observer.disconnect()
  }, [])

  const handleLoad = (app: Application) => {
    appRef.current = app
    if (!visibleRef.current) app.stop()
    setLoaded(true)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('spline:loaded'))
    }
  }

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className ?? ''}`}
    >
      {fallbackImage && (
        <img
          src={fallbackImage}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            loaded ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}
      <Suspense fallback={null}>
        <Spline
          scene={scene}
          onLoad={handleLoad}
          style={{
            width: '100%',
            height: '100%',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.7s ease',
          }}
        />
      </Suspense>
    </div>
  )
}
