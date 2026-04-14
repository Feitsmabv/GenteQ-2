import type { Page } from '@/payload-types'
import { HeroBlock } from './Hero/Component'

type Block = NonNullable<Page['layout']>[number]

const renderers = {
  hero: HeroBlock,
} as const

export function RenderBlocks({ blocks }: { blocks: Block[] | null | undefined }) {
  if (!blocks || blocks.length === 0) return null

  return (
    <>
      {blocks.map((block, i) => {
        const Renderer = renderers[block.blockType as keyof typeof renderers]
        if (!Renderer) return null
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <Renderer key={block.id ?? i} {...(block as any)} />
      })}
    </>
  )
}
