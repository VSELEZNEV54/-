import { Calculator } from '../../shared/Calculator'
import { useLead } from '../../shared/LeadContext'
import { Container, Section, SectionHeader } from '../../ui/Primitives'

/** Экономика водителя — калькулятор из shared, дисклеймер внутри */
export function Economics() {
  const { openLead } = useLead()
  return (
    <Section id="economics" inverse className="scroll-mt-20 border-t border-[rgba(242,244,247,.14)]">
      <Container className="flex flex-col gap-8 md:gap-12">
        <SectionHeader
          inverse label="Калькулятор"
          title={<>Посчитайте экономику <span className="plate">смены</span></>}
          lead="Тариф, машина, дни и часы — и вы видите выручку, аренду и остаток за неделю. Формула — с сайта парка, ставки ориентировочные."
        />
        <Calculator variant="full" inverse onLead={({ car, tariff }) => openLead({ context: car?.name, title: 'Узнать наличие', tariff })} />
      </Container>
    </Section>
  )
}
