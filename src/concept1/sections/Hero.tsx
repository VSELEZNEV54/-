import { ArrowDown } from 'lucide-react'
import { company, heroStats } from '../../data/company'
import { Button } from '../../ui/Button'
import { Container, Stat } from '../../ui/Primitives'
import { asset } from '../../lib/asset'

/** Первый экран: что, где, почему, что дальше — за 5 секунд. Главный объект — автомобиль. */
export function Hero() {
  return (
    <section id="top" className="scroll-mt-20 overflow-hidden">
      <Container className="pb-12 pt-6 md:pb-16 md:pt-10 lg:pt-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:grid-rows-[1fr_auto] lg:gap-x-10 lg:gap-y-10">
          {/* Текст */}
          <div className="flex flex-col gap-6 lg:col-span-5 lg:row-start-1 lg:gap-8">
            <span className="inline-flex h-7 items-center gap-2 self-start rounded-0 border border-asphalt-200 bg-white px-2.5 t-label !text-[12px] text-asphalt-700">
              <span className="size-2 rounded-full bg-partner-yandex" aria-hidden />
              {company.partner}
            </span>
            <h1 className="t-display-xl text-asphalt-950">
              Выберите машину — и выходите <span className="plate">на линию</span>
            </h1>
            <p className="t-lead max-w-md text-asphalt-600">
              Москва · 4 тарифа · цена фиксируется в договоре · без залога · решение о выдаче за 10 минут
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="l" href="#cars" iconRight={<ArrowDown className="size-4" />}>Выбрать автомобиль</Button>
              <Button size="l" variant="ghost" href="#economics">Рассчитать заработок</Button>
            </div>
          </div>

          {/* Фото с выходом за сетку вправо */}
          <div className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:-mr-[max(var(--margin),calc((100vw_-_var(--container))/2))]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2 bg-asphalt-900 sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[580px] lg:rounded-r-none">
              <img
                src={asset('/img/scenes/hero-duo.jpg')} alt="Автомобили парка Таксимания, готовые к выдаче" fetchPriority="high"
                className="absolute inset-0 h-full w-full object-cover object-[70%_50%]"
              />
            </div>
          </div>

          {/* Proof-points */}
          <div className="grid grid-cols-3 gap-4 border-t border-asphalt-200 pt-6 lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:self-end lg:pt-8">
            {heroStats.map((s) => <Stat key={s.label} value={s.value} unit={s.unit} label={s.label} />)}
          </div>
        </div>
      </Container>
    </section>
  )
}
