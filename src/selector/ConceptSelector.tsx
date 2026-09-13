import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, SlidersHorizontal } from 'lucide-react'
import { cn, formatNumber } from '../lib/format'
import { cars } from '../data/cars'
import { tariffs } from '../data/tariffs'
import { useDocumentTitle } from '../lib/hooks'

/** Экран выбора концепции: две полноценные визуальные области по 50vw, hover расширяет до 58% */
export function ConceptSelector() {
  useDocumentTitle('Таксимания — редизайн: выбор концепции')
  const [hover, setHover] = useState<1 | 2 | null>(null)
  const w1 = hover === 1 ? 58 : hover === 2 ? 42 : 50
  return (
    <div className="flex min-h-dvh w-full flex-col bg-asphalt-950 md:h-dvh md:flex-row md:overflow-hidden">
      {/* Концепция 1 */}
      <Link
        to="/concept-1"
        onMouseEnter={() => setHover(1)} onMouseLeave={() => setHover(null)}
        className="group relative flex flex-col overflow-hidden bg-asphalt-50 text-asphalt-950 transition-[flex-basis] duration-[700ms] ease-in-out md:min-h-0 md:flex-none md:[flex-basis:var(--basis)]"
        style={{ ['--basis' as string]: `${w1}%` }}
        aria-label="Открыть концепцию 1 — Сайт кодом + статьи под SEO"
      >
        <div className="absolute inset-0">
          <img src="/img/scenes/hero-duo.jpg" alt="" className="h-full w-full object-cover opacity-[.08] transition-transform duration-[1200ms] ease-out-brand group-hover:scale-105" />
        </div>
        <div className="relative flex h-full flex-col justify-between gap-8 p-6 md:gap-4 md:p-10 lg:p-14">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <span className="t-label text-signal-700">Концепция 1</span>
              <h2 className="t-display-l max-w-[12ch]">Сайт кодом + статьи под SEO</h2>
            </div>
            <span className="font-display text-[64px] font-black leading-none text-asphalt-200 md:text-[120px]">01</span>
          </div>

          {/* Fragment/mockup будущего сайта */}
          <div className="my-4 hidden flex-1 items-center md:flex">
            <Mockup1 />
          </div>

          <div className="flex flex-col gap-5">
            <p className="t-lead max-w-md text-asphalt-700">Компактный продающий сайт, написанный кодом, а не на конструкторе: быстрый выбор автомобиля и заявка. Плюс блог со статьями под поисковые запросы.</p>
            <div className="flex flex-wrap items-center gap-2 t-label text-asphalt-600">
              <span>Минимум действий</span><ArrowRight className="size-3.5 text-signal-500" /><span>максимум доверия</span><ArrowRight className="size-3.5 text-signal-500" /><span className="plate">заявка</span>
            </div>
            <Results
              items={[
                { label: 'Органический трафик', level: 2, note: 'статьи блога под запросы' },
                { label: 'Удобство редактирования', level: 3, note: 'цены и машины в одном файле данных' },
              ]}
            />
            <span className="inline-flex h-14 w-fit items-center gap-3 rounded-1 bg-asphalt-950 px-7 t-btn text-white transition-colors duration-fast group-hover:bg-signal-500 group-hover:text-asphalt-950">Открыть концепцию<ArrowRight className="size-5 transition-transform duration-fast group-hover:translate-x-1" /></span>
          </div>
        </div>
      </Link>

      {/* Концепция 2 */}
      <Link
        to="/concept-2"
        onMouseEnter={() => setHover(2)} onMouseLeave={() => setHover(null)}
        className="group relative flex flex-col overflow-hidden bg-asphalt-950 text-asphalt-50 transition-[flex-basis] duration-[700ms] ease-in-out md:min-h-0 md:flex-none md:[flex-basis:var(--basis)]"
        style={{ ['--basis' as string]: `${100 - w1}%` }}
        aria-label="Открыть концепцию 2 — SEO-лайнер"
      >
        <div className="absolute inset-0">
          <img src="/img/scenes/parking-orange.jpg" alt="" className="h-full w-full object-cover opacity-20 transition-transform duration-[1200ms] ease-out-brand group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-asphalt-950 via-asphalt-950/70 to-asphalt-950/30" />
        </div>
        <div className="relative flex h-full flex-col justify-between gap-8 p-6 md:gap-4 md:p-10 lg:p-14">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <span className="t-label text-signal-400">Концепция 2</span>
              <h2 className="t-display-l">SEO-лайнер</h2>
            </div>
            <span className="font-display text-[64px] font-black leading-none text-asphalt-800 md:text-[120px]">02</span>
          </div>

          <div className="my-4 hidden flex-1 items-center md:flex">
            <Mockup2 />
          </div>

          <div className="flex flex-col gap-5">
            <p className="t-lead max-w-md text-asphalt-300">Платформа с отдельными посадочными страницами автомобилей, тарифов, условий, акций и статей — под сотни поисковых запросов.</p>
            <div className="flex flex-wrap items-center gap-2 t-label text-asphalt-400">
              <span>Запрос в поиске</span><ArrowRight className="size-3.5 text-signal-400" /><span>посадочная</span><ArrowRight className="size-3.5 text-signal-400" /><span>выбор авто</span><ArrowRight className="size-3.5 text-signal-400" /><span className="plate">заявка</span>
            </div>
            <Results
              inverse
              items={[
                { label: 'Органический трафик', level: 4, note: 'десятки посадочных: машины, тарифы, условия, статьи' },
                { label: 'Удобство редактирования', level: 4, note: 'новая машина или статья = одна запись, страницы собираются сами' },
              ]}
            />
            <span className="inline-flex h-14 w-fit items-center gap-3 rounded-1 border border-[rgba(242,244,247,.3)] px-7 t-btn text-asphalt-50 transition-colors duration-fast group-hover:border-signal-500 group-hover:bg-signal-500 group-hover:text-asphalt-950">Открыть концепцию<ArrowRight className="size-5 transition-transform duration-fast group-hover:translate-x-1" /></span>
          </div>
        </div>
      </Link>

      <div className="pointer-events-none absolute left-1/2 top-4 hidden -translate-x-1/2 items-center gap-2 rounded-1 border border-[rgba(242,244,247,.14)] bg-asphalt-950/85 px-3 py-1.5 t-caption text-asphalt-300 backdrop-blur lg:flex">
        <img src="/img/logo/logo-mark.png" alt="" className="h-4" />Таксимания · прототип редизайна · две концепции одного бренда
      </div>
    </div>
  )
}

