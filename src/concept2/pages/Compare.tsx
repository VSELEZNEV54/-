import { useMemo, type CSSProperties, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, X } from 'lucide-react'
import { Page } from '../../shared/Page'
import { LeadForm } from '../../shared/LeadForm'
import { useLead } from '../../shared/LeadContext'
import { Button } from '../../ui/Button'
import { Select } from '../../ui/Form'
import { Container, Price, Section, SectionHeader, Tag } from '../../ui/Primitives'
import { ArticleCard, CarCard } from '../../ui/Cards'
import { carBySlug, cars, fuelLabel, type Car } from '../../data/cars'
import { tariffName, tariffs } from '../../data/tariffs'
import { DISCLAIMER, estimate } from '../../data/calculator'
import { articlesByCategory } from '../../data/articles'
import { c2 } from '../Layout'
import { PageIntro } from '../sections/PageIntro'
import { FinalCta } from '../sections/FinalCta'
import { DashList, leadForCar } from '../sections/helpers'
import { cn, formatPrice } from '../../lib/format'
import { asset } from '../../lib/asset'

const DEFAULT = ['kia-k5', 'dongfeng-shine-max', 'faw-bestune-b70']
const SLOTS = 3
const DAYS = 6
const HOURS = 10

/** Slug'и с минимальным значением (с учётом ничьих) */
function minSlugs(list: Car[], val: (c: Car) => number | null) {
  const nums = list.map((c) => val(c)).filter((v): v is number => v !== null)
  if (!nums.length) return []
  const m = Math.min(...nums)
  return list.filter((c) => val(c) === m).map((c) => c.slug)
}

interface Row { label: string; cell: (c: Car) => ReactNode; best?: (list: Car[]) => string[] }

const rows: Row[] = [
  { label: 'Тариф', cell: (c) => <Link to={c2.tariff(c.tariff)} className="underline decoration-1 underline-offset-2 transition-colors duration-fast hover:text-signal-700">{tariffName(c.tariff)}</Link> },
  { label: 'Аренда в день', cell: (c) => <span className="t-title-m tabular text-asphalt-950">{formatPrice(c.priceFrom)}</span>, best: (l) => minSlugs(l, (c) => c.priceFrom) },
  { label: `Аренда за неделю (${DAYS} дней)`, cell: (c) => <span className="tabular font-semibold text-asphalt-950">{formatPrice(c.priceFrom * DAYS)}</span>, best: (l) => minSlugs(l, (c) => c.priceFrom) },
  { label: 'Двигатель', cell: (c) => c.engine },
  { label: 'Топливо', cell: (c) => fuelLabel(c.fuel) },
  { label: 'Расход', cell: (c) => c.consumption, best: (l) => (l.some((c) => c.fuel === 'electric') ? l.filter((c) => c.fuel === 'electric').map((c) => c.slug) : minSlugs(l, (c) => c.consumptionValue)) },
  { label: 'Кузов', cell: (c) => c.bodyLabel },
  { label: 'Коробка', cell: (c) => c.gearbox },
  { label: 'Год выпуска', cell: (c) => c.yearNote },
  { label: 'Сильная сторона', cell: (c) => c.benefit },
  { label: 'Кому подойдёт', cell: (c) => <DashList size="small" items={c.fitsIf.map((s) => s.charAt(0).toUpperCase() + s.slice(1))} /> },
]

