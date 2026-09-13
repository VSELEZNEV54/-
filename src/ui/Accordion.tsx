import { useState, type ReactNode } from 'react'
import { Plus } from 'lucide-react'
import { cn } from '../lib/format'

export interface AccordionItem { id: string; title: ReactNode; content: ReactNode; meta?: ReactNode }

export function Accordion({ items, inverse, defaultOpen, single = true, className }: { items: AccordionItem[]; inverse?: boolean; defaultOpen?: string; single?: boolean; className?: string }) {
  const [open, setOpen] = useState<string[]>(defaultOpen ? [defaultOpen] : [])
  const toggle = (id: string) => setOpen((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : single ? [id] : [...prev, id]))
  return (
    <div className={cn('divide-y', inverse ? 'divide-[rgba(242,244,247,.14)] border-y border-[rgba(242,244,247,.14)]' : 'divide-asphalt-200 border-y border-asphalt-200', className)}>
      {items.map((it) => {
        const isOpen = open.includes(it.id)
        return (
          <div key={it.id}>
            <button
              type="button" onClick={() => toggle(it.id)} aria-expanded={isOpen}
              className={cn('flex w-full items-start justify-between gap-4 py-4 text-left transition-colors duration-fast md:py-5', inverse ? 'text-asphalt-50 hover:text-signal-400' : 'text-asphalt-950 hover:text-signal-700')}
            >
              <span className="flex flex-col gap-1">
                <span className="t-title-m">{it.title}</span>
                {it.meta}
              </span>
              <span className={cn('mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-1 border transition-[transform,background-color,border-color] duration-base ease-out-brand', isOpen ? 'rotate-45 bg-signal-500 border-signal-500 text-asphalt-950' : inverse ? 'border-asphalt-600' : 'border-asphalt-300')}>
                <Plus className="size-4" strokeWidth={2.25} />
              </span>
            </button>
            <div className={cn('grid transition-[grid-template-rows] duration-base ease-out-brand', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
              <div className="overflow-hidden">
                <div className={cn('pb-5 pr-12 t-body', inverse ? 'text-asphalt-300' : 'text-asphalt-600')}>{it.content}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
