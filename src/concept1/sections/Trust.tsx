import { ArrowRight, BadgeCheck, Headset, Wrench } from 'lucide-react'
import { company, stats } from '../../data/company'
import { Button } from '../../ui/Button'
import { Container, Section, SectionHeader, Stat, Tag } from '../../ui/Primitives'
import { C1 } from '../Layout'
import { asset } from '../../lib/asset'

/** О компании / Trust — факты вместо истории */
export function Trust() {
  const trustStats = [stats[0], stats[1], stats[3], stats[2]]
  const facts = [
    { icon: Wrench, title: 'Собственный сервис', text: 'Плановое ТО и обслуживание ведёт парк, а не водитель.' },
    { icon: Headset, title: 'Поддержка 24/7', text: 'Без перерывов и выходных: от мелкой неисправности до оформления ДТП.' },
    { icon: BadgeCheck, title: company.partner, text: 'Подключение при оформлении, Яндекс Заправки, вывод средств круглосуточно.' },
  ]
  return (
    <Section id="about" inverse className="scroll-mt-20">
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col gap-8 lg:col-span-5">
          <SectionHeader
            inverse label="О компании"
            title={<>Факты вместо <span className="plate">истории</span></>}
            lead="Таксимания — таксопарк в Москве на Загородном шоссе. Официальный партнёр Яндекс Go."
          />
          <div className="grid grid-cols-2 gap-6 border-y border-[rgba(242,244,247,.14)] py-6">
            {trustStats.map((s) => <Stat key={s.label} value={s.value} unit={s.unit} label={s.label} inverse />)}
          </div>
          <ul className="flex flex-col gap-4">
            {facts.map((f) => (
              <li key={f.title} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-1 bg-asphalt-800 text-signal-400"><f.icon className="size-5" strokeWidth={1.75} /></span>
                <div>
                  <div className="t-title-m">{f.title}</div>
                  <p className="t-small text-asphalt-300">{f.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <Button variant="ghost-inverse" size="l" to={`${C1}/about`} iconRight={<ArrowRight className="size-4" />} className="self-start">Посмотреть о компании</Button>
        </div>
        <div className="grid grid-cols-3 gap-4 lg:col-span-7 lg:gap-6">
          <figure className="relative col-span-2 overflow-hidden rounded-2 bg-asphalt-800">
            <img src={asset('/img/scenes/parking-tiggo7.jpg')} alt="Автомобиль парка Таксимании на крытой парковке" loading="lazy" className="aspect-[4/3] h-full w-full object-cover" />
            <figcaption className="absolute left-3 top-3"><Tag tone="dark">Парк</Tag></figcaption>
          </figure>
          <figure className="relative overflow-hidden rounded-2 bg-asphalt-800">
            <img src={asset('/img/scenes/manager-ok.webp')} alt="Менеджер парка" loading="lazy" className="h-full w-full object-cover" />
            <figcaption className="absolute left-3 top-3"><Tag tone="dark">Выдача</Tag></figcaption>
          </figure>
        </div>
      </Container>
    </Section>
  )
}
