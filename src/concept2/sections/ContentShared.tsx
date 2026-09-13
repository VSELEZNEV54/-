import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, SquareCheck } from 'lucide-react'
import { Breadcrumbs, Container, Kicker, Section } from '../../ui/Primitives'
import { LeadForm, type LeadFormProps } from '../../shared/LeadForm'
import { cn } from '../../lib/format'

/* ------------------------------------------------------------------
   Общие блоки контентных страниц Concept 02: шапка, sticky-оглавление,
   нумерованная секция документа, чек-лист, группа ссылок, тёмный CTA.
   ------------------------------------------------------------------ */

export interface Crumb { label: string; to?: string }

/** Крошки → метка → H1 → лид. Без Section: следующая секция задаёт ритм. */
export function ContentHead({ crumbs, label, title, lead, aside, children, className }: {
  crumbs: Crumb[]; label?: string; title: ReactNode; lead?: ReactNode; aside?: ReactNode; children?: ReactNode; className?: string
}) {
  return (
    <Container className={cn('flex flex-col gap-6 pt-6 md:pt-10', className)}>
      <Breadcrumbs items={crumbs} />
      <div className={cn('grid gap-6', !!aside && 'lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12')}>
        <div className="flex max-w-4xl flex-col gap-3">
          {label && <Kicker>{label}</Kicker>}
          <h1 className="t-display-l">{title}</h1>
          {lead && <p className="t-lead max-w-2xl text-asphalt-600">{lead}</p>}
        </div>
        {aside}
      </div>
      {children}
    </Container>
  )
}

/** Подсветка активного раздела по IntersectionObserver */
export function useActiveSection(ids: string[]) {
  const key = ids.join('|')
  const [active, setActive] = useState(ids[0] ?? '')
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
    if (!els.length || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible[0]) setActive(visible[0].target.id)
    }, { rootMargin: '-88px 0px -55% 0px', threshold: 0 })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return active
}

/** Sticky-оглавление слева. Скрыто на мобильном. */
export function StickyNav({ items, title = 'На этой странице', className, footer }: {
  items: { id: string; label: string; count?: number }[]; title?: string; className?: string; footer?: ReactNode
}) {
  const active = useActiveSection(items.map((i) => i.id))
  return (
    <nav aria-label={title} className={cn('hidden lg:block lg:sticky lg:top-24 lg:self-start', className)}>
      <div className="t-label text-asphalt-500 mb-3">{title}</div>
      <ol className="flex flex-col border-l border-asphalt-200">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className={cn(
                '-ml-px flex items-center justify-between gap-3 border-l-2 py-1.5 pl-4 pr-2 t-small transition-colors duration-fast',
                active === it.id ? 'border-signal-500 font-semibold text-asphalt-950' : 'border-transparent text-asphalt-600 hover:text-asphalt-950',
              )}
            >
              <span>{it.label}</span>
              {typeof it.count === 'number' && <span className="t-caption !font-normal tabular text-asphalt-400">{it.count}</span>}
            </a>
          </li>
        ))}
      </ol>
      {footer && <div className="mt-6">{footer}</div>}
    </nav>
  )
}

/** Нумерованный раздел документа: «01 · Стоимость» */
export function DocSection({ id, n, title, children, meta, className }: { id: string; n: string; title: ReactNode; children: ReactNode; meta?: ReactNode; className?: string }) {
  return (
    <section id={id} className={cn('flex scroll-mt-20 flex-col gap-5 border-t border-asphalt-200 pt-8 md:pt-10', className)}>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <span className="t-label tabular text-signal-700">{n}</span>
        <h2 className="t-display-m">{title}</h2>
        {meta}
      </div>
      {children}
    </section>
  )
}

/** Чек-лист с квадратной галкой */
export function CheckList({ items, inverse, columns = 1, className, size = 'm' }: { items: ReactNode[]; inverse?: boolean; columns?: 1 | 2; className?: string; size?: 'm' | 's' }) {
  return (
    <ul className={cn('grid gap-2.5', columns === 2 && 'sm:grid-cols-2', className)}>
      {items.map((it, i) => (
        <li key={i} className={cn('flex items-start gap-3', size === 's' ? 't-small' : 't-body', inverse ? 'text-asphalt-200' : 'text-asphalt-800')}>
          <SquareCheck className={cn('mt-0.5 size-5 shrink-0', inverse ? 'text-signal-400' : 'text-signal-700')} strokeWidth={1.75} />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  )
}

/** Группа внутренних ссылок (перелинковка) */
export function LinkGroup({ title, links, className, inverse }: { title: string; links: { label: string; to: string; hint?: string }[]; className?: string; inverse?: boolean }) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className={cn('t-label', inverse ? 'text-asphalt-400' : 'text-asphalt-500')}>{title}</div>
      <ul className={cn('flex flex-col divide-y border-y', inverse ? 'divide-[rgba(242,244,247,.14)] border-[rgba(242,244,247,.14)]' : 'divide-asphalt-200 border-asphalt-200')}>
        {links.map((l) => (
          <li key={l.to + l.label}>
            <Link to={l.to} className={cn('group flex items-center justify-between gap-3 py-2.5 t-small transition-colors duration-fast', inverse ? 'text-asphalt-200 hover:text-signal-400' : 'text-asphalt-800 hover:text-signal-700')}>
              <span className="min-w-0 truncate">{l.label}</span>
              <span className={cn('flex shrink-0 items-center gap-2 t-caption !font-normal tabular', inverse ? 'text-asphalt-400' : 'text-asphalt-500')}>
                {l.hint}
                <ArrowRight className={cn('size-4 transition-transform duration-fast group-hover:translate-x-0.5', inverse ? 'text-asphalt-500' : 'text-asphalt-400')} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Тёмный финальный CTA с инлайн-формой */
export function DarkCta({ label = 'Заявка', title, lead, form, children, id, stacked }: {
  label?: string; title: ReactNode; lead?: ReactNode; form?: Omit<LeadFormProps, 'inverse'>; children?: ReactNode; id?: string; stacked?: boolean
}) {
  return (
    <Section inverse tight id={id} className="bg-asphalt-950">
      <Container className={cn('grid gap-8', stacked ? 'lg:gap-10' : 'lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-16')}>
        <div className="flex flex-col gap-3">
          <Kicker inverse>{label}</Kicker>
          <h2 className="t-display-l">{title}</h2>
          {lead && <p className="t-lead max-w-xl text-asphalt-300">{lead}</p>}
          {children}
        </div>
        <LeadForm inverse compact {...form} />
      </Container>
    </Section>
  )
}

/** Мелкая строка-ссылка «Читайте также / Смотрите» */
export function InlineLink({ to, children, className }: { to: string; children: ReactNode; className?: string }) {
  return (
    <Link to={to} className={cn('group inline-flex items-center gap-1.5 t-small font-semibold text-signal-700 transition-colors duration-fast hover:text-signal-500', className)}>
      {children}<ArrowRight className="size-4 transition-transform duration-fast group-hover:translate-x-0.5" />
    </Link>
  )
}
