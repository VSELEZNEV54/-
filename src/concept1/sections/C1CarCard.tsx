import { Fuel, Gauge, Settings2, Zap } from 'lucide-react'
import type { Car } from '../../data/cars'
import { tariffName } from '../../data/tariffs'
import { cn } from '../../lib/format'
import { Button } from '../../ui/Button'
import { Price, Tag } from '../../ui/Primitives'

/** Карточка машины для лендинга C1: «Подробнее» открывает модалку, «Узнать наличие» — заявку */
export function C1CarCard({ car, onLead, onDetails, className }: {
  car: Car; onLead: (car: Car) => void; onDetails: (car: Car) => void; className?: string
}) {
  const specs = [
    { icon: Settings2, label: car.gearbox },
    { icon: car.fuel === 'electric' ? Zap : Fuel, label: car.fuel === 'electric' ? 'Электро' : `${car.engine}, бензин` },
    { icon: Gauge, label: car.consumption },
  ]
  return (
    <article className={cn('group flex flex-col overflow-hidden rounded-2 border border-asphalt-200 bg-white transition-colors duration-fast hover:border-asphalt-950', className)}>
      <button type="button" onClick={() => onDetails(car)} className="relative block aspect-[4/3] w-full overflow-hidden bg-asphalt-100 text-left" aria-label={`Подробнее: ${car.name}`}>
        <img src={car.images.cover} alt={car.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-slow ease-out-brand group-hover:scale-[1.03]" />
        <span className="absolute left-3 top-3 flex gap-1.5">
          <Tag tone="dark">{tariffName(car.tariff)}</Tag>
          {car.fuel === 'electric' && <Tag tone="signal">Электро</Tag>}
        </span>
      </button>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="min-w-0">
          <h3 className="t-title-l">
            <button type="button" onClick={() => onDetails(car)} className="text-left transition-colors duration-fast hover:text-signal-700">{car.name}</button>
          </h3>
          <p className="t-small text-asphalt-600">{car.benefit}</p>
        </div>
        <Price value={car.priceFrom} size="m" />
        <ul className="grid grid-cols-1 gap-x-3 gap-y-1.5 t-small text-asphalt-700 sm:grid-cols-3">
          {specs.map((s, i) => (
            <li key={i} className="flex items-center gap-2"><s.icon className="size-4 shrink-0 text-asphalt-400" strokeWidth={1.75} />{s.label}</li>
          ))}
        </ul>
        <div className="mt-auto flex gap-2 pt-2">
          <Button variant="ghost" onClick={() => onDetails(car)} className="flex-1">Подробнее</Button>
          <Button onClick={() => onLead(car)} className="flex-1">Узнать наличие</Button>
        </div>
      </div>
    </article>
  )
}
