import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Phone } from 'lucide-react'
import { Page } from '../../shared/Page'
import { NotFound } from '../../shared/NotFound'
import { useLead } from '../../shared/LeadContext'
import { Accordion } from '../../ui/Accordion'
import { Button } from '../../ui/Button'
import { CarCard, OfferCard } from '../../ui/Cards'
import { Breadcrumbs, Callout, Container, NeedsConfirm, Reveal, Section, SectionHeader, Table, Tag } from '../../ui/Primitives'
import { C2, c2 } from '../Layout'
import { offerBySlug, offers } from '../../data/offers'
import { cars, carsByTariff } from '../../data/cars'
import { tariffs, tariffName } from '../../data/tariffs'
import { company, perks } from '../../data/company'
import { faq } from '../../data/faq'
import { formatNumber, phoneHref } from '../../lib/format'
import { CheckList, DarkCta } from '../sections/ContentShared'
import { asset } from '../../lib/asset'

const faqIds: Record<string, string[]> = {
  'trial-day': ['trial', 'how-fast', 'deposit', 'docs'],
  'no-deposit': ['deposit', 'extra-fees', 'price-change', 'min-term'],
  'fixed-rent': ['price-change', 'extra-fees', 'deposit', 'commission'],
  'car-swap': ['swap', 'age', 'photo-match', 'included'],
  'yandex-partner': ['aggregator', 'payout', 'fuel', 'self-employed'],
}

const popular = [...cars].sort((a, b) => b.popularity - a.popularity).slice(0, 3)
const onePerTariff = tariffs.map((t) => [...carsByTariff(t.id)].sort((a, b) => b.popularity - a.popularity)[0]).filter(Boolean)

