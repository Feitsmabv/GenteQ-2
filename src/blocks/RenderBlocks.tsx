import type { Page } from '@/payload-types'
import { ContactHeroBlock } from './ContactHero/Component'
import { ContactSplitBlock } from './ContactSplit/Component'
import { HeroBlock } from './Hero/Component'

type Block = NonNullable<Page['layout']>[number]

export function RenderBlocks({
  blocks,
  locale,
}: {
  blocks: Block[] | null | undefined
  locale: string
}) {
  if (!blocks || blocks.length === 0) return null

  return (
    <>
      {blocks.map((block, i) => {
        const key = block.id ?? i
        switch (block.blockType) {
          case 'hero':
            return <HeroBlock key={key} {...block} />
          case 'contactHero':
            return <ContactHeroBlock key={key} {...block} />
          case 'contactSplit':
            return <ContactSplitBlock key={key} {...block} locale={locale} />
          default:
            return null
        }
      })}
    </>
  )
}
