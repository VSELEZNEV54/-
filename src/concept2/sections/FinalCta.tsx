import type { ReactNode } from 'react'
import { Phone } from 'lucide-react'
import { Container, Kicker } from '../../ui/Primitives'
import { company } from '../../data/company'
import { phoneHref } from '../../lib/format'

/** Финальный CTA страницы: тёмная секция, слева заголовок и телефон, справа форма */
export function FinalCta({ label = 'Заявка', title, lead, children }: { label?: string; title: ReactNode; lead?: ReactNode; children: ReactNode }) {
  return (
    <section className="section-y bg-asphalt-950 text-asphalt-50 on-dark">
      <Container className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.25fr] lg:items-start lg:gap-12">
        <div className="flex flex-col gap-4">
          <Kicker inverse>{label}</Kicker>
          <h2 className="t-display-l">{title}</h2>
          {lead && <p className="t-lead text-asphalt-300">{lead}</p>}
          <div className="mt-2 flex flex-col gap-1 border-t border-[rgba(242,244,247,.14)] pt-5">
            <a href={phoneHref(company.phone)} className="inline-flex items-center gap-3 t-display-m transition-colors duration-fast hover:text-signal-400"><Phone className="size-6" strokeWidth={1.75} />{company.phone}</a>
            <span className="t-small text-asphalt-400">Поддержка круглосуточно · {company.phoneSupport}</span>
          </div>
        </div>
        <div className="rounded-2 border border-[rgba(242,244,247,.14)] bg-asphalt-900 p-5 md:p-6">{children}</div>
      </Container>
    </section>
  )
}
