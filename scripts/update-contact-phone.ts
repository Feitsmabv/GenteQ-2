import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

const PHONE_VALUE = '+32 89 24 47 89'
const PHONE_HREF = 'tel:+3289244789'
const HOURS_VALUE = 'ma–vr 9:00–17:00'
const RESPONSE_TEXT = 'We reageren binnen 1 werkdag.'
const SUCCESS_TEXT = 'We nemen binnen 1 werkdag contact met je op.'

type InfoItem = {
  id?: string
  icon?: string
  label?: string
  value?: string
  href?: string
}

type ContactSplitBlock = {
  id?: string
  blockType: 'contactSplit'
  infoTitle?: string
  infoIntro?: string
  infoItems?: InfoItem[]
  responsePromise?: string
  formTitle?: string
  formIntro?: string
  recipientEmail?: string
  successTitle?: string
  successMessage?: string
}

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
    const cs = block as ContactSplitBlock
    const items: InfoItem[] = Array.isArray(cs.infoItems) ? [...cs.infoItems] : []

    const phoneIdx = items.findIndex((i) => i.icon === 'phone')
    if (phoneIdx === -1) {
      items.push({
        icon: 'phone',
        label: 'Telefoon',
        value: PHONE_VALUE,
        href: PHONE_HREF,
      })
    } else {
      items[phoneIdx] = {
        ...items[phoneIdx],
        label: items[phoneIdx].label || 'Telefoon',
        value: PHONE_VALUE,
        href: PHONE_HREF,
      }
    }

    const hoursIdx = items.findIndex((i) => i.icon === 'clock')
    if (hoursIdx === -1) {
      items.push({
        icon: 'clock',
        label: 'Bereikbaar',
        value: HOURS_VALUE,
      })
    } else {
      items[hoursIdx] = {
        ...items[hoursIdx],
        label: items[hoursIdx].label || 'Bereikbaar',
        value: HOURS_VALUE,
      }
    }

    updated = true
    return {
      ...cs,
      infoItems: items,
      responsePromise: RESPONSE_TEXT,
      successMessage: SUCCESS_TEXT,
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
  console.log(`   - Telefoon: ${PHONE_VALUE} (${PHONE_HREF})`)
  console.log(`   - Bereikbaar: ${HOURS_VALUE}`)
  console.log(`   - responsePromise: "${RESPONSE_TEXT}"`)
  console.log(`   - successMessage: "${SUCCESS_TEXT}"`)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