export function C2OfferPage() {
  const { slug = '' } = useParams()
  const { openLead } = useLead()
  const offer = offerBySlug(slug)
  if (!offer) return <NotFound base={C2} />

  const lead = () => openLead({ title: offer.title, text: offer.short, context: offer.title, submitLabel: offer.cta })
  const items = (faqIds[offer.slug] ?? []).map((id) => faq.find((f) => f.id === id)).filter((f): f is NonNullable<typeof f> => !!f)
  const others = offers.filter((o) => o.slug !== offer.slug)

  const carsBlock = (() => {
    if (offer.slug === 'yandex-partner') {
      return {
        title: 'Что даёт партнёрство водителю',
        lead: 'Подключение к агрегатору проходит в парке при оформлении. Ниже — что уже работает для водителей Таксимании.',
        body: (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {perks.map((p, i) => (
              <Reveal key={p.title} delay={i * 40} className="flex h-full flex-col gap-1.5 rounded-2 border border-asphalt-200 bg-white p-5">
                <span className="t-label tabular text-asphalt-400">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="t-title-m">{p.title}</h3>
                <p className="t-small text-asphalt-600">{p.text}</p>
              </Reveal>
            ))}
          </div>
        ),
      }
    }
    if (offer.slug === 'fixed-rent') {
      return {
        title: 'Стоимость, которая фиксируется в договоре',
        lead: 'Минимальные ставки по моделям. Точная сумма зависит от комплектации и указывается в договоре до подписания.',
        body: (
          <Table
            head={['Модель', 'Тариф', 'Аренда от']}
            highlightCol={2}
            rows={[...cars].sort((a, b) => a.priceFrom - b.priceFrom).map((c) => [
              <Link key={c.slug} to={c2.car(c.slug)} className="transition-colors duration-fast hover:text-signal-700">{c.name}</Link>,
              tariffName(c.tariff),
              <span key={`${c.slug}-p`} className="tabular font-semibold">{formatNumber(c.priceFrom)} ₽/день</span>,
            ])}
            caption="Цены с текущего сайта парка."
          />
        ),
      }
    }
    const list = offer.slug === 'car-swap' ? onePerTariff : popular
    return {
      title: offer.slug === 'car-swap' ? 'По одной машине из каждого тарифа' : 'Подходящие автомобили',
      lead: offer.slug === 'car-swap'
        ? 'Начать можно с любой — и перейти в соседний класс в рабочее время без ожидания.'
        : 'Три самые востребованные модели парка. Предложение действует на любой автомобиль.',
      body: (
        <div className={offer.slug === 'car-swap' ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4' : 'grid grid-cols-1 gap-4 md:grid-cols-3'}>
          {list.map((c, i) => <Reveal key={c.slug} delay={i * 50}><CarCard car={c} variant="catalog" to={c2.car(c.slug)} onLead={() => openLead({ title: 'Узнать наличие', context: `${c.name} · ${offer.title}` })} className="h-full" /></Reveal>)}
        </div>
      ),
    }
  })()

  return (
    <Page title={`${offer.title} — Таксимания`}>
      <Section tight className="pb-0">
        <Container className="flex flex-col gap-6">
          <Breadcrumbs items={[{ label: 'Главная', to: C2 }, { label: 'Акции', to: c2.offers }, { label: offer.title }]} />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-12">
            <div className="flex flex-col items-start gap-4">
              <Tag tone={offer.accent ? 'signal' : 'dark'}>{offer.label}</Tag>
              <h1 className="t-display-l">{offer.title}</h1>
              <p className="t-lead max-w-xl text-asphalt-600">{offer.short}</p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button size="l" onClick={lead}>{offer.cta}</Button>
                <Button size="l" variant="ghost" href={phoneHref(company.phone)} icon={<Phone className="size-4" />}>{company.phone}</Button>
              </div>
            </div>
            <div className="overflow-hidden rounded-2 bg-asphalt-100"><img src={asset(offer.image)} alt="" className="aspect-[16/9] w-full object-cover" /></div>
          </div>
        </Container>
      </Section>

      <Section tight>
        <Container className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
          <div className="flex flex-col gap-6">
            <SectionHeader size="m" title="Как это работает" />
            <p className="t-body text-asphalt-700">{offer.description}</p>
            <Callout tone="info" title="Чем подтверждено">{offer.source}. Формулировки на этой странице не выходят за пределы того, что парк уже публикует.</Callout>
          </div>
          <div className="flex flex-col gap-5 rounded-2 border border-asphalt-200 bg-white p-6 lg:self-start">
            <h2 className="t-display-m">Условия</h2>
            <CheckList items={offer.conditions} />
            <Link to={c2.terms} className="group inline-flex items-center gap-1.5 t-small font-semibold text-signal-700 transition-colors duration-fast hover:text-signal-500">Все условия аренды<ArrowRight className="size-4 transition-transform duration-fast group-hover:translate-x-0.5" /></Link>
          </div>
        </Container>
      </Section>

      <Section tight className="border-y border-asphalt-200 bg-white">
        <Container className="flex flex-col gap-8">
          <SectionHeader size="m" label="Автопарк" title={carsBlock.title} lead={carsBlock.lead} action={<Button variant="ghost" to={c2.cars}>Все автомобили</Button>} />
          {carsBlock.body}
        </Container>
      </Section>

      {items.length > 0 && (
        <Section tight>
          <Container className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr] lg:gap-16">
            <SectionHeader size="m" label="FAQ" title="Вопросы по предложению" lead={<Link to={c2.faq} className="underline underline-offset-4 decoration-1 hover:text-signal-700 transition-colors duration-fast">Все вопросы и ответы</Link>} />
            <Accordion items={items.map((f) => ({ id: f.id, title: f.q, content: f.a, meta: f.needsConfirmation ? <NeedsConfirm /> : undefined }))} defaultOpen={items[0].id} />
          </Container>
        </Section>
      )}

      <Section tight className="border-t border-asphalt-200 bg-white">
        <Container className="flex flex-col gap-8">
          <SectionHeader size="m" label="Акции" title="Другие предложения" action={<Button variant="ghost" to={c2.offers}>Все акции</Button>} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {others.map((o, i) => <Reveal key={o.slug} delay={i * 40}><OfferCard offer={o} to={c2.offer(o.slug)} className="h-full" /></Reveal>)}
          </div>
        </Container>
      </Section>

      <DarkCta
        title={<><span className="plate-light">{offer.label}</span> — оставьте заявку</>}
        lead={`${offer.short} Менеджер перезвонит и подтвердит условия под ваш тариф.`}
        form={{ submitLabel: offer.cta, context: offer.title }}
      />
    </Page>
  )
}
