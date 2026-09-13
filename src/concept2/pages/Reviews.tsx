import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Page } from '../../shared/Page'
import { Button } from '../../ui/Button'
import { ReviewCard } from '../../ui/Cards'
import { Select } from '../../ui/Form'
import { Tabs } from '../../ui/Tabs'
import { Container, Reveal, Section, SectionHeader, Stars } from '../../ui/Primitives'
import { C2, c2 } from '../Layout'
import { overallRating, reviews, reviewTagLabels, type ReviewTag } from '../../data/reviews'
import { carBySlug } from '../../data/cars'
import { tariffName } from '../../data/tariffs'
import { company } from '../../data/company'
import { cn, pluralWith } from '../../lib/format'
import { ContentHead, DarkCta } from '../sections/ContentShared'

type Filter = 'all' | ReviewTag
const tagIds = Object.keys(reviewTagLabels) as ReviewTag[]

export function C2Reviews() {
  const [tag, setTag] = useState<Filter>('all')
  const [car, setCar] = useState('all')

  const tagCounts = useMemo(() => tagIds.map((t) => ({ id: t, label: reviewTagLabels[t], count: reviews.filter((r) => r.tags.includes(t)).length })), [])
  const maxCount = Math.max(...tagCounts.map((t) => t.count))
  const carRows = useMemo(() => {
    const map = new Map<string, number>()
    reviews.forEach((r) => { if (r.car) map.set(r.car, (map.get(r.car) ?? 0) + 1) })
    return Array.from(map.entries()).map(([slug, count]) => ({ car: carBySlug(slug)!, count })).filter((x) => x.car).sort((a, b) => b.count - a.count)
  }, [])

  const list = reviews.filter((r) => (tag === 'all' || r.tags.includes(tag)) && (car === 'all' || r.car === car))
  const goToList = (slug: string) => { setCar(slug); setTag('all'); document.getElementById('list')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }

  return (
    <Page title="Отзывы водителей о таксопарке Таксимания">
      <ContentHead
        crumbs={[{ label: 'Главная', to: C2 }, { label: 'Отзывы' }]}
        label="Отзывы"
        title="Отзывы водителей"
        lead={`${overallRating.count} отзывов водителей парка с текущего сайта таксимания.рф. Все — с оценкой 5, поэтому смотрите не на звёзды, а на темы: что именно отмечают и на каких машинах.`}
      />

      <Section tight>
        <Container className="flex flex-col gap-8 md:gap-10">
          {/* Сводка */}
          <div className="grid grid-cols-1 gap-8 rounded-2 border border-asphalt-200 bg-white p-6 md:p-8 lg:grid-cols-[auto_1fr] lg:gap-16">
            <div className="flex flex-col gap-2 lg:border-r lg:border-asphalt-200 lg:pr-16">
              <div className="flex items-baseline gap-2"><span className="t-number-xl">{String(overallRating.value).replace('.', ',')}</span><span className="t-display-m text-asphalt-400">/ {overallRating.of}</span></div>
              <Stars n={5} size={20} />
              <span className="t-small text-asphalt-600">{pluralWith(overallRating.count, 'отзыв', 'отзыва', 'отзывов')} · рейтинг с текущего сайта</span>
            </div>
            <div className="flex flex-col gap-3">
              <div className="t-label text-asphalt-500">Что отмечают водители</div>
              <ul className="flex flex-col gap-2">
                {tagCounts.map((t) => (
                  <li key={t.id}>
                    <button type="button" onClick={() => { setTag(t.id); setCar('all') }} className={cn('group grid w-full grid-cols-[150px_1fr_36px] items-center gap-3 text-left sm:grid-cols-[190px_1fr_36px]', tag === t.id ? 'text-asphalt-950' : 'text-asphalt-700')} aria-pressed={tag === t.id}>
                      <span className="t-small truncate group-hover:text-signal-700 transition-colors duration-fast">{t.label}</span>
                      <span className="h-2 w-full bg-asphalt-100"><span className={cn('block h-full transition-[width] duration-base ease-out-brand', tag === t.id ? 'bg-signal-500' : 'bg-asphalt-950')} style={{ width: `${(t.count / maxCount) * 100}%` }} /></span>
                      <span className="t-caption tabular text-right text-asphalt-500">{t.count}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Фильтры */}
          <div id="list" className="flex scroll-mt-20 flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <Tabs<Filter> ariaLabel="Темы отзывов" items={[{ id: 'all', label: 'Все', count: reviews.length }, ...tagCounts]} value={tag} onChange={setTag} />
            <Select label="Автомобиль" value={car} onChange={(e) => setCar(e.target.value)} className="md:w-72">
              <option value="all">Все автомобили</option>
              {carRows.map((r) => <option key={r.car.slug} value={r.car.slug}>{r.car.name} · {r.count}</option>)}
            </Select>
          </div>

          {/* Сетка */}
          {list.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {list.map((r, i) => <Reveal key={r.id} delay={Math.min(i, 5) * 40}><ReviewCard review={r} carTo={r.car ? c2.car(r.car) : undefined} className="h-full" /></Reveal>)}
            </div>
          ) : (
            <div className="rounded-2 border border-asphalt-200 bg-white p-8 text-center">
              <p className="t-body text-asphalt-600">По этим фильтрам отзывов нет.</p>
              <Button variant="ghost" size="s" className="mt-4" onClick={() => { setTag('all'); setCar('all') }}>Сбросить фильтры</Button>
            </div>
          )}
          <p className="t-caption !font-normal text-asphalt-500">Отзывы с текущего сайта таксимания.рф. Тексты сохранены; обрезанные на сайте фразы завершены на последнем полном предложении.</p>
        </Container>
      </Section>

      {/* По моделям */}
      <Section tight className="border-y border-asphalt-200 bg-white">
        <Container className="flex flex-col gap-8">
          <SectionHeader size="m" label="Автомобили" title="Отзывы по моделям" lead="Машины, которые водители называют в отзывах. Chery Tiggo 7 Pro — самая упоминаемая." action={<Button variant="ghost" to={c2.cars}>Все автомобили</Button>} />
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {carRows.map(({ car: c, count }) => (
              <li key={c.slug} className="flex items-center gap-4 rounded-2 border border-asphalt-200 bg-asphalt-50 p-3">
                <Link to={c2.car(c.slug)} className="group flex min-w-0 flex-1 items-center gap-4">
                  <img src={c.images.cover} alt="" loading="lazy" className="size-16 shrink-0 rounded-1 object-cover" />
                  <span className="min-w-0">
                    <span className="block t-caption text-asphalt-500">{tariffName(c.tariff)}</span>
                    <span className="block t-title-m truncate group-hover:text-signal-700 transition-colors duration-fast">{c.name}</span>
                    <span className="block t-small text-asphalt-600">{pluralWith(count, 'отзыв', 'отзыва', 'отзывов')}</span>
                  </span>
                  <ArrowRight className="ml-auto size-5 shrink-0 text-asphalt-400 transition-transform duration-fast group-hover:translate-x-0.5 group-hover:text-asphalt-950" />
                </Link>
                <Button variant="ghost" size="s" onClick={() => goToList(c.slug)} className="hidden sm:inline-flex">Показать</Button>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <DarkCta
        title={<>Проверьте условия сами: <span className="plate-light">первый день бесплатно</span></>}
        lead={`Менеджер перезвонит и подберёт машину под ваш тариф. Поддержка на линии круглосуточно: ${company.phoneSupport}.`}
        form={{ submitLabel: 'Оставить заявку', context: 'Отзывы' }}
      />
    </Page>
  )
}
