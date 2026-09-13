import { Link } from 'react-router-dom'
import { Clock, Mail, Phone, RefreshCw, Timer, Wrench } from 'lucide-react'
import { Page } from '../../shared/Page'
import { Accordion } from '../../ui/Accordion'
import { Button } from '../../ui/Button'
import { Callout, Container, NeedsConfirm, Reveal, Section, SectionHeader, Stat, Table, Tag } from '../../ui/Primitives'
import { C2, c2 } from '../Layout'
import { cars, minPriceForTariff } from '../../data/cars'
import { tariffs, tariffName } from '../../data/tariffs'
import { company, documents, requirements, steps } from '../../data/company'
import { faq, faqByGroup } from '../../data/faq'
import { articlesByCategory } from '../../data/articles'
import { formatNumber, phoneHref } from '../../lib/format'
import { CheckList, ContentHead, DarkCta, DocSection, InlineLink, LinkGroup, StickyNav } from '../sections/ContentShared'

const toc = [
  { id: 'cost', label: 'Стоимость' },
  { id: 'deposit', label: 'Депозит и комиссии' },
  { id: 'requirements', label: 'Требования к водителю' },
  { id: 'documents', label: 'Документы' },
  { id: 'process', label: 'Оформление' },
  { id: 'service', label: 'Обслуживание' },
  { id: 'schedule', label: 'График' },
  { id: 'incidents', label: 'ДТП и поломки' },
  { id: 'fines', label: 'Штрафы' },
  { id: 'return', label: 'Возврат автомобиля' },
  { id: 'swap', label: 'Замена автомобиля' },
  { id: 'faq', label: 'FAQ по условиям' },
]

const byId = (id: string) => faq.find((f) => f.id === id)!
const tariffOrder = Object.fromEntries(tariffs.map((t) => [t.id, t.order])) as Record<string, number>

