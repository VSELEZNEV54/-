import { SquareX } from 'lucide-react'
import { Page } from '../../shared/Page'
import { OfferCard } from '../../ui/Cards'
import { Container, NeedsConfirm, Reveal, Section, SectionHeader, Tag } from '../../ui/Primitives'
import { C2, c2 } from '../Layout'
import { offers } from '../../data/offers'
import { faq } from '../../data/faq'
import { ContentHead, DarkCta, InlineLink } from '../sections/ContentShared'

const byId = (id: string) => faq.find((f) => f.id === id)!

const notHave = [
  { title: 'Скрытых платежей', text: byId('extra-fees').a, source: 'FAQ текущего сайта' },
  { title: 'Залога', text: byId('deposit').a, source: 'Блок «Почему выбирают нас»' },
  { title: 'Повышения цены по ходу аренды', text: byId('price-change').a, source: 'FAQ текущего сайта' },
]

const pending = [
  { title: 'Приведи друга', text: 'Бонус за водителя, который оформился по вашей рекомендации. В отзывах водители пишут, что приводят братьев и друзей — механика поощрения обсуждается.' },
  { title: 'Специальные условия на отдельные модели', text: 'Сниженная ставка на конкретные автомобили, которых в парке больше всего. Список моделей и размер скидки согласуются.' },
  { title: 'Условия для новых водителей', text: 'Пакет для тех, кто выходит на линию впервые: помощь с КИС «АРТ», самозанятостью и первой неделей. Состав пакета согласуется.' },
]

export function C2Offers() {
  const [first, ...rest] = offers
  return (
    <Page title="Акции и специальные условия аренды авто под такси — Таксимания">
      <ContentHead
        crumbs={[{ label: 'Главная', to: C2 }, { label: 'Акции' }]}
        label="Акции"
        title="Акции и специальные условия"
        lead="Только подтверждённые предложения парка. Каждое — с условиями и источником: страница текущего сайта или отзывы водителей. Ничего, что нельзя проверить."
        aside={<div className="flex flex-wrap gap-2 lg:justify-end"><Tag tone="signal">{offers.length} действующих</Tag><Tag>{pending.length} на согласовании</Tag></div>}
      />

      <Section tight>
        <Container className="flex flex-col gap-4 md:gap-6">
          <Reveal><OfferCard offer={first} to={c2.offer(first.slug)} variant="wide" /></Reveal>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {rest.map((o, i) => <Reveal key={o.slug} delay={i * 50}><OfferCard offer={o} to={c2.offer(o.slug)} className="h-full" /></Reveal>)}
          </div>
        </Container>
      </Section>

      <Section tight className="border-y border-asphalt-200 bg-white">
        <Container className="flex flex-col gap-8">
          <SectionHeader size="m" label="Честно" title="Чего у нас нет" lead="Три пункта, которые водители обычно проверяют первыми. У Таксимании их нет — и это подтверждено текущим сайтом." />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {notHave.map((n, i) => (
              <Reveal key={n.title} delay={i * 50} className="flex h-full flex-col gap-3 rounded-2 border border-asphalt-200 bg-asphalt-50 p-5 md:p-6">
                <span className="flex size-10 items-center justify-center rounded-1 bg-asphalt-950 text-asphalt-50"><SquareX className="size-5" strokeWidth={1.75} /></span>
                <h3 className="t-title-l">{n.title}</h3>
                <p className="t-small text-asphalt-600">{n.text}</p>
                <span className="mt-auto pt-2 t-caption !font-normal text-asphalt-500">Источник: {n.source}</span>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tight>
        <Container className="flex flex-col gap-8">
          <SectionHeader
            size="m" label="В работе" title="Предложения на согласовании"
            lead="Механики, которые обсуждаются с парком. Цифры и условия появятся после подтверждения — до этого страница не обещает ничего, чего нет."
            action={<NeedsConfirm />}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {pending.map((p) => (
              <div key={p.title} className="flex flex-col gap-3 rounded-2 border border-dashed border-asphalt-300 bg-asphalt-100/60 p-5 md:p-6">
                <div className="flex items-center justify-between gap-3"><Tag>На согласовании</Tag><NeedsConfirm /></div>
                <h3 className="t-title-l text-asphalt-700">{p.title}</h3>
                <p className="t-small text-asphalt-500">{p.text}</p>
                <div className="mt-auto flex flex-col gap-1.5 pt-2" aria-hidden>
                  <span className="h-3 w-2/3 rounded-0 bg-asphalt-200" /><span className="h-3 w-1/2 rounded-0 bg-asphalt-200" />
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <InlineLink to={c2.terms}>Все условия аренды</InlineLink>
            <InlineLink to={c2.faq}>Вопросы и ответы</InlineLink>
          </div>
        </Container>
      </Section>

      <DarkCta
        title={<>Узнать, какие условия <span className="plate-light">действуют сегодня</span></>}
        lead="Менеджер перезвонит, подтвердит пробный день и аренду без залога и подберёт машину под ваш тариф."
        form={{ submitLabel: 'Получить условия', context: 'Акции и специальные условия' }}
      />
    </Page>
  )
}
