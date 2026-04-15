import type { Page } from '@/payload-types'
import { HeroBlock } from './Hero/Component'

type Block = NonNullable<Page['layout']>[number]

export function RenderBlocks({ blocks }: { blocks: Block[] | null | undefined }) {
  if (!blocks || blocks.length === 0) return null

  return (
    <>
      {blocks.map((block, i) => {
        const key = block.id ?? i
        switch (block.blockType) {
          case 'hero':
            return <HeroBlock key={key} {...block} />
          default:
            return null
        }
      })}
    </>
  )
}
