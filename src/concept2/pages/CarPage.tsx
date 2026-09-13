import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Calculator as CalcIcon } from 'lucide-react'
import { Page } from '../../shared/Page'
import { NotFound } from '../../shared/NotFound'
import { Calculator } from '../../shared/Calculator'
import { LeadForm } from '../../shared/LeadForm'
import { useLead } from '../../shared/LeadContext'
import { Button } from '../../ui/Button'
import { Accordion } from '../../ui/Accordion'
import { Breadcrumbs, Container, Kicker, NeedsConfirm, Price, Reveal, Section, Table, Tag } from '../../ui/Primitives'
import { CarCard, ReviewCard } from '../../ui/Cards'
import { carBySlug, fuelLabel, relatedCars, type Car } from '../../data/cars'
import { tariffById, tariffName } from '../../data/tariffs'
import { requirements } from '../../data/company'
import { reviewsByCar, reviewsByTag } from '../../data/reviews'
import { carFaq } from '../../data/faq'
import { articlesByCategory, articlesForCar } from '../../data/articles'
import { C2, c2 } from '../Layout'
import { Gallery } from '../sections/Gallery'
import { BookingPanel } from '../sections/BookingPanel'
import { ArticlesRows } from '../sections/ArticlesRows'
import { FinalCta } from '../sections/FinalCta'
import { DashList, SubSection, carSpecs, consumptionLabel, leadForCar } from '../sections/helpers'
import { formatNumber, formatPrice } from '../../lib/format'

