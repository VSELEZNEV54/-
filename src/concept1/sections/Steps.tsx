import { steps } from '../../data/company'
import { useLead } from '../../shared/LeadContext'
import { Button } from '../../ui/Button'
import { Container, Reveal, Section, SectionHeader, Tag } from '../../ui/Primitives'

/** «Начать за 4 шага» — timeline: горизонтальная линия маршрута на десктопе, вертикальная на мобильном */
export function Steps() {
  const { openLead } = useLead()
  return (
    <Section id="start" className="scroll-mt-20">
      <Container className="flex flex-col gap-8 md:gap-12">
        <SectionHeader
          label="Как начать"
          title={<>Начать за <span className="plate">4 шага</span></>}
          lead="От заявки до выхода на линию — обычно в тот же день. Решение о выдаче принимаем за 10 минут."
        />
        <ol className="relative flex flex-col gap-8 before:absolute before:bottom-2 before:left-[6px] before:top-2 before:w-1 before:bg-signal-500 lg:grid lg:grid-cols-4 lg:gap-6 lg:before:bottom-auto lg:before:left-0 lg:before:right-0 lg:before:top-[6px] lg:before:h-1 lg:before:w-auto">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 60} className="relative pl-9 lg:pl-0 lg:pt-10">
              <span className="absolute left-0 top-1 size-4 bg-asphalt-950 lg:top-0" aria-hidden />
              <div className="flex flex-col gap-3">
                <span className="t-number-l text-asphalt-300">{s.n}</span>
                <h3 className="t-title-l">{s.title}</h3>
                <p className="t-body text-asphalt-600">{s.text}</p>
                <Tag tone={i === steps.length - 1 ? 'dark' : 'neutral'} className="self-start">{s.time}</Tag>
              </div>
            </Reveal>
          ))}
        </ol>
        <div className="flex flex-col gap-4 rounded-2 border border-asphalt-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
          <div>
            <div className="t-title-l">Готовы начать?</div>
            <p className="t-small text-asphalt-600">Два поля — имя и телефон. Менеджер перезвонит и уточнит наличие машины.</p>
          </div>
          <Button size="l" onClick={() => openLead({ title: 'Оставить заявку', withTariff: true })} className="shrink-0">Оставить заявку</Button>
        </div>
      </Container>
    </Section>
  )
}
