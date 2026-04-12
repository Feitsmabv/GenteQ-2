'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export function PageTransition() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setLoading(true)
    setProgress(70)

    const timer = setTimeout(() => {
      setProgress(100)
      setTimeout(() => {
        setLoading(false)
        setProgress(0)
      }, 200)
    }, 150)

    return () => clearTimeout(timer)
  }, [pathname])

  if (!loading && progress === 0) return null

  return (
    <div className="fixed left-0 right-0 top-0 z-[60] h-[2px]">
      <div
        className="h-full bg-steel-blue transition-all duration-300 ease-out"
        style={{ width: `${progress}%`, opacity: progress === 100 ? 0 : 1 }}
      />
    </div>
  )
}