export function C2RentalTerms() {
  const priceRows = [...cars]
    .sort((a, b) => tariffOrder[a.tariff] - tariffOrder[b.tariff] || a.priceFrom - b.priceFrom)
    .map((c) => [
      <Link key={c.slug} to={c2.car(c.slug)} className="underline-offset-2 transition-colors duration-fast hover:text-signal-700 hover:underline">{c.name}</Link>,
      <Link key={`${c.slug}-t`} to={c2.tariff(c.tariff)} className="transition-colors duration-fast hover:text-signal-700">{tariffName(c.tariff)}</Link>,
      <span key={`${c.slug}-p`} className="tabular font-semibold text-asphalt-950">{formatNumber(c.priceFrom)} ₽/день</span>,
      c.consumption,
    ])

  const termsFaq = [...faqByGroup('rental'), ...faqByGroup('payment')].map((f) => ({
    id: f.id, title: f.q, content: f.a, meta: f.needsConfirmation ? <NeedsConfirm /> : undefined,
  }))

  const articles = [...articlesByCategory('rental'), ...articlesByCategory('documents')]

  return (
    <Page title="Условия аренды автомобиля под такси в Москве — Таксимания">
      <ContentHead
        crumbs={[{ label: 'Главная', to: C2 }, { label: 'Условия аренды' }]}
        label="Условия парка"
        title={<>Условия аренды автомобиля под такси в&nbsp;Москве</>}
        lead="Цена аренды фиксируется в договоре, залог не нужен, дополнительные комиссии не списываются. Решение о выдаче — за 10 минут, первый день аренды бесплатно. Все условия парка — на одной странице."
      >
        <div className="flex flex-wrap gap-2">
          <Tag tone="dark">от {formatNumber(minPriceForTariff('econom'))} ₽/день</Tag>
          <Tag tone="signal">0 ₽ залог</Tag>
          <Tag>решение за 10 минут</Tag>
          <Tag>первый день бесплатно</Tag>
          <Tag>поддержка 24/7</Tag>
        </div>
      </ContentHead>

      <Section tight>
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
          <StickyNav
            items={toc}
            footer={
              <div className="flex flex-col gap-2 rounded-2 bg-asphalt-950 p-4 text-asphalt-50">
                <span className="t-caption text-asphalt-400">Поддержка круглосуточно</span>
                <a href={phoneHref(company.phoneSupport)} className="t-title-m hover:text-signal-400 transition-colors duration-fast">{company.phoneSupport}</a>
              </div>
            }
          />

          <div className="flex flex-col gap-10 md:gap-14">
            {/* 01 Стоимость */}
            <DocSection id="cost" n="01" title="Стоимость аренды" className="border-t-0 pt-0 md:pt-0">
              <p className="t-body max-w-2xl text-asphalt-600">Десять моделей под четыре тарифа. Цена в таблице — минимальная ставка за день по каждой модели; точная стоимость зависит от комплектации и фиксируется в договоре до подписания.</p>
              <Table
                head={['Модель', 'Тариф', 'Аренда от', 'Расход']}
                rows={priceRows}
                caption="Цена фиксируется в договоре на весь срок аренды и не меняется по ходу работы."
                highlightCol={2}
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {tariffs.map((t) => (
                  <Link key={t.id} to={c2.tariff(t.slug)} className="group flex flex-col gap-1 rounded-2 border border-asphalt-200 bg-white p-4 transition-colors duration-fast hover:border-asphalt-950">
                    <span className="t-label text-asphalt-500 group-hover:text-signal-700 transition-colors duration-fast">{t.name}</span>
                    <span className="t-display-s tabular">от {formatNumber(minPriceForTariff(t.id))} ₽</span>
                    <span className="t-caption !font-normal text-asphalt-500">{t.short}</span>
                  </Link>
                ))}
              </div>
            </DocSection>

            {/* 02 Депозит и комиссии */}
            <DocSection id="deposit" n="02" title="Депозит и комиссии">
              <div className="grid grid-cols-1 gap-6 rounded-2 border border-asphalt-200 bg-white p-6 sm:grid-cols-3 md:p-8">
                <Stat value="0 ₽" label="залог при получении автомобиля" />
                <Stat value="0 ₽" label="дополнительных комиссий в процессе аренды" />
                <Stat value="1" unit="день" label="аренды бесплатно при оформлении" />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <p className="t-body text-asphalt-700">{byId('deposit').a} {byId('extra-fees').a}</p>
                <p className="t-body text-asphalt-700">{byId('price-change').a} Вы заранее знаете ежедневный платёж и можете считать экономику смены до выхода на линию.</p>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <InlineLink to={c2.offer('no-deposit')}>Аренда без залога</InlineLink>
                <InlineLink to={c2.offer('fixed-rent')}>Фиксированная стоимость по договору</InlineLink>
              </div>
            </DocSection>

            {/* 03 Требования */}
            <DocSection id="requirements" n="03" title="Требования к водителю">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {requirements.map((r, i) => (
                  <Reveal key={r.title} delay={i * 40} className="flex flex-col gap-2 rounded-2 border border-asphalt-200 bg-white p-5">
                    <span className="t-label tabular text-asphalt-400">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="t-title-m">{r.title}</h3>
                    <p className="t-small text-asphalt-600">{r.text}</p>
                  </Reveal>
                ))}
                <div className="flex flex-col justify-between gap-3 rounded-2 bg-asphalt-950 p-5 text-asphalt-50">
                  <p className="t-small text-asphalt-300">Не уверены, подходите ли по требованиям? Менеджер проверит документы по телефону до приезда в парк.</p>
                  <a href={phoneHref(company.phone)} className="inline-flex items-center gap-2 t-btn text-signal-400 hover:text-signal-300 transition-colors duration-fast"><Phone className="size-4" />{company.phone}</a>
                </div>
              </div>
            </DocSection>

            {/* 04 Документы */}
            <DocSection id="documents" n="04" title="Документы для оформления">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.2fr_1fr]">
                <div className="flex flex-col gap-4 rounded-2 border border-asphalt-200 bg-white p-6">
                  <div className="t-label text-asphalt-500">Граждане РФ</div>
                  <CheckList items={documents.slice(0, 5)} />
                </div>
                <div className="flex flex-col gap-4">
                  <Callout tone="info" title="Иностранным гражданам">
                    {documents[5].replace('Для иностранных граждан: ', 'Дополнительно: ')}. Принимаются водительские удостоверения, выданные в России, Беларуси или Киргизии.
                  </Callout>
                  <p className="t-small text-asphalt-600">Оригиналы документов нужны в парке при подписании договора. Сканы заранее присылать не обязательно.</p>
                  <InlineLink to={c2.article('dokumenty-dlya-arendy')}>Подробный чек-лист документов</InlineLink>
                </div>
              </div>
            </DocSection>

            {/* 05 Оформление */}
            <DocSection id="process" n="05" title="Как проходит оформление" meta={<Tag tone="signal">решение за 10 минут</Tag>}>
              <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {steps.map((s) => (
                  <li key={s.n} className="relative flex flex-col gap-2 border-t-2 border-asphalt-950 pt-4">
                    <span className="absolute -top-[5px] left-0 size-2 bg-signal-500" aria-hidden />
                    <span className="t-label tabular text-signal-700">{s.n}</span>
                    <h3 className="t-title-m">{s.title}</h3>
                    <p className="t-small text-asphalt-600">{s.text}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-2 t-caption text-asphalt-500"><Timer className="size-3.5" />{s.time}</span>
                  </li>
                ))}
              </ol>
              <p className="t-body max-w-2xl text-asphalt-700">{byId('how-fast').a}</p>
            </DocSection>

            {/* 06 Обслуживание */}
            <DocSection id="service" n="06" title="Обслуживание автомобиля">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-3">
                  <p className="t-body text-asphalt-700">{byId('maintenance').a} Возраст машин — не более 3 лет, поэтому плановые работы редкие и предсказуемые.</p>
                  <p className="t-body text-asphalt-700">Сотрудники офиса помогают решать вопросы от мелких неисправностей до оформления ДТП.</p>
                </div>
                <ul className="flex flex-col divide-y divide-asphalt-200 rounded-2 border border-asphalt-200 bg-white">
                  {[
                    { icon: Wrench, title: 'Собственный сервис парка', text: 'ТО и ремонт — в сервисе Таксимании, не у сторонних подрядчиков' },
                    { icon: Clock, title: 'График ТО ведёт парк', text: 'Водителю не нужно следить за регламентом и записываться самому' },
                    { icon: RefreshCw, title: 'Подменный автомобиль на время ремонта', text: <>Порядок предоставления <NeedsConfirm /></> },
                  ].map((r) => (
                    <li key={r.title} className="flex items-start gap-4 p-4">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-1 bg-signal-50 text-signal-700"><r.icon className="size-4" strokeWidth={1.75} /></span>
                      <span className="flex flex-col gap-0.5"><span className="t-title-m">{r.title}</span><span className="t-small text-asphalt-600">{r.text}</span></span>
                    </li>
                  ))}
                </ul>
              </div>
            </DocSection>

            {/* 07 График */}
            <DocSection id="schedule" n="07" title="График работы">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2 border border-asphalt-200 bg-white p-5">
                  <div className="t-label text-asphalt-500 mb-2">Смены</div>
                  <p className="t-body text-asphalt-700">{byId('schedule').a}</p>
                </div>
                <div className="rounded-2 border border-asphalt-200 bg-white p-5">
                  <div className="t-label text-asphalt-500 mb-2">Автомобиль и класс</div>
                  <p className="t-body text-asphalt-700">Сменить автомобиль или класс можно в любое рабочее время: начать с Эконома и перейти в Комфорт+, когда будете готовы.</p>
                </div>
              </div>
            </DocSection>

            {/* 08 ДТП и поломки */}
            <DocSection id="incidents" n="08" title="ДТП и поломки">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[byId('breakdown'), byId('accident')].map((f) => (
                  <div key={f.id} className="flex flex-col gap-3 rounded-2 border border-asphalt-200 bg-white p-5">
                    <div className="flex flex-wrap items-center gap-2"><h3 className="t-title-m">{f.q}</h3>{f.needsConfirmation && <NeedsConfirm />}</div>
                    <p className="t-body text-asphalt-700">{f.a}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3 rounded-2 bg-asphalt-950 p-5 text-asphalt-50 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="t-label text-signal-400">Поддержка 24/7</div>
                  <p className="t-small text-asphalt-300">{company.hours.support}. Звоните при любой неисправности на линии.</p>
                </div>
                <a href={phoneHref(company.phoneSupport)} className="inline-flex items-center gap-2 t-title-l hover:text-signal-400 transition-colors duration-fast"><Phone className="size-5" />{company.phoneSupport}</a>
              </div>
            </DocSection>

            {/* 09 Штрафы */}
            <DocSection id="fines" n="09" title="Штрафы" meta={<NeedsConfirm />}>
              <Callout tone="amber" title={byId('fines').q}>{byId('fines').a}</Callout>
            </DocSection>

            {/* 10 Возврат */}
            <DocSection id="return" n="10" title="Возврат автомобиля">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_1fr]">
                <p className="t-body text-asphalt-700">{byId('return').a} Автомобиль сдаётся в парке по адресу {company.address}.</p>
                <a href={`mailto:${company.email}`} className="group flex items-center gap-4 rounded-2 border border-asphalt-200 bg-white p-4 transition-colors duration-fast hover:border-asphalt-950">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-1 bg-asphalt-950 text-asphalt-50"><Mail className="size-5" strokeWidth={1.75} /></span>
                  <span className="min-w-0"><span className="block t-caption text-asphalt-500">Письмо за 7 дней до сдачи</span><span className="block t-title-m truncate group-hover:text-signal-700 transition-colors duration-fast">{company.email}</span><span className="block t-caption !font-normal text-asphalt-500">ФИО и дата сдачи</span></span>
                </a>
              </div>
            </DocSection>

            {/* 11 Замена */}
            <DocSection id="swap" n="11" title="Замена автомобиля">
              <p className="t-body max-w-2xl text-asphalt-700">{byId('swap').a}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <InlineLink to={c2.offer('car-swap')}>Смена автомобиля или класса</InlineLink>
                <InlineLink to={c2.compare}>Сравнить автомобили</InlineLink>
              </div>
            </DocSection>

            {/* 12 FAQ */}
            <DocSection id="faq" n="12" title="FAQ по условиям">
              <Accordion items={termsFaq} />
              <InlineLink to={c2.faq}>Все вопросы и ответы</InlineLink>
            </DocSection>
          </div>
        </Container>
      </Section>

      {/* Перелинковка */}
      <Section tight className="border-t border-asphalt-200 bg-white">
        <Container className="flex flex-col gap-8">
          <SectionHeader size="m" label="Смотрите также" title="Тарифы, автомобили и статьи по теме" />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <LinkGroup title="Тарифы" links={[...tariffs.map((t) => ({ label: `Авто для тарифа ${t.name}`, to: c2.tariff(t.slug), hint: `от ${formatNumber(minPriceForTariff(t.id))} ₽` })), { label: 'Все тарифы', to: c2.tariffs }]} />
            <LinkGroup title="Инструменты" links={[{ label: 'Каталог автомобилей', to: c2.cars, hint: `${cars.length} моделей` }, { label: 'Калькулятор заработка', to: `${c2.home}#economics` }, { label: 'Сравнение автомобилей', to: c2.compare }, { label: 'Акции и специальные условия', to: c2.offers }]} />
            <LinkGroup title="Статьи" links={articles.map((a) => ({ label: a.title, to: c2.article(a.slug) }))} />
          </div>
        </Container>
      </Section>

      <DarkCta
        title={<>Получить условия под ваш <span className="plate-light">тариф</span></>}
        lead="Менеджер перезвонит, уточнит наличие машин в выбранном тарифе и назовёт точную стоимость аренды по договору."
        stacked
        form={{ withTariff: true, submitLabel: 'Получить условия', context: 'Условия аренды' }}
      >
        <div className="flex flex-wrap gap-2 pt-1">
          <Button variant="ghost-inverse" size="s" href={phoneHref(company.phone)} icon={<Phone className="size-4" />}>{company.phone}</Button>
          <Button variant="ghost-inverse" size="s" to={c2.cars}>Выбрать автомобиль</Button>
        </div>
      </DarkCta>
    </Page>
  )
}
