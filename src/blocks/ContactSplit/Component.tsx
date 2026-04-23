import type { Page } from '@/payload-types'
import { ContactForm } from './ContactForm'
import { iconMap, type IconName } from './icons'

type ContactSplitBlock = Extract<
  NonNullable<Page['layout']>[number],
  { blockType: 'contactSplit' }
>

type Props = ContactSplitBlock & { locale: string }

export function ContactSplitBlock({
  infoTitle,
  infoIntro,
  infoItems,
  responsePromise,
  formTitle,
  formIntro,
  successTitle,
  successMessage,
  locale,
}: Props) {
  return (
    <section className="relative bg-carbon-black px-6 pb-28">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:gap-16">
        {/* Linker kolom — info */}
        <div className="flex flex-col">
          {infoTitle && (
            <h2 className="text-2xl font-semibold text-white md:text-3xl">
              {infoTitle}
            </h2>
          )}
          {infoIntro && (
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-light md:text-base md:leading-7">
              {infoIntro}
            </p>
          )}

          {infoItems && infoItems.length > 0 && (
            <ul className="mt-10 flex flex-col divide-y divide-white/5">
              {infoItems.map((item, i) => {
                const Icon = iconMap[(item.icon ?? 'mail') as IconName] ?? iconMap.mail
                const content = (
                  <>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-steel-blue">
                      <Icon />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-[11px] font-medium uppercase tracking-[2px] text-slate-light/80">
                        {item.label}
                      </span>
                      <span className="mt-1 text-sm text-white md:text-base">
                        {item.value}
                      </span>
                    </span>
                  </>
                )
                return (
                  <li key={i} className="py-5 first:pt-0 last:pb-0">
                    {item.href ? (
                      <a
                        href={item.href}
                        className="group flex items-center gap-4 transition-opacity hover:opacity-80"
                      >
                        {content}
                      </a>
                    ) : (
                      <div className="flex items-center gap-4">{content}</div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}

          {responsePromise && (
            <div className="mt-10 flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2.5 text-xs text-slate-light w-fit">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-steel-blue opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-steel-blue" />
              </span>
              {responsePromise}
            </div>
          )}
        </div>

        {/* Rechter kolom — formulier */}
        <div className="flex flex-col">
          {formTitle && (
            <h2 className="text-2xl font-semibold text-white md:text-3xl">
              {formTitle}
            </h2>
          )}
          {formIntro && (
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-light md:text-base md:leading-7">
              {formIntro}
            </p>
          )}
          <div className="mt-8">
            <ContactForm
              successTitle={successTitle || 'Bedankt, we hebben je bericht ontvangen.'}
              successMessage={
                successMessage || 'We nemen binnen 1 werkdag contact met je op.'
              }
              locale={locale}
              turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
