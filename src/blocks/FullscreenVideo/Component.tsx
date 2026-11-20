import type { Media, Page } from '@/payload-types'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/getDictionary'
import { FullscreenVideoPlayer } from './Player.client'

type FullscreenVideoBlock = Extract<
  NonNullable<Page['layout']>[number],
  { blockType: 'fullscreenVideo' }
>

function asMedia(value: unknown): Media | null {
  return typeof value === 'object' && value !== null ? (value as Media) : null
}

export function FullscreenVideoBlock({
  title,
  video,
  videoMobile,
  poster,
  locale,
}: FullscreenVideoBlock & { locale: string }) {
  const src = asMedia(video)?.url
  if (!src) return null

  const t = getDictionary(isLocale(locale) ? locale : 'nl')

  return (
    <FullscreenVideoPlayer
      title={title ?? undefined}
      src={src}
      srcMobile={asMedia(videoMobile)?.url ?? undefined}
      poster={asMedia(poster)?.url ?? undefined}
      labels={t.video}
    />
  )
}
