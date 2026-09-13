import { Headset, LayoutGrid, ShieldCheck, Timer, Wrench, type LucideIcon } from 'lucide-react'
import { values } from '../../data/company'
import { cn } from '../../lib/format'
import { FeatureCard } from '../../ui/Cards'
import { Container, Reveal, Section, SectionHeader } from '../../ui/Primitives'

const icons: Record<string, LucideIcon> = { transparent: ShieldCheck, fast: Timer, ready: Wrench, support: Headset, choice: LayoutGrid }
const images: Record<string, string> = {
  transparent: '/img/scenes/parking-tiggo7.jpg',
  ready: '/img/scenes/street-tiggo7.webp',
  support: '/img/scenes/manager-ok.webp',
}

/** «Почему Таксимания» — editorial-сетка: одна большая карточка на 2 колонки, две с фото, две текстовые */
export function Why() {
  return (
    <Section id="why" className="scroll-mt-20">
      <Container className="flex flex-col gap-8 md:gap-12">
        <SectionHeader
          label="Почему Таксимания"
          title={<>Пять причин, которые можно <span className="plate">проверить</span></>}
          lead="Не обещания, а условия с сайта парка и из отзывов водителей. Каждую можно уточнить у менеджера до подписания договора."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {values.map((v, i) => {
            const Icon = icons[v.id] ?? ShieldCheck
            return (
              <Reveal key={v.id} delay={(i % 3) * 60} className={cn(i === 0 && 'md:col-span-2')}>
                <FeatureCard
                  label={v.label} title={v.title} text={v.text} fact={v.fact}
                  image={images[v.id]} icon={<Icon className="size-5" strokeWidth={1.75} />}
                  size={i === 0 ? 'l' : 'm'} className="h-full"
                />
              </Reveal>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
