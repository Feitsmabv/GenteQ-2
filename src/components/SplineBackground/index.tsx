'use client'

import { Suspense, lazy, useState } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineBackgroundProps {
  scene: string
  fallbackImage?: string
  className?: string
}

export function SplineBackground({ scene, fallbackImage, className }: SplineBackgroundProps) {
  const [loaded, setLoaded] = useState(false)

  const handleLoad = () => {
    setLoaded(true)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('spline:loaded'))
    }
  }

  return (
    <div
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
