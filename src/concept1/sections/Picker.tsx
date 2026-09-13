import { useMemo, useState, type ReactNode } from 'react'
import { minPriceForTariff, pickCars, pickerPriorities, type Car, type PickerPriority } from '../../data/cars'
import { tariffs, type TariffId } from '../../data/tariffs'
import { useLead } from '../../shared/LeadContext'
import { formatPrice, pluralWith } from '../../lib/format'
import { ChipGroup } from '../../ui/Form'
import { Container, Section, SectionHeader } from '../../ui/Primitives'
import { MiniCarCard } from './MiniCarCard'

type TariffChoice = TariffId | 'any' | ''
type PriorityChoice = PickerPriority | ''

/** «Какую машину выбрать» — подбор в 2 шага на тёмном фоне */
export function Picker() {
  const [tariff, setTariff] = useState<TariffChoice>('')
  const [priority, setPriority] = useState<PriorityChoice>('')
  const { openLead } = useLead()
  const result = useMemo(() => (tariff && priority ? pickCars(tariff, priority) : []), [tariff, priority])
  const lead = (car: Car) => openLead({ context: car.name, title: 'Узнать наличие', tariff: car.tariff })

  const tariffOptions = [
    ...tariffs.map((t) => ({ value: t.id as TariffChoice, label: t.name, hint: `от ${formatPrice(minPriceForTariff(t.id))}/день` })),
    { value: 'any' as TariffChoice, label: 'Не знаю', hint: 'подберём по приоритету' },
  ]
  const priorityOptions = pickerPriorities.map((p) => ({ value: p.id as PriorityChoice, label: p.label, hint: p.hint }))

  return (
    <Section id="picker" inverse className="scroll-mt-20 !bg-asphalt-950">
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="flex flex-col gap-8">
          <SectionHeader
            inverse label="Подбор за 2 шага"
            title={<>Какую машину <span className="plate">выбрать</span>?</>}
            lead="Ответьте на два вопроса — покажем 2–3 машины парка под ваш тариф и приоритет."
          />
          <Step n="01" title="Какой тариф хотите использовать?">
            <ChipGroup inverse options={tariffOptions} value={tariff} onChange={setTariff} />
          </Step>
          <Step n="02" title="Что для вас важнее?">
            <ChipGroup inverse options={priorityOptions} value={priority} onChange={setPriority} />
          </Step>
        </div>

        <div className="flex flex-col gap-4 lg:pt-2">
          <div className="flex items-baseline justify-between gap-4 border-b border-[rgba(242,244,247,.14)] pb-3">
            <span className="t-label text-signal-400">Результат</span>
            <span className="t-caption text-asphalt-400">{result.length ? pluralWith(result.length, 'машина', 'машины', 'машин') : 'ждём два ответа'}</span>
          </div>
          {result.length > 0 ? (
            <div key={`${tariff}-${priority}`} className="flex flex-col gap-3 animate-fade-up">
              {result.map((car, i) => (
                <MiniCarCard key={car.slug} car={car} inverse primary={i === 0} badge={i === 0 ? 'Лучший вариант' : undefined} onLead={lead} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-2 border border-dashed border-asphalt-700 p-8 text-center">
              <span className="t-display-m text-asphalt-600">2–3 машины</span>
              <p className="t-small max-w-xs text-asphalt-400">Выберите тариф и приоритет — здесь появятся подходящие автомобили с ценой за день.</p>
            </div>
          )}
          <p className="t-caption !font-normal text-asphalt-500">Подбор ориентировочный — окончательно машину выбираете в парке.</p>
        </div>
      </Container>
    </Section>
  )
}

function Step({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="t-number-l text-asphalt-600">{n}</span>
        <h3 className="t-title-l">{title}</h3>
      </div>
      {children}
    </div>
  )
}
