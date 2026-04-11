import type { Metadata } from 'next'
import { HandleidingContent } from './HandleidingContent'

export const metadata: Metadata = {
  title: 'Handleiding | Projectnaam',
  description: 'Leer hoe u de content van uw projectwebsite kunt beheren.',
  robots: 'noindex, nofollow',
}

export default function HandleidingPage() {
  return (
    <main>
      <HandleidingContent />
    </main>
  )
}
