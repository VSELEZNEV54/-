import { ArrowRight, Check } from 'lucide-react'
import { requirements } from '../../data/company'
import { objections } from '../../data/faq'
import { Button } from '../../ui/Button'
import { Container, NeedsConfirm, Reveal, Section, SectionHeader } from '../../ui/Primitives'

/** Крупная цифра-факт слева от каждого возражения */
const facts: Record<string, string> = {
  deposit: '0 ₽',
  'extra-fees': '0 %',
  'how-fast': '10 мин',
  swap: 'в любой день',
  age: '≤ 3 лет',
  'photo-match': 'в парке',
  breakdown: '24/7',
  accident: '24/7',
  maintenance: 'свой сервис',
  docs: '5 док.',
}

/** «Что обычно волнует водителей до аренды» — на него ведёт пункт меню «Условия» */
export function Terms() {
  return (
    <Section id="terms" className="scroll-mt-20 bg-white">
      <Container className="flex flex-col gap-8 md:gap-12">
        <SectionHeader
          label="Условия"
          title={<>Что обычно волнует водителей <span className="plate">до аренды</span></>}
          lead="Десять вопросов, которые задают чаще всего, и ответы с сайта парка. Где точных условий пока нет — стоит пометка."
          action={<Button variant="link" href="#faq" iconRight={<ArrowRight className="size-4" />}>Полный FAQ</Button>}
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {objections.map((o, i) => (
            <Reveal key={o.id} delay={(i % 2) * 60}>
              <article className="flex h-full flex-col gap-4 rounded-2 border border-asphalt-200 bg-asphalt-50 p-5 sm:flex-row sm:gap-5 md:gap-6 md:p-6">
                <div className="shrink-0 sm:w-20 md:w-28">
                  <div className="t-display-m break-words text-asphalt-950">{facts[o.id] ?? '—'}</div>
                  <div className="mt-2 h-1 w-8 bg-signal-500" aria-hidden />
                </div>
                <div className="flex min-w-0 flex-col gap-2">
                  <h3 className="t-title-l">{o.q}</h3>
                  <p className="t-body text-asphalt-600">{o.a}</p>
                  {o.needsConfirmation && <NeedsConfirm className="self-start" />}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="rounded-2 bg-asphalt-950 p-6 text-asphalt-50 on-dark md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
            <div className="lg:w-56 lg:shrink-0">
              <div className="t-label text-signal-400">Требования к водителю</div>
              <p className="mt-1 t-small text-asphalt-400">Пять условий, без которых машину не выдадут.</p>
            </div>
            <ul className="grid flex-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-5">
              {requirements.map((r) => (
                <li key={r.title} className="flex items-start gap-2 t-small font-semibold text-asphalt-100">
                  <Check className="mt-0.5 size-4 shrink-0 text-signal-400" strokeWidth={2.25} />{r.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  )
}
