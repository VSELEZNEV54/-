import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Calculator, FileText, Scale } from 'lucide-react'
import { Page } from '../../shared/Page'
import { NotFound } from '../../shared/NotFound'
import { useLead } from '../../shared/LeadContext'
import { ArticleBody, type LinkResolver } from '../../shared/ArticleBody'
import { LeadForm } from '../../shared/LeadForm'
import { Button } from '../../ui/Button'
import { ArticleCard, CarCard } from '../../ui/Cards'
import { Breadcrumbs, Container, Kicker, Section, SectionHeader } from '../../ui/Primitives'
import { C2, c2 } from '../Layout'
import { articleBySlug, articleWords, c2CategoryOf, categoryLabels, relatedArticles, type Article } from '../../data/articles'
import { carBySlug, minPriceForTariff } from '../../data/cars'
import { tariffById, type TariffId } from '../../data/tariffs'
import { cn, formatDate, formatNumber, readingTime } from '../../lib/format'
import { asset } from '../../lib/asset'

const resolve: LinkResolver = (kind, slug) => {
  switch (kind) {
    case 'car': return c2.car(slug)
    case 'tariff': return c2.tariff(slug)
    case 'article': return c2.article(slug)
    case 'calc': return `${c2.home}#economics`
    case 'terms': return c2.terms
    case 'cars': return c2.cars
    case 'offers': return slug ? c2.offer(slug) : c2.offers
    case 'faq': return c2.faq
    default: return c2.blog
  }
}

const stripLinks = (t: string) => t.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')

function tocOf(a: Article) {
  const out: string[] = []
  a.blocks.forEach((b) => { if (b.type === 'h2') out.push(stripLinks(b.text)); else if (b.type === 'faq') out.push('Вопросы по теме') })
  return out
}

