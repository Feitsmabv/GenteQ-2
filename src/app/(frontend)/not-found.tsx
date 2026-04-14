import Link from 'next/link'
import { defaultLocale, homePath } from '@/i18n/config'
import { getDictionary } from '@/i18n/getDictionary'

export default function GlobalNotFound() {
  const t = getDictionary(defaultLocale)

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-brand-black px-5 pt-20">
      <div className="flex flex-col items-center gap-6 text-center">
        <span className="text-xs font-medium tracking-[2.4px] text-steel-blue">
          {t.notFound.label}
        </span>
        <h1 className="font-heading text-[80px] leading-none text-white md:text-[120px]">
          {t.notFound.title}
        </h1>
        <p className="max-w-md text-base leading-7 text-white/60">{t.notFound.description}</p>
        <div className="mt-4 flex gap-4">
          <Link
            href={homePath(defaultLocale)}
            className="btn-primary rounded-full bg-steel-blue px-8 py-4 text-[15px] font-normal text-white"
          >
            {t.notFound.homeCta}
          </Link>
        </div>
      </div>
    </div>
  )
}
