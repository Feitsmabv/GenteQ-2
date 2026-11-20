'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { FullscreenIcon, PauseIcon, PlayIcon, SoundOffIcon, SoundOnIcon } from './icons'

export interface VideoLabels {
  region: string
  play: string
  pause: string
  soundOn: string
  soundOff: string
  fullscreen: string
  progress: string
}

/** Safari op de iPhone kent geen requestFullscreen, wel een eigen volledig scherm voor video. */
type VideoWithWebkit = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void
  webkitDisplayingFullscreen?: boolean
}

function isFullscreen(video: VideoWithWebkit): boolean {
  return document.fullscreenElement === video || video.webkitDisplayingFullscreen === true
}

interface FullscreenVideoPlayerProps {
  title?: string
  src: string
  srcMobile?: string
  poster?: string
  labels: VideoLabels
}

/** Vanaf dit deel in beeld start de video, onder het tweede deel pauzeert hij. */
const PLAY_RATIO = 0.6
const PAUSE_RATIO = 0.35
const SEEK_STEP_SECONDS = 5
/** Grote schermen krijgen de 1080p-versie, de rest de lichtere 720p-versie. */
const DESKTOP_QUERY = '(min-width: 768px)'

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const whole = Math.floor(seconds)
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`
}

export function FullscreenVideoPlayer({
  title,
  src,
  srcMobile,
  poster,
  labels,
}: FullscreenVideoPlayerProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fillRef = useRef<HTMLSpanElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  /** Heeft de bezoeker zelf op pauze gedrukt? Dan start scrollen de video niet opnieuw. */
  const pausedByUser = useRef(false)

  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)

  const play = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    // Weigert de browser een start met geluid, dan probeert hij het stil;
    // lukt ook dat niet, dan blijft de afspeelknop staan.
    video.play().catch(() => {
      if (video.muted) {
        setPlaying(false)
        return
      }
      video.muted = true
      video.play().catch(() => setPlaying(false))
    })
  }, [])

  // Houd de knoppen gelijk met wat de video echt doet.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onVolume = () => setMuted(video.muted)
    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    video.addEventListener('volumechange', onVolume)
    return () => {
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('volumechange', onVolume)
    }
  }, [])

  // Start zodra het blok grotendeels in beeld is, pauzeer wanneer het wegscrolt.
  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    if (!section || !video) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData ===
      true
    const mayAutoplay = !reducedMotion && !saveData

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= PLAY_RATIO) {
          // Start stil (de video begint muted); wie zelf geluid aanzette, hoort het weer bij terugkomen.
          if (mayAutoplay && !pausedByUser.current && video.paused) play()
        } else if (entry.intersectionRatio < PAUSE_RATIO && !video.paused && !isFullscreen(video)) {
          // Niet pauzeren in volledig scherm: draaien naar liggend verschuift de pagina eronder.
          video.pause()
        }
      },
      { threshold: [0, PAUSE_RATIO, PLAY_RATIO, 1] },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [play])

  // In volledig scherm gebruikt de browser zijn eigen bediening; daarna weer de onze.
  useEffect(() => {
    const onChange = () => {
      const video = videoRef.current
      if (video && document.fullscreenElement !== video) video.controls = false
    }
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  // Voortgangslijn: rechtstreeks op het element, zonder React opnieuw te laten tekenen.
  // Per beeld alleen de lijn zelf; de tekst voor schermlezers volgt met timeupdate (±4× per seconde).
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    let frame = 0

    const ratioNow = () => {
      const duration = video.duration
      return duration > 0 ? Math.min(video.currentTime / duration, 1) : 0
    }
    const paintLine = () => {
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${ratioNow()})`
    }
    const announce = () => {
      const slider = sliderRef.current
      if (!slider) return
      slider.setAttribute('aria-valuenow', String(Math.round(ratioNow() * 100)))
      slider.setAttribute(
        'aria-valuetext',
        `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`,
      )
    }
    const paintAll = () => {
      paintLine()
      announce()
    }
    const loop = () => {
      paintLine()
      frame = requestAnimationFrame(loop)
    }
    const start = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      paintAll()
    }

    video.addEventListener('play', start)
    video.addEventListener('pause', stop)
    video.addEventListener('timeupdate', announce)
    video.addEventListener('seeked', paintAll)
    video.addEventListener('loadedmetadata', paintAll)
    return () => {
      cancelAnimationFrame(frame)
      video.removeEventListener('play', start)
      video.removeEventListener('pause', stop)
      video.removeEventListener('timeupdate', announce)
      video.removeEventListener('seeked', paintAll)
      video.removeEventListener('loadedmetadata', paintAll)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      pausedByUser.current = false
      play()
    } else {
      pausedByUser.current = true
      video.pause()
    }
  }

  const toggleSound = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    if (!video.muted && video.paused) {
      pausedByUser.current = false
      play()
    }
  }

  const enterFullscreen = () => {
    const video = videoRef.current as VideoWithWebkit | null
    if (!video) return
    pausedByUser.current = false
    if (video.paused) play()
    if (typeof video.requestFullscreen === 'function') {
      video.controls = true
      video.requestFullscreen().catch(() => {
        video.controls = false
      })
    } else {
      video.webkitEnterFullscreen?.()
    }
  }

  const seekToRatio = (ratio: number) => {
    const video = videoRef.current
    if (!video || !(video.duration > 0)) return
    video.currentTime = Math.min(Math.max(ratio, 0), 1) * video.duration
  }

  // Een klik of tik, geen pointerdown: zo verspringt de video niet als iemand op de balk begint te scrollen.
  const onSliderClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    if (rect.width > 0) seekToRatio((event.clientX - rect.left) / rect.width)
  }

  const onSliderKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const video = videoRef.current
    if (!video || !(video.duration > 0)) return
    let target: number | null = null
    if (event.key === 'ArrowRight') target = video.currentTime + SEEK_STEP_SECONDS
    else if (event.key === 'ArrowLeft') target = video.currentTime - SEEK_STEP_SECONDS
    else if (event.key === 'Home') target = 0
    else if (event.key === 'End') target = video.duration
    if (target === null) return
    event.preventDefault()
    seekToRatio(target / video.duration)
  }

  return (
    <section ref={sectionRef} className="fsv" aria-label={title || labels.region}>
      <div className="fsv__box">
        {title && <h2 className="fsv__title">{title}</h2>}

        <div className="fsv__frame">
          {/* De browser kiest de bron zelf bij het laden; zonder lichtere versie krijgt iedereen 1080p. */}
          <video
            ref={videoRef}
            className="fsv__video"
            poster={poster}
            preload="none"
            muted
            loop
            playsInline
            onClick={togglePlay}
          >
            {srcMobile && <source src={src} type="video/mp4" media={DESKTOP_QUERY} />}
            <source src={srcMobile ?? src} type="video/mp4" />
          </video>
          <div className="fsv__shade" aria-hidden="true" />
          <div
            ref={sliderRef}
            className="fsv__progress"
            role="slider"
            tabIndex={0}
            aria-label={labels.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
            onClick={onSliderClick}
            onKeyDown={onSliderKey}
          >
            <span className="fsv__progress-track">
              <span ref={fillRef} className="fsv__progress-fill" />
            </span>
          </div>
        </div>

        <div className="fsv__controls">
          <button
            type="button"
            className="fsv__button"
            onClick={togglePlay}
            aria-label={playing ? labels.pause : labels.play}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button
            type="button"
            className="fsv__button fsv__button--label"
            onClick={toggleSound}
          >
            {muted ? <SoundOffIcon /> : <SoundOnIcon />}
            <span>{muted ? labels.soundOn : labels.soundOff}</span>
          </button>
          <button
            type="button"
            className="fsv__button"
            onClick={enterFullscreen}
            aria-label={labels.fullscreen}
          >
            <FullscreenIcon />
          </button>
        </div>
      </div>
    </section>
  )
}