export function C2Article() {
  const { slug = '' } = useParams()
  const { openLead } = useLead()
  const bodyRef = useRef<HTMLDivElement>(null)
  const article = articleBySlug(slug)

  useEffect(() => {
    bodyRef.current?.querySelectorAll('h2').forEach((h, i) => { h.id = `s-${i}`; h.classList.add('scroll-mt-24') })
  }, [slug])

  if (!article) return <NotFound base={C2} />

  const cat = c2CategoryOf(article.category)
  const toc = tocOf(article)
  const relCars = (article.relatedCars ?? []).map(carBySlug).filter((c): c is NonNullable<typeof c> => !!c)
  const relTariffs = (article.relatedTariffs ?? []).map((t) => tariffById(t as TariffId))
  const related = relatedArticles(article, 3)
  const leadCtx = relCars[0] ? relCars[0].name : categoryLabels[cat]

  const Aside = ({ withToc, className }: { withToc?: boolean; className?: string }) => (
    <aside className={cn('flex flex-col gap-8', className)}>
      {withToc && toc.length > 0 && (
        <nav aria-label="Содержание" className="flex flex-col gap-2">
          <div className="t-label text-asphalt-500">Содержание</div>
          <ol className="flex flex-col border-l border-asphalt-200">
            {toc.map((t, i) => <li key={i}><a href={`#s-${i}`} className="-ml-px block border-l-2 border-transparent py-1 pl-4 t-small text-asphalt-600 transition-colors duration-fast hover:border-signal-500 hover:text-asphalt-950">{t}</a></li>)}
          </ol>
        </nav>
      )}
      <div className="flex flex-col gap-3">
        <div className="t-label text-asphalt-500">Связанные страницы</div>
        {relCars.length > 0 && <div className="flex flex-col gap-2">{relCars.slice(0, 3).map((c) => <CarCard key={c.slug} car={c} variant="compact" to={c2.car(c.slug)} />)}</div>}
        {relTariffs.length > 0 && (
          <ul className="flex flex-col divide-y divide-asphalt-200 rounded-2 border border-asphalt-200 bg-white">
            {relTariffs.map((t) => (
              <li key={t.id}><Link to={c2.tariff(t.slug)} className="group flex items-center justify-between gap-3 px-4 py-2.5 transition-colors duration-fast hover:bg-asphalt-0"><span className="t-small font-semibold">Тариф {t.name}</span><span className="flex items-center gap-2 t-caption !font-normal tabular text-asphalt-500">от {formatNumber(minPriceForTariff(t.id))} ₽<ArrowRight className="size-4 text-asphalt-400 transition-transform duration-fast group-hover:translate-x-0.5" /></span></Link></li>
            ))}
          </ul>
        )}
        <ul className="flex flex-col divide-y divide-asphalt-200 border-y border-asphalt-200">
          {[
            { icon: Calculator, label: 'Калькулятор заработка', to: `${c2.home}#economics` },
            { icon: FileText, label: 'Условия аренды', to: c2.terms },
            { icon: Scale, label: 'Сравнить автомобили', to: c2.compare },
          ].map((l) => (
            <li key={l.to}><Link to={l.to} className="group flex items-center gap-3 py-2.5 t-small text-asphalt-800 transition-colors duration-fast hover:text-signal-700"><l.icon className="size-4 text-asphalt-400" strokeWidth={1.75} />{l.label}<ArrowRight className="ml-auto size-4 text-asphalt-400 transition-transform duration-fast group-hover:translate-x-0.5" /></Link></li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-3 rounded-2 bg-asphalt-950 p-5 text-asphalt-50 on-dark">
        <div className="t-label text-signal-400">Узнать наличие</div>
        <p className="t-small text-asphalt-300">{relCars.length > 0 ? `${relCars.map((c) => c.name).slice(0, 2).join(' и ')} — уточним наличие на день выдачи.` : 'Менеджер перезвонит, уточнит тариф и наличие машины.'} Первый день аренды бесплатно.</p>
        <Button size="s" onClick={() => openLead({ title: 'Узнать наличие', context: leadCtx })}>Узнать наличие</Button>
      </div>
    </aside>
  )

  return (
    <Page title={`${article.title} — Таксимания`}>
      <Section tight className="pb-0">
        <Container className="flex flex-col gap-6">
          <Breadcrumbs items={[{ label: 'Главная', to: C2 }, { label: 'Блог', to: c2.blog }, { label: categoryLabels[cat], to: `${c2.blog}?category=${cat}` }, { label: article.title }]} />
          <div className="flex max-w-4xl flex-col gap-4">
            <Kicker>{categoryLabels[cat]}</Kicker>
            <h1 className="t-display-l">{article.title}</h1>
            <p className="t-lead max-w-3xl text-asphalt-600">{article.lead}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 t-caption text-asphalt-500"><span>{formatDate(article.date)}</span><span aria-hidden>·</span><span>{readingTime(articleWords(article))} чтения</span><span aria-hidden>·</span><span>{articleWords(article)} слов</span></div>
          </div>
        </Container>
      </Section>

      <Section tight>
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,720px)_minmax(280px,360px)] lg:justify-between lg:gap-16">
          <div className="flex min-w-0 flex-col gap-8">
            <div className="overflow-hidden rounded-2 bg-asphalt-100"><img src={asset(article.image)} alt="" className="aspect-[16/9] w-full object-cover" /></div>
            {toc.length > 0 && (
              <nav aria-label="Содержание" className="rounded-2 border border-asphalt-200 bg-white p-4 lg:hidden">
                <div className="t-label text-asphalt-500 mb-2">Содержание</div>
                <ol className="flex flex-col gap-1">{toc.map((t, i) => <li key={i}><a href={`#s-${i}`} className="t-small text-asphalt-700 hover:text-signal-700 transition-colors duration-fast">{i + 1}. {t}</a></li>)}</ol>
              </nav>
            )}
            <div ref={bodyRef}><ArticleBody blocks={article.blocks} resolve={resolve} /></div>
            <div className="flex flex-col gap-5 rounded-2 bg-asphalt-950 p-6 text-asphalt-50 on-dark md:p-8">
              <div className="flex flex-col gap-2">
                <Kicker inverse>Заявка</Kicker>
                <h2 className="t-display-m">Подобрать машину под ваш тариф</h2>
                <p className="t-small text-asphalt-300">Менеджер перезвонит, уточнит наличие и назовёт стоимость аренды по договору. Залог не нужен.</p>
              </div>
              <LeadForm inverse compact submitLabel="Подобрать автомобиль" context={leadCtx} />
            </div>
            <Aside className="lg:hidden" />
          </div>
          <Aside withToc className="hidden lg:flex lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:self-start lg:overflow-y-auto no-scrollbar" />
        </Container>
      </Section>

      {relCars.length > 0 && (
        <Section tight className="border-t border-asphalt-200 bg-white">
          <Container className="flex flex-col gap-8">
            <SectionHeader size="m" label="Автопарк" title="Автомобили из статьи" action={<Button variant="ghost" to={c2.cars}>Все автомобили</Button>} />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {relCars.slice(0, 3).map((c) => <CarCard key={c.slug} car={c} variant="catalog" to={c2.car(c.slug)} onLead={() => openLead({ title: 'Узнать наличие', context: c.name })} className="h-full" />)}
            </div>
          </Container>
        </Section>
      )}

      <Section tight className={cn(relCars.length === 0 && 'border-t border-asphalt-200 bg-white')}>
        <Container className="flex flex-col gap-8">
          <SectionHeader size="m" label="Блог" title="Читайте также" action={<Button variant="ghost" to={c2.blog}>Все статьи</Button>} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {related.map((a) => <ArticleCard key={a.slug} article={a} to={c2.article(a.slug)} categoryLabel={categoryLabels[c2CategoryOf(a.category)]} className="h-full" />)}
          </div>
        </Container>
      </Section>
    </Page>
  )
}