export function C2Compare() {
  const [params, setParams] = useSearchParams()
  const { openLead } = useLead()

  const slots = useMemo(() => {
    const raw = (params.get('cars') ?? '').split(',').map((s) => s.trim()).filter(Boolean)
    const valid = Array.from(new Set(raw.filter((s) => carBySlug(s))))
    const base = valid.length ? valid : DEFAULT
    return Array.from({ length: SLOTS }, (_, i) => base[i] ?? '')
  }, [params])
  const selected = slots.map((s) => carBySlug(s)).filter((c): c is Car => !!c)

  const setSlots = (next: string[]) => {
    const list = next.filter(Boolean)
    setParams(list.length ? { cars: list.join(',') } : {}, { replace: true })
  }
  const setSlot = (i: number, slug: string) => { const n = [...slots]; n[i] = slug; setSlots(n) }
  const remove = (slug: string) => setSlots(slots.filter((s) => s !== slug))

  const est = selected.map((c) => ({ car: c, e: estimate({ tariff: c.tariff, days: DAYS, hours: HOURS, rentPerDay: c.priceFrom }) }))
  const bestNet = Math.max(...est.map((x) => x.e.netWeek))
  const cols = `repeat(${Math.max(selected.length, 1)}, minmax(0, 1fr))`
  const comparison = articlesByCategory('comparison')

  return (
    <Page title="Сравнение автомобилей для такси: аренда, расход, тариф — Таксимания">
      <PageIntro
        crumbs={[{ label: 'Главная', to: c2.home }, { label: 'Автопарк', to: c2.cars }, { label: 'Сравнение' }]}
        label="Сравнение"
        title={<>Сравнить <span className="plate">до трёх машин</span> по аренде, расходу и тарифу</>}
        lead="Чек внутри тарифа одинаковый, поэтому в сравнении важны аренда, расход и кузов. Лучшие значения подсвечены."
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {slots.map((slug, i) => (
            <Select key={i} label={`Автомобиль ${i + 1}`} value={slug} onChange={(e) => setSlot(i, e.target.value)}>
              {i > 0 && <option value="">— не выбрано —</option>}
              {tariffs.map((t) => (
                <optgroup key={t.id} label={t.name}>
                  {cars.filter((c) => c.tariff === t.id).map((c) => <option key={c.slug} value={c.slug} disabled={slots.includes(c.slug) && c.slug !== slug}>{c.name} · {formatPrice(c.priceFrom)}/день</option>)}
                </optgroup>
              ))}
            </Select>
          ))}
        </div>
      </PageIntro>

      {/* ---------- Таблица ---------- */}
      <Section tight>
        <Container className="flex flex-col gap-8">
          <div className="overflow-x-auto rounded-2 border border-asphalt-200 bg-white">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="align-top">
                  <th className="w-44 px-4 py-4 t-label text-asphalt-600">Параметр</th>
                  {selected.map((c) => (
                    <th key={c.slug} className="px-4 py-4">
                      <div className="flex flex-col gap-3">
                        <div className="relative aspect-[3/2] overflow-hidden rounded-1 bg-asphalt-100">
                          <img src={asset(c.images.cover)} alt={c.name} className="h-full w-full object-cover" loading="lazy" />
                          {selected.length > 1 && (
                            <button type="button" onClick={() => remove(c.slug)} className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-1 bg-white text-asphalt-950 transition-colors duration-fast hover:bg-asphalt-100" aria-label={`Убрать ${c.name} из сравнения`}><X className="size-4" /></button>
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          <Link to={c2.car(c.slug)} className="t-title-m transition-colors duration-fast hover:text-signal-700">{c.name}</Link>
                          <Price value={c.priceFrom} size="s" />
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-asphalt-200 border-t border-asphalt-200">
                {rows.map((r) => {
                  const best = r.best ? r.best(selected) : []
                  const highlight = best.length > 0 && best.length < selected.length
                  return (
                    <tr key={r.label}>
                      <th scope="row" className="px-4 py-3 t-caption text-asphalt-500 align-top">{r.label}</th>
                      {selected.map((c) => <td key={c.slug} className={cn('px-4 py-3 t-small align-top text-asphalt-800', highlight && best.includes(c.slug) && 'bg-signal-50')}>{r.cell(c)}</td>)}
                    </tr>
                  )
                })}
                <tr>
                  <th scope="row" className="px-4 py-4 t-caption text-asphalt-500 align-top" />
                  {selected.map((c) => (
                    <td key={c.slug} className="px-4 py-4 align-top">
                      <div className="flex flex-col gap-2">
                        <Button variant="secondary" size="s" onClick={() => openLead(leadForCar(c))}>Узнать наличие</Button>
                        <Button variant="ghost" size="s" to={c2.car(c.slug)} iconRight={<ArrowRight className="size-4" />}>Подробнее</Button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          {selected.length < SLOTS && <p className="t-small text-asphalt-600">Добавьте ещё {selected.length === 1 ? 'одну-две машины' : 'одну машину'} в списке выше, чтобы сравнить.</p>}
        </Container>
      </Section>

      {/* ---------- Мини-калькулятор ---------- */}
      <Section inverse tight>
        <Container className="flex flex-col gap-8">
          <SectionHeader inverse size="m" label="Экономика недели" title={`${DAYS} дней × ${HOURS} часов: что остаётся после аренды`} lead="Выручка — по формуле парка для тарифа машины (дни × выручка за смену × коэффициент тарифа), аренда — цена машины × 6 дней." />
          <div className="grid gap-4 md:[grid-template-columns:var(--cols)]" style={{ '--cols': cols } as CSSProperties}>
              {est.map(({ car, e }) => {
                const best = est.length > 1 && e.netWeek === bestNet
                return (
                  <div key={car.slug} className={cn('flex flex-col gap-4 rounded-2 p-5', best ? 'bg-signal-500 text-asphalt-950' : 'bg-asphalt-800 text-asphalt-50')}>
                    <div className="flex items-start justify-between gap-3">
                      <div><div className="t-title-m">{car.name}</div><div className={cn('t-caption !font-normal', best ? 'text-asphalt-900/80' : 'text-asphalt-400')}>{tariffName(car.tariff)} · {formatPrice(car.priceFrom)}/день</div></div>
                      {best && <Tag tone="dark">Больше остаётся</Tag>}
                    </div>
                    <dl className="flex flex-col gap-1.5 t-small">
                      <div className="flex justify-between gap-3"><dt className={best ? 'text-asphalt-900/80' : 'text-asphalt-300'}>Выручка за неделю</dt><dd className="tabular">{formatPrice(e.revenueWeek)}</dd></div>
                      <div className="flex justify-between gap-3"><dt className={best ? 'text-asphalt-900/80' : 'text-asphalt-300'}>Аренда за неделю</dt><dd className="tabular">− {formatPrice(e.rentWeek)}</dd></div>
                      <div className={cn('mt-2 flex items-end justify-between gap-3 border-t pt-3', best ? 'border-asphalt-950/20' : 'border-[rgba(242,244,247,.14)]')}><dt className={best ? 'text-asphalt-900/80' : 'text-asphalt-300'}>Остаток</dt><dd className="t-number-l tabular">{formatPrice(e.netWeek)}</dd></div>
                    </dl>
                  </div>
                )
              })}
          </div>
          <p className="t-caption !font-normal text-asphalt-400">{DISCLAIMER} Ставки — с текущего сайта парка, формулу подтверждает парк.</p>
        </Container>
      </Section>

      {/* ---------- Ссылки ---------- */}
      <Section tight>
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div className="flex flex-col gap-6">
            <SectionHeader size="m" label="Страницы машин" title="Подробнее о каждой" action={<Button variant="link" to={c2.cars}>Весь автопарк</Button>} />
            <div className="flex flex-col gap-3">{selected.map((c) => <CarCard key={c.slug} car={c} variant="compact" to={c2.car(c.slug)} />)}</div>
          </div>
          <div className="flex flex-col gap-6">
            <SectionHeader size="m" label="Статьи" title="Сравнения в блоге" action={<Button variant="link" to={c2.blog}>Все статьи</Button>} />
            <div className="grid gap-4">{comparison.slice(0, 2).map((a) => <ArticleCard key={a.slug} article={a} to={c2.article(a.slug)} variant="featured" />)}</div>
          </div>
        </Container>
      </Section>

      <FinalCta title={<>Не определились? Менеджер <span className="plate-light">подберёт машину</span> под ваш тариф и опыт</>} lead="Назовёт свободные машины на сегодня и условия. Решение о выдаче — за 10 минут.">
        <LeadForm inverse withTariff compact submitLabel="Подобрать автомобиль" />
      </FinalCta>
    </Page>
  )
}