export function C2CarPage() {
  const { slug = '' } = useParams()
  const car = carBySlug(slug)
  if (!car) return <NotFound base={C2} />
  return <CarView key={car.slug} car={car} />
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

function CarView({ car }: { car: Car }) {
  const { openLead } = useLead()
  const t = tariffById(car.tariff)
  const related = relatedCars(car, 3)
  const compareSet = [car, ...related.slice(0, 2)]
  const compareHref = `${c2.compare}?cars=${compareSet.map((c) => c.slug).join(',')}`
  const ownReviews = reviewsByCar(car.slug)
  const reviewsFallback = ownReviews.length === 0
  const reviews = reviewsFallback ? reviewsByTag('condition').slice(0, 2) : ownReviews.slice(0, 4)
  const ownArticles = articlesForCar(car.slug)
  const articles = ownArticles.length ? ownArticles : articlesByCategory('choice')
  const images = [...car.images.gallery, ...(car.images.interior ? [car.images.interior] : [])]
  const specs = carSpecs(car)
  const lead = () => openLead(leadForCar(car))
  const h1 = `${car.name} в аренду для работы в такси в Москве`

  const specRows: [string, ReactNode][] = [
    ['Марка и модель', `${car.brand} ${car.model}`],
    ['Коробка', car.gearbox],
    ['Двигатель', car.engine],
    ['Топливо', fuelLabel(car.fuel)],
    [consumptionLabel(car), car.consumption],
    ['Кузов', car.bodyLabel],
    ['Класс агрегатора', <Link key="t" to={c2.tariff(t.slug)} className="underline decoration-1 underline-offset-[3px] transition-colors duration-fast hover:text-signal-700">{t.name}</Link>],
    ['Год выпуска', car.yearNote],
    ['Аренда', `от ${formatNumber(car.priceFrom)} ₽/день`],
  ]

  const termRows: { k: string; v: ReactNode }[] = [
    { k: 'Аренда', v: <span className="flex flex-wrap items-center gap-x-3 gap-y-1"><Price value={car.priceFrom} size="s" /><span className="t-small text-asphalt-600">цена фиксируется в договоре и не меняется</span></span> },
    { k: 'Что входит', v: <DashList size="small" items={[`Автомобиль ${car.yearNote.toLowerCase()}`, 'Оформление документов и подключение к Яндекс Go', 'Обслуживание в собственном сервисе парка', 'Поддержка водителей 24/7', 'Помощь при неисправностях и ДТП']} /> },
    { k: 'Что не входит', v: <span>Топливо (доступны Яндекс Заправки) и штрафы ГИБДД за период аренды <NeedsConfirm className="align-middle" /></span> },
    { k: 'Депозит', v: 'Нет: автомобиль выдаётся без залога' },
    { k: 'График', v: 'Гибкий: дни и смены выбираете сами' },
    { k: 'Обслуживание', v: 'Собственный сервис парка, график ТО ведёт парк' },
    { k: 'Требования к водителю', v: requirements.slice(0, 4).map((r) => r.title).join(' · ') },
  ]

  const faqQuestion: Record<string, string> = {
    deposit: `Нужен ли залог за ${car.name}?`,
    'how-fast': `Как быстро можно получить ${car.name}?`,
    trial: `Есть ли пробный день на ${car.name}?`,
    age: `Какого года ${car.name} в парке?`,
    included: `Что входит в аренду ${car.name}?`,
  }
  const faqItems = [
    { id: 'price', title: `Сколько стоит аренда ${car.name}?`, content: <>От {formatPrice(car.priceFrom)} в день. Цена фиксируется в договоре и не меняется на протяжении аренды. Залог не нужен, первый день — бесплатно. Полные условия — на странице <Link to={c2.terms} className="underline underline-offset-2">условий аренды</Link>.</> },
    { id: 'consumption', title: car.fuel === 'electric' ? `Какой запас хода у ${car.name}?` : `Какой расход у ${car.name}?`, content: car.fuel === 'electric' ? `${cap(car.consumption)}: обычная городская смена без промежуточной зарядки, но маршрут смены стоит планировать вокруг станций.` : `${car.consumption} при двигателе ${car.engine} и ${car.gearbox === 'АКПП' ? 'автоматической' : 'роботизированной'} коробке. Считайте экономику смены как «аренда + расход × пробег × цена литра».` },
    { id: 'tariff', title: `Под какой тариф подходит ${car.name}?`, content: <>{t.name}: {t.short.toLowerCase()}. {t.strategy} Все машины тарифа — на странице <Link to={c2.tariff(t.slug)} className="underline underline-offset-2">«Авто для {t.name}»</Link>.</> },
    ...carFaq.map((f) => ({ id: f.id, title: faqQuestion[f.id] ?? f.q, content: <>{f.a}{f.needsConfirmation && <NeedsConfirm className="ml-2 align-middle" />}</> })),
  ]

  return (
    <Page title={`${h1} от ${formatPrice(car.priceFrom)} — Таксимания`}>
      {/* ---------- Hero ---------- */}
      <section className="border-b border-asphalt-200 bg-white">
        <Container className="flex flex-col gap-6 py-6 md:py-8">
          <Breadcrumbs items={[{ label: 'Главная', to: c2.home }, { label: 'Автопарк', to: c2.cars }, { label: t.name, to: c2.tariff(t.slug) }, { label: car.name }]} />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_minmax(0,1fr)] lg:gap-12">
            <Gallery images={images} alt={`${car.name} — автомобиль парка Таксимания`} />
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <Kicker>Тариф {t.name}</Kicker>
                <Link to={c2.tariff(t.slug)} className="t-caption !font-normal text-asphalt-500 underline underline-offset-2 transition-colors duration-fast hover:text-asphalt-950">все машины тарифа</Link>
              </div>
              <h1 className="t-display-l"><span className="plate">{car.name}</span> в аренду для такси</h1>
              <p className="t-lead text-asphalt-600">{car.benefit}. {t.name}: {t.short.toLowerCase()}.</p>
              <Price value={car.priceFrom} size="l" />
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Ключевые характеристики">
                {specs.map((s) => (
                  <li key={s.label} className="flex flex-col gap-1 rounded-1 border border-asphalt-200 p-3">
                    <s.icon className="size-5 text-asphalt-400" strokeWidth={1.75} aria-hidden />
                    <span className="t-caption !font-normal text-asphalt-500">{s.label}</span>
                    <span className="t-small font-semibold text-asphalt-950">{s.value}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-2">
                <Tag tone="green">Есть свободные машины</Tag><NeedsConfirm />
                <Tag tone="neutral">{car.yearNote}</Tag>
                {car.fuel === 'electric' && <Tag tone="signal">Электро</Tag>}
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <Button size="l" onClick={lead}>Узнать наличие</Button>
                <Button size="l" variant="ghost" href="#economics" icon={<CalcIcon className="size-4" />}>Рассчитать заработок</Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------- Контент + панель бронирования ---------- */}
      <Section tight>
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-12">
          <div className="flex flex-col gap-14 md:gap-16">
            {/* 1. Почему */}
            <SubSection title={`Почему ${car.name} для такси`} lead={car.benefit}>
              <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {car.forDriver.map((f, i) => (
                  <li key={f.title} className="flex flex-col gap-2 rounded-2 border border-asphalt-200 bg-white p-5">
                    <span className="t-label text-signal-700">0{i + 1}</span>
                    <h3 className="t-title-m">{f.title}</h3>
                    <p className="t-small text-asphalt-600">{f.text}</p>
                  </li>
                ))}
              </ol>
            </SubSection>

            {/* 2. Характеристики */}
            <SubSection title="Характеристики" lead="Только подтверждённые парком данные. Количество мест и комплектация уточняются при осмотре в парке.">
              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2 border border-asphalt-200 bg-asphalt-200 md:grid-cols-3">
                {specRows.map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-1 bg-white p-4">
                    <dt className="t-caption !font-normal text-asphalt-500">{k}</dt>
                    <dd className="t-title-m">{v}</dd>
                  </div>
                ))}
              </dl>
            </SubSection>

            {/* 3. Условия */}
            <SubSection title={`Условия аренды ${car.name}`} action={<Button variant="link" to={c2.terms}>Полные условия</Button>}>
              <dl className="divide-y divide-asphalt-200 rounded-2 border border-asphalt-200 bg-white">
                {termRows.map((r) => (
                  <div key={r.k} className="grid grid-cols-1 gap-1.5 px-5 py-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-6">
                    <dt className="t-caption text-asphalt-500 sm:pt-1">{r.k}</dt>
                    <dd className="t-body text-asphalt-800">{r.v}</dd>
                  </div>
                ))}
              </dl>
            </SubSection>

            {/* 4. Экономика */}
            <SubSection id="economics" title={`Экономика на ${car.name}`} lead="Если работать 6 дней × 10 часов: базовый сценарий калькулятора. Дни, часы и выручку за смену можно поменять.">
              <div className="rounded-2 bg-asphalt-900 p-5 text-asphalt-50 on-dark md:p-8 [&>div]:lg:grid-cols-1 [&>div]:lg:gap-8">
                <Calculator variant="car" car={car} inverse onLead={lead} />
              </div>
            </SubSection>

            {/* 5. Кому подойдёт */}
            <SubSection title="Кому подойдёт">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-2 border border-asphalt-200 bg-white p-5">
                  <div className="mb-3 t-caption text-asphalt-500">{car.name} подойдёт, если вы…</div>
                  <DashList items={car.fitsIf.map(cap)} />
                </div>
                <div className="flex flex-col gap-3">
                  <div className="t-caption text-asphalt-500">Возможно, вам лучше подойдёт другая машина</div>
                  {related.slice(0, 3).map((c) => <CarCard key={c.slug} car={c} variant="compact" to={c2.car(c.slug)} />)}
                </div>
              </div>
            </SubSection>

            {/* 6. Сравнение */}
            <SubSection title="Сравнение с машинами класса" lead={`${car.name} против ${related.slice(0, 2).map((c) => c.name).join(' и ')}: чек в тарифе одинаковый, разница в аренде и расходе.`} action={<Button variant="ghost" size="s" to={compareHref} iconRight={<ArrowRight className="size-4" />}>Сравнить автомобили</Button>}>
              <Table
                highlightCol={1}
                head={['', ...compareSet.map((c) => c.name)]}
                rows={[
                  ['Тариф', ...compareSet.map((c) => <Link key={c.slug} to={c2.tariff(c.tariff)} className="underline decoration-1 underline-offset-2 hover:text-signal-700">{tariffName(c.tariff)}</Link>)],
                  ['Аренда', ...compareSet.map((c) => <span key={c.slug} className="whitespace-nowrap tabular font-semibold text-asphalt-950">{formatPrice(c.priceFrom)}/день</span>)],
                  ['Топливо', ...compareSet.map((c) => fuelLabel(c.fuel))],
                  ['Расход', ...compareSet.map((c) => c.consumption)],
                  ['Кузов', ...compareSet.map((c) => c.bodyLabel)],
                  ['Коробка', ...compareSet.map((c) => c.gearbox)],
                  ['Сильная сторона', ...compareSet.map((c) => c.benefit)],
                  ['', ...compareSet.map((c) => c.slug === car.slug ? <span key={c.slug} className="t-caption text-asphalt-500">Эта страница</span> : <Link key={c.slug} to={c2.car(c.slug)} className="inline-flex items-center gap-1 t-small font-semibold underline underline-offset-2 hover:text-signal-700">Подробнее<ArrowRight className="size-3.5" /></Link>)],
                ]}
              />
            </SubSection>

            {/* 7. Отзывы */}
            <SubSection title={`Отзывы о ${car.name}`} lead={reviewsFallback ? 'Отзывов именно об этой модели на сайте парка пока нет — показываем отзывы водителей о состоянии машин.' : `${ownReviews.length === 1 ? 'Отзыв водителя' : 'Отзывы водителей'} парка с текущего сайта, тексты сохранены.`} action={<Button variant="link" to={c2.reviews}>Все отзывы</Button>}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {reviews.map((r) => <ReviewCard key={r.id} review={r} carTo={r.car ? c2.car(r.car) : undefined} />)}
              </div>
            </SubSection>

            {/* 8. FAQ */}
            <SubSection title={`Вопросы о ${car.name}`} action={<Button variant="link" to={c2.faq}>Все вопросы</Button>}>
              <Accordion items={faqItems} defaultOpen="price" />
            </SubSection>
          </div>

          <BookingPanel car={car} className="hidden sm:block" />
        </Container>
      </Section>

      {/* ---------- Другие машины и статьи ---------- */}
      <Section tight className="border-t border-asphalt-200 bg-white">
        <Container className="flex flex-col gap-14">
          <SubSection title={`Другие автомобили ${t.name}`} lead={t.short} action={<Button variant="ghost" size="s" to={c2.tariff(t.slug)} iconRight={<ArrowRight className="size-4" />}>Все машины тарифа</Button>}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
              {related.map((c, i) => (
                <Reveal key={c.slug} delay={i * 40}><CarCard car={c} variant="catalog" to={c2.car(c.slug)} onLead={(x) => openLead(leadForCar(x))} className="h-full" /></Reveal>
              ))}
            </div>
          </SubSection>
          <SubSection title="Полезные статьи" lead={ownArticles.length ? `Материалы блога, где упоминается ${car.name}.` : 'Статьи о выборе машины для такси.'} action={<Button variant="link" to={c2.blog}>Все статьи</Button>}>
            <ArticlesRows articles={articles} max={4} columns={2} />
          </SubSection>
        </Container>
      </Section>

      <FinalCta title={<>Хотите узнать, есть ли <span className="plate-light">{car.name}</span> свободная сегодня?</>} lead="Оставьте телефон — менеджер проверит наличие в парке и перезвонит. Решение о выдаче — за 10 минут.">
        <LeadForm inverse compact context={car.name} submitLabel="Узнать наличие" />
      </FinalCta>
    </Page>
  )
}
