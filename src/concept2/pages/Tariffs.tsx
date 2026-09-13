import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Page } from '../../shared/Page'
import { Calculator } from '../../shared/Calculator'
import { LeadForm } from '../../shared/LeadForm'
import { Button } from '../../ui/Button'
import { Container, Price, Reveal, Section, SectionHeader } from '../../ui/Primitives'
import { ArticleCard } from '../../ui/Cards'
import { cars, carsByTariff, minPriceForTariff } from '../../data/cars'
import { tariffs, type TariffId } from '../../data/tariffs'
import { articlesByCategory } from '../../data/articles'
import { c2 } from '../Layout'
import { PageIntro } from '../sections/PageIntro'
import { TariffCard } from '../sections/TariffTiles'
import { FinalCta } from '../sections/FinalCta'
import { formatNumber } from '../../lib/format'

/** Формулировки из описаний тарифов (tariffs.ts), без выдуманных чисел */
const ordersWord: Record<TariffId, string> = { econom: 'Больше всего', comfort: 'Много', 'comfort-plus': 'Меньше, но длиннее', business: 'Меньше всего' }
const checkWord: Record<TariffId, string> = { econom: 'Низкий', comfort: 'Средний', 'comfort-plus': 'Высокий', business: 'Максимальный' }
const multiplierLabel = (m: number) => (m === 1 ? 'база' : `×${String(m).replace('.', ',')} к выручке Эконома`)

