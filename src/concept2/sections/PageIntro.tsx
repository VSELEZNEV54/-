import type { ReactNode } from 'react'
import { Breadcrumbs, Container, Kicker } from '../../ui/Primitives'
import { cn } from '../../lib/format'

/** Шапка страницы платформы: белая полоса с крошками, H1 и лидом */
export function PageIntro({ crumbs, label, title, lead, aside, children, className, size = 'l' }: {
  crumbs: { label: string; to?: string }[]
  label?: string
  title: ReactNode
  lead?: ReactNode
  aside?: ReactNode
  children?: ReactNode
  className?: string
  size?: 'l' | 'm'
}) {
  return (
    <div className={cn('border-b border-asphalt-200 bg-white', className)}>
      <Container className="flex flex-col gap-5 py-6 md:gap-6 md:py-8">
        <Breadcrumbs items={crumbs} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="flex max-w-3xl flex-col gap-3">
            {label && <Kicker>{label}</Kicker>}
            <h1 className={size === 'l' ? 't-display-l' : 't-display-m'}>{title}</h1>
            {lead && <p className="t-lead text-asphalt-600">{lead}</p>}
          </div>
          {aside && <div className="shrink-0">{aside}</div>}
        </div>
        {children}
      </Container>
    </div>
  )
}
