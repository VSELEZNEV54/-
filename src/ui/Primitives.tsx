import type { ReactNode, HTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Star } from 'lucide-react'
import { cn } from '../lib/format'
import { useInView } from '../lib/hooks'

/* ---------- Сетка ---------- */
export function Container({ children, className, ...rest }: { children: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('container-page', className)} {...rest}>{children}</div>
}

export function Section({ children, className, inverse, id, tight, ...rest }: { children: ReactNode; className?: string; inverse?: boolean; id?: string; tight?: boolean } & HTMLAttributes<HTMLElement>) {
  return (
    <section id={id} className={cn(tight ? 'section-y-sm' : 'section-y', inverse && 'bg-asphalt-900 text-asphalt-50 on-dark', className)} {...rest}>
      {children}
    </section>
  )
}

/** Заголовок раздела: метка → display → лид */
export function SectionHeader({ label, title, lead, inverse, align = 'left', size = 'l', className, action }: {
  label?: string; title: ReactNode; lead?: ReactNode; inverse?: boolean; align?: 'left' | 'center'; size?: 'l' | 'm'; className?: string; action?: ReactNode
}) {
  return (
    <div className={cn('flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8', align === 'center' && 'md:flex-col md:items-center md:text-center', className)}>
      <div className={cn('flex max-w-3xl flex-col gap-3', align === 'center' && 'items-center')}>
        {label && <span className={cn('t-label', inverse ? 'text-signal-400' : 'text-signal-700')}>{label}</span>}
        <h2 className={cn(size === 'l' ? 't-display-l' : 't-display-m', inverse ? 'text-asphalt-50' : 'text-asphalt-950')}>{title}</h2>
        {lead && <p className={cn('t-lead max-w-2xl', inverse ? 'text-asphalt-300' : 'text-asphalt-600')}>{lead}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

/* ---------- Появление при скролле ---------- */
export function Reveal({ children, className, delay = 0, as: Tag = 'div' }: { children: ReactNode; className?: string; delay?: number; as?: 'div' | 'li' | 'article' | 'section' }) {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <Tag ref={ref as never} className={cn('transition-[opacity,transform] duration-slow ease-out-brand', inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4', className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  )
}

/* ---------- Метки ---------- */
export function Plate({ children, tone = 'signal', className }: { children: ReactNode; tone?: 'signal' | 'dark' | 'light'; className?: string }) {
  return <span className={cn(tone === 'signal' ? 'plate' : tone === 'dark' ? 'plate-dark' : 'plate-light', className)}>{children}</span>
}

export function Tag({ children, tone = 'neutral', className }: { children: ReactNode; tone?: 'neutral' | 'signal' | 'dark' | 'inverse' | 'green' | 'amber'; className?: string }) {
  const tones = {
    neutral: 'bg-asphalt-100 text-asphalt-700',
    signal: 'bg-signal-500 text-asphalt-950',
    dark: 'bg-asphalt-950 text-asphalt-50',
    inverse: 'bg-[rgba(242,244,247,.12)] text-asphalt-100',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
  }
  return <span className={cn('inline-flex h-7 items-center rounded-0 px-2 t-label !text-[12px]', tones[tone], className)}>{children}</span>
}

export function Kicker({ children, inverse, className }: { children: ReactNode; inverse?: boolean; className?: string }) {
  return <span className={cn('t-label', inverse ? 'text-signal-400' : 'text-signal-700', className)}>{children}</span>
}

/** Пометка «требует подтверждения парком» */
export function NeedsConfirm({ className }: { className?: string }) {
  return <span className={cn('inline-flex items-center gap-1 rounded-0 bg-amber-50 px-1.5 py-0.5 t-caption text-amber-600', className)} title="Текст-заглушка: уточняется у парка">уточняется у парка</span>
}

/* ---------- Цифры ---------- */
export function Stat({ value, unit, label, inverse, size = 'l', className }: { value: string; unit?: string; label: string; inverse?: boolean; size?: 'l' | 'xl' | 'm'; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className={cn('flex items-baseline gap-1', inverse ? 'text-asphalt-50' : 'text-asphalt-950')}>
        <span className={cn(size === 'xl' ? 't-number-xl' : size === 'l' ? 't-number-l' : 't-display-m')}>{value}</span>
        {unit && <span className={cn('t-display-m', inverse ? 'text-asphalt-300' : 'text-asphalt-500')}>{unit}</span>}
      </div>
      <span className={cn('t-small', inverse ? 'text-asphalt-300' : 'text-asphalt-600')}>{label}</span>
    </div>
  )
}

export function Price({ value, size = 'm', inverse, prefix = 'от', suffix = '/день', className }: { value: number; size?: 's' | 'm' | 'l' | 'xl'; inverse?: boolean; prefix?: string; suffix?: string; className?: string }) {
  const num = new Intl.NumberFormat('ru-RU').format(value)
  const numCls = size === 'xl' ? 't-number-xl' : size === 'l' ? 't-number-l' : size === 'm' ? 't-display-m' : 't-display-s'
  return (
    <span className={cn('inline-flex flex-wrap items-baseline gap-x-1.5', inverse ? 'text-asphalt-50' : 'text-asphalt-950', className)}>
      {prefix && <span className={cn('t-caption', inverse ? 'text-asphalt-300' : 'text-asphalt-600')}>{prefix}</span>}
      <span className={cn(numCls, 'tabular whitespace-nowrap')}>{num} ₽</span>
      {suffix && <span className={cn('t-caption whitespace-nowrap', inverse ? 'text-asphalt-300' : 'text-asphalt-600')}>{suffix}</span>}
    </span>
  )
}

/* ---------- Звёзды, аватар ---------- */
export function Stars({ n = 5, className, size = 14 }: { n?: number; className?: string; size?: number }) {
  return (
    <span className={cn('inline-flex gap-0.5 text-signal-500', className)} aria-label={`${n} из 5`}>
      {Array.from({ length: 5 }).map((_, i) => <Star key={i} style={{ width: size, height: size }} className={i < n ? 'fill-current' : 'opacity-30'} strokeWidth={0} />)}
    </span>
  )
}

export function Avatar({ name, inverse, className }: { name: string; inverse?: boolean; className?: string }) {
  const initials = name.split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase()
  return <span className={cn('inline-flex size-11 shrink-0 items-center justify-center rounded-1 font-label text-[15px] font-bold', inverse ? 'bg-asphalt-800 text-asphalt-100' : 'bg-asphalt-100 text-asphalt-800', className)}>{initials}</span>
}

/* ---------- Хлебные крошки ---------- */
export function Breadcrumbs({ items, className, inverse }: { items: { label: string; to?: string }[]; className?: string; inverse?: boolean }) {
  return (
    <nav aria-label="Хлебные крошки" className={cn('t-small', inverse ? 'text-asphalt-400' : 'text-asphalt-500', className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="size-3.5 opacity-60" aria-hidden />}
            {it.to ? <Link to={it.to} className={cn('transition-colors duration-fast', inverse ? 'hover:text-asphalt-50' : 'hover:text-asphalt-950')}>{it.label}</Link> : <span className={inverse ? 'text-asphalt-200' : 'text-asphalt-800'} aria-current="page">{it.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/* ---------- Callout ---------- */
export function Callout({ title, children, tone = 'signal', className }: { title?: ReactNode; children: ReactNode; tone?: 'signal' | 'info' | 'dark' | 'amber'; className?: string }) {
  const tones = {
    signal: 'border-l-4 border-signal-500 bg-signal-50 text-asphalt-950',
    info: 'border-l-4 border-blue-600 bg-blue-50 text-asphalt-950',
    dark: 'bg-asphalt-900 text-asphalt-50 on-dark',
    amber: 'border-l-4 border-amber-600 bg-amber-50 text-asphalt-950',
  }
  return (
    <div className={cn('rounded-2 px-5 py-4 md:px-6 md:py-5', tones[tone], className)}>
      {title && <div className="t-title-m mb-1.5">{title}</div>}
      <div className={cn('t-body', tone === 'dark' ? 'text-asphalt-300' : 'text-asphalt-700')}>{children}</div>
    </div>
  )
}

/* ---------- Таблица ---------- */
export function Table({ head, rows, caption, className, highlightCol }: { head: string[]; rows: (ReactNode)[][]; caption?: string; className?: string; highlightCol?: number }) {
  return (
    <div className={cn('overflow-x-auto rounded-2 border border-asphalt-200 bg-white', className)}>
      <table className="min-w-full text-left">
        {caption && <caption className="px-4 py-3 text-left t-caption text-asphalt-600">{caption}</caption>}
        <thead className="bg-asphalt-0">
          <tr>{head.map((h, i) => <th key={i} className={cn('px-4 py-3 t-label text-asphalt-600 whitespace-nowrap', i === highlightCol && 'bg-signal-50 text-signal-800')}>{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-asphalt-200">
          {rows.map((r, ri) => (
            <tr key={ri} className="hover:bg-asphalt-0 transition-colors duration-fast">
              {r.map((c, ci) => <td key={ci} className={cn('px-4 py-3 t-small text-asphalt-800 align-top', ci === 0 && 'font-semibold text-asphalt-950', ci === highlightCol && 'bg-signal-50/60')}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ---------- Логотип ---------- */
export function Logo({ to, className, size = 'm' }: { inverse?: boolean; to: string; className?: string; compact?: boolean; size?: 'm' | 'l' }) {
  return (
    <Link to={to} className={cn('inline-flex items-center', className)} aria-label="Таксимания — на главную">
      <img src="/img/logo/logo-mark.png" alt="Таксимания" className={cn('w-auto', size === 'l' ? 'h-14' : 'h-12')} />
    </Link>
  )
}

/* ---------- Линия маршрута (единственная мягкая линия системы) ---------- */
export function RouteLine({ className, inverse, animate = true }: { className?: string; inverse?: boolean; animate?: boolean }) {
  return (
    <svg viewBox="0 0 400 120" fill="none" className={cn('h-auto w-full', className)} aria-hidden>
      <path d="M8 96 C 60 96, 70 24, 130 24 L 260 24 C 320 24, 330 96, 392 96" stroke={inverse ? '#FE7550' : '#FF4300'} strokeWidth="4" strokeLinecap="round" pathLength={1} strokeDasharray={1} className={animate ? 'animate-draw' : ''} />
      <circle cx="8" cy="96" r="6" fill={inverse ? '#F2F4F7' : '#14181C'} />
      <rect x="386" y="90" width="12" height="12" fill="#FF4300" />
    </svg>
  )
}

/* ---------- Заглушка карты ---------- */
export function MapPlaceholder({ className, label = 'Загородное шоссе, 1, корп. 2, стр. 10' }: { className?: string; label?: string }) {
  return (
    <div className={cn('relative overflow-hidden rounded-2 bg-asphalt-100', className)} role="img" aria-label="Карта: расположение парка">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#DBDEE3" strokeWidth="1" /></pattern></defs>
        <rect width="800" height="500" fill="url(#grid)" />
        <path d="M-20 320 L 220 300 L 420 240 L 640 210 L 820 170" stroke="#C0C5CA" strokeWidth="14" strokeLinecap="round" fill="none" />
        <path d="M120 -20 L 180 160 L 260 330 L 300 520" stroke="#C0C5CA" strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M480 -20 L 470 180 L 430 520" stroke="#DBDEE3" strokeWidth="8" strokeLinecap="round" fill="none" />
        <path d="M-20 420 L 300 400 L 820 360" stroke="#DBDEE3" strokeWidth="6" fill="none" />
        <path d="M120 60 C 200 40, 260 110, 340 90 S 480 130, 560 100" stroke="#FF4300" strokeWidth="4" strokeLinecap="round" fill="none" strokeDasharray="1" pathLength={1} className="animate-draw" />
        <rect x="392" y="230" width="16" height="16" fill="#FF4300" />
        <rect x="380" y="218" width="40" height="40" fill="none" stroke="#FF4300" strokeWidth="2" opacity=".5" />
        <text x="420" y="205" fontFamily="Sofia Sans Condensed, Arial Narrow, sans-serif" fontWeight="700" fontSize="14" fill="#14181C" letterSpacing=".06em">ТАКСИМАНИЯ</text>
        <text x="60" y="380" fontFamily="Sofia Sans, Arial, sans-serif" fontSize="12" fill="#787E84">Загородное ш.</text>
        <text x="500" y="260" fontFamily="Sofia Sans, Arial, sans-serif" fontSize="12" fill="#787E84">МЦК · 5 мин</text>
      </svg>
      <div className="absolute bottom-3 left-3 rounded-1 bg-white px-3 py-2 t-caption text-asphalt-800 shadow-pop">{label}</div>
    </div>
  )
}
