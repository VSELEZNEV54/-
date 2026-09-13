import { forwardRef, useId, type InputHTMLAttributes, type SelectHTMLAttributes, type ReactNode } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '../lib/format'

interface FieldBase { label?: string; hint?: string; error?: string; inverse?: boolean; className?: string }

export const Input = forwardRef<HTMLInputElement, FieldBase & InputHTMLAttributes<HTMLInputElement>>(function Input(
  { label, hint, error, inverse, className, id, ...rest }, ref,
) {
  const auto = useId(); const fid = id ?? auto
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && <label htmlFor={fid} className={cn('t-caption', inverse ? 'text-asphalt-300' : 'text-asphalt-600')}>{label}</label>}
      <input
        ref={ref} id={fid}
        className={cn(
          'h-14 w-full rounded-1 border px-4 t-body outline-none transition-[border-color,box-shadow] duration-fast',
          inverse
            ? 'bg-asphalt-800 border-asphalt-700 text-asphalt-50 placeholder:text-asphalt-400 focus:border-signal-400 focus:ring-2 focus:ring-signal-400/30'
            : 'bg-white border-asphalt-300 text-asphalt-950 placeholder:text-asphalt-500 focus:border-asphalt-950 focus:ring-2 focus:ring-signal-200',
          error && '!border-red-600',
        )}
        aria-invalid={!!error}
        {...rest}
      />
      {error ? <span className="t-caption text-red-600">{error}</span> : hint ? <span className="t-caption text-asphalt-500">{hint}</span> : null}
    </div>
  )
})

export const Select = forwardRef<HTMLSelectElement, FieldBase & SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }>(function Select(
  { label, hint, error, inverse, className, id, children, ...rest }, ref,
) {
  const auto = useId(); const fid = id ?? auto
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && <label htmlFor={fid} className={cn('t-caption', inverse ? 'text-asphalt-300' : 'text-asphalt-600')}>{label}</label>}
      <div className="relative">
        <select
          ref={ref} id={fid}
          className={cn(
            'h-14 w-full appearance-none rounded-1 border pl-4 pr-11 t-body outline-none transition-[border-color,box-shadow] duration-fast',
            inverse
              ? 'bg-asphalt-800 border-asphalt-700 text-asphalt-50 focus:border-signal-400 focus:ring-2 focus:ring-signal-400/30'
              : 'bg-white border-asphalt-300 text-asphalt-950 focus:border-asphalt-950 focus:ring-2 focus:ring-signal-200',
            error && '!border-red-600',
          )}
          {...rest}
        >
          {children}
        </select>
        <ChevronDown className={cn('pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2', inverse ? 'text-asphalt-300' : 'text-asphalt-500')} aria-hidden />
      </div>
      {error ? <span className="t-caption text-red-600">{error}</span> : hint ? <span className="t-caption text-asphalt-500">{hint}</span> : null}
    </div>
  )
})

export function Checkbox({ label, inverse, className, checked, onChange, error, ...rest }: { label: ReactNode; inverse?: boolean; className?: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId()
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <span className="relative mt-0.5 inline-flex shrink-0">
          <input id={id} type="checkbox" className="peer sr-only" checked={checked} onChange={onChange} {...rest} />
          <span className={cn(
            'flex size-5 items-center justify-center rounded-1 border transition-colors duration-fast',
            inverse ? 'border-asphalt-500 bg-asphalt-800 peer-checked:bg-signal-500 peer-checked:border-signal-500' : 'border-asphalt-400 bg-white peer-checked:bg-asphalt-950 peer-checked:border-asphalt-950',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-signal-200',
            error && '!border-red-600',
          )}>
          </span>
          <span className="pointer-events-none absolute inset-0 hidden peer-checked:block"><Check className={cn('mt-[3px] ml-[3px] size-3.5', inverse ? 'text-asphalt-950' : 'text-white')} strokeWidth={3} /></span>
        </span>
        <span className={cn('t-small', inverse ? 'text-asphalt-300' : 'text-asphalt-600')}>{label}</span>
      </label>
      {error && <span className="t-caption text-red-600">{error}</span>}
    </div>
  )
}

/** Радио в виде чипов: одна активная, стиль плитки */
export function ChipGroup<T extends string | number>({
  label, options, value, onChange, inverse, className, columns,
}: { label?: string; options: { value: T; label: string; hint?: string }[]; value: T; onChange: (v: T) => void; inverse?: boolean; className?: string; columns?: number }) {
  return (
    <div className={cn('flex flex-col gap-2', className)} role="radiogroup" aria-label={label}>
      {label && <span className={cn('t-caption', inverse ? 'text-asphalt-300' : 'text-asphalt-600')}>{label}</span>}
      <div className={cn('flex flex-wrap gap-2', columns ? 'grid' : undefined)} style={columns ? { gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` } : undefined}>
        {options.map((o) => {
          const active = o.value === value
          return (
            <button
              key={String(o.value)} type="button" role="radio" aria-checked={active}
              onClick={() => onChange(o.value)}
              className={cn(
                'flex min-h-11 flex-col items-start justify-center rounded-1 border px-3.5 py-2 text-left transition-colors duration-fast',
                inverse
                  ? active ? 'border-signal-500 bg-signal-500 text-asphalt-950' : 'border-asphalt-700 bg-asphalt-800 text-asphalt-50 hover:border-asphalt-400'
                  : active ? 'border-asphalt-950 bg-asphalt-950 text-white' : 'border-asphalt-300 bg-white text-asphalt-950 hover:border-asphalt-950',
              )}
            >
              <span className="t-caption !font-bold text-[15px]">{o.label}</span>
              {o.hint && <span className={cn('t-caption !font-normal', active ? (inverse ? 'text-asphalt-900/80' : 'text-asphalt-300') : 'text-asphalt-500')}>{o.hint}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function Slider({ label, value, min, max, step = 1, onChange, format, inverse, className }: {
  label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; format?: (v: number) => string; inverse?: boolean; className?: string
}) {
  const id = useId()
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className={cn('t-caption', inverse ? 'text-asphalt-300' : 'text-asphalt-600')}>{label}</label>
        <span className={cn('t-title-m tabular', inverse ? 'text-asphalt-50' : 'text-asphalt-950')}>{format ? format(value) : value}</span>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className={cn('range-input', inverse && 'on-dark')} />
      <div className={cn('flex justify-between t-caption', inverse ? 'text-asphalt-500' : 'text-asphalt-400')}>
        <span>{format ? format(min) : min}</span><span>{format ? format(max) : max}</span>
      </div>
    </div>
  )
}
