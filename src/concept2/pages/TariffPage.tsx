import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Calculator as CalcIcon } from 'lucide-react'
import { Page } from '../../shared/Page'
import { NotFound } from '../../shared/NotFound'
import { Calculator } from '../../shared/Calculator'
import { LeadForm } from '../../shared/LeadForm'
import { useLead } from '../../shared/LeadContext'
import { Button } from '../../ui/Button'
import { Accordion } from '../../ui/Accordion'
import { Breadcrumbs, Callout, Container, Kicker, NeedsConfirm, Price, Reveal, Section, SectionHeader, Table, Tag } from '../../ui/Primitives'
import { CarCard, ReviewCard } from '../../ui/Cards'
import { carsByTariff, fuelLabel, minPriceForTariff } from '../../data/cars'
import { tariffs, type Tariff } from '../../data/tariffs'
import { featuredReviews, reviewsForTariff } from '../../data/reviews'
import { faq } from '../../data/faq'
import { articlesByCategory, articlesForTariff } from '../../data/articles'
import { C2, c2 } from '../Layout'
import { TariffTile } from '../sections/TariffTiles'
import { TermsFacts } from '../sections/TermsFacts'
import { ArticlesRows } from '../sections/ArticlesRows'
import { FinalCta } from '../sections/FinalCta'
import { DashList, calcFullWrap, leadForCar } from '../sections/helpers'
import { formatNumber, formatPrice, pluralWith } from '../../lib/format'

