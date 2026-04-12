'use client'

import { useEffect, useId, useRef } from 'react'

const LINE_COUNT = 28
const POINTS = 120
const SPEED = 0.0004
const SVG_WIDTH = 1440

function createPath(
  width: number,
  lineIndex: number,
  totalLines: number,
  time: number,
): string {
  const yBase = (lineIndex / totalLines) * 100
  const points: string[] = []

  for (let i = 0; i <= POINTS; i++) {
    const x = (i / POINTS) * width
    const normalizedX = i / POINTS

    const wave1 = Math.sin(normalizedX * 3 + time + lineIndex * 0.4) * 6
    const wave2 = Math.sin(normalizedX * 1.5 - time * 0.7 + lineIndex * 0.2) * 4
    const wave3 = Math.sin(normalizedX * 5 + time * 0.3 + lineIndex * 0.6) * 2

    const centerFade = Math.sin(normalizedX * Math.PI) * 0.8 + 0.2
    const y = yBase + (wave1 + wave2 + wave3) * centerFade

    points.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)
  }

  return points.join(' ')
}

export function WaveLines() {
  const id = useId()
  const gradientId = `vignette-${id}`
  const maskId = `vignette-mask-${id}`
  const svgRef = useRef<SVGSVGElement>(null)
  const frameRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (prefersReducedMotion.matches) return

    const paths = svg.querySelectorAll<SVGPathElement>('path')

    startTimeRef.current = 0

    function animate(timestamp: number) {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const time = (timestamp - startTimeRef.current) * SPEED

      paths.forEach((path, i) => {
        path.setAttribute('d', createPath(SVG_WIDTH, i, LINE_COUNT, time))
      })

      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  return (
    <div
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_WIDTH} 100`}
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <defs>
          <radialGradient id={gradientId} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id={maskId}>
            <rect width={SVG_WIDTH} height="100" fill={`url(#${gradientId})`} />
          </mask>
        </defs>

        <g mask={`url(#${maskId})`}>
          {Array.from({ length: LINE_COUNT }, (_, i) => {
            const centerDistance = Math.abs(i / LINE_COUNT - 0.5) * 2
            const opacity = 0.08 + (1 - centerDistance) * 0.22

            return (
              <path
                key={i}
                d={`M 0 ${(i / LINE_COUNT) * 100} L ${SVG_WIDTH} ${(i / LINE_COUNT) * 100}`}
                fill="none"
                stroke="var(--steel-blue)"
                strokeWidth="0.15"
                strokeOpacity={opacity}
              />
            )
          })}
        </g>
      </svg>
    </div>
  )
}
