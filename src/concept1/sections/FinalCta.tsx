import { Phone } from 'lucide-react'
import { company } from '../../data/company'
import { phoneHref } from '../../lib/format'
import { LeadForm } from '../../shared/LeadForm'
import { Button } from '../../ui/Button'
import { Container, Section, SectionHeader } from '../../ui/Primitives'

const after = [
  'Менеджер перезвонит и уточнит тариф и график',
  'Назовёт наличие машин и цену, которая будет в договоре',
  'Согласует удобное время приезда в парк',
]

/** Финальный CTA — предложение подобрать, а не «оставьте заявку» */
export function FinalCta() {
  return (
    <Section id="lead" inverse className="scroll-mt-20">
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-8">
          <SectionHeader
            inverse label="Подбор"
            title={<>Не знаете, какую машину <span className="plate">выбрать</span>?</>}
            lead="Ответьте на несколько вопросов — подберём варианты под ваш тариф и бюджет."
          />
          <ol className="flex flex-col gap-4">
            {after.map((t, i) => (
              <li key={t} className="flex gap-4">
                <span className="t-number-l w-12 shrink-0 text-asphalt-600">0{i + 1}</span>
                <p className="pt-2 t-body text-asphalt-200">{t}</p>
              </li>
            ))}
          </ol>
          <div className="flex flex-col gap-3 border-t border-[rgba(242,244,247,.14)] pt-6">
            <span className="t-caption text-asphalt-400">Удобнее по телефону? Позвоните — ответим и подберём.</span>
            <Button variant="ghost-inverse" size="l" href={phoneHref(company.phone)} icon={<Phone className="size-4" />} className="self-start">{company.phone}</Button>
            <span className="t-caption !font-normal text-asphalt-500">Поддержка круглосуточно · {company.phoneSupport}</span>
          </div>
        </div>
        <div className="rounded-2 border border-[rgba(242,244,247,.14)] bg-asphalt-950 p-6 md:p-8">
          <div className="mb-6 flex flex-col gap-1">
            <span className="t-label text-signal-400">Заявка</span>
            <h3 className="t-title-l">Подобрать автомобиль</h3>
          </div>
          <LeadForm inverse withTariff submitLabel="Подобрать автомобиль" legalVariant="full" />
        </div>
      </Container>
    </Section>
  )
}
