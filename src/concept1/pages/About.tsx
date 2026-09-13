import type { ReactNode } from 'react'
import { ArrowRight, Check, LayoutGrid, Repeat, Timer } from 'lucide-react'
import { Page } from '../../shared/Page'
import { useLead } from '../../shared/LeadContext'
import { Button } from '../../ui/Button'
import { FeatureCard, ReviewCard } from '../../ui/Cards'
import { Breadcrumbs, Container, Kicker, NeedsConfirm, Reveal, Section, SectionHeader, Stat, Tag } from '../../ui/Primitives'
import { company, stats, values } from '../../data/company'
import { tariffs } from '../../data/tariffs'
import { minPriceForTariff } from '../../data/cars'
import { featuredReviews } from '../../data/reviews'
import { formatPrice, phoneHref } from '../../lib/format'
import { C1 } from '../Layout'
import { asset } from '../../lib/asset'

const firstSentence = (t: string) => { const i = t.indexOf('. '); return i > 0 ? t.slice(0, i + 1) : t }

export function C1About() {
  const { openLead } = useLead()
  const tariffLine = tariffs.map((t) => `${t.name} от ${formatPrice(minPriceForTariff(t.id))}`).join(', ')
  const serviceFacts: { k: string; v: ReactNode }[] = [
    { k: 'Где обслуживаются', v: 'В собственном сервисе парка' },
    { k: 'Плановое ТО', v: 'График ведёт парк, а не водитель' },
    { k: 'Возраст машин', v: 'Не более 3 лет' },
    { k: 'Подменный автомобиль на время ремонта', v: <NeedsConfirm /> },
  ]
  const supportPoints = [
    'Круглосуточно, без перерывов и выходных',
    'Помощь от мелкой неисправности до оформления ДТП',
    'Смена автомобиля или класса — в любое рабочее время',
  ]
  const photos = [
    { src: '/img/scenes/parking-tiggo7.jpg', tag: 'Парк', alt: 'Автомобиль парка на крытой парковке' },
    { src: '/img/scenes/hero-duo.jpg', tag: 'Выдача', alt: 'Автомобили, подготовленные к выдаче' },
    { src: '/img/scenes/parking-portrait.jpg', tag: 'Сервис', alt: 'Территория парка' },
  ]

  return (
    <Page title="О компании — Таксимания">
      {/* Hero */}
      <section className="pt-6 md:pt-10">
        <Container className="flex flex-col gap-8 md:gap-12">
          <Breadcrumbs items={[{ label: 'Главная', to: C1 }, { label: 'О компании' }]} />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="flex flex-col gap-6 lg:col-span-5">
              <Kicker>О компании</Kicker>
              <h1 className="t-display-l">Таксимания — парк из <span className="plate">1000+ машин</span></h1>
              <p className="t-lead text-asphalt-600">
                Аренда автомобилей для работы в такси в Москве: 10+ лет на рынке, четыре тарифа, собственный сервис и круглосуточная поддержка. Официальный партнёр Яндекс Go.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="l" to={`${C1}#cars`}>Выбрать автомобиль</Button>
                <Button size="l" variant="ghost" to={`${C1}/contact`}>Как добраться</Button>
              </div>
            </div>
            <div className="overflow-hidden rounded-2 bg-asphalt-900 lg:col-span-7">
              <img src={asset('/img/scenes/parking-orange.jpg')} alt="Автомобиль парка Таксимании" className="aspect-[4/3] w-full object-cover sm:aspect-[3/2]" />
            </div>
          </div>
        </Container>
      </section>

      {/* В цифрах */}
      <Section>
        <Container className="flex flex-col gap-8 md:gap-12">
          <SectionHeader size="m" label="Компания в цифрах" title="Что можно проверить до визита в парк" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={(i % 4) * 60}>
                <div className="surface h-full p-5 md:p-6"><Stat value={s.value} unit={s.unit} label={s.label} /></div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Как устроен парк */}
      <Section className="bg-white">
        <Container className="flex flex-col gap-8 md:gap-12">
          <SectionHeader label="Парк" title={<>Как устроен <span className="plate">парк</span></>} lead="Тысяча с лишним машин под четыре тарифа агрегаторов, свежий возраст и возможность сменить автомобиль, когда вырастете из тарифа." />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            <Reveal delay={0}>
              <FeatureCard className="h-full" label="Машины" title="1000+ автомобилей под 4 тарифа" text={`${tariffLine} ₽/день. Бензин и электро, седаны и кроссоверы — десять моделей на сайте, больше в парке.`} fact="10 моделей · 4 тарифа" icon={<LayoutGrid className="size-5" strokeWidth={1.75} />} />
            </Reveal>
            <Reveal delay={60}>
              <FeatureCard className="h-full" label="Возраст" title="Не старше 3 лет" text="Требования агрегаторов к году выпуска соблюдаются на всём парке. Машины своевременно обслуживаются в собственном сервисе." fact="≤ 3 лет · свой сервис" icon={<Timer className="size-5" strokeWidth={1.75} />} />
            </Reveal>
            <Reveal delay={120}>
              <FeatureCard className="h-full" label="Гибкость" title="Смена машины в любое рабочее время" text="Начали в Экономе — переходите в Комфорт+, когда будете готовы. Подходящий вариант найдётся из 1000+ машин без ожидания." fact="4 тарифа · любой рабочий день" icon={<Repeat className="size-5" strokeWidth={1.75} />} />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Обслуживание */}
      <Section>
        <Container className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="overflow-hidden rounded-2 bg-asphalt-100 lg:col-span-7">
            <img src={asset('/img/scenes/street-tiggo7.webp')} alt="Автомобили парка на улице" loading="lazy" className="aspect-[3/2] w-full object-cover" />
          </div>
          <div className="flex flex-col gap-6 lg:col-span-5">
            <SectionHeader size="m" label="Сервис" title="Как обслуживаются автомобили" lead="График ТО ведёт парк, а не водитель. Вы получаете машину, на которой можно выходить на линию сразу." />
            <dl className="divide-y divide-asphalt-200 border-y border-asphalt-200">
              {serviceFacts.map((f) => (
                <div key={f.k} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <dt className="t-caption text-asphalt-500">{f.k}</dt>
                  <dd className="t-body font-semibold text-asphalt-950 sm:text-right">{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </Section>

      {/* Поддержка */}
      <Section inverse>
        <Container className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="flex flex-col gap-6 lg:col-span-6">
            <SectionHeader inverse size="m" label="Поддержка" title="Как работает поддержка" lead="После оформления вы не остаётесь один: сотрудники офиса помогают решать вопросы, а служба поддержки отвечает круглосуточно." />
            <ul className="flex flex-col gap-3">
              {supportPoints.map((p) => (
                <li key={p} className="flex items-start gap-3 t-body text-asphalt-200">
                  <Check className="mt-1 size-5 shrink-0 text-signal-400" strokeWidth={2.25} />{p}
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2 border-t border-[rgba(242,244,247,.14)] pt-5">
              <span className="t-caption text-asphalt-400">Телефон поддержки</span>
              <div className="flex flex-wrap items-center gap-3">
                <a href={phoneHref(company.phoneSupport)} className="t-display-m tabular text-asphalt-50 transition-colors duration-fast hover:text-signal-400">{company.phoneSupport}</a>
                <Tag tone="inverse">24/7</Tag>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-2 bg-asphalt-800 lg:col-span-6">
            <img src={asset('/img/scenes/manager-ok.webp')} alt="Менеджер поддержки парка" loading="lazy" className="aspect-[4/3] w-full object-cover" />
          </div>
        </Container>
      </Section>

      {/* Территория */}
      <Section>
        <Container className="flex flex-col gap-8 md:gap-12">
          <SectionHeader size="m" label="Команда, офис, территория" title="Парк на Загородном шоссе" lead={`${company.address}, ${company.city}. ${company.addressNote}.`} action={<Button variant="link" to={`${C1}/contact`} iconRight={<ArrowRight className="size-4" />}>Контакты и маршрут</Button>} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {photos.map((p, i) => (
              <Reveal key={p.src} delay={i * 60}>
                <figure className="relative overflow-hidden rounded-2 bg-asphalt-900">
                  <img src={asset(p.src)} alt={p.alt} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                  <figcaption className="absolute left-3 top-3"><Tag tone="dark">{p.tag}</Tag></figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Принципы */}
      <Section className="bg-white">
        <Container className="flex flex-col gap-8 md:gap-12">
          <SectionHeader label="Принципы" title={<>Как работаем <span className="plate">с водителями</span></>} />
          <ol className="border-t border-asphalt-200">
            {values.map((v, i) => (
              <li key={v.id} className="grid grid-cols-1 gap-2 border-b border-asphalt-200 py-5 md:grid-cols-[72px_minmax(0,5fr)_minmax(0,7fr)] md:items-baseline md:gap-x-8 md:py-6">
                <span className="t-number-l text-asphalt-300">0{i + 1}</span>
                <h3 className="t-title-l">{v.label}</h3>
                <p className="t-body text-asphalt-600">{firstSentence(v.text)}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Отзывы */}
      <Section>
        <Container className="flex flex-col gap-8 md:gap-12">
          <SectionHeader size="m" label="Отзывы" title="Что говорят водители парка" action={<Button variant="link" to={`${C1}#reviews`} iconRight={<ArrowRight className="size-4" />}>Все отзывы</Button>} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {featuredReviews.slice(0, 3).map((r, i) => (
              <Reveal key={r.id} delay={i * 60}><ReviewCard review={r} className="h-full" /></Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section inverse className="!bg-asphalt-950">
        <Container className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="flex max-w-2xl flex-col gap-4">
            <Kicker inverse>Следующий шаг</Kicker>
            <h2 className="t-display-l">Готовы выбрать <span className="plate">машину</span>?</h2>
            <p className="t-lead text-asphalt-300">Оставьте заявку — менеджер перезвонит, уточнит тариф и наличие. Решение о выдаче — за 10 минут, первый день аренды бесплатно.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
            <Button size="l" onClick={() => openLead({ title: 'Подобрать автомобиль', withTariff: true, submitLabel: 'Подобрать автомобиль' })}>Подобрать автомобиль</Button>
            <Button size="l" variant="ghost-inverse" to={`${C1}#cars`}>Смотреть автомобили</Button>
          </div>
        </Container>
      </Section>
    </Page>
  )
}
