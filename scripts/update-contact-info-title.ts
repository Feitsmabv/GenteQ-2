import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

const NEW_TITLE = 'Contact'

const run = async () => {
  const payload = await getPayload({ config })

  const page = await payload.findByID({
    collection: 'pages',
    id: 2,
    depth: 0,
    locale: 'nl',
  })

  const layout = (page.layout ?? []) as Array<Record<string, unknown>>
  let updated = false

  const newLayout = layout.map((block) => {
    if (block.blockType !== 'contactSplit') return block
    updated = true
    return {
      ...block,
      infoTitle: NEW_TITLE,
      infoIntro: '',
    }
  })

  if (!updated) {
    console.log('⚠️  Geen contactSplit-block gevonden op pagina id=2')
    process.exit(1)
  }

  await payload.update({
    collection: 'pages',
    id: 2,
    locale: 'nl',
    data: { layout: newLayout },
  })

  console.log('✅ Contact-pagina bijgewerkt:')
  console.log(`   - infoTitle: "${NEW_TITLE}"`)
  console.log(`   - infoIntro: leeg`)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
