'use client'

import { useEffect, useRef } from 'react'

const LINE_COUNT = 28
const POINTS = 120
const SPEED = 0.0004

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

    // Multiple sine waves layered for organic feel
    const wave1 = Math.sin(normalizedX * 3 + time + lineIndex * 0.4) * 6
    const wave2 = Math.sin(normalizedX * 1.5 - time * 0.7 + lineIndex * 0.2) * 4
    const wave3 = Math.sin(normalizedX * 5 + time * 0.3 + lineIndex * 0.6) * 2

    // More movement in the center, calmer at edges
    const centerFade = Math.sin(normalizedX * Math.PI) * 0.8 + 0.2

    const y = yBase + (wave1 + wave2 + wave3) * centerFade

    points.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)
  }

  return points.join(' ')
}

export function WaveLines() {
  const svgRef = useRef<SVGSVGElement>(null)
  const frameRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const paths = svg.querySelectorAll<SVGPathElement>('path')

    function animate(timestamp: number) {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const time = (timestamp - startTimeRef.current) * SPEED

      const width = svg!.viewBox.baseVal.width

      paths.forEach((path, i) => {
        path.setAttribute('d', createPath(width, i, LINE_COUNT, time))
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
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <defs>
          {/* Vignette: edges fade to black */}
          <radialGradient id="vignette" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="vignette-mask">
            <rect width="1440" height="100" fill="url(#vignette)" />
          </mask>
        </defs>

        <g mask="url(#vignette-mask)">
          {Array.from({ length: LINE_COUNT }, (_, i) => {
            // Gradient: lines closer to center are brighter (steel-blue),
            // lines at top/bottom are darker (graphite)
            const centerDistance = Math.abs(i / LINE_COUNT - 0.5) * 2
            const opacity = 0.08 + (1 - centerDistance) * 0.22

            return (
              <path
                key={i}
                d={`M 0 ${(i / LINE_COUNT) * 100} L 1440 ${(i / LINE_COUNT) * 100}`}
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
