import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, SlidersHorizontal, X } from 'lucide-react'
import { Page } from '../../shared/Page'
import { useLead } from '../../shared/LeadContext'
import { Button } from '../../ui/Button'
import { Select } from '../../ui/Form'
import { Modal } from '../../ui/Modal'
import { Container, Reveal, Section, SectionHeader } from '../../ui/Primitives'
import { CarCard } from '../../ui/Cards'
import { carBySlug, cars, carsByTariff } from '../../data/cars'
import { tariffs } from '../../data/tariffs'
import { articlesByCategory } from '../../data/articles'
import { c2 } from '../Layout'
import { PageIntro } from '../sections/PageIntro'
import { ArticlesRows } from '../sections/ArticlesRows'
import { leadForCar } from '../sections/helpers'
import { CarFilters, activeChips, applyFilters, countActive, emptyFilters, parseFilters, parseSort, serializeFilters, sortCars, sortOptions, type Filters, type SortId } from '../sections/CarFilters'
import { formatNumber, pluralWith } from '../../lib/format'

const carsWord = (n: number) => pluralWith(n, 'автомобиль', 'автомобиля', 'автомобилей')

export function C2Cars() {
  const [params, setParams] = useSearchParams()
  const filters = useMemo(() => parseFilters(params), [params])
  const sort = parseSort(params)
  const [drawer, setDrawer] = useState(false)
  const { openLead } = useLead()

  const update = (f: Filters, s: SortId = sort) => setParams(serializeFilters(f, s), { replace: true })
  const result = useMemo(() => sortCars(applyFilters(cars, filters), sort), [filters, sort])
  const active = countActive(filters)
  const chips = activeChips(filters)

  const minPrice = Math.min(...cars.map((c) => c.priceFrom))
  const maxPrice = Math.max(...cars.map((c) => c.priceFrom))

  return (
    <Page title="Автопарк: аренда авто под такси в Москве, 10 моделей — Таксимания">
      <PageIntro
        crumbs={[{ label: 'Главная', to: c2.home }, { label: 'Автопарк' }]}
        label="Автопарк"
        title={<>Автопарк: все автомобили <span className="plate">для работы в такси</span></>}
        lead={`${carsWord(cars.length)} под четыре тарифа, аренда от ${formatNumber(minPrice)} до ${formatNumber(maxPrice)} ₽/день. Все машины не старше 3 лет, без залога, первый день бесплатно.`}
      />

      <Section tight>
        <Container className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
          {/* Sticky-панель фильтров */}
          <aside className="hidden lg:block" aria-label="Фильтры каталога">
            <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-2 border border-asphalt-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between"><span className="t-title-m">Фильтры</span>{active > 0 && <span className="t-caption tabular text-asphalt-500">активных: {active}</span>}</div>
              <CarFilters value={filters} onChange={(f) => update(f)} />
            </div>
          </aside>

          <div className="flex flex-col gap-5">
            {/* Тулбар */}
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="t-title-l" aria-live="polite">Найдено {carsWord(result.length)}</h2>
              <Button variant="ghost" size="s" className="lg:hidden" icon={<SlidersHorizontal className="size-4" />} onClick={() => setDrawer(true)}>
                Фильтры{active > 0 && <span className="inline-flex size-5 items-center justify-center rounded-0 bg-signal-500 t-caption text-asphalt-950">{active}</span>}
              </Button>
              <Select value={sort} onChange={(e) => update(filters, e.target.value as SortId)} aria-label="Сортировка" className="w-full sm:ml-auto sm:w-52 [&_select]:h-12">
                {sortOptions.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
              </Select>
            </div>

            {/* Активные фильтры */}
            {chips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2" aria-label="Активные фильтры">
                {chips.map((ch) => (
                  <button key={ch.key} type="button" onClick={() => update(ch.remove(filters))} className="inline-flex h-8 items-center gap-1.5 rounded-1 bg-asphalt-950 pl-3 pr-2 t-caption text-asphalt-50 transition-colors duration-fast hover:bg-asphalt-800" aria-label={`Убрать фильтр ${ch.label}`}>
                    {ch.label}<X className="size-3.5" />
                  </button>
                ))}
                <button type="button" onClick={() => update(emptyFilters)} className="ml-1 t-caption text-asphalt-600 underline underline-offset-2 transition-colors duration-fast hover:text-asphalt-950">Сбросить все</button>
              </div>
            )}

            {/* Сетка или пустое состояние */}
            {result.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 md:gap-6">
                {result.map((car, i) => (
                  <Reveal key={car.slug} delay={Math.min(i, 5) * 40}>
                    <CarCard car={car} variant="catalog" to={c2.car(car.slug)} onLead={(c) => openLead(leadForCar(c))} className="h-full" />
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-start gap-4 rounded-2 border border-dashed border-asphalt-300 bg-white p-6 md:p-10">
                <div className="t-display-m">Ничего не подошло</div>
                <p className="t-body max-w-lg text-asphalt-600">Под такое сочетание фильтров в парке нет машин. Снимите часть условий или попросите менеджера подобрать вариант — парк из 1000+ машин, подходящий найдётся.</p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary" onClick={() => update(emptyFilters)}>Сбросить фильтры</Button>
                  <Button variant="ghost" onClick={() => openLead({ withTariff: true, title: 'Подобрать автомобиль', submitLabel: 'Подобрать автомобиль' })}>Подобрать через менеджера</Button>
                </div>
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* ---------- SEO-блок ---------- */}
      <Section tight className="border-t border-asphalt-200 bg-white">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
          <div className="flex flex-col gap-6">
            <SectionHeader size="m" label="Как выбрать" title="Как выбрать автомобиль под тариф" />
            <SeoText />
            <div className="flex flex-wrap gap-2">
              {tariffs.map((t) => (
                <Link key={t.id} to={c2.tariff(t.slug)} className="inline-flex h-10 items-center gap-1.5 rounded-1 border border-asphalt-300 bg-white px-3.5 t-small font-semibold transition-colors duration-fast hover:border-asphalt-950">
                  Авто для {t.name}<ArrowRight className="size-4 text-asphalt-400" />
                </Link>
              ))}
              <Link to={c2.compare} className="inline-flex h-10 items-center gap-1.5 rounded-1 bg-asphalt-950 px-3.5 t-small font-semibold text-white transition-colors duration-fast hover:bg-asphalt-800">Сравнить автомобили</Link>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="t-label text-asphalt-500">Статьи о выборе машины</div>
            <ArticlesRows articles={articlesByCategory('choice')} max={3} />
            <Button variant="link" to={c2.blog} className="self-start">Все статьи блога</Button>
          </div>
        </Container>
      </Section>

      {/* ---------- Фильтры на мобильном ---------- */}
      <Modal open={drawer} onClose={() => setDrawer(false)} title={<div className="t-display-m">Фильтры</div>}>
        <CarFilters value={filters} onChange={(f) => update(f)} />
        <Button full size="l" className="mt-6" onClick={() => setDrawer(false)}>Показать {carsWord(result.length)}</Button>
      </Modal>
    </Page>
  )
}

/** Три абзаца из данных: цены и расход берём из cars/tariffs, а не пишем руками */
function SeoText() {
  const rio = carBySlug('kia-rio')!
  const optima = carBySlug('kia-optima')!
  const coolray = carBySlug('geely-coolray')!
  const evolute = carBySlug('evolute-i-pro')!
  const k5 = carBySlug('kia-k5')!
  const shine = carBySlug('dongfeng-shine-max')!
  const hongqi = carBySlug('hongqi-h5')!
  const plus = carsByTariff('comfort-plus')
  const plusMin = Math.min(...plus.map((c) => c.priceFrom))
  const plusMax = Math.max(...plus.map((c) => c.priceFrom))
  const crossovers = plus.filter((c) => c.body === 'crossover').map((c) => c.name)
  return (
    <div className="prose-tm max-w-2xl text-asphalt-700">
      <p>
        Начинаете — берите Эконом: <Link to={c2.car(rio.slug)}>{rio.name}</Link> за {formatNumber(rio.priceFrom)} ₽/день, самая низкая аренда в парке и самый загруженный тариф агрегаторов. Хотите повысить чек без резкого роста платежа — смотрите <Link to={c2.tariff('comfort')}>Комфорт</Link>: <Link to={c2.car(optima.slug)}>{optima.name}</Link> за {formatNumber(optima.priceFrom)} ₽, <Link to={c2.car(coolray.slug)}>{coolray.name}</Link> с расходом {coolray.consumption} и электромобиль <Link to={c2.car(evolute.slug)}>{evolute.name}</Link> с запасом хода {evolute.consumption.replace(' на одном заряде', '')}.
      </p>
      <p>
        В <Link to={c2.tariff('comfort-plus')}>Комфорт+</Link> {pluralWith(plus.length, 'машина', 'машины', 'машин')} от {formatNumber(plusMin)} до {formatNumber(plusMax)} ₽/день. Чек внутри тарифа одинаковый, поэтому сравнивайте сумму «аренда + топливо на ваш пробег»: <Link to={c2.car(shine.slug)}>{shine.name}</Link> расходует {shine.consumption}, <Link to={c2.car(k5.slug)}>{k5.name}</Link> — {k5.consumption} при разнице в аренде {formatNumber(k5.priceFrom - shine.priceFrom)} ₽ в день. Кроссоверы {crossovers.join(' и ')} — для тех, кому важны высокая посадка и багажник.
      </p>
      <p>
        <Link to={c2.tariff('business')}>Бизнес</Link> — это <Link to={c2.car(hongqi.slug)}>{hongqi.name}</Link> за {formatNumber(hongqi.priceFrom)} ₽/день: самый высокий чек и самые строгие требования к машине и водителю, подходит тем, кто уже работал в Комфорт+. Сменить машину или класс можно в любое рабочее время, поэтому разумно начать с минимальной аренды в классе и переходить выше, когда появится статистика по загрузке. Полные условия — на странице <Link to={c2.terms}>условий аренды</Link>.
      </p>
    </div>
  )
}
