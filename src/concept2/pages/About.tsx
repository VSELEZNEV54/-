import { Link } from 'react-router-dom'
import { ArrowRight, Phone } from 'lucide-react'
import { Page } from '../../shared/Page'
import { Button } from '../../ui/Button'
import { ReviewCard } from '../../ui/Cards'
import { Container, Reveal, Section, SectionHeader, Stat } from '../../ui/Primitives'
import { C2, c2 } from '../Layout'
import { company, heroStats, perks, stats, values } from '../../data/company'
import { cars } from '../../data/cars'
import { tariffs } from '../../data/tariffs'
import { featuredReviews } from '../../data/reviews'
import { cn, phoneHref } from '../../lib/format'
import { ContentHead, DarkCta } from '../sections/ContentShared'

const chain = [
  { n: '01', title: 'Автопарк', image: '/img/scenes/parking-tiggo7.jpg', link: { label: 'Смотреть автопарк', to: c2.cars },
    facts: ['1000+ машин в собственном парке', `${cars.length} моделей под ${tariffs.length} тарифа: Эконом, Комфорт, Комфорт+ и Бизнес, бензин и электро`, 'Возраст автомобилей — не более 3 лет'] },
  { n: '02', title: 'Выдача автомобиля', image: '/img/scenes/manager-ok.webp', link: { label: 'Условия аренды', to: c2.terms },
    facts: ['Решение о выдаче — в течение 10 минут после заявки', 'Договор с фиксированной ценой, без залога и дополнительных комиссий', 'Первый день аренды бесплатно'] },
  { n: '03', title: 'Техническое обслуживание', image: '/img/scenes/parking-orange.jpg', link: { label: 'Вопросы об обслуживании', to: c2.faq },
    facts: ['Собственный сервис парка: ТО и ремонт без сторонних подрядчиков', 'График ТО ведёт парк, а не водитель', 'Помощь при неисправностях — от мелких до оформления ДТП'] },
  { n: '04', title: 'Поддержка', image: '/img/scenes/street-tiggo7.webp', link: { label: 'Контакты парка', to: c2.contact },
    facts: [company.hours.support, `Телефон поддержки ${company.phoneSupport}`, 'Сотрудники офиса на связи по любому вопросу на линии'] },
  { n: '05', title: 'Работа водителя', image: '/img/scenes/hero-duo.jpg', link: { label: 'Тарифы и калькулятор', to: c2.tariffs },
    facts: ['Гибкий график: смены и дни выбираете сами', 'Смена автомобиля или класса в любое рабочее время', 'Вывод средств круглосуточно до 15 000 ₽, Яндекс Заправки'] },
]

