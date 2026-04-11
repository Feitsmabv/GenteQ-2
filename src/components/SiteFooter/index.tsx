import { getProjectSettings } from '@/utilities/payload'
import { SiteFooterClient } from './SiteFooter.client'
import type { ProjectSetting } from '@/payload-types'

async function fetchWithRetry(retries = 2): Promise<ProjectSetting | null> {
  for (let i = 0; i <= retries; i++) {
    try {
      const result = await getProjectSettings()
      return result
    } catch (error) {
      if (i === retries) {
        console.error('[SiteFooter] Definitieve fout na retries:', error)
        return null
      }
      // Korte wachttijd voor de volgende poging (cold start beschermen)
      await new Promise((r) => setTimeout(r, 150 * (i + 1)))
    }
  }
  return null
}

export async function SiteFooter() {
  const settings = await fetchWithRetry()
  return <SiteFooterClient settings={settings} />
}
