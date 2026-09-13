import { useMemo, useState } from 'react'
import { featuredReviews, overallRating, reviewsByTag, reviewTagLabels, type ReviewTag } from '../../data/reviews'
import { ReviewCard } from '../../ui/Cards'
import { Container, Kicker, Section, Stars } from '../../ui/Primitives'
import { Tabs } from '../../ui/Tabs'

type Filter = 'featured' | ReviewTag

/** Отзывы — не карусель: слева общий рейтинг и фильтр по темам, справа сетка */
export function Reviews() {
  const [tag, setTag] = useState<Filter>('featured')
  const list = useMemo(() => (tag === 'featured' ? featuredReviews : reviewsByTag(tag)).slice(0, 6), [tag])
  const items = [
    { id: 'featured' as Filter, label: 'Избранные', count: featuredReviews.length },
    ...(Object.keys(reviewTagLabels) as ReviewTag[]).map((t) => ({ id: t as Filter, label: reviewTagLabels[t], count: reviewsByTag(t).length })),
  ]
  return (
    <Section id="reviews" className="scroll-mt-20">
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-12">
        <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <Kicker>Отзывы</Kicker>
          <h2 className="t-display-l">Что говорят <span className="plate">водители</span></h2>
          <div className="flex items-end gap-4">
            <span className="t-number-xl text-asphalt-950">{overallRating.value.toLocaleString('ru-RU')}</span>
            <div className="flex flex-col gap-1.5 pb-2">
              <Stars n={5} size={18} />
              <span className="t-small text-asphalt-600">из {overallRating.of} по отзывам водителей парка</span>
            </div>
          </div>
          <p className="t-small text-asphalt-600">{overallRating.count} отзывов с сайта парка. О чём пишут чаще всего:</p>
          <Tabs items={items} value={tag} onChange={setTag} ariaLabel="Темы отзывов" />
        </div>
        <div key={tag} className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 animate-fade-up">
          {list.map((r) => <ReviewCard key={r.id} review={r} />)}
        </div>
      </Container>
    </Section>
  )
}
