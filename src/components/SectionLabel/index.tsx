export function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-[2px] w-10 bg-brand-gold" />
      <span className="text-xs font-medium tracking-[2.4px] text-brand-gold">{label}</span>
      <div className="h-[2px] w-10 bg-brand-gold" />
    </div>
  )
}
