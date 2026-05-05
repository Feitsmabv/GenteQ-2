import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

const run = async () => {
  const payload = await getPayload({ config })
  const page = await payload.findByID({
    collection: 'pages',
    id: 2,
    depth: 0,
    locale: 'nl',
  })
  console.log(JSON.stringify(page.layout, null, 2))
  process.exit(0)
}
run().catch((err) => {
  console.error(err)
  process.exit(1)
})
