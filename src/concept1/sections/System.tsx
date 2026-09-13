import { Fragment } from 'react'
import { systemParts } from '../../data/company'
import { Container, Reveal, RouteLine, Section, SectionHeader } from '../../ui/Primitives'

function Op({ children }: { children: string }) {
  return <span aria-hidden className="flex items-center justify-center t-display-m text-asphalt-400 lg:w-6 lg:shrink-0">{children}</span>
}

/** «Что вы получаете» — аренда как система: 5 плиток + «=» + тёмный итог */
export function System() {
  return (
    <Section id="system" className="scroll-mt-20 bg-white">
      <Container className="flex flex-col gap-8 md:gap-12">
        <SectionHeader
          label="Что вы получаете"
          title={<>Не машина, а <span className="plate">система</span></>}
          lead="Аренда в Таксимании — пять частей, которые работают вместе. Уберите любую — и смена встанет."
        />
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch lg:gap-3">
            {systemParts.map((p, i) => (
              <Fragment key={p.id}>
                {i > 0 && <Op>+</Op>}
                <Reveal delay={i * 60} className="lg:flex-1">
                  <div className="flex h-full flex-col gap-3 rounded-2 border border-asphalt-200 bg-white p-5 md:p-6">
                    <span className="t-number-l text-asphalt-300">0{i + 1}</span>
                    <h3 className="t-title-m">{p.title}</h3>
                    <p className="t-small text-asphalt-600">{p.text}</p>
                  </div>
                </Reveal>
              </Fragment>
            ))}
          </div>
          <Op>=</Op>
          <Reveal delay={300}>
            <div className="grid items-center gap-6 rounded-2 bg-asphalt-950 p-6 text-asphalt-50 on-dark md:grid-cols-[1fr_minmax(0,320px)] md:gap-10 md:p-8">
              <div className="flex flex-col gap-3">
                <span className="t-label text-signal-400">Итог</span>
                <h3 className="t-display-m">Готовый инструмент для работы</h3>
                <p className="t-body max-w-xl text-asphalt-300">
                  Машина, документы, поддержка и сервис — в одном парке. Цена фиксируется в договоре, залога и комиссий нет: вы выходите на линию, а не решаете вопросы.
                </p>
              </div>
              <RouteLine inverse className="hidden md:block" />
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