export function C2About() {
  return (
    <Page title="О компании Таксимания — таксопарк в Москве, 1000+ машин">
      <ContentHead
        crumbs={[{ label: 'Главная', to: C2 }, { label: 'О компании' }]}
        label="О компании"
        title={<>Таксопарк, который работает как <span className="plate">система</span></>}
        lead={`Таксимания — ${stats[1].value} ${stats[1].unit} на рынке аренды авто под такси в Москве. 1000+ машин не старше 3 лет, собственный сервис, оформление за 10 минут и поддержка круглосуточно. ${company.partner}.`}
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-end lg:gap-12">
          <div className="grid grid-cols-3 gap-4 border-t border-asphalt-200 pt-5">
            {heroStats.map((s) => <Stat key={s.label} value={s.value} unit={s.unit} label={s.label} />)}
          </div>
          <div className="overflow-hidden rounded-2 bg-asphalt-100"><img src="/img/scenes/hero-duo.jpg" alt="Автомобили парка Таксимания" className="aspect-[3/2] w-full object-cover" /></div>
        </div>
      </ContentHead>

      {/* Цифры */}
      <Section tight>
        <Container className="flex flex-col gap-8">
          <SectionHeader size="m" label="Факты" title="Компания в цифрах" lead="Все цифры — с текущего сайта парка и из отзывов водителей." />
          <div className="grid grid-cols-2 overflow-hidden rounded-2 border border-asphalt-200 bg-white lg:grid-cols-4">
            {stats.map((s, i) => (
              <div key={s.label} className={cn('border-asphalt-200 p-5 md:p-6', i % 2 === 0 && 'border-r', i < 6 && 'border-b', 'lg:border-r lg:[&:nth-child(4n)]:border-r-0 lg:[&:nth-child(n+5)]:border-b-0')}>
                <Stat value={s.value} unit={s.unit} label={s.label} />
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Схема системы */}
      <Section tight className="border-y border-asphalt-200 bg-white">
        <Container className="flex flex-col gap-10 md:gap-14">
          <SectionHeader size="m" label="Как устроен парк" title="Пять звеньев одной системы" lead="От машины на стоянке до вашей смены на линии. Каждое звено — своя команда, свои сроки и своё обещание водителю." />
          <ol className="relative flex flex-col before:absolute before:bottom-4 before:left-[10px] before:top-4 before:w-1 before:bg-signal-500 md:before:left-[14px]">
            {chain.map((b, i) => {
              const last = i === chain.length - 1
              return (
                <li key={b.n} className={cn('relative pl-10 md:pl-16', !last && 'pb-12 md:pb-16')}>
                  <span className={cn('absolute left-0 top-1 size-6 md:size-8', last ? 'bg-asphalt-950' : 'bg-signal-500')} aria-hidden />
                  <Reveal className="grid grid-cols-1 gap-6 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-10">
                    <div className="flex flex-col gap-4">
                      <span className="t-label tabular text-signal-700">{b.n}</span>
                      <h3 className="t-display-m">{b.title}</h3>
                      <ul className="flex flex-col gap-2">
                        {b.facts.map((f) => <li key={f} className="flex items-start gap-3 t-body text-asphalt-700"><span className="mt-[11px] size-1.5 shrink-0 bg-asphalt-950" aria-hidden />{f}</li>)}
                      </ul>
                      <Link to={b.link.to} className="group inline-flex items-center gap-1.5 t-small font-semibold text-signal-700 transition-colors duration-fast hover:text-signal-500">{b.link.label}<ArrowRight className="size-4 transition-transform duration-fast group-hover:translate-x-0.5" /></Link>
                    </div>
                    <div className="overflow-hidden rounded-2 bg-asphalt-100"><img src={b.image} alt="" loading="lazy" className="aspect-[3/2] w-full object-cover" /></div>
                  </Reveal>
                </li>
              )
            })}
          </ol>
        </Container>
      </Section>

      {/* Принципы */}
      <Section tight>
        <Container className="flex flex-col gap-8">
          <SectionHeader size="m" label="Принципы" title="Принципы работы с водителями" />
          <ul className="flex flex-col divide-y divide-asphalt-200 border-y border-asphalt-200">
            {values.map((v) => (
              <li key={v.id} className="grid grid-cols-1 gap-2 py-5 md:grid-cols-[200px_1fr_220px] md:gap-6 md:py-6">
                <span className="t-label text-signal-700">{v.label}</span>
                <div className="flex flex-col gap-1.5"><h3 className="t-title-l">{v.title}</h3><p className="t-small text-asphalt-600">{v.text}</p></div>
                <span className="t-label-l text-asphalt-950 md:text-right">{v.fact}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Партнёр */}
      <Section tight className="border-y border-asphalt-200 bg-white">
        <Container className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div className="flex flex-col items-start gap-4">
            <span className="inline-flex items-center rounded-0 bg-partner-yandex px-3 py-1.5 t-label text-asphalt-950">Яндекс Go</span>
            <h2 className="t-display-m">{company.partner}</h2>
            <p className="t-body text-asphalt-600">Подключение к агрегатору проходит в парке при оформлении. Заправки, вывод средств и поддержка работают в одной связке с арендой.</p>
            <Link to={c2.offer('yandex-partner')} className="group inline-flex items-center gap-1.5 t-small font-semibold text-signal-700 transition-colors duration-fast hover:text-signal-500">Подробнее о партнёрстве<ArrowRight className="size-4 transition-transform duration-fast group-hover:translate-x-0.5" /></Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {perks.map((p) => (
              <div key={p.title} className="flex flex-col gap-1 rounded-2 border border-asphalt-200 bg-asphalt-50 p-4">
                <h3 className="t-title-m">{p.title}</h3>
                <p className="t-small text-asphalt-600">{p.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Отзывы */}
      <Section tight>
        <Container className="flex flex-col gap-8">
          <SectionHeader size="m" label="Отзывы" title="Что говорят водители" lead="4,9 из 5 по отзывам на текущем сайте парка." action={<Button variant="ghost" to={c2.reviews}>Все отзывы</Button>} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {featuredReviews.slice(0, 3).map((r, i) => <Reveal key={r.id} delay={i * 50}><ReviewCard review={r} carTo={r.car ? c2.car(r.car) : undefined} className="h-full" /></Reveal>)}
          </div>
        </Container>
      </Section>

      {/* Юридическая информация */}
      <Section tight className="border-t border-asphalt-200 bg-white">
        <Container className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr] lg:gap-16">
          <SectionHeader size="m" label="Реквизиты" title="Юридическая информация" lead={<Link to={c2.documents} className="underline underline-offset-4 decoration-1 hover:text-signal-700 transition-colors duration-fast">Оферта, политики и реквизиты</Link>} />
          <dl className="grid grid-cols-1 gap-x-8 gap-y-3 rounded-2 border border-asphalt-200 bg-asphalt-50 p-6 t-small sm:grid-cols-[180px_1fr]">
            <dt className="text-asphalt-500">Наименование</dt><dd className="font-semibold">{company.legalName}</dd>
            <dt className="text-asphalt-500">ОГРН</dt><dd className="tabular">{company.legal.ogrn}</dd>
            <dt className="text-asphalt-500">ИНН / КПП</dt><dd className="tabular">{company.legal.inn} / {company.legal.kpp}</dd>
            <dt className="text-asphalt-500">Юридический адрес</dt><dd>{company.legal.address}</dd>
            <dt className="text-asphalt-500">Парк</dt><dd>{company.address}, {company.city} · {company.addressNote}</dd>
            <dt className="text-asphalt-500">Телефон</dt><dd><a href={phoneHref(company.phone)} className="hover:text-signal-700 transition-colors duration-fast">{company.phone}</a></dd>
            <dt className="text-asphalt-500">Почта</dt><dd><a href={`mailto:${company.email}`} className="hover:text-signal-700 transition-colors duration-fast">{company.email}</a></dd>
          </dl>
        </Container>
      </Section>

      <DarkCta
        title={<>Начните с заявки — <span className="plate-light">решение за 10 минут</span></>}
        lead="Менеджер перезвонит, уточнит тариф и наличие машины. Первый день аренды бесплатно, залог не нужен."
        form={{ submitLabel: 'Оставить заявку', context: 'О компании' }}
      >
        <a href={phoneHref(company.phone)} className="inline-flex items-center gap-2 t-btn text-signal-400 hover:text-signal-300 transition-colors duration-fast"><Phone className="size-4" />{company.phone}</a>
      </DarkCta>
    </Page>
  )
}
