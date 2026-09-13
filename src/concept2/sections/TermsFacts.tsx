import { BadgePercent, CalendarClock, FileText, Gift, Headset, ShieldCheck, type LucideIcon } from 'lucide-react'
import { cn } from '../../lib/format'

interface Fact { icon: LucideIcon; value: string; title: string; text: string }

/** Шесть подтверждённых сайтом фактов об условиях аренды */
export const termsFacts: Fact[] = [
  { icon: ShieldCheck, value: '0 ₽', title: 'Без залога', text: 'Депозит для получения машины не нужен' },
  { icon: FileText, value: 'фикс.', title: 'Цена по договору', text: 'Стоимость аренды не меняется на весь срок' },
  { icon: BadgePercent, value: 'нет', title: 'Доп. комиссий', text: 'В процессе аренды ничего не списывается сверх аренды' },
  { icon: CalendarClock, value: '≤ 3 лет', title: 'Возраст машин', text: 'Обслуживание в собственном сервисе парка' },
  { icon: Headset, value: '24/7', title: 'Поддержка', text: 'Круглосуточно, без перерывов и выходных' },
  { icon: Gift, value: 'бесплатно', title: 'Первый день', text: 'Выходите на линию в день оформления' },
]

/** Плотная сетка фактов: цифра, название, пояснение. cols=6 для полной ширины, 3 — для контентной колонки */
export function TermsFacts({ cols = 6, className }: { cols?: 3 | 6; className?: string }) {
  return (
    <ul className={cn('grid grid-cols-2 gap-px overflow-hidden rounded-2 border border-asphalt-200 bg-asphalt-200', cols === 6 ? 'md:grid-cols-3 lg:grid-cols-6' : 'md:grid-cols-3', className)}>
      {termsFacts.map((f) => (
        <li key={f.title} className="flex flex-col gap-1.5 bg-white p-4 md:p-5">
          <div className="flex items-start justify-between gap-2">
            <span className="t-display-s tabular text-asphalt-950">{f.value}</span>
            <f.icon className="mt-0.5 size-5 shrink-0 text-asphalt-400" strokeWidth={1.75} aria-hidden />
          </div>
          <div className="t-title-m">{f.title}</div>
          <p className="t-caption !font-normal text-asphalt-600">{f.text}</p>
        </li>
      ))}
    </ul>
  )
}
