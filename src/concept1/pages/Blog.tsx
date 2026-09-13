import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Page } from '../../shared/Page'
import { Button } from '../../ui/Button'
import { ArticleCard } from '../../ui/Cards'
import { Breadcrumbs, Container, Section, SectionHeader } from '../../ui/Primitives'
import { Tabs } from '../../ui/Tabs'
import { articles, articlesByCategory, c1Categories, categoryLabels, type ArticleCategory } from '../../data/articles'
import { cars } from '../../data/cars'
import { formatPrice } from '../../lib/format'
import { C1 } from '../Layout'

type Cat = 'all' | ArticleCategory

export function C1Blog() {
  const [params, setParams] = useSearchParams()
  const initial = params.get('cat')
  const [cat, setCat] = useState<Cat>(initial && (c1Categories as string[]).includes(initial) ? (initial as Cat) : 'all')
  const change = (c: Cat) => { setCat(c); setParams(c === 'all' ? {} : { cat: c }, { replace: true }) }

  const list = cat === 'all' ? articles : articlesByCategory(cat)
  const [first, ...rest] = list
  const items = [
    { id: 'all' as Cat, label: 'Все', count: articles.length },
    ...c1Categories.map((c) => ({ id: c as Cat, label: categoryLabels[c], count: articlesByCategory(c).length })),
  ]
  const minPrice = Math.min(...cars.map((c) => c.priceFrom))

  return (
    <Page title="Блог — Таксимания">
      <section className="pb-12 pt-6 md:pb-16 md:pt-10">
        <Container className="flex flex-col gap-8 md:gap-12">
          <Breadcrumbs items={[{ label: 'Главная', to: C1 }, { label: 'Блог' }]} />
          <SectionHeader
            label="Блог"
            title={<>Выбор, цифры и <span className="plate">практика</span></>}
            lead="Как выбрать машину, посчитать смену и не переплатить — на данных парка, а не на общих словах."
          />
          <Tabs items={items} value={cat} onChange={change} size="l" ariaLabel="Разделы блога" />
          <div key={cat} className="flex flex-col gap-4 animate-fade-up md:gap-6">
            {first && <ArticleCard article={first} to={`${C1}/blog/${first.slug}`} variant="featured" />}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
                {rest.map((a) => <ArticleCard key={a.slug} article={a} to={`${C1}/blog/${a.slug}`} />)}
              </div>
            )}
          </div>
        </Container>
      </section>

      <Section inverse tight>
        <Container className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="t-display-m">Готовы выбрать машину?</h2>
            <p className="mt-2 t-body text-asphalt-300">Десять моделей под четыре тарифа, от {formatPrice(minPrice)}/день. Без залога, цена по договору.</p>
          </div>
          <Button size="l" to={`${C1}#cars`} className="shrink-0">Выбрать автомобиль</Button>
        </Container>
      </Section>
    </Page>
  )
}