/* Ожидаемый результат: шкала из четырёх сегментов */
function Results({ items, inverse }: { items: { label: string; level: 1 | 2 | 3 | 4; note: string }[]; inverse?: boolean }) {
  return (
    <div className={cn('grid gap-3 border-t pt-4 sm:grid-cols-2', inverse ? 'border-[rgba(242,244,247,.14)]' : 'border-asphalt-200')}>
      <div className={cn('t-label sm:col-span-2', inverse ? 'text-asphalt-400' : 'text-asphalt-500')}>Ожидаемый результат</div>
      {items.map((it) => (
        <div key={it.label} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-3">
            <span className={cn('t-small font-semibold', inverse ? 'text-asphalt-50' : 'text-asphalt-950')}>{it.label}</span>
            <span className="flex gap-1" aria-label={`${it.level} из 4`}>
              {[1, 2, 3, 4].map((n) => (
                <span key={n} className={cn('block h-2 w-5 rounded-0', n <= it.level ? 'bg-signal-500' : inverse ? 'bg-asphalt-700' : 'bg-asphalt-200')} />
              ))}
            </span>
          </div>
          <span className={cn('t-caption !font-normal', inverse ? 'text-asphalt-400' : 'text-asphalt-500')}>{it.note}</span>
        </div>
      ))}
    </div>
  )
}

