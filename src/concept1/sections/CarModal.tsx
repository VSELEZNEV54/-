import { useEffect, useState } from 'react'
import { fuelLabel, type Car } from '../../data/cars'
import { tariffName } from '../../data/tariffs'
import { cn } from '../../lib/format'
import { Button } from '../../ui/Button'
import { Modal } from '../../ui/Modal'
import { Kicker, Price, Tag } from '../../ui/Primitives'

/** Модалка «Подробнее» — в C1 нет страниц машин, вся фактура здесь */
export function CarModal({ car, onClose, onLead }: { car: Car | null; onClose: () => void; onLead: (car: Car) => void }) {
  const [idx, setIdx] = useState(0)
  useEffect(() => { setIdx(0) }, [car?.slug])
  if (!car) return null

  const photos = [...car.images.gallery, ...(car.images.interior ? [car.images.interior] : [])]
  const current = photos[Math.min(idx, photos.length - 1)]
  const specs: [string, string][] = [
    ['Тариф', tariffName(car.tariff)],
    ['Коробка', car.gearbox],
    ['Двигатель', car.engine],
    ['Топливо', fuelLabel(car.fuel)],
    ['Расход', car.consumption],
    ['Кузов', car.bodyLabel],
    ['Возраст', car.yearNote],
  ]

  return (
    <Modal
      open onClose={onClose} size="l"
      title={
        <div className="flex flex-col gap-1.5">
          <Kicker>{tariffName(car.tariff)} · {car.bodyLabel}</Kicker>
          <h3 className="t-display-m">{car.name}</h3>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.15fr_1fr] md:gap-8">
        <div className="flex flex-col gap-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2 bg-asphalt-100">
            <img key={current} src={current} alt={`${car.name}, фото ${idx + 1}`} className="h-full w-full object-cover animate-fade-in" />
            <span className="absolute left-3 top-3 flex gap-1.5">
              <Tag tone="dark">{tariffName(car.tariff)}</Tag>
              {car.fuel === 'electric' && <Tag tone="signal">Электро</Tag>}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {photos.map((p, i) => (
              <button
                key={p} type="button" onClick={() => setIdx(i)} aria-label={`Фото ${i + 1}`} aria-pressed={i === idx}
                className={cn('aspect-[4/3] overflow-hidden rounded-1 border-2 bg-asphalt-100 transition-colors duration-fast', i === idx ? 'border-signal-500' : 'border-transparent hover:border-asphalt-400')}
              >
                <img src={p} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <Price value={car.priceFrom} size="l" />
          <p className="t-body text-asphalt-600">{car.benefit}</p>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-y border-asphalt-200 py-4">
            {specs.map(([k, v]) => (
              <div key={k} className="flex flex-col">
                <dt className="t-caption text-asphalt-500">{k}</dt>
                <dd className="t-small font-semibold text-asphalt-950">{v}</dd>
              </div>
            ))}
          </dl>
          <Button size="l" full onClick={() => onLead(car)}>Узнать наличие</Button>
          <p className="t-caption !font-normal text-asphalt-500">Конкретный автомобиль вы осматриваете в парке перед подписанием договора.</p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <div className="mb-3 t-label text-signal-700">Что важно водителю</div>
          <ul className="flex flex-col divide-y divide-asphalt-200 border-y border-asphalt-200">
            {car.forDriver.map((f) => (
              <li key={f.title} className="py-3">
                <div className="t-title-m">{f.title}</div>
                <p className="mt-0.5 t-small text-asphalt-600">{f.text}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-3 t-label text-signal-700">Подойдёт, если вы</div>
          <ul className="flex flex-col gap-3">
            {car.fitsIf.map((f) => (
              <li key={f} className="flex items-start gap-3 t-body text-asphalt-800">
                <span className="mt-3 h-0.5 w-4 shrink-0 bg-signal-500" aria-hidden />{f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  )
}
