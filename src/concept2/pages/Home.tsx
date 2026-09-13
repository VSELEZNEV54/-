import { Link } from 'react-router-dom'
import { ArrowRight, CarFront, Clock, Headset, ShieldCheck, Wrench, type LucideIcon } from 'lucide-react'
import { Page } from '../../shared/Page'
import { Calculator } from '../../shared/Calculator'
import { LeadForm } from '../../shared/LeadForm'
import { useLead } from '../../shared/LeadContext'
import { Button } from '../../ui/Button'
import { Accordion } from '../../ui/Accordion'
import { Breadcrumbs, Container, Kicker, NeedsConfirm, Reveal, Section, SectionHeader, Stars, Table } from '../../ui/Primitives'
import { ArticleCard, CarCard, FeatureCard, OfferCard, ReviewCard } from '../../ui/Cards'
import { cars, carsByTariff, minPriceForTariff } from '../../data/cars'
import { tariffs } from '../../data/tariffs'
import { company, heroStats, values } from '../../data/company'
import { offers } from '../../data/offers'
import { featuredReviews, overallRating } from '../../data/reviews'
import { articles } from '../../data/articles'
import { objections } from '../../data/faq'
import { c2 } from '../Layout'
import { ElectricTile, TariffTile } from '../sections/TariffTiles'
import { TermsFacts } from '../sections/TermsFacts'
import { FinalCta } from '../sections/FinalCta'
import { PartnerBadge, calcFullWrap, leadForCar } from '../sections/helpers'
import { formatNumber, formatPrice, pluralWith } from '../../lib/format'

const valueIcons: Record<string, LucideIcon> = { transparent: ShieldCheck, fast: Clock, ready: Wrench, support: Headset, choice: CarFront }

