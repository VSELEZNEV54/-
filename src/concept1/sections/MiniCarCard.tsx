import type { Car } from '../../data/cars'
import { tariffName } from '../../data/tariffs'
import { cn } from '../../lib/format'
import { Button } from '../../ui/Button'
import { Price, Tag } from '../../ui/Primitives'

/** Компактная карточка машины: результат подбора (тёмная) и «машины из статьи» (светлая) */
export function MiniCarCard({ car, inverse, primary, badge, onLead, className }: {
  car: Car; inverse?: boolean; primary?: boolean; badge?: string; onLead: (car: Car) => void; className?: string
}) {
  return (
    <article className={cn(
      'flex flex-col gap-4 rounded-2 border p-4 sm:flex-row sm:items-center sm:gap-5',
      inverse
        ? primary ? 'border-signal-500 bg-asphalt-800 text-asphalt-50' : 'border-[rgba(242,244,247,.14)] bg-asphalt-800 text-asphalt-50'
        : primary ? 'border-asphalt-950 bg-white' : 'border-asphalt-200 bg-white',
      className,
    )}>
      <div className="overflow-hidden rounded-1 bg-asphalt-100 sm:w-36 sm:shrink-0">
        <img src={car.images.cover} alt={car.name} loading="lazy" className="aspect-[4/3] w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn('t-caption', inverse ? 'text-asphalt-400' : 'text-asphalt-500')}>{tariffName(car.tariff)} · {car.bodyLabel}</span>
          {badge && <Tag tone="signal">{badge}</Tag>}
        </div>
        <div className="t-title-m truncate">{car.name}</div>
        <p className={cn('t-small', inverse ? 'text-asphalt-300' : 'text-asphalt-600')}>{car.benefit}</p>
        <Price value={car.priceFrom} size="s" inverse={inverse} className="mt-1" />
      </div>
      <Button size="s" variant={primary ? 'primary' : inverse ? 'ghost-inverse' : 'ghost'} onClick={() => onLead(car)} className="sm:shrink-0">Узнать наличие</Button>
    </article>
  )
}
