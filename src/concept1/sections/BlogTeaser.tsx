import { ArrowRight } from 'lucide-react'
import { articles, categoryLabels } from '../../data/articles'
import { Button } from '../../ui/Button'
import { ArticleCard } from '../../ui/Cards'
import { Container, Reveal, Section, SectionHeader } from '../../ui/Primitives'
import { C1 } from '../Layout'

/** Блог на главной: одна большая статья и три свежих — ведут в раздел блога */
export function BlogTeaser() {
  const latest = [...articles].sort((a, b) => b.date.localeCompare(a.date))
  const [featured, ...rest] = latest
  const list = rest.slice(0, 3)
  return (
    <Section id="blog" className="scroll-mt-20">
      <Container className="flex flex-col gap-8 md:gap-12">
        <SectionHeader
          label="Блог"
          title={<>Статьи для водителей: выбор машины, <span className="plate">цифры</span> и практика</>}
          lead="Как выбрать машину под тариф, посчитать смену и не переплатить. Тексты опираются на цены и условия парка, а не на общие слова."
          action={<Button variant="ghost" to={`${C1}/blog`} iconRight={<ArrowRight className="size-4" />}>Все статьи</Button>}
        />
        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="h-full">
            <ArticleCard article={featured} to={`${C1}/blog/${featured.slug}`} variant="featured" categoryLabel={categoryLabels[featured.category]} className="h-full lg:flex-col" />
          </Reveal>
          <div className="flex flex-col gap-4 md:gap-6">
            {list.map((a, i) => (
              <Reveal key={a.slug} delay={(i + 1) * 60} className="flex-1">
                <ArticleCard article={a} to={`${C1}/blog/${a.slug}`} variant="row" categoryLabel={categoryLabels[a.category]} className="h-full rounded-2 border border-asphalt-200 bg-white px-4 !py-4 border-b-asphalt-200" />
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
