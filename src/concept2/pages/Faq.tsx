import { Phone } from 'lucide-react'
import { Page } from '../../shared/Page'
import { LeadForm } from '../../shared/LeadForm'
import { Accordion } from '../../ui/Accordion'
import { Container, NeedsConfirm, Section } from '../../ui/Primitives'
import { C2, c2 } from '../Layout'
import { faq, faqGroupLabels, faqGroups, type FaqGroup } from '../../data/faq'
import { company } from '../../data/company'
import { phoneHref, pluralWith } from '../../lib/format'
import { ContentHead, InlineLink, StickyNav } from '../sections/ContentShared'

const groupLinks: Partial<Record<FaqGroup, { label: string; to: string }>> = {
  rental: { label: 'Все условия аренды на одной странице', to: c2.terms },
  payment: { label: 'Стоимость, депозит и комиссии — в условиях аренды', to: c2.terms },
  cars: { label: 'Каталог автомобилей парка', to: c2.cars },
  documents: { label: 'Чек-лист документов для аренды', to: c2.article('dokumenty-dlya-arendy') },
  work: { label: 'Тарифы и калькулятор заработка', to: c2.tariffs },
  service: { label: 'Контакты поддержки', to: c2.contact },
}

export function C2Faq() {
  const groups = faqGroups.map((g) => ({ id: g, label: faqGroupLabels[g], items: faq.filter((f) => f.group === g) }))

  return (
    <Page title="Вопросы и ответы об аренде авто под такси — Таксимания">
      <ContentHead
        crumbs={[{ label: 'Главная', to: C2 }, { label: 'FAQ' }]}
        label="FAQ"
        title="Вопросы и ответы об аренде авто под такси"
        lead={`${faq.length} вопросов по ${faqGroups.length} темам: аренда, оплата, автомобили, работа, обслуживание и документы. Ответы — с текущего сайта парка; то, чего на сайте нет, помечено «уточняется у парка».`}
      >
      </ContentHead>

      <Section tight>
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
          <StickyNav
            title="Темы"
            items={groups.map((g) => ({ id: g.id, label: g.label, count: g.items.length }))}
            footer={<InlineLink to={c2.terms}>Условия аренды</InlineLink>}
          />
          <div className="flex flex-col gap-10 md:gap-14">
            {groups.map((g, gi) => (
              <section key={g.id} id={g.id} className={gi === 0 ? 'scroll-mt-20' : 'scroll-mt-20 border-t border-asphalt-200 pt-8 md:pt-10'}>
                <div className="mb-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h2 className="t-display-m">{g.label}</h2>
                  <span className="t-caption tabular text-asphalt-500">{pluralWith(g.items.length, 'вопрос', 'вопроса', 'вопросов')}</span>
                </div>
                <Accordion
                  key={g.id}
                  single={false}
                  items={g.items.map((f) => ({ id: f.id, title: f.q, content: f.a, meta: f.needsConfirmation ? <NeedsConfirm /> : undefined }))}
                />
                {groupLinks[g.id] && <div className="pt-4"><InlineLink to={groupLinks[g.id]!.to}>{groupLinks[g.id]!.label}</InlineLink></div>}
              </section>
            ))}
          </div>
        </Container>
      </Section>

      <Section tight className="border-t border-asphalt-200 bg-white">
        <Container className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div className="flex flex-col gap-4">
            <h2 className="t-display-m">Не нашли ответ?</h2>
            <p className="t-body text-asphalt-600">Позвоните — менеджер ответит по условиям и наличию машин. Поддержка водителей на линии круглосуточно.</p>
            <a href={phoneHref(company.phone)} className="inline-flex items-center gap-2 t-title-l hover:text-signal-700 transition-colors duration-fast"><Phone className="size-5" />{company.phone}</a>
            <span className="-mt-2 t-caption text-asphalt-500">поддержка {company.phoneSupportNote} · {company.phoneSupport}</span>
          </div>
          <div className="rounded-2 border border-asphalt-200 bg-asphalt-50 p-5 md:p-6">
            <LeadForm compact submitLabel="Задать вопрос" context="Вопрос из FAQ" />
          </div>
        </Container>
      </Section>
    </Page>
  )
}
