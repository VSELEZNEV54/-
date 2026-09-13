import { useMemo, useState } from 'react'
import { cars, type Car } from '../../data/cars'
import { tariffs, type TariffId } from '../../data/tariffs'
import { useLead } from '../../shared/LeadContext'
import { Button } from '../../ui/Button'
import { Container, Reveal, Section, SectionHeader } from '../../ui/Primitives'
import { Tabs } from '../../ui/Tabs'
import { C1CarCard } from './C1CarCard'
import { CarModal } from './CarModal'

type Filter = 'all' | TariffId | 'electric'

/** Быстрый выбор машины: табы по тарифам, сетка карточек, модалка «Подробнее» */
export function CarSelector() {
  const [filter, setFilter] = useState<Filter>('all')
  const [detail, setDetail] = useState<Car | null>(null)
  const { openLead } = useLead()

  const list = useMemo(() => (
    filter === 'all' ? cars : filter === 'electric' ? cars.filter((c) => c.fuel === 'electric') : cars.filter((c) => c.tariff === filter)
  ), [filter])

  const items = [
    { id: 'all' as Filter, label: 'Все', count: cars.length },
    ...tariffs.map((t) => ({ id: t.id as Filter, label: t.name, count: cars.filter((c) => c.tariff === t.id).length })),
    { id: 'electric' as Filter, label: 'Электро', count: cars.filter((c) => c.fuel === 'electric').length },
  ]

  const lead = (car: Car) => { setDetail(null); openLead({ context: car.name, title: 'Узнать наличие', tariff: car.tariff }) }

  return (
    <Section id="cars" className="scroll-mt-20">
      <Container className="flex flex-col gap-8 md:gap-12">
        <SectionHeader
          label="Автомобили"
          title={<>Выберите машину под свой <span className="plate">тариф</span></>}
          lead="Десять моделей от Kia Rio до Hongqi H5, не старше 3 лет. Цена — за день аренды, фиксируется в договоре."
        />
        <Tabs items={items} value={filter} onChange={setFilter} size="l" ariaLabel="Фильтр по тарифу" />
        <div key={filter} className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {list.map((car, i) => (
            <Reveal key={car.slug} delay={(i % 3) * 60}>
              <C1CarCard car={car} onLead={lead} onDetails={setDetail} className="h-full" />
            </Reveal>
          ))}
        </div>
        <div className="flex flex-col gap-3 border-t border-asphalt-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="t-body text-asphalt-600">Не нашли свою машину? В парке 1000+ автомобилей — менеджер подберёт под ваш тариф.</p>
          <Button variant="link" onClick={() => openLead({ title: 'Подобрать автомобиль', withTariff: true, submitLabel: 'Подобрать автомобиль' })}>Подобрать автомобиль</Button>
        </div>
      </Container>
      <CarModal car={detail} onClose={() => setDetail(null)} onLead={lead} />
    </Section>
  )
}
