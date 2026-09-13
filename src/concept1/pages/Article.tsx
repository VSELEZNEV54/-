import { Link, useParams } from 'react-router-dom'
import { Phone } from 'lucide-react'
import { Page } from '../../shared/Page'
import { NotFound } from '../../shared/NotFound'
import { ArticleBody, type LinkResolver } from '../../shared/ArticleBody'
import { LeadForm } from '../../shared/LeadForm'
import { useLead } from '../../shared/LeadContext'
import { Button } from '../../ui/Button'
import { ArticleCard } from '../../ui/Cards'
import { Breadcrumbs, Container, Kicker, Price, Section, SectionHeader } from '../../ui/Primitives'
import { articleBySlug, articleWords, categoryLabels, relatedArticles } from '../../data/articles'
import { carBySlug, cars, type Car } from '../../data/cars'
import { company } from '../../data/company'
import { formatDate, phoneHref, readingTime } from '../../lib/format'
import { C1 } from '../Layout'
import { MiniCarCard } from '../sections/MiniCarCard'

export function C1Article() {
  const { slug = '' } = useParams()
  const a = articleBySlug(slug)
  const { openLead } = useLead()
  if (!a) return <NotFound base={C1} />

  const resolve: LinkResolver = (kind, s) => {
    switch (kind) {
      case 'article': return `${C1}/blog/${s}`
      case 'calc': return `${C1}#economics`
      case 'terms':
      case 'offers': return `${C1}#terms`
      case 'faq': return `${C1}#faq`
      default: return `${C1}#cars`
    }
  }
  const related = relatedArticles(a, 3)
  const relCars = (a.relatedCars ?? []).map(carBySlug).filter((c): c is Car => !!c).slice(0, 3)
  const minPrice = Math.min(...cars.map((c) => c.priceFrom))
  const lead = (car: Car) => openLead({ context: car.name, title: 'Узнать наличие', tariff: car.tariff })

  return (
    <Page title={`${a.title} — Таксимания`}>
      <article className="pb-12 pt-6 md:pb-16 md:pt-10">
        <Container>
          <div className="lg:grid lg:grid-cols-[minmax(0,720px)_300px] lg:justify-center lg:gap-16">
            <div className="mx-auto flex w-full max-w-[720px] flex-col gap-8 lg:mx-0">
              <Breadcrumbs items={[
                { label: 'Главная', to: C1 },
                { label: 'Блог', to: `${C1}/blog` },
                { label: categoryLabels[a.category], to: `${C1}/blog?cat=${a.category}` },
                { label: a.title },
              ]} />
              <header className="flex flex-col gap-5">
                <Kicker>{categoryLabels[a.category]}</Kicker>
                <h1 className="font-display text-[clamp(34px,24px_+_2.4vw,56px)] font-extrabold leading-[.98] tracking-[-.005em] text-asphalt-950">{a.title}</h1>
                <p className="t-lead text-asphalt-600">{a.lead}</p>
                <div className="flex items-center gap-2 t-caption text-asphalt-500">
                  <span>{formatDate(a.date)}</span><span>·</span><span>{readingTime(articleWords(a))} чтения</span>
                </div>
              </header>
              <div className="overflow-hidden rounded-2 bg-asphalt-100">
                <img src={a.image} alt="" className="aspect-[16/9] w-full object-cover" />
              </div>
              <ArticleBody blocks={a.blocks} resolve={resolve} />

              {relCars.length > 0 && (
                <section className="flex flex-col gap-4 border-t border-asphalt-200 pt-8">
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="t-display-m">Машины из статьи</h2>
                    <Link to={`${C1}#cars`} className="t-small text-signal-700 underline underline-offset-2 transition-colors duration-fast hover:text-signal-500">Все автомобили</Link>
                  </div>
                  <div className="flex flex-col gap-3">
                    {relCars.map((c) => <MiniCarCard key={c.slug} car={c} onLead={lead} />)}
                  </div>
                </section>
              )}
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-24 flex flex-col gap-4 rounded-2 bg-asphalt-950 p-6 text-asphalt-50 on-dark">
                <span className="t-label text-signal-400">Автомобили парка</span>
                <h2 className="t-display-s">Выбрать автомобиль</h2>
                <Price value={minPrice} size="m" inverse />
                <p className="t-small text-asphalt-300">Десять моделей под четыре тарифа, не старше 3 лет. Без залога, цена фиксируется в договоре.</p>
                <Button full to={`${C1}#cars`}>К автомобилям</Button>
                <a href={phoneHref(company.phone)} className="inline-flex items-center gap-2 t-small text-asphalt-300 transition-colors duration-fast hover:text-signal-400"><Phone className="size-4" />{company.phone}</a>
              </div>
            </aside>
          </div>

          <div className="mx-auto mt-10 max-w-[720px] lg:mt-12">
            <section className="rounded-2 bg-asphalt-900 p-6 text-asphalt-50 on-dark md:p-8">
              <div className="mb-5">
                <span className="t-label text-signal-400">Заявка</span>
                <h2 className="mt-2 t-display-m">Подберём машину под ваш тариф</h2>
                <p className="mt-2 t-body text-asphalt-300">Оставьте номер — менеджер перезвонит, назовёт наличие и цену по договору.</p>
              </div>
              <LeadForm compact inverse submitLabel="Подобрать автомобиль" />
            </section>
          </div>
        </Container>
      </article>

      <Section tight className="border-t border-asphalt-200">
        <Container className="flex flex-col gap-8">
          <SectionHeader size="m" label="Блог" title="Читайте также" action={<Button variant="link" to={`${C1}/blog`}>Все статьи</Button>} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {related.map((r) => <ArticleCard key={r.slug} article={r} to={`${C1}/blog/${r.slug}`} />)}
          </div>
        </Container>
      </Section>
    </Page>
  )
}
