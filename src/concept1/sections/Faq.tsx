import { useState } from 'react'
import { company } from '../../data/company'
import { faq, faqByGroup, faqGroupLabels, faqGroups, type FaqGroup } from '../../data/faq'
import { phoneHref } from '../../lib/format'
import { Accordion } from '../../ui/Accordion'
import { Container, Kicker, NeedsConfirm, Section } from '../../ui/Primitives'
import { Tabs } from '../../ui/Tabs'

type Group = 'all' | FaqGroup

/** FAQ: слева sticky заголовок и табы по группам, справа аккордеон */
export function FaqSection() {
  const [group, setGroup] = useState<Group>('all')
  const list = group === 'all' ? faq : faqByGroup(group)
  const items = [
    { id: 'all' as Group, label: 'Все', count: faq.length },
    ...faqGroups.map((g) => ({ id: g as Group, label: faqGroupLabels[g], count: faqByGroup(g).length })),
  ]
  return (
    <Section id="faq" className="scroll-mt-20">
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-12">
        <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <Kicker>FAQ</Kicker>
          <h2 className="t-display-l">Вопросы и ответы</h2>
          <p className="t-lead text-asphalt-600">Ответы — с сайта парка. Пункты с пометкой уточняются у менеджера до подписания договора.</p>
          <Tabs items={items} value={group} onChange={setGroup} ariaLabel="Разделы FAQ" />
          <p className="t-small text-asphalt-600">
            Не нашли ответ? Позвоните: <a href={phoneHref(company.phone)} className="font-semibold text-asphalt-950 underline underline-offset-2">{company.phone}</a>
          </p>
        </div>
        <Accordion
          key={group}
          items={list.map((f) => ({ id: f.id, title: f.q, content: f.a, meta: f.needsConfirmation ? <NeedsConfirm /> : undefined }))}
        />
      </Container>
    </Section>
  )
}
