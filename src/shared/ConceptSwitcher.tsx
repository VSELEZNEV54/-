import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutGrid } from 'lucide-react'
import { cn } from '../lib/format'

/** Dev/prototype switcher — только для презентации макетов, не часть будущего сайта */
export function ConceptSwitcher() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  const current = pathname.startsWith('/concept-2') ? '02' : '01'
  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])
  useEffect(() => setOpen(false), [pathname])
  const items = [
    { to: '/concept-1', label: 'Концепция 1 · Сайт кодом + статьи', active: current === '01' },
    { to: '/concept-2', label: 'Концепция 2 · SEO-лайнер', active: current === '02' },
  ]
  return (
    <div ref={ref} className="fixed bottom-24 left-4 z-[90] md:bottom-5 md:left-5 print:hidden">
      <div className={cn('absolute bottom-full left-0 mb-2 w-60 origin-bottom-left overflow-hidden rounded-2 border border-asphalt-700 bg-asphalt-950 text-asphalt-50 shadow-pop transition-[opacity,transform] duration-base ease-out-brand', open ? 'opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-95')}>
        <div className="px-3 pt-3 pb-1 t-label text-asphalt-400">Прототип · переключатель</div>
        {items.map((it) => (
          <Link key={it.to} to={it.to} className={cn('flex items-center justify-between px-3 py-2.5 t-small transition-colors duration-fast hover:bg-asphalt-800', it.active && 'text-signal-400')}>
            {it.label}{it.active && <span className="t-caption">текущая</span>}
          </Link>
        ))}
        <Link to="/" className="flex items-center gap-2 border-t border-asphalt-800 px-3 py-2.5 t-small hover:bg-asphalt-800 transition-colors duration-fast"><LayoutGrid className="size-4" />К выбору концепции</Link>
      </div>
      <button
        type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label="Переключить концепцию"
        className="flex h-11 items-center gap-2 rounded-1 border border-asphalt-700 bg-asphalt-950 px-3 font-label text-[14px] font-bold tracking-wider text-asphalt-50 shadow-pop transition-colors duration-fast hover:border-asphalt-400"
      >
        <span className={cn(current === '01' ? 'text-signal-400' : 'text-asphalt-400')}>01</span>
        <span className="text-asphalt-600">/</span>
        <span className={cn(current === '02' ? 'text-signal-400' : 'text-asphalt-400')}>02</span>
      </button>
    </div>
  )
}
