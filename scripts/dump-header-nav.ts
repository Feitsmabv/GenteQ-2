import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

const run = async () => {
  const payload = await getPayload({ config })
  const header = await payload.findGlobal({ slug: 'header', locale: 'nl' })
  console.log(JSON.stringify(header, null, 2))
  process.exit(0)
}
run().catch((err) => {
  console.error(err)
  process.exit(1)
})
