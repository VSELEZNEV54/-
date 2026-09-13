import { Link } from 'react-router-dom'
import { ArrowRight, Zap } from 'lucide-react'
import { carsByTariff, electricCars, minPriceForTariff } from '../../data/cars'
import type { Tariff } from '../../data/tariffs'
import { Button } from '../../ui/Button'
import { Price, Tag } from '../../ui/Primitives'
import { DashList } from './helpers'
import { c2 } from '../Layout'
import { cn, formatNumber, pluralWith } from '../../lib/format'

const carsWord = (n: number) => pluralWith(n, 'машина', 'машины', 'машин')

/** Компактная плитка-вход в тариф (главная, «другие тарифы») */
export function TariffTile({ tariff: t, className }: { tariff: Tariff; className?: string }) {
  const n = carsByTariff(t.id).length
  return (
    <Link to={c2.tariff(t.slug)} className={cn('group flex flex-col gap-2 rounded-2 border border-asphalt-200 bg-white p-4 transition-colors duration-fast hover:border-asphalt-950', className)}>
      <span className="flex items-center justify-between gap-2">
        <span className="t-label text-signal-700">Тариф</span>
        <ArrowRight className="size-4 text-asphalt-400 transition-transform duration-fast group-hover:translate-x-0.5 group-hover:text-asphalt-950" />
      </span>
      <span className="t-title-l leading-tight">{t.name}</span>
      <span className="t-caption !font-normal text-asphalt-600">{t.short}</span>
      <span className="mt-auto flex flex-col gap-0.5 pt-2">
        <Price value={minPriceForTariff(t.id)} size="s" />
        <span className="t-caption !font-normal text-asphalt-500">{carsWord(n)} в классе</span>
      </span>
    </Link>
  )
}

/** Плитка «Электромобили» → каталог с фильтром */
export function ElectricTile({ className }: { className?: string }) {
  const el = electricCars()
  const min = Math.min(...el.map((c) => c.priceFrom))
  return (
    <Link to={`${c2.cars}?fuel=electric`} className={cn('group flex flex-col gap-2 rounded-2 border border-asphalt-200 bg-asphalt-950 p-4 text-asphalt-50 transition-colors duration-fast hover:border-signal-500', className)}>
      <span className="flex items-center justify-between gap-2">
        <Tag tone="signal"><Zap className="mr-1 size-3" strokeWidth={2.5} />Электро</Tag>
        <ArrowRight className="size-4 text-asphalt-500 transition-transform duration-fast group-hover:translate-x-0.5 group-hover:text-asphalt-50" />
      </span>
      <span className="t-title-l leading-tight">Электромобили</span>
      <span className="t-caption !font-normal text-asphalt-400">Зарядка вместо бензина, тариф Комфорт</span>
      <span className="mt-auto flex flex-col gap-0.5 pt-2">
        <Price value={min} size="s" inverse />
        <span className="t-caption !font-normal text-asphalt-500">{carsWord(el.length)}: {el.map((c) => c.name).join(', ')}</span>
      </span>
    </Link>
  )
}

/** Большая карточка тарифа для обзорной страницы тарифов */
export function TariffCard({ tariff: t, index }: { tariff: Tariff; index: number }) {
  const pool = carsByTariff(t.id)
  const covers = pool.slice(0, 3)
  return (
    <article className="flex flex-col gap-5 rounded-2 border border-asphalt-200 bg-white p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="t-label text-signal-700">Тариф {String(index + 1).padStart(2, '0')}</span>
          <h2 className="t-display-m"><Link to={c2.tariff(t.slug)} className="transition-colors duration-fast hover:text-signal-700">{t.name}</Link></h2>
          <p className="t-small text-asphalt-600">{t.short}</p>
        </div>
        <div className="flex shrink-0 -space-x-2">
          {covers.map((c) => <img key={c.slug} src={c.images.cover} alt={c.name} title={c.name} className="size-12 rounded-1 border-2 border-white object-cover" loading="lazy" />)}
        </div>
      </div>
      <p className="t-body text-asphalt-700">{t.description}</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="flex flex-col gap-2">
          <span className="t-caption text-asphalt-500">Кому подходит</span>
          <DashList size="small" items={t.whoFor.map((w) => w.charAt(0).toUpperCase() + w.slice(1))} />
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-1 sm:text-right">
          <dt className="t-caption !font-normal text-asphalt-500 sm:col-start-2 sm:row-start-1">Аренда</dt>
          <dd className="t-title-m tabular sm:col-start-2 sm:row-start-2">от {formatNumber(minPriceForTariff(t.id))} ₽/день</dd>
          <dt className="t-caption !font-normal text-asphalt-500 sm:col-start-1 sm:row-start-1">Машин в классе</dt>
          <dd className="t-title-m tabular sm:col-start-1 sm:row-start-2">{pool.length}</dd>
        </dl>
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-asphalt-200 pt-4">
        <Button to={c2.tariff(t.slug)} variant="ghost" iconRight={<ArrowRight className="size-4" />}>Автомобили тарифа</Button>
        <span className="t-caption !font-normal text-asphalt-500">{pool.map((c) => c.name).join(' · ')}</span>
      </div>
    </article>
  )
}
