import { cn } from '../lib/format'

export interface TabItem<T extends string> { id: T; label: string; count?: number }

export function Tabs<T extends string>({ items, value, onChange, inverse, size = 'm', className, ariaLabel }: {
  items: TabItem<T>[]; value: T; onChange: (v: T) => void; inverse?: boolean; size?: 'm' | 'l'; className?: string; ariaLabel?: string
}) {
  return (
    <div role="tablist" aria-label={ariaLabel} className={cn('-mx-[var(--margin)] flex gap-2 overflow-x-auto px-[var(--margin)] no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0', className)}>
      {items.map((it) => {
        const active = it.id === value
        return (
          <button
            key={it.id} role="tab" aria-selected={active} type="button" onClick={() => onChange(it.id)}
            className={cn(
              'inline-flex shrink-0 items-center gap-2 rounded-1 border t-label !normal-case !tracking-normal transition-colors duration-fast',
              size === 'l' ? 'h-12 px-5 text-[15px]' : 'h-10 px-4 text-[14px]',
              inverse
                ? active ? 'border-signal-500 bg-signal-500 text-asphalt-950' : 'border-asphalt-700 text-asphalt-200 hover:border-asphalt-400'
                : active ? 'border-asphalt-950 bg-asphalt-950 text-white' : 'border-asphalt-300 bg-white text-asphalt-950 hover:border-asphalt-950',
            )}
          >
            {it.label}
            {typeof it.count === 'number' && <span className={cn('tabular text-[12px]', active ? (inverse ? 'text-asphalt-900/70' : 'text-asphalt-300') : 'text-asphalt-500')}>{it.count}</span>}
          </button>
        )
      })}
    </div>
  )
}