export function C2Home() {
  const { openLead } = useLead()
  const popular = [...cars].sort((a, b) => b.popularity - a.popularity || a.priceFrom - b.priceFrom).slice(0, 6)
  const latest = [...articles].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)
  const minPrice = Math.min(...cars.map((c) => c.priceFrom))
  const maxPrice = Math.max(...cars.map((c) => c.priceFrom))
  const cheapest = cars.find((c) => c.priceFrom === minPrice)!
  const priciest = cars.find((c) => c.priceFrom === maxPrice)!

  return (
    <Page title="Аренда авто под такси в Москве без залога — Таксимания">
      {/* ---------- Hero ---------- */}
      <section className="border-b border-asphalt-200 bg-white">
        <Container className="flex flex-col gap-8 py-6 md:py-10">
          <Breadcrumbs items={[{ label: 'Главная' }]} />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_minmax(0,1fr)] lg:items-center lg:gap-12">
            <div className="flex flex-col gap-5">
              <Kicker>Таксопарк в Москве · официальный партнёр Яндекс Go</Kicker>
              <h1 className="t-display-l">Аренда авто под такси в Москве: <span className="plate">10 моделей</span> под 4 тарифа</h1>
              <p className="t-lead max-w-2xl text-asphalt-600">
                От {cheapest.name} за {formatNumber(cheapest.priceFrom)} ₽/день до {priciest.name} за {formatNumber(priciest.priceFrom)} ₽. Без залога, цена фиксируется в договоре, первый день бесплатно. Решение о выдаче — за 10 минут.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="l" onClick={() => openLead({ withTariff: true, title: 'Подобрать автомобиль', submitLabel: 'Подобрать автомобиль' })}>Подобрать автомобиль</Button>
                <Button size="l" variant="ghost" to={c2.cars} iconRight={<ArrowRight className="size-4" />}>Смотреть автопарк</Button>
              </div>
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-2 bg-asphalt-100">
              <img src="/img/scenes/hero-duo.jpg" alt="Автомобили парка Таксимания на площадке выдачи" className="h-full w-full object-cover" fetchPriority="high" />
            </div>
          </div>
          {/* Входы по тарифам */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            {tariffs.map((t) => <TariffTile key={t.id} tariff={t} />)}
            <ElectricTile className="col-span-2 md:col-span-1" />
          </div>
        </Container>
      </section>

      {/* ---------- Полоса цифр + партнёр ---------- */}
      <div className="border-b border-asphalt-200 bg-asphalt-0">
        <Container className="flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between md:gap-8">
          <dl className="grid grid-cols-3 gap-4 md:flex md:gap-10">
            {heroStats.map((s) => (
              <div key={s.label} className="flex flex-col gap-0.5">
                <dd className="t-display-s tabular text-asphalt-950">{s.value}{'unit' in s && s.unit && <span className="text-asphalt-500"> {s.unit}</span>}</dd>
                <dt className="t-caption !font-normal text-asphalt-600">{s.label}</dt>
              </div>
            ))}
          </dl>
          <PartnerBadge />
        </Container>
      </div>

      {/* ---------- Популярные автомобили ---------- */}
      <Section>
        <Container className="flex flex-col gap-8">
          <SectionHeader size="m" label="Автопарк" title="Популярные автомобили" lead="Шесть машин, которые водители парка берут чаще всего. Цены — за день, фиксируются в договоре." action={<Button variant="ghost" to={c2.cars} iconRight={<ArrowRight className="size-4" />}>Весь автопарк</Button>} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {popular.map((car, i) => (
              <Reveal key={car.slug} delay={i * 40}>
                <CarCard car={car} variant="catalog" to={c2.car(car.slug)} onLead={(c) => openLead(leadForCar(c))} className="h-full" />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------- Тарифы ---------- */}
      <Section tight className="border-t border-asphalt-200 bg-white">
        <Container className="flex flex-col gap-8">
          <SectionHeader size="m" label="Тарифы" title="Четыре тарифа: чем выше класс, тем выше чек и аренда" lead="Чек внутри тарифа одинаковый для всех машин, поэтому выбирайте класс по стратегии, а машину — по аренде и расходу." action={<Button variant="ghost" to={c2.tariffs} iconRight={<ArrowRight className="size-4" />}>Все тарифы</Button>} />
          <Table
            head={['Тариф', 'Кому подходит', 'Машин в классе', 'Аренда от', 'Стратегия', '']}
            rows={tariffs.map((t) => [
              <Link key="n" to={c2.tariff(t.slug)} className="t-title-m transition-colors duration-fast hover:text-signal-700">{t.name}</Link>,
              <span key="s" className="block max-w-xs">{t.short}</span>,
              <span key="c" className="tabular">{carsByTariff(t.id).length}</span>,
              <span key="p" className="whitespace-nowrap tabular font-semibold text-asphalt-950">{formatPrice(minPriceForTariff(t.id))}/день</span>,
              <span key="st" className="block max-w-md">{t.strategy}</span>,
              <Link key="a" to={c2.tariff(t.slug)} className="inline-flex size-8 items-center justify-center rounded-1 border border-asphalt-200 text-asphalt-600 transition-colors duration-fast hover:border-asphalt-950 hover:text-asphalt-950" aria-label={`Автомобили тарифа ${t.name}`}><ArrowRight className="size-4" /></Link>,
            ])}
          />
        </Container>
      </Section>

      {/* ---------- Условия коротко ---------- */}
      <Section tight>
        <Container className="flex flex-col gap-6">
          <SectionHeader size="m" label="Условия" title="Условия аренды коротко" action={<Button variant="link" to={c2.terms}>Все условия</Button>} />
          <TermsFacts cols={6} />
        </Container>
      </Section>

      {/* ---------- Акции ---------- */}
      <Section tight className="border-t border-asphalt-200 bg-white">
        <Container className="flex flex-col gap-8">
          <SectionHeader size="m" label="Предложения" title="Акции и предложения" action={<Button variant="ghost" to={c2.offers} iconRight={<ArrowRight className="size-4" />}>Все предложения</Button>} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {offers.slice(0, 3).map((o, i) => (
              <Reveal key={o.slug} delay={i * 40}><OfferCard offer={o} to={c2.offer(o.slug)} className="h-full" /></Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------- Экономика ---------- */}
      <Section inverse id="economics" className="scroll-mt-20">
        <Container className="flex flex-col gap-8 md:gap-10">
          <SectionHeader inverse size="m" label="Экономика" title="Сколько остаётся после аренды" lead="Формула с текущего сайта парка: дни × выручка за смену × коэффициент тарифа минус аренда. Меняйте машину, дни и часы." />
          <div className={calcFullWrap}>
            <Calculator variant="full" inverse carLink={(c) => c2.car(c.slug)} onLead={({ car }) => openLead(car ? leadForCar(car) : { withTariff: true })} />
          </div>
        </Container>
      </Section>

      {/* ---------- Почему ---------- */}
      <Section tight>
        <Container className="flex flex-col gap-8">
          <SectionHeader size="m" label="Почему Таксимания" title="Что подтверждают сайт и отзывы" lead="Только то, что уже написано на текущем сайте парка и в отзывах водителей." />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6 md:gap-6">
            {values.map((v, i) => {
              const Icon = valueIcons[v.id]
              return (
                <Reveal key={v.id} delay={i * 40} className={i < 3 ? 'lg:col-span-2' : 'lg:col-span-3'}>
                  <FeatureCard label={v.label} title={v.title} text={v.text} fact={v.fact} size="m" icon={Icon ? <Icon className="size-4" strokeWidth={1.75} /> : undefined} className="h-full" />
                </Reveal>
              )
            })}
          </div>
        </Container>
      </Section>

      {/* ---------- Отзывы ---------- */}
      <Section tight className="border-t border-asphalt-200 bg-white">
        <Container className="flex flex-col gap-8">
          <SectionHeader
            size="m" label="Отзывы" title="Что говорят водители парка"
            lead={<span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1"><span className="t-number-l text-asphalt-950">{String(overallRating.value).replace('.', ',')}</span><Stars n={5} size={16} /><span>из {overallRating.of} по {pluralWith(overallRating.count, 'отзыву', 'отзывам', 'отзывам')} с сайта парка</span></span>}
            action={<Button variant="ghost" to={c2.reviews} iconRight={<ArrowRight className="size-4" />}>Все отзывы</Button>}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {featuredReviews.slice(0, 3).map((r, i) => (
              <Reveal key={r.id} delay={i * 40}><ReviewCard review={r} compact carTo={r.car ? c2.car(r.car) : undefined} className="h-full" /></Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------- Блог ---------- */}
      <Section tight>
        <Container className="flex flex-col gap-8">
          <SectionHeader size="m" label="Блог" title="Последние статьи" lead="Выбор машины, экономика смены, документы: разбираем с цифрами парка." action={<Button variant="ghost" to={c2.blog} iconRight={<ArrowRight className="size-4" />}>Все статьи</Button>} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {latest.map((a, i) => (
              <Reveal key={a.slug} delay={i * 40}><ArticleCard article={a} to={c2.article(a.slug)} className="h-full" /></Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------- FAQ ---------- */}
      <Section tight className="border-t border-asphalt-200 bg-white">
        <Container className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
          <SectionHeader size="m" label="FAQ" title="Что обычно волнует водителей" lead="Пять вопросов, которые задают чаще всего. Остальные — на странице FAQ." action={<Button variant="link" to={c2.faq}>Все вопросы</Button>} className="md:flex-col md:items-start" />
          <Accordion
            defaultOpen={objections[0]?.id}
            items={objections.slice(0, 5).map((f) => ({ id: f.id, title: f.q, content: <>{f.a}{f.needsConfirmation && <NeedsConfirm className="ml-2 align-middle" />}</> }))}
          />
        </Container>
      </Section>

      {/* ---------- Final CTA ---------- */}
      <FinalCta title={<>Оставьте заявку — менеджер перезвонит и назовёт <span className="plate-light">свободные машины</span></>} lead={`Решение о выдаче — за 10 минут. Парк: ${company.address}, ${company.addressNote.toLowerCase()}.`}>
        <LeadForm inverse withTariff compact submitLabel="Оставить заявку" />
      </FinalCta>
    </Page>
  )
}
