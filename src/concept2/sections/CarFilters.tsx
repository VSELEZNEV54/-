import type { ReactNode } from 'react'
import { RotateCcw } from 'lucide-react'
import { brands, carsByTariff, type Body, type Car, type Fuel } from '../../data/cars'
import { tariffName, tariffs, type TariffId } from '../../data/tariffs'
import { Checkbox, Slider } from '../../ui/Form'
import { cn, formatNumber } from '../../lib/format'

/* ---------- Модель фильтров каталога и синхронизация с URL ---------- */
export type Gearbox = Car['gearbox']
export type SortId = 'popular' | 'cheap' | 'expensive' | 'efficient'

export const sortOptions: { id: SortId; label: string }[] = [
  { id: 'popular', label: 'Популярные' },
  { id: 'cheap', label: 'Дешевле' },
  { id: 'expensive', label: 'Дороже' },
  { id: 'efficient', label: 'Экономичнее' },
]

export const PRICE_MIN = 1300
export const PRICE_MAX = 4500
export const PRICE_STEP = 100

export interface Filters {
  tariff: TariffId[]
  fuel: Fuel[]
  brand: string[]
  body: Body[]
  gearbox: Gearbox[]
  max: number
}

export const emptyFilters: Filters = { tariff: [], fuel: [], brand: [], body: [], gearbox: [], max: PRICE_MAX }

const TARIFF_IDS = tariffs.map((t) => t.id)
const FUELS: Fuel[] = ['petrol', 'electric']
const BODIES: Body[] = ['sedan', 'crossover']
const GEARBOXES: Gearbox[] = ['АКПП', 'Робот']
const GEAR_SLUG: Record<Gearbox, string> = { 'АКПП': 'akpp', 'Робот': 'robot' }
const gearFromSlug = (s: string) => GEARBOXES.find((g) => GEAR_SLUG[g] === s)

export const fuelLabels: Record<Fuel, string> = { petrol: 'Бензин', electric: 'Электро' }
export const bodyLabels: Record<Body, string> = { sedan: 'Седан', crossover: 'Кроссовер' }

const pick = <T extends string>(raw: string | null, allowed: readonly T[]): T[] =>
  raw ? Array.from(new Set(raw.split(',').filter((x): x is T => (allowed as readonly string[]).includes(x)))) : []

export function parseFilters(p: URLSearchParams): Filters {
  const max = Number(p.get('max'))
  return {
    tariff: pick(p.get('tariff'), TARIFF_IDS),
    fuel: pick(p.get('fuel'), FUELS),
    brand: pick(p.get('brand'), brands),
    body: pick(p.get('body'), BODIES),
    gearbox: (p.get('gearbox') ?? '').split(',').map(gearFromSlug).filter((g): g is Gearbox => !!g),
    max: Number.isFinite(max) && max >= PRICE_MIN && max < PRICE_MAX ? Math.round(max / PRICE_STEP) * PRICE_STEP : PRICE_MAX,
  }
}

export function parseSort(p: URLSearchParams): SortId {
  const s = p.get('sort')
  return sortOptions.some((o) => o.id === s) ? (s as SortId) : 'popular'
}

export function serializeFilters(f: Filters, sort: SortId): URLSearchParams {
  const p = new URLSearchParams()
  if (f.tariff.length) p.set('tariff', f.tariff.join(','))
  if (f.fuel.length) p.set('fuel', f.fuel.join(','))
  if (f.brand.length) p.set('brand', f.brand.join(','))
  if (f.body.length) p.set('body', f.body.join(','))
  if (f.gearbox.length) p.set('gearbox', f.gearbox.map((g) => GEAR_SLUG[g]).join(','))
  if (f.max < PRICE_MAX) p.set('max', String(f.max))
  if (sort !== 'popular') p.set('sort', sort)
  return p
}

export const countActive = (f: Filters) =>
  f.tariff.length + f.fuel.length + f.brand.length + f.body.length + f.gearbox.length + (f.max < PRICE_MAX ? 1 : 0)

export function applyFilters(list: Car[], f: Filters) {
  return list.filter((c) =>
    (f.tariff.length === 0 || f.tariff.includes(c.tariff)) &&
    (f.fuel.length === 0 || f.fuel.includes(c.fuel)) &&
    (f.brand.length === 0 || f.brand.includes(c.brand)) &&
    (f.body.length === 0 || f.body.includes(c.body)) &&
    (f.gearbox.length === 0 || f.gearbox.includes(c.gearbox)) &&
    c.priceFrom <= f.max,
  )
}

export function sortCars(list: Car[], s: SortId) {
  const arr = [...list]
  switch (s) {
    case 'cheap': return arr.sort((a, b) => a.priceFrom - b.priceFrom || b.popularity - a.popularity)
    case 'expensive': return arr.sort((a, b) => b.priceFrom - a.priceFrom || b.popularity - a.popularity)
    case 'efficient': return arr.sort((a, b) => (a.consumptionValue ?? 0) - (b.consumptionValue ?? 0) || a.priceFrom - b.priceFrom)
    default: return arr.sort((a, b) => b.popularity - a.popularity || a.priceFrom - b.priceFrom)
  }
}

