import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="bg-[#f7f5f2] px-5 pb-3 pt-24 md:px-20">
      <ol className="flex items-center gap-2 text-[13px]">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {i > 0 && <span className="text-brand-dark/30">›</span>}
            {item.href ? (
              <Link href={item.href} className="text-brand-dark/50 hover:text-brand-dark transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-brand-dark">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
