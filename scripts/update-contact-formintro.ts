import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

const NEW_TEXT =
  'Een vraag, een idee of een volledig projectdossier, we denken graag mee. Stuur een bericht of bel direct.'

const run = async () => {
  const payload = await getPayload({ config })

  const page = await payload.findByID({
    collection: 'pages',
    id: 2,
    depth: 0,
    locale: 'nl',
  })

  const layout = (page.layout ?? []) as Array<Record<string, unknown>>
  let touched = 0

  const newLayout = layout.map((block) => {
    if (block.blockType !== 'contactHero') return block
    const next: Record<string, unknown> = { ...block }
    if (typeof next.subtitle === 'string') {
      next.subtitle = NEW_TEXT
      touched++
      console.log('   - contactHero.subtitle bijgewerkt')
    }
    return next
  })

  if (touched === 0) {
    console.log('⚠️  Geen contactHero met subtitle gevonden')
    process.exit(1)
  }

  await payload.update({
    collection: 'pages',
    id: 2,
    locale: 'nl',
    data: { layout: newLayout },
  })
  console.log('✅ Contact-pagina bijgewerkt')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