const without = <T,>(arr: T[], v: T) => arr.filter((x) => x !== v)
const toggleIn = <T,>(arr: T[], v: T) => (arr.includes(v) ? without(arr, v) : [...arr, v])

/** Активные фильтры в виде чипов с удалением */
export function activeChips(f: Filters): { key: string; label: string; remove: (f: Filters) => Filters }[] {
  return [
    ...f.tariff.map((t) => ({ key: `t-${t}`, label: tariffName(t), remove: (x: Filters) => ({ ...x, tariff: without(x.tariff, t) }) })),
    ...(f.max < PRICE_MAX ? [{ key: 'max', label: `до ${formatNumber(f.max)} ₽/день`, remove: (x: Filters) => ({ ...x, max: PRICE_MAX }) }] : []),
    ...f.fuel.map((v) => ({ key: `f-${v}`, label: fuelLabels[v], remove: (x: Filters) => ({ ...x, fuel: without(x.fuel, v) }) })),
    ...f.brand.map((v) => ({ key: `b-${v}`, label: v, remove: (x: Filters) => ({ ...x, brand: without(x.brand, v) }) })),
    ...f.body.map((v) => ({ key: `k-${v}`, label: bodyLabels[v], remove: (x: Filters) => ({ ...x, body: without(x.body, v) }) })),
    ...f.gearbox.map((v) => ({ key: `g-${v}`, label: v, remove: (x: Filters) => ({ ...x, gearbox: without(x.gearbox, v) }) })),
  ]
}

/* ---------- UI панели фильтров ---------- */
function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-3 border-t border-asphalt-200 pt-4 first:border-t-0 first:pt-0">
      <legend className="float-left w-full t-label text-asphalt-500 mb-3">{title}</legend>
      {children}
    </fieldset>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button" aria-pressed={active} onClick={onClick}
      className={cn('inline-flex h-10 items-center rounded-1 border px-3.5 t-small font-semibold transition-colors duration-fast', active ? 'border-asphalt-950 bg-asphalt-950 text-white' : 'border-asphalt-300 bg-white text-asphalt-950 hover:border-asphalt-950')}
    >
      {children}
    </button>
  )
}

export function CarFilters({ value, onChange, className }: { value: Filters; onChange: (f: Filters) => void; className?: string }) {
  const set = (patch: Partial<Filters>) => onChange({ ...value, ...patch })
  const active = countActive(value)
  return (
    <div className={cn('flex flex-col gap-5', className)}>
      <Group title="Тариф">
        {tariffs.map((t) => (
          <Checkbox
            key={t.id} checked={value.tariff.includes(t.id)} onChange={() => set({ tariff: toggleIn(value.tariff, t.id) })}
            label={<span className="flex items-center gap-2 text-asphalt-950">{t.name}<span className="t-caption !font-normal tabular text-asphalt-400">{carsByTariff(t.id).length}</span></span>}
          />
        ))}
      </Group>
      <Group title="Цена аренды">
        <Slider label="В день" min={PRICE_MIN} max={PRICE_MAX} step={PRICE_STEP} value={value.max} onChange={(v) => set({ max: v })} format={(v) => `до ${formatNumber(v)} ₽`} />
      </Group>
      <Group title="Тип двигателя">
        {FUELS.map((f) => (
          <Checkbox key={f} checked={value.fuel.includes(f)} onChange={() => set({ fuel: toggleIn(value.fuel, f) })} label={<span className="text-asphalt-950">{fuelLabels[f]}</span>} />
        ))}
      </Group>
      <Group title="Марка">
        <div className="flex flex-wrap gap-2">
          {brands.map((b) => <Chip key={b} active={value.brand.includes(b)} onClick={() => set({ brand: toggleIn(value.brand, b) })}>{b}</Chip>)}
        </div>
      </Group>
      <Group title="Кузов">
        <div className="flex flex-wrap gap-2">
          {BODIES.map((b) => <Chip key={b} active={value.body.includes(b)} onClick={() => set({ body: toggleIn(value.body, b) })}>{bodyLabels[b]}</Chip>)}
        </div>
      </Group>
      <Group title="Коробка">
        <div className="flex flex-wrap gap-2">
          {GEARBOXES.map((g) => <Chip key={g} active={value.gearbox.includes(g)} onClick={() => set({ gearbox: toggleIn(value.gearbox, g) })}>{g}</Chip>)}
        </div>
      </Group>
      <button
        type="button" disabled={active === 0} onClick={() => onChange(emptyFilters)}
        className="inline-flex items-center gap-2 self-start border-t border-asphalt-200 pt-4 t-small font-semibold text-asphalt-950 transition-colors duration-fast hover:text-signal-700 disabled:text-asphalt-400 disabled:hover:text-asphalt-400"
      >
        <RotateCcw className="size-4" />Сбросить{active > 0 && ` (${active})`}
      </button>
    </div>
  )
}
