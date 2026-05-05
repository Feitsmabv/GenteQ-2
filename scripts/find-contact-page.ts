import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

const run = async () => {
  const payload = await getPayload({ config })
  const pages = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 100,
    locale: 'nl',
  })

  for (const page of pages.docs) {
    const layout = (page.layout ?? []) as Array<{ blockType?: string }>
    const blockTypes = layout.map((b) => b.blockType).join(', ')
    console.log(`- id=${page.id}  slug="${page.slug}"  title="${page.title}"  blocks=[${blockTypes}]`)
  }

  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
