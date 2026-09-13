import { Link } from 'react-router-dom'
import { ArrowRight, Check, Phone } from 'lucide-react'
import type { Car } from '../../data/cars'
import { tariffName } from '../../data/tariffs'
import { company } from '../../data/company'
import { Button } from '../../ui/Button'
import { Price } from '../../ui/Primitives'
import { useLead } from '../../shared/LeadContext'
import { leadForCar } from './helpers'
import { c2 } from '../Layout'
import { cn, phoneHref } from '../../lib/format'

const facts = ['Без залога', 'Цена фиксируется в договоре', 'Первый день аренды бесплатно']

/** Панель бронирования: на десктопе липнет под шапкой, на мобильном — обычный блок */
export function BookingPanel({ car, className }: { car: Car; className?: string }) {
  const { openLead } = useLead()
  return (
    <aside className={cn('rounded-2 bg-asphalt-950 p-5 text-asphalt-50 on-dark md:p-6 lg:sticky lg:top-24', className)} aria-label="Заявка на автомобиль">
      <div className="t-label text-signal-400">{tariffName(car.tariff)}</div>
      <div className="mt-1 t-title-l">{car.name}</div>
      <div className="mt-3"><Price value={car.priceFrom} size="l" inverse /></div>
      <ul className="mt-4 flex flex-col gap-2 border-t border-[rgba(242,244,247,.14)] pt-4">
        {facts.map((f) => <li key={f} className="flex items-center gap-2 t-small text-asphalt-200"><Check className="size-4 shrink-0 text-signal-400" strokeWidth={2.25} />{f}</li>)}
      </ul>
      <div className="mt-5 flex flex-col gap-2">
        <Button size="l" full onClick={() => openLead({ ...leadForCar(car), title: 'Оставить заявку', submitLabel: 'Оставить заявку' })}>Оставить заявку</Button>
        <Button size="l" full variant="ghost-inverse" href={phoneHref(company.phone)} icon={<Phone className="size-4" />}>Позвонить</Button>
      </div>
      <Link to={`${c2.compare}?cars=${car.slug}`} className="mt-4 inline-flex items-center gap-1.5 t-small text-asphalt-300 transition-colors duration-fast hover:text-signal-400">Сравнить с другими <ArrowRight className="size-4" /></Link>
      <p className="mt-4 t-caption !font-normal text-asphalt-500">Решение о выдаче — за 10 минут. Поддержка {company.phoneSupport}, круглосуточно.</p>
    </aside>
  )
}
