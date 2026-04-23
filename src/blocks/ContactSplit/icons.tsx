import type { SVGProps } from 'react'

const base = 'h-5 w-5 stroke-current'

function IconMail(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className={base} {...props}>
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5v9A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9Z" strokeLinecap="round" />
      <path d="m3.5 7.5 8 5.5a1.5 1.5 0 0 0 1.7 0L21 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconPhone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className={base} {...props}>
      <path d="M4.5 5.5a2 2 0 0 1 2-2h1.8c.4 0 .8.3 1 .7l1.3 3a1 1 0 0 1-.3 1.2L9 9.5a11 11 0 0 0 5.5 5.5l1.1-1.3a1 1 0 0 1 1.2-.3l3 1.3c.4.2.7.6.7 1v1.8a2 2 0 0 1-2 2A15.5 15.5 0 0 1 4.5 5.5Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconMap(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className={base} {...props}>
      <path d="M12 21s-7-6.5-7-12a7 7 0 1 1 14 0c0 5.5-7 12-7 12Z" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  )
}

function IconClock(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className={base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconBuilding(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className={base} {...props}>
      <path d="M5 20V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v15" strokeLinejoin="round" />
      <path d="M15 10h3a1 1 0 0 1 1 1v9" strokeLinejoin="round" />
      <path d="M3 20h18" strokeLinecap="round" />
      <path d="M8 8h4M8 12h4M8 16h4" strokeLinecap="round" />
    </svg>
  )
}

export const iconMap = {
  mail: IconMail,
  phone: IconPhone,
  map: IconMap,
  clock: IconClock,
  building: IconBuilding,
} as const

export type IconName = keyof typeof iconMap
