'use client'

import { useState, useRef, useEffect } from 'react'

interface FilterState {
  woningtype: string
  slaapkamers: string
  prijsTot: string
  status: string
}

interface PropertyFilterProps {
  onFilter?: (filters: FilterState) => void
}

interface Option {
  label: string
  value: string
}

function FilterDropdown({ label, value, options, onChange }: {
  label: string
  value: string
  options: Option[]
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.value === value) || options[0]

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative flex flex-1 flex-col gap-1.5">
      <span className="text-[11px] font-medium text-brand-dark/50">{label}</span>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between rounded-lg border bg-white px-4 py-3 text-sm transition-colors ${
          open ? 'border-brand-gold' : 'border-[#e0dcd6]'
        }`}
      >
        <span className="text-brand-dark/70">{selected.label}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-dark/40" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-lg border border-[#e0dcd6] bg-white shadow-[0px_8px_24px_-4px_rgba(0,0,0,0.08)]">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
              className={`flex w-full items-center px-4 py-2.5 text-sm transition-colors ${
                opt.value === value
                  ? 'bg-brand-gold/8 font-medium text-brand-gold'
                  : 'text-brand-dark/70 hover:bg-brand-light'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function PropertyFilter({ onFilter }: PropertyFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    woningtype: '',
    slaapkamers: '',
    prijsTot: '',
    status: '',
  })

  const update = (key: keyof FilterState, value: string) => {
    const next = { ...filters, [key]: value }
    setFilters(next)
    onFilter?.(next)
  }

  return (
    <div className="border-b border-brand-dark/10 bg-white px-5 py-8 md:px-20">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-4">
        <FilterDropdown
          label="Woningtype"
          value={filters.woningtype}
          onChange={(v) => update('woningtype', v)}
          options={[
            { label: 'Alle types', value: '' },
            { label: 'Appartement', value: 'appartement' },
            { label: 'Woning', value: 'woning' },
            { label: 'Penthouse', value: 'penthouse' },
          ]}
        />
        <FilterDropdown
          label="Slaapkamers"
          value={filters.slaapkamers}
          onChange={(v) => update('slaapkamers', v)}
          options={[
            { label: 'Alle', value: '' },
            { label: '1 slaapkamer', value: '1' },
            { label: '2 slaapkamers', value: '2' },
            { label: '3 slaapkamers', value: '3' },
            { label: '4+ slaapkamers', value: '4' },
          ]}
        />
        <FilterDropdown
          label="Prijs tot"
          value={filters.prijsTot}
          onChange={(v) => update('prijsTot', v)}
          options={[
            { label: 'Geen limiet', value: '' },
            { label: '€200.000', value: '200000' },
            { label: '€300.000', value: '300000' },
            { label: '€400.000', value: '400000' },
            { label: '€500.000', value: '500000' },
          ]}
        />
        <FilterDropdown
          label="Status"
          value={filters.status}
          onChange={(v) => update('status', v)}
          options={[
            { label: 'Alle', value: '' },
            { label: 'Beschikbaar', value: 'beschikbaar' },
            { label: 'Nieuw', value: 'nieuw' },
            { label: 'Bijna volzet', value: 'bijna-volzet' },
            { label: 'Verkocht', value: 'verkocht' },
          ]}
        />
        <button
          type="button"
          onClick={() => {
            setFilters({ woningtype: '', slaapkamers: '', prijsTot: '', status: '' })
            onFilter?.({ woningtype: '', slaapkamers: '', prijsTot: '', status: '' })
          }}
          className="btn-outline btn-no-arrow shrink-0 rounded-full border-[1.5px] border-brand-dark px-7 py-3 text-[15px] font-normal text-brand-dark hover:bg-brand-dark hover:text-white"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