/* Mockup 1: hero лендинга + карточка машины */
function Mockup1() {
  const car = cars[0]
  return (
    <div className="relative w-full max-w-lg">
      <div className="overflow-hidden rounded-2 border border-asphalt-200 bg-white shadow-pop transition-transform duration-[700ms] ease-out-brand group-hover:-translate-y-1">
        <div className="flex items-center justify-between border-b border-asphalt-200 px-4 py-2.5">
          <img src="/img/logo/logo-mark.png" alt="" className="h-7" />
          <div className="flex gap-3 t-caption text-asphalt-500"><span>Автомобили</span><span>Условия</span><span>FAQ</span></div>
          <span className="rounded-1 bg-signal-500 px-2 py-1 t-caption text-asphalt-950">Подобрать</span>
        </div>
        <div className="grid grid-cols-[1.1fr_1fr] gap-4 p-4">
          <div className="flex flex-col gap-2">
            <div className="font-display text-[34px] font-bold leading-[.9]">Выберите машину и выходите на линию</div>
            <div className="t-caption !font-normal text-asphalt-600">Москва · 4 тарифа · без залога · за 10 минут</div>
            <div className="mt-1 flex gap-2"><span className="rounded-1 bg-signal-500 px-2.5 py-1.5 t-caption text-asphalt-950">Выбрать автомобиль</span><span className="rounded-1 border border-asphalt-300 px-2.5 py-1.5 t-caption">Рассчитать</span></div>
          </div>
          <div className="overflow-hidden rounded-1 bg-asphalt-100"><img src={car.images.cover} alt="" className="h-full w-full object-cover" /></div>
        </div>
      </div>
      <div className="absolute -bottom-6 -right-4 w-44 rounded-2 border border-asphalt-200 bg-white p-2.5 shadow-pop transition-transform duration-[700ms] ease-out-brand group-hover:translate-x-1 group-hover:-translate-y-2">
        <img src={cars[4].images.cover} alt="" className="aspect-[4/3] w-full rounded-1 object-cover" />
        <div className="mt-2 t-caption">{cars[4].name}</div>
        <div className="font-display text-[22px] font-black leading-none tabular">от {formatNumber(cars[4].priceFrom)} ₽</div>
      </div>
    </div>
  )
}

/* Mockup 2: каталог с фильтрами + SEO-страница */
function Mockup2() {
  return (
    <div className="relative w-full max-w-lg">
      <div className="overflow-hidden rounded-2 border border-asphalt-700 bg-asphalt-900 shadow-pop transition-transform duration-[700ms] ease-out-brand group-hover:-translate-y-1">
        <div className="flex items-center gap-3 border-b border-asphalt-700 px-4 py-2.5 t-caption text-asphalt-400">
          <span className="text-asphalt-50">Главная</span><span>›</span><span className="text-asphalt-50">Автопарк</span><span>›</span><span className="text-asphalt-50">Комфорт+</span><span>›</span><span className="text-signal-400">Kia K5</span>
          
        </div>
        <div className="grid grid-cols-[110px_1fr] gap-3 p-3">
          <div className="flex flex-col gap-2 rounded-1 border border-asphalt-700 p-2.5 t-caption text-asphalt-300">
            <span className="inline-flex items-center gap-1 text-asphalt-50"><SlidersHorizontal className="size-3" />Фильтры</span>
            {tariffs.map((t) => <span key={t.id} className="flex items-center gap-1.5"><span className={cn('size-2.5 rounded-0 border border-asphalt-500', t.id === 'comfort-plus' && 'bg-signal-500 border-signal-500')} />{t.name}</span>)}
            <span className="mt-1 h-1 w-full bg-asphalt-700"><span className="block h-1 w-2/3 bg-signal-500" /></span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {cars.slice(4, 10).map((c) => (
              <div key={c.slug} className="overflow-hidden rounded-1 border border-asphalt-700 bg-asphalt-800">
                <img src={c.images.cover} alt="" className="aspect-[3/2] w-full object-cover" />
                <div className="p-1.5"><div className="t-caption !text-[11px] text-asphalt-50 truncate">{c.name}</div><div className="t-caption !text-[10px] !font-normal text-asphalt-400">от {formatNumber(c.priceFrom)} ₽</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute -bottom-6 -left-4 w-52 rounded-2 border border-asphalt-700 bg-asphalt-950 p-3 shadow-pop transition-transform duration-[700ms] ease-out-brand group-hover:-translate-x-1 group-hover:-translate-y-2">
        <div className="t-caption text-signal-400">Статья · Сравнение</div>
        <div className="mt-1 t-caption text-asphalt-50">Kia K5 или Dongfeng Shine Max для такси</div>
        <div className="mt-2 flex flex-wrap gap-1">{['Комфорт+', 'Kia K5', 'Калькулятор'].map((t) => <span key={t} className="rounded-0 bg-asphalt-800 px-1.5 py-0.5 t-caption !text-[10px] text-asphalt-300">→ {t}</span>)}</div>
      </div>
    </div>
  )
}
