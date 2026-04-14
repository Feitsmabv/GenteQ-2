import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LegalPage } from '@/components/LegalPage'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/getDictionary'
import { legalContent } from '../_legal/content'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return { title: legalContent.cookies[locale].metaTitle }
}

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const page = legalContent.cookies[locale]

  return (
    <LegalPage
      label={t.legal.label}
      title={page.title}
      lastUpdated={page.lastUpdated}
      sections={page.sections}
    />
  )
}
