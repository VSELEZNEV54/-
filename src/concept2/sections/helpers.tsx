import type { ReactNode } from 'react'
import { Cog, Fuel, Gauge, Settings2, Zap, type LucideIcon } from 'lucide-react'
import type { Car } from '../../data/cars'
import { fuelLabel } from '../../data/cars'
import type { LeadOptions } from '../../shared/LeadContext'
import { cn } from '../../lib/format'

/** Опции заявки для конкретной машины: контекст + предвыбранный тариф */
export const leadForCar = (car: Car): LeadOptions => ({
  context: car.name, title: 'Узнать наличие', submitLabel: 'Узнать наличие', tariff: car.tariff,
})

export const consumptionLabel = (car: Car) => (car.fuel === 'electric' ? 'Запас хода' : 'Расход')

/**
 * Обёртка для Calculator variant="full": в общем компоненте колонка результата узкая,
 * и цифры «83 640 ₽» переносятся на две строки. Даём результату больше места и
 * слегка уменьшаем кегль числа — без правок shared/.
 */
export const calcFullWrap = '[&>div]:lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] [&_.t-number-l]:text-[clamp(36px,3.4vw,52px)]'

export interface Spec { icon: LucideIcon; label: string; value: string }

/** Четыре ключевые характеристики для иконочной строки */
export function carSpecs(car: Car): Spec[] {
  return [
    { icon: Settings2, label: 'Коробка', value: car.gearbox },
    { icon: car.fuel === 'electric' ? Zap : Cog, label: 'Двигатель', value: car.engine },
    { icon: Fuel, label: 'Топливо', value: fuelLabel(car.fuel) },
    { icon: Gauge, label: consumptionLabel(car), value: car.consumption },
  ]
}

/** Бейдж партнёра: единственное место, где используется жёлтый Яндекса */
export function PartnerBadge({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex h-9 items-center gap-2 rounded-1 bg-partner-yandex px-3 t-label text-asphalt-950', className)}>
      <span className="size-2 rounded-full bg-asphalt-950" aria-hidden />
      Официальный партнёр Яндекс Go
    </span>
  )
}

/** Список с короткими оранжевыми маркерами (как в prose-tm) */
export function DashList({ items, className, inverse, size = 'body' }: { items: ReactNode[]; className?: string; inverse?: boolean; size?: 'body' | 'small' }) {
  return (
    <ul className={cn('flex flex-col gap-2', className)}>
      {items.map((it, i) => (
        <li key={i} className={cn('relative pl-5', size === 'body' ? 't-body' : 't-small', inverse ? 'text-asphalt-200' : 'text-asphalt-700')}>
          <span className="absolute left-0 top-[.72em] h-0.5 w-3 bg-signal-500" aria-hidden />
          {it}
        </li>
      ))}
    </ul>
  )
}

/** Подзаголовок внутри контентной колонки: H2 + лид + действие справа */
export function SubSection({ id, title, lead, action, children, className, inverse }: {
  id?: string; title: ReactNode; lead?: ReactNode; action?: ReactNode; children: ReactNode; className?: string; inverse?: boolean
}) {
  return (
    <section id={id} className={cn('flex flex-col gap-5 scroll-mt-24', className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="flex max-w-3xl flex-col gap-1.5">
          <h2 className={cn('t-display-m', inverse ? 'text-asphalt-50' : 'text-asphalt-950')}>{title}</h2>
          {lead && <p className={cn('t-small', inverse ? 'text-asphalt-300' : 'text-asphalt-600')}>{lead}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </section>
  )
}
