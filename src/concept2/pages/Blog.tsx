import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Page } from '../../shared/Page'
import { Button } from '../../ui/Button'
import { ArticleCard } from '../../ui/Cards'
import { Tabs } from '../../ui/Tabs'
import { Container, Reveal, Section, SectionHeader } from '../../ui/Primitives'
import { C2, c2 } from '../Layout'
import { articles, c2Categories, c2CategoryOf, categoryLabels, type ArticleCategory } from '../../data/articles'
import { cars, minPriceForTariff } from '../../data/cars'
import { tariffs } from '../../data/tariffs'
import { formatNumber } from '../../lib/format'
import { ContentHead, DarkCta, InlineLink, LinkGroup } from '../sections/ContentShared'

type Cat = 'all' | ArticleCategory
const sorted = [...articles].sort((a, b) => b.date.localeCompare(a.date))
const clusters = [
  { id: 'cars', label: 'Автомобили', text: 'Обзоры и выбор моделей парка', to: c2.cars, cta: 'Каталог автомобилей' },
  { id: 'comparison', label: 'Сравнения', text: 'Модель против модели, тариф против тарифа', to: c2.compare, cta: 'Сравнить автомобили' },
  { id: 'economics', label: 'Экономика', text: 'Выручка, аренда, окупаемость смены', to: c2.tariffs, cta: 'Тарифы и калькулятор' },
  { id: 'beginners', label: 'Новичкам', text: 'Документы, первая неделя, подготовка', to: c2.terms, cta: 'Условия аренды' },
] as const

export function C2Blog() {
  const [params, setParams] = useSearchParams()
  const fromUrl = params.get('category') as ArticleCategory | null
  const [cat, setCatState] = useState<Cat>(fromUrl && c2Categories.includes(fromUrl) ? fromUrl : 'all')
  const setCat = (c: Cat) => { setCatState(c); setParams(c === 'all' ? {} : { category: c }, { replace: true }) }

  const tabs = useMemo(() => [
    { id: 'all' as Cat, label: 'Все', count: articles.length },
    ...c2Categories.map((c) => ({ id: c as Cat, label: categoryLabels[c], count: articles.filter((a) => c2CategoryOf(a.category) === c).length })),
  ], [])
  const list = cat === 'all' ? sorted : sorted.filter((a) => c2CategoryOf(a.category) === cat)
  const [first, ...rest] = list
  const popular = [...cars].sort((a, b) => b.popularity - a.popularity).slice(0, 5)

  return (
    <Page title="Блог для водителей такси: выбор машины, экономика, документы — Таксимания">
      <ContentHead
        crumbs={[{ label: 'Главная', to: C2 }, { label: 'Блог' }]}
        label="Блог"
        title={<>Блог для водителей <span className="plate">такси</span></>}
        lead={`${articles.length} статей о выборе машины, экономике смены, документах и работе в Москве. Цифры — из данных парка: аренда, расход, тарифы. Каждая статья ведёт к машине, тарифу или калькулятору.`}
      >
        <Tabs<Cat> ariaLabel="Категории" items={tabs} value={cat} onChange={setCat} />
      </ContentHead>

      <Section tight>
        <Container className="flex flex-col gap-4 md:gap-6">
          {first && <Reveal><ArticleCard article={first} to={c2.article(first.slug)} variant="featured" categoryLabel={categoryLabels[c2CategoryOf(first.category)]} /></Reveal>}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 md:gap-6">
            {rest.map((a, i) => <Reveal key={a.slug} delay={Math.min(i, 5) * 40}><ArticleCard article={a} to={c2.article(a.slug)} categoryLabel={categoryLabels[c2CategoryOf(a.category)]} className="h-full" /></Reveal>)}
          </div>
          {list.length === 0 && <p className="t-body text-asphalt-600">В этой категории пока нет статей.</p>}
        </Container>
      </Section>

      <Section tight className="border-y border-asphalt-200 bg-white">
        <Container className="flex flex-col gap-8">
          <SectionHeader size="m" label="Кластеры контента" title="Статьи по темам, которые ищут водители" lead="Четыре кластера: каждый собирает статьи вокруг одного запроса и ведёт в раздел сайта, где можно действовать." />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4 md:gap-6">
            {clusters.map((cl) => {
              const items = sorted.filter((a) => a.cluster === cl.id)
              return (
                <div key={cl.id} className="flex flex-col">
                  <div className="flex items-baseline justify-between gap-3 border-b-2 border-asphalt-950 pb-3">
                    <h3 className="t-display-s">{cl.label}</h3>
                    <span className="t-caption tabular text-asphalt-500">{items.length}</span>
                  </div>
                  <p className="pt-3 t-caption !font-normal text-asphalt-500">{cl.text}</p>
                  <div className="flex flex-col">
                    {items.map((a) => <ArticleCard key={a.slug} article={a} to={c2.article(a.slug)} variant="row" categoryLabel={categoryLabels[c2CategoryOf(a.category)]} />)}
                  </div>
                  <div className="pt-4"><InlineLink to={cl.to}>{cl.cta}</InlineLink></div>
                </div>
              )
            })}
          </div>
        </Container>
      </Section>

      <Section tight>
        <Container className="flex flex-col gap-8">
          <SectionHeader size="m" label="Перелинковка" title="Куда ведут статьи" action={<Button variant="ghost" to={c2.cars}>Каталог автомобилей</Button>} />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <LinkGroup title="Популярные модели" links={popular.map((c) => ({ label: c.name, to: c2.car(c.slug), hint: `от ${formatNumber(c.priceFrom)} ₽` }))} />
            <LinkGroup title="Тарифы" links={tariffs.map((t) => ({ label: `Авто для тарифа ${t.name}`, to: c2.tariff(t.slug), hint: `от ${formatNumber(minPriceForTariff(t.id))} ₽` }))} />
            <LinkGroup title="Разделы" links={[{ label: 'Условия аренды', to: c2.terms }, { label: 'Калькулятор заработка', to: `${c2.home}#economics` }, { label: 'Акции и специальные условия', to: c2.offers }, { label: 'Вопросы и ответы', to: c2.faq }]} />
          </div>
        </Container>
      </Section>

      <DarkCta
        title={<>Прочитали — <span className="plate-light">подберите машину</span></>}
        lead="Менеджер перезвонит, уточнит тариф и наличие. Первый день аренды бесплатно, залог не нужен."
        form={{ submitLabel: 'Подобрать автомобиль', context: 'Блог' }}
      />
    </Page>
  )
}