export function C2TariffPage() {
  const { slug = '' } = useParams()
  const t = tariffs.find((x) => x.slug === slug)
  if (!t) return <NotFound base={C2} />
  return <TariffView key={t.id} tariff={t} />
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const names = (list: { name: string }[]) => list.map((c) => c.name).join(', ')

/** Заголовок из seo.h1 с плашкой на названии тарифа */
function PlateTitle({ text, word }: { text: string; word: string }) {
  const i = text.indexOf(word)
  if (i < 0) return <>{text}</>
  return <>{text.slice(0, i)}<span className="plate">{word}</span>{text.slice(i + word.length)}</>
}

function TariffView({ tariff: t }: { tariff: Tariff }) {
  const { openLead } = useLead()
  const pool = carsByTariff(t.id)
  const slugs = pool.map((c) => c.slug)
  const min = minPriceForTariff(t.id)
  const max = Math.max(...pool.map((c) => c.priceFrom))
  const hero = pool[0]
  const others = tariffs.filter((x) => x.id !== t.id)
  const tariffReviews = reviewsForTariff(slugs)
  const reviews = (tariffReviews.length ? tariffReviews : featuredReviews).slice(0, 3)
  const ownArticles = articlesForTariff(t.slug)
  const articles = ownArticles.length ? ownArticles : articlesByCategory('choice')

  /* Советы — только из данных класса */
  const cheapest = [...pool].sort((a, b) => a.priceFrom - b.priceFrom)[0]
  const petrol = pool.filter((c) => c.consumptionValue !== null)
  const efficient = petrol.length ? [...petrol].sort((a, b) => (a.consumptionValue ?? 99) - (b.consumptionValue ?? 99))[0] : undefined
  const crossovers = pool.filter((c) => c.body === 'crossover')
  const sedans = pool.filter((c) => c.body === 'sedan')
  const electric = pool.filter((c) => c.fuel === 'electric')
  const tips = [
    {
      title: 'Считайте аренду вместе с топливом',
      text: pool.length === 1
        ? `В классе одна машина — ${cheapest.name}: ${formatNumber(cheapest.priceFrom)} ₽/день при расходе ${cheapest.consumption}. Считайте сумму «аренда + топливо на ваш дневной пробег» и сравнивайте с остатком в Комфорт+.`
        : `Чек в тарифе одинаковый для всех машин, разница — в расходах. ${cheapest.name} — самая низкая аренда в классе (${formatNumber(cheapest.priceFrom)} ₽/день)${efficient && efficient.slug !== cheapest.slug ? `, ${efficient.name} — самый низкий расход (${efficient.consumption})` : ''}. Сравнивайте сумму «аренда + топливо на ваш пробег», а не только цену аренды.`,
    },
    {
      title: 'Кузов — под ваши заказы',
      text: crossovers.length && sedans.length
        ? `Кроссоверы (${names(crossovers)}) дают высокую посадку и клиренс зимой. Седаны (${names(sedans)}) привычнее пассажирам и, как правило, экономичнее.`
        : crossovers.length ? `В классе только кроссоверы: ${names(crossovers)}.` : `В классе только седаны: ${names(sedans)}. Для аэропортовых заказов смотрите на объём багажника, для города — на расход.`,
    },
    ...(electric.length ? [{ title: 'Электро — если смена проходит в городе', text: `${names(electric)}: ${electric[0].consumption}. Зарядка дешевле бензина на тот же пробег, но смену нужно планировать вокруг станций. Для аэропортов выгоднее бензиновая машина.` }] : []),
    { title: 'Начинайте с минимальной аренды в классе', text: 'Возьмите самую дешёвую машину тарифа, наберите статистику по загрузке и переходите выше. Сменить машину или класс можно в любое рабочее время.' },
    { title: 'Читайте отзывы по модели', text: tariffReviews.length ? `О машинах тарифа на сайте парка ${pluralWith(tariffReviews.length, 'отзыв', 'отзыва', 'отзывов')}: ${Array.from(new Set(tariffReviews.map((r) => r.carLabel))).join(', ')}. Ниже — тексты без правок.` : 'Отзывов именно о машинах этого тарифа на сайте парка пока нет — спросите менеджера, какие модели класса берут повторно.' },
  ].slice(0, 4)

  const faqIds = ['deposit', 'extra-fees', 'how-fast', 'swap', 'age']
  const faqItems = [
    { id: 'which', title: `Какие машины подходят под тариф ${t.name}?`, content: <>{names(pool)}. Все машины парка не старше 3 лет и обслуживаются в собственном сервисе. Полный список с ценами — <a href="#cars" className="underline underline-offset-2">в разделе «Автомобили»</a> выше.</> },
    { id: 'price', title: `Сколько стоит аренда в тарифе ${t.name}?`, content: pool.length === 1 ? `${formatPrice(min)} в день за ${pool[0].name}. Цена фиксируется в договоре, залог не нужен, первый день бесплатно.` : `От ${formatPrice(min)} до ${formatPrice(max)} в день в зависимости от модели. Цена фиксируется в договоре, залог не нужен, первый день бесплатно.` },
    ...faqIds.map((id) => faq.find((f) => f.id === id)!).map((f) => ({ id: f.id, title: f.q, content: <>{f.a}{f.needsConfirmation && <NeedsConfirm className="ml-2 align-middle" />}</> })),
  ]

  return (
    <Page title={t.seo.title}>
      {/* ---------- Hero ---------- */}
      <section className="border-b border-asphalt-200 bg-white">
        <Container className="flex flex-col gap-6 py-6 md:py-8">
          <Breadcrumbs items={[{ label: 'Главная', to: c2.home }, { label: 'Тарифы', to: c2.tariffs }, { label: t.name }]} />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_minmax(0,1fr)] lg:items-center lg:gap-12">
            <div className="flex flex-col gap-5">
              <Kicker>Тариф {String(t.order).padStart(2, '0')} · {t.short}</Kicker>
              <h1 className="t-display-l"><PlateTitle text={t.seo.h1} word={t.name} /></h1>
              <p className="t-lead max-w-2xl text-asphalt-600">{t.seo.lead}</p>
              <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
                <Price value={min} size="l" />
                <div className="flex flex-col"><span className="t-display-s tabular">{pool.length}</span><span className="t-caption !font-normal text-asphalt-600">{pluralWith(pool.length, 'машина', 'машины', 'машин').replace(/^\d+\s/, '')} в классе</span></div>
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <Button size="l" href="#cars">Выбрать автомобиль</Button>
                <Button size="l" variant="ghost" href="#economics" icon={<CalcIcon className="size-4" />}>Рассчитать</Button>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2 bg-asphalt-100">
              <img src={hero.images.cover} alt={`${hero.name} — тариф ${t.name}`} className="h-full w-full object-cover" fetchPriority="high" />
              <div className="absolute left-3 top-3 flex gap-1.5"><Tag tone="dark">{t.name}</Tag><Tag tone="neutral">{hero.name}</Tag></div>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------- Что за тариф ---------- */}
      <Section tight>
        <Container className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-16">
          <div className="flex flex-col gap-5">
            <SectionHeader size="m" label="О тарифе" title={`Что представляет собой тариф ${t.name}`} />
            <p className="t-lead text-asphalt-700">{t.description}</p>
            <Callout tone="dark" title="Стратегия заработка">{t.strategy}</Callout>
          </div>
          <div className="flex flex-col gap-4 rounded-2 border border-asphalt-200 bg-white p-5 md:p-6">
            <div className="t-label text-asphalt-500">Кому подходит</div>
            <DashList items={t.whoFor.map(cap)} />
            <Link to={c2.tariffs} className="mt-auto inline-flex items-center gap-1.5 pt-2 t-small font-semibold text-asphalt-950 transition-colors duration-fast hover:text-signal-700">Сравнить с другими тарифами<ArrowRight className="size-4" /></Link>
          </div>
        </Container>
      </Section>

      {/* ---------- Автомобили ---------- */}
      <Section id="cars" tight className="scroll-mt-20 border-t border-asphalt-200 bg-white">
        <Container className="flex flex-col gap-8">
          <SectionHeader size="m" label="Автомобили" title={`Какие автомобили доступны в тарифе ${t.name}`} lead={pool.length === 1 ? `Одна модель: ${hero.name}. Цена за день, фиксируется в договоре.` : `${pluralWith(pool.length, 'модель', 'модели', 'моделей')} от ${formatNumber(min)} до ${formatNumber(max)} ₽/день. Цены за день, фиксируются в договоре.`} action={<Button variant="ghost" to={`${c2.cars}?tariff=${t.id}`} iconRight={<ArrowRight className="size-4" />}>В каталоге с фильтрами</Button>} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {pool.map((c, i) => <Reveal key={c.slug} delay={i * 40}><CarCard car={c} variant="catalog" to={c2.car(c.slug)} onLead={(x) => openLead(leadForCar(x))} className="h-full" /></Reveal>)}
          </div>
        </Container>
      </Section>

      {/* ---------- Сравнение машин ---------- */}
      <Section tight>
        <Container className="flex flex-col gap-8">
          <SectionHeader size="m" label="Сравнение" title={`Машины тарифа ${t.name} в одной таблице`} lead="Чек одинаковый для всех машин класса, поэтому сравнивайте аренду, расход и кузов." action={<Button variant="ghost" to={`${c2.compare}?cars=${slugs.slice(0, 3).join(',')}`} iconRight={<ArrowRight className="size-4" />}>Открыть сравнение</Button>} />
          <Table
            head={['Модель', 'Аренда', 'Двигатель', 'Расход / запас хода', 'Кузов', 'Коробка', 'Сильная сторона']}
            rows={pool.map((c) => [
              <Link key="n" to={c2.car(c.slug)} className="inline-flex items-center gap-3 transition-colors duration-fast hover:text-signal-700"><img src={c.images.cover} alt="" className="size-10 rounded-1 object-cover" loading="lazy" /><span className="whitespace-nowrap">{c.name}</span></Link>,
              <span key="p" className="whitespace-nowrap tabular font-semibold text-asphalt-950">{formatPrice(c.priceFrom)}/день</span>,
              <span key="e" className="whitespace-nowrap">{c.engine}{c.fuel === 'petrol' ? ', бензин' : ''}</span>,
              <span key="c" className="whitespace-nowrap">{c.fuel === 'electric' ? `${c.consumption} (${fuelLabel(c.fuel).toLowerCase()})` : c.consumption}</span>,
              c.bodyLabel,
              c.gearbox,
              <span key="b" className="block max-w-xs">{c.benefit}</span>,
            ])}
          />
        </Container>
      </Section>

      {/* ---------- Экономика ---------- */}
      <Section inverse id="economics" className="scroll-mt-20">
        <Container className="flex flex-col gap-8 md:gap-10">
          <SectionHeader inverse size="m" label="Экономика" title={`Сколько остаётся после аренды в тарифе ${t.name}`} lead={`Коэффициент тарифа ${t.multiplier === 1 ? '1 (база)' : `×${String(t.multiplier).replace('.', ',')} к выручке Эконома`} — из формулы на текущем сайте парка. Выберите машину, дни и часы.`} />
          <div className={calcFullWrap}>
            <Calculator variant="full" inverse defaultTariff={t.id} carLink={(c) => c2.car(c.slug)} onLead={({ car }) => openLead(car ? leadForCar(car) : { withTariff: true, tariff: t.id })} />
          </div>
        </Container>
      </Section>

      {/* ---------- Как выбрать ---------- */}
      <Section tight>
        <Container className="flex flex-col gap-8">
          <SectionHeader size="m" label="Как выбрать" title={`Как выбрать машину в тарифе ${t.name}`} />
          <ol className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {tips.map((tip, i) => (
              <li key={tip.title} className="flex gap-4 rounded-2 border border-asphalt-200 bg-white p-5">
                <span className="shrink-0 self-start t-number-l leading-none text-asphalt-200" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                <div className="flex flex-col gap-1.5"><h3 className="t-title-m">{tip.title}</h3><p className="t-small text-asphalt-600">{tip.text}</p></div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ---------- Условия ---------- */}
      <Section tight className="border-t border-asphalt-200 bg-white">
        <Container className="flex flex-col gap-6">
          <SectionHeader size="m" label="Условия" title="Условия аренды одинаковы для всех тарифов" action={<Button variant="link" to={c2.terms}>Все условия</Button>} />
          <TermsFacts cols={6} />
        </Container>
      </Section>

      {/* ---------- Отзывы ---------- */}
      <Section tight>
        <Container className="flex flex-col gap-8">
          <SectionHeader size="m" label="Отзывы" title={tariffReviews.length ? `Отзывы водителей о машинах ${t.name}` : 'Отзывы водителей парка'} lead={tariffReviews.length ? 'Тексты с текущего сайта парка, без правок.' : 'Отзывов именно о машинах этого тарифа пока нет — показываем избранные.'} action={<Button variant="link" to={c2.reviews}>Все отзывы</Button>} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {reviews.map((r, i) => <Reveal key={r.id} delay={i * 40}><ReviewCard review={r} compact carTo={r.car ? c2.car(r.car) : undefined} className="h-full" /></Reveal>)}
          </div>
        </Container>
      </Section>

      {/* ---------- FAQ ---------- */}
      <Section tight className="border-t border-asphalt-200 bg-white">
        <Container className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
          <SectionHeader size="m" label="FAQ" title={`Вопросы о тарифе ${t.name}`} action={<Button variant="link" to={c2.faq}>Все вопросы</Button>} className="md:flex-col md:items-start" />
          <Accordion items={faqItems} defaultOpen="which" />
        </Container>
      </Section>

      {/* ---------- Другие тарифы + статьи ---------- */}
      <Section tight>
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div className="flex flex-col gap-6">
            <SectionHeader size="m" label="Другие тарифы" title="Не тот класс?" lead="Сменить класс можно в любое рабочее время." />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {others.map((o) => <TariffTile key={o.id} tariff={o} />)}
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <SectionHeader size="m" label="Статьи" title={ownArticles.length ? `Статьи о тарифе ${t.name}` : 'Статьи о выборе машины'} action={<Button variant="link" to={c2.blog}>Все статьи</Button>} />
            <ArticlesRows articles={articles} max={4} />
          </div>
        </Container>
      </Section>

      <FinalCta title={<>Подобрать машину под тариф <span className="plate-light">{t.name}</span></>} lead={`Менеджер назовёт свободные машины класса на сегодня и условия. Решение о выдаче — за 10 минут.`}>
        <LeadForm inverse compact defaultTariff={t.id} withTariff submitLabel="Подобрать автомобиль" />
      </FinalCta>
    </Page>
  )
}