export function C2Tariffs() {
  const minPrice = Math.min(...cars.map((c) => c.priceFrom))
  const maxPrice = Math.max(...cars.map((c) => c.priceFrom))
  const comparison = articlesByCategory('comparison')
  const calcCar = cars.find((c) => c.tariff === 'comfort')!
  const cell = 'px-4 py-3 t-small align-top text-asphalt-800'

  return (
    <Page title="Тарифы такси Эконом, Комфорт, Комфорт+ и Бизнес: какие машины и сколько стоит аренда — Таксимания">
      <PageIntro
        crumbs={[{ label: 'Главная', to: c2.home }, { label: 'Тарифы' }]}
        label="Тарифы"
        title={<>Четыре тарифа: от <span className="plate">Эконома</span> до Бизнеса</>}
        lead={`${tariffs.length} класса агрегаторов, ${cars.length} моделей, аренда от ${formatNumber(minPrice)} до ${formatNumber(maxPrice)} ₽/день. Чем выше класс, тем выше чек и аренда; чек внутри класса одинаковый для всех машин.`}
      />

      {/* ---------- Карточки тарифов ---------- */}
      <Section tight>
        <Container className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {tariffs.map((t, i) => <Reveal key={t.id} delay={i * 40}><TariffCard tariff={t} index={i} /></Reveal>)}
        </Container>
      </Section>

      {/* ---------- Таблица сравнения ---------- */}
      <Section tight className="border-t border-asphalt-200 bg-white">
        <Container className="flex flex-col gap-8">
          <SectionHeader size="m" label="Сравнение" title="Эконом vs Комфорт vs Комфорт+ vs Бизнес" lead="Заказы и чек описаны словами, как на сайте парка. Коэффициенты — из формулы калькулятора на текущем сайте." />
          <div className="overflow-x-auto rounded-2 border border-asphalt-200 bg-white">
            <table className="min-w-[760px] w-full text-left">
              <thead className="bg-asphalt-0">
                <tr>
                  <th className="px-4 py-3 t-label text-asphalt-600" />
                  {tariffs.map((t) => <th key={t.id} className="px-4 py-3 t-label text-asphalt-950 whitespace-nowrap"><Link to={c2.tariff(t.slug)} className="transition-colors duration-fast hover:text-signal-700">{t.name}</Link></th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-asphalt-200">
                <tr><th scope="row" className={`${cell} font-semibold text-asphalt-950`}>Заказов</th>{tariffs.map((t) => <td key={t.id} className={cell}>{ordersWord[t.id]}</td>)}</tr>
                <tr><th scope="row" className={`${cell} font-semibold text-asphalt-950`}>Средний чек</th>{tariffs.map((t) => <td key={t.id} className={cell}>{checkWord[t.id]}</td>)}</tr>
                <tr><th scope="row" className={`${cell} font-semibold text-asphalt-950`}>Аренда от</th>{tariffs.map((t) => <td key={t.id} className={cell}><Price value={minPriceForTariff(t.id)} size="s" prefix="" suffix="/день" /></td>)}</tr>
                <tr><th scope="row" className={`${cell} font-semibold text-asphalt-950`}>Машин в классе</th>{tariffs.map((t) => <td key={t.id} className={`${cell} tabular`}>{carsByTariff(t.id).length}</td>)}</tr>
                <tr><th scope="row" className={`${cell} font-semibold text-asphalt-950`}>Коэффициент калькулятора</th>{tariffs.map((t) => <td key={t.id} className={cell}>{multiplierLabel(t.multiplier)}</td>)}</tr>
                <tr><th scope="row" className={`${cell} font-semibold text-asphalt-950`}>Стратегия</th>{tariffs.map((t) => { const [head, rest] = t.strategy.split(': '); return <td key={t.id} className={cell}><span className="block font-semibold text-asphalt-950">{head}</span><span className="block t-caption !font-normal text-asphalt-600">{rest}</span></td> })}</tr>
                <tr><th scope="row" className={`${cell} font-semibold text-asphalt-950`}>Кому</th>{tariffs.map((t) => <td key={t.id} className={cell}>{t.whoFor[0].charAt(0).toUpperCase() + t.whoFor[0].slice(1)}</td>)}</tr>
                <tr><th scope="row" className={`${cell} font-semibold text-asphalt-950`}>Машины</th>{tariffs.map((t) => <td key={t.id} className={cell}><ul className="flex flex-col gap-1">{carsByTariff(t.id).map((c) => <li key={c.slug}><Link to={c2.car(c.slug)} className="underline decoration-1 underline-offset-2 transition-colors duration-fast hover:text-signal-700">{c.name}</Link></li>)}</ul></td>)}</tr>
                <tr><th scope="row" className={cell} />{tariffs.map((t) => <td key={t.id} className={cell}><Button size="s" variant="ghost" to={c2.tariff(t.slug)} iconRight={<ArrowRight className="size-4" />}>Подробнее</Button></td>)}</tr>
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      {/* ---------- Калькулятор ---------- */}
      <Section inverse tight>
        <Container className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
          <SectionHeader
            inverse size="m" label="Экономика" title="Считайте остаток, а не выручку"
            lead="Выручка за неделю = дни × выручка за смену × коэффициент тарифа. Из неё вычитаем аренду. В полном калькуляторе можно выбрать тариф и машину."
            action={<Button variant="ghost-inverse" to={`${c2.home}#economics`} iconRight={<ArrowRight className="size-4" />}>Полный калькулятор</Button>}
            className="md:flex-col md:items-start"
          />
          <div className="flex flex-col gap-2">
            <div className="t-caption text-asphalt-400">Быстрый расчёт: {calcCar.name} · Комфорт · {formatNumber(calcCar.priceFrom)} ₽/день</div>
            <Calculator variant="compact" inverse />
          </div>
        </Container>
      </Section>

      {/* ---------- Статьи ---------- */}
      <Section tight>
        <Container className="flex flex-col gap-8">
          <SectionHeader size="m" label="Сравнения" title="Статьи о выборе тарифа и машины" action={<Button variant="link" to={c2.blog}>Все статьи</Button>} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {comparison.map((a, i) => <Reveal key={a.slug} delay={i * 40}><ArticleCard article={a} to={c2.article(a.slug)} className="h-full" /></Reveal>)}
          </div>
        </Container>
      </Section>

      <FinalCta title={<>Не уверены в тарифе? Менеджер <span className="plate-light">подберёт класс</span> под ваш опыт</>} lead="Сменить класс можно в любое рабочее время, поэтому ошибка на старте не критична. Начните с минимальной аренды в классе.">
        <LeadForm inverse withTariff compact submitLabel="Подобрать тариф" />
      </FinalCta>
    </Page>
  )
}
