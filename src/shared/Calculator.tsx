import { useMemo, useState } from 'react'
import { Info } from 'lucide-react'
import { cars, type Car } from '../data/cars'
import { tariffs, type TariffId, tariffName } from '../data/tariffs'
import { DAYS_OPTIONS, DISCLAIMER, HOURS_OPTIONS, dailyRevenue, estimate } from '../data/calculator'
import { ChipGroup, Slider } from '../ui/Form'
import { Button } from '../ui/Button'
import { cn, formatPrice } from '../lib/format'

interface Props {
  variant?: 'full' | 'car' | 'compact'
  car?: Car                     // для варианта car
  inverse?: boolean
  defaultTariff?: TariffId
  onLead?: (ctx: { car?: Car; tariff: TariffId }) => void
  className?: string
  carLink?: (c: Car) => string
}

/** Калькулятор экономики водителя. Формула — с текущего сайта, ставки помечены как ориентировочные. */
export function Calculator({ variant = 'full', car, inverse = true, defaultTariff, onLead, className, carLink }: Props) {
  const [tariff, setTariff] = useState<TariffId>(car?.tariff ?? defaultTariff ?? 'comfort')
  const [days, setDays] = useState(6)
  const [hours, setHours] = useState(10)
  const [carSlug, setCarSlug] = useState<string>(car?.slug ?? cars.find((c) => c.tariff === (defaultTariff ?? 'comfort'))!.slug)
  const [customRevenue, setCustomRevenue] = useState<number | null>(null)

  const pool = useMemo(() => cars.filter((c) => c.tariff === tariff), [tariff])
  const selected = car ?? (pool.find((c) => c.slug === carSlug) ?? pool[0])
  const revenuePerDay = customRevenue ?? dailyRevenue(tariff, hours)
  const res = estimate({ tariff, days, hours, rentPerDay: selected.priceFrom, revenuePerDay })

  const changeTariff = (t: TariffId) => {
    setTariff(t); setCustomRevenue(null)
    const first = cars.find((c) => c.tariff === t); if (first) setCarSlug(first.slug)
  }

  const compare = useMemo(() => pool.map((c) => ({ car: c, ...estimate({ tariff, days, hours, rentPerDay: c.priceFrom, revenuePerDay }) })).sort((a, b) => b.netWeek - a.netWeek), [pool, tariff, days, hours, revenuePerDay])

  const labelCls = inverse ? 'text-asphalt-300' : 'text-asphalt-600'
  const ResultCell = ({ label, value, accent }: { label: string; value: number; accent?: boolean }) => (
    <div className={cn('flex flex-col gap-1 rounded-2 p-4 md:p-5', inverse ? (accent ? 'bg-signal-500 text-asphalt-950' : 'bg-asphalt-800') : (accent ? 'bg-asphalt-950 text-asphalt-50' : 'bg-asphalt-0 border border-asphalt-200'))}>
      <span className={cn('t-caption', accent ? (inverse ? 'text-asphalt-900/80' : 'text-asphalt-300') : labelCls)}>{label}</span>
      <span className="t-number-l tabular whitespace-nowrap !text-[clamp(30px,2.4vw,44px)]">{formatPrice(value)}</span>
      <span className={cn('t-caption !font-normal', accent ? (inverse ? 'text-asphalt-900/70' : 'text-asphalt-400') : (inverse ? 'text-asphalt-500' : 'text-asphalt-500'))}>в неделю · {formatPrice(value * 4)} в месяц</span>
    </div>
  )

  if (variant === 'compact') {
    return (
      <div className={cn('rounded-2 border p-5', inverse ? 'border-[rgba(242,244,247,.14)] bg-asphalt-900 text-asphalt-50 on-dark' : 'border-asphalt-200 bg-white', className)}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Slider label="Рабочих дней в неделю" min={1} max={7} value={days} onChange={setDays} inverse={inverse} />
          <Slider label="Часов в день" min={6} max={12} value={hours} onChange={setHours} inverse={inverse} />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[['Выручка', res.revenueWeek], ['Аренда', res.rentWeek], ['Остаток', res.netWeek]].map(([l, v], i) => (
            <div key={i} className={cn('rounded-1 p-3', i === 2 ? 'bg-signal-500 text-asphalt-950' : inverse ? 'bg-asphalt-800' : 'bg-asphalt-0')}>
              <div className={cn('t-caption', i === 2 ? 'text-asphalt-900/80' : labelCls)}>{l as string}</div>
              <div className="t-display-s tabular whitespace-nowrap">{formatPrice(v as number)}</div>
            </div>
          ))}
        </div>
        <p className={cn('mt-3 t-caption !font-normal', inverse ? 'text-asphalt-500' : 'text-asphalt-500')}>{DISCLAIMER}</p>
      </div>
    )
  }

  return (
    <div className={cn('grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12', className)}>
      {/* Ввод */}
      <div className="flex flex-col gap-6">
        {!car && (
          <ChipGroup label="Тариф" options={tariffs.map((t) => ({ value: t.id, label: t.name }))} value={tariff} onChange={changeTariff} inverse={inverse} />
        )}
        {!car && (
          <ChipGroup label="Автомобиль" options={pool.map((c) => ({ value: c.slug, label: c.name, hint: `${formatPrice(c.priceFrom)}/день` }))} value={selected.slug} onChange={setCarSlug} inverse={inverse} />
        )}
        <ChipGroup label="Рабочих дней в неделю" options={DAYS_OPTIONS.map((d) => ({ value: d, label: String(d) }))} value={days} onChange={setDays} inverse={inverse} />
        <ChipGroup label="Часов в день" options={HOURS_OPTIONS.map((h) => ({ value: h, label: String(h) }))} value={hours} onChange={setHours} inverse={inverse} />
        <Slider
          label={`Ориентировочная выручка за смену · ${tariffName(tariff)}`} min={3000} max={25000} step={100}
          value={revenuePerDay} onChange={setCustomRevenue} format={(v) => formatPrice(v)} inverse={inverse}
        />
        {customRevenue !== null && (
          <button type="button" onClick={() => setCustomRevenue(null)} className={cn('self-start t-caption underline underline-offset-2', inverse ? 'text-asphalt-400' : 'text-asphalt-600')}>Вернуть ставку парка ({formatPrice(dailyRevenue(tariff, hours))})</button>
        )}
      </div>
      {/* Результат */}
      <div className="flex flex-col gap-4">
        <div className={cn('flex items-baseline justify-between gap-3 border-b pb-3', inverse ? 'border-[rgba(242,244,247,.14)]' : 'border-asphalt-200')}>
          <div>
            <div className={cn('t-caption', labelCls)}>Расчёт для</div>
            <div className="t-title-l">{selected.name} · {tariffName(tariff)}</div>
          </div>
          <div className={cn('t-small tabular', labelCls)}>{formatPrice(selected.priceFrom)}/день</div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <ResultCell label="Потенциальная выручка" value={res.revenueWeek} />
          <ResultCell label="Расход на аренду" value={res.rentWeek} />
          <ResultCell label="Остаток после аренды" value={res.netWeek} accent />
        </div>
        {variant === 'full' && compare.length > 1 && (
          <div className={cn('rounded-2 border', inverse ? 'border-[rgba(242,244,247,.14)]' : 'border-asphalt-200 bg-white')}>
            <div className={cn('px-4 py-3 t-caption border-b', inverse ? 'text-asphalt-300 border-[rgba(242,244,247,.14)]' : 'text-asphalt-600 border-asphalt-200')}>Сравнение машин тарифа {tariffName(tariff)} при тех же часах</div>
            <ul className={cn('divide-y', inverse ? 'divide-[rgba(242,244,247,.1)]' : 'divide-asphalt-200')}>
              {compare.map(({ car: c, netWeek, rentWeek }) => (
                <li key={c.slug} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <button type="button" onClick={() => setCarSlug(c.slug)} className={cn('t-small text-left hover:underline underline-offset-2', c.slug === selected.slug && 'font-bold')}>{c.name}</button>
                  <span className={cn('t-caption !font-normal tabular', labelCls)}>аренда {formatPrice(rentWeek)}</span>
                  <span className={cn('t-title-m tabular', c.slug === selected.slug ? (inverse ? 'text-signal-400' : 'text-signal-700') : '')}>{formatPrice(netWeek)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className={cn('flex items-start gap-2 t-caption !font-normal', inverse ? 'text-asphalt-400' : 'text-asphalt-500')}><Info className="mt-0.5 size-4 shrink-0" />{DISCLAIMER} Ставки — с текущего сайта парка, формулу подтверждает парк.</p>
        <div className="flex flex-wrap gap-3 pt-1">
          {onLead && <Button variant={inverse ? 'primary' : 'primary'} size="l" onClick={() => onLead({ car: selected, tariff })}>Узнать наличие {selected.name}</Button>}
          {carLink && <Button variant={inverse ? 'ghost-inverse' : 'ghost'} size="l" to={carLink(selected)}>Подробнее о машине</Button>}
        </div>
      </div>
    </div>
  )
}
