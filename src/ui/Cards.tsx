import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Fuel, Gauge, Settings2, Zap } from 'lucide-react'
import type { Car } from '../data/cars'
import { fuelLabel } from '../data/cars'
import { tariffName } from '../data/tariffs'
import type { Article } from '../data/articles'
import { articleWords, categoryLabels } from '../data/articles'
import type { Review } from '../data/reviews'
import { reviewTagLabels } from '../data/reviews'
import type { Offer } from '../data/offers'
import { cn, formatDate, readingTime, pluralWith } from '../lib/format'
import { Avatar, Price, Stars, Tag } from './Primitives'
import { Button } from './Button'

/* ---------- Карточка автомобиля ---------- */
export function CarCard({ car, to, onLead, variant = 'landing', className, showSpecs = true }: {
  car: Car; to?: string; onLead?: (car: Car) => void; variant?: 'landing' | 'catalog' | 'compact'; className?: string; showSpecs?: boolean
}) {
  const Wrapper = to ? Link : 'div'
  const wrapperProps = to ? { to } : {}
  const specs = [
    { icon: Settings2, label: car.gearbox },
    { icon: car.fuel === 'electric' ? Zap : Fuel, label: car.fuel === 'electric' ? 'Электро' : `${car.engine}, бензин` },
    { icon: Gauge, label: car.consumption },
  ]
  if (variant === 'compact') {
    return (
      <Link to={to ?? '#'} className={cn('group flex items-center gap-4 rounded-2 border border-asphalt-200 bg-white p-3 transition-colors duration-fast hover:border-asphalt-950', className)}>
        <img src={car.images.cover} alt={car.name} className="size-20 shrink-0 rounded-1 object-cover" loading="lazy" />
        <div className="min-w-0 flex-1">
          <div className="t-caption text-asphalt-500">{tariffName(car.tariff)}</div>
          <div className="t-title-m truncate">{car.name}</div>
          <Price value={car.priceFrom} size="s" />
        </div>
        <ArrowRight className="size-5 shrink-0 text-asphalt-400 transition-transform duration-fast group-hover:translate-x-0.5 group-hover:text-asphalt-950" />
      </Link>
    )
  }
  const landing = variant === 'landing'
  return (
    <article className={cn('group flex flex-col overflow-hidden rounded-2 border border-asphalt-200 bg-white transition-[border-color,transform] duration-fast hover:border-asphalt-950', className)}>
      <Wrapper {...(wrapperProps as { to: string })} className={cn('relative block overflow-hidden bg-asphalt-100', landing ? 'aspect-[4/3]' : 'aspect-[3/2]')}>
        <img src={car.images.cover} alt={car.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-slow ease-out-brand group-hover:scale-[1.03]" />
        <div className="absolute left-3 top-3 flex gap-1.5">
          <Tag tone="dark">{tariffName(car.tariff)}</Tag>
          {car.fuel === 'electric' && <Tag tone="signal">Электро</Tag>}
        </div>
      </Wrapper>
      <div className={cn('flex flex-1 flex-col', landing ? 'gap-4 p-5' : 'gap-3 p-4')}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className={cn(landing ? 't-title-l' : 't-title-m')}>{to ? <Link to={to} className="hover:text-signal-700 transition-colors duration-fast">{car.name}</Link> : car.name}</h3>
            <p className="t-small text-asphalt-600">{car.benefit}</p>
          </div>
        </div>
        <Price value={car.priceFrom} size={landing ? 'm' : 's'} />
        {showSpecs && (
          <ul className={cn('grid gap-x-3 gap-y-1.5 t-small text-asphalt-700', landing ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1')}>
            {specs.map((s, i) => (
              <li key={i} className="flex items-center gap-2"><s.icon className="size-4 shrink-0 text-asphalt-400" strokeWidth={1.75} />{s.label}</li>
            ))}
          </ul>
        )}
        <div className={cn('mt-auto flex gap-2', landing ? 'pt-2' : 'pt-1')}>
          {to && <Button to={to} variant="ghost" size={landing ? 'm' : 's'} className="flex-1">Подробнее</Button>}
          {onLead && <Button onClick={() => onLead(car)} variant="primary" size={landing ? 'm' : 's'} className="flex-1">Узнать наличие</Button>}
        </div>
      </div>
    </article>
  )
}

/* ---------- Карточка статьи ---------- */
export function ArticleCard({ article, to, variant = 'default', className, categoryLabel }: { article: Article; to: string; variant?: 'default' | 'featured' | 'row'; className?: string; categoryLabel?: string }) {
  const cat = categoryLabel ?? categoryLabels[article.category]
  if (variant === 'row') {
    return (
      <Link to={to} className={cn('group flex gap-4 border-b border-asphalt-200 py-4 transition-colors duration-fast hover:bg-asphalt-0', className)}>
        <img src={article.image} alt="" className="size-20 shrink-0 rounded-1 object-cover" loading="lazy" />
        <div className="min-w-0">
          <div className="t-caption text-signal-700">{cat}</div>
          <div className="t-title-m line-clamp-2 group-hover:text-signal-700 transition-colors duration-fast">{article.title}</div>
          <div className="t-caption text-asphalt-500 mt-1">{formatDate(article.date)} · {readingTime(articleWords(article))}</div>
        </div>
      </Link>
    )
  }
  const featured = variant === 'featured'
  return (
    <Link to={to} className={cn('group flex overflow-hidden rounded-2 border border-asphalt-200 bg-white transition-colors duration-fast hover:border-asphalt-950', featured ? 'flex-col md:flex-row' : 'flex-col', className)}>
      <div className={cn('overflow-hidden bg-asphalt-100', featured ? 'aspect-[16/10] md:aspect-auto md:w-1/2' : 'aspect-[16/10]')}>
        <img src={article.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-slow ease-out-brand group-hover:scale-[1.03]" />
      </div>
      <div className={cn('flex flex-1 flex-col gap-3', featured ? 'p-6 md:p-8' : 'p-5')}>
        <div className="flex items-center gap-2 t-caption text-asphalt-500"><span className="text-signal-700">{cat}</span><span>·</span><span>{readingTime(articleWords(article))}</span></div>
        <h3 className={cn(featured ? 't-display-m' : 't-title-l', 'group-hover:text-signal-700 transition-colors duration-fast')}>{article.title}</h3>
        <p className={cn('t-small text-asphalt-600', featured ? 'line-clamp-4' : 'line-clamp-3')}>{article.lead}</p>
        <div className="mt-auto flex items-center justify-between pt-2 t-caption text-asphalt-500">
          <span>{formatDate(article.date)}</span>
          <span className="inline-flex items-center gap-1 text-asphalt-950">Читать <ArrowRight className="size-4 transition-transform duration-fast group-hover:translate-x-0.5" /></span>
        </div>
      </div>
    </Link>
  )
}

/* ---------- Карточка отзыва ---------- */
export function ReviewCard({ review, inverse, carTo, className, compact }: { review: Review; inverse?: boolean; carTo?: string; className?: string; compact?: boolean }) {
  return (
    <article className={cn('flex flex-col gap-4 rounded-2 border p-5', inverse ? 'border-[rgba(242,244,247,.14)] bg-asphalt-800 text-asphalt-50' : 'border-asphalt-200 bg-white', className)}>
      <div className="flex items-center gap-3">
        <Avatar name={review.name} inverse={inverse} />
        <div className="min-w-0 flex-1">
          <div className="t-title-m truncate">{review.name}</div>
          <div className={cn('t-caption', inverse ? 'text-asphalt-400' : 'text-asphalt-500')}>{review.years ? `в парке ${pluralWith(review.years, 'год', 'года', 'лет')}` : 'водитель парка'}</div>
        </div>
        <Stars n={review.rating} />
      </div>
      <p className={cn(compact ? 't-small line-clamp-4' : 't-body', inverse ? 'text-asphalt-200' : 'text-asphalt-700')}>{review.text}</p>
      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
        {review.carLabel && (carTo ? <Link to={carTo}><Tag tone="signal">{review.carLabel}</Tag></Link> : <Tag tone="signal">{review.carLabel}</Tag>)}
        {review.tags.slice(0, 2).map((t) => <Tag key={t} tone={inverse ? 'inverse' : 'neutral'}>{reviewTagLabels[t]}</Tag>)}
        <span className={cn('ml-auto t-caption', inverse ? 'text-asphalt-500' : 'text-asphalt-400')}>{formatDate(review.date)}</span>
      </div>
    </article>
  )
}

/* ---------- Карточка преимущества (editorial) ---------- */
export function FeatureCard({ label, title, text, fact, image, icon, inverse, className, size = 'm' }: { label: string; title: string; text: string; fact?: string; image?: string; icon?: ReactNode; inverse?: boolean; className?: string; size?: 'm' | 'l' }) {
  return (
    <article className={cn('relative flex flex-col overflow-hidden rounded-2 border', inverse ? 'border-[rgba(242,244,247,.14)] bg-asphalt-800 text-asphalt-50' : 'border-asphalt-200 bg-white', className)}>
      {image && (
        <div className={cn('relative overflow-hidden bg-asphalt-100', size === 'l' ? 'aspect-[16/9]' : 'aspect-[16/8]')}>
          <img src={image} alt="" loading="lazy" className="h-full w-full object-cover" />
        </div>
      )}
      <div className={cn('flex flex-1 flex-col gap-3', size === 'l' ? 'p-6 md:p-8' : 'p-5 md:p-6')}>
        <div className="flex items-center gap-2">
          {icon && <span className={cn('flex size-9 items-center justify-center rounded-1', inverse ? 'bg-asphalt-700 text-signal-400' : 'bg-signal-50 text-signal-700')}>{icon}</span>}
          <span className={cn('t-label', inverse ? 'text-signal-400' : 'text-signal-700')}>{label}</span>
        </div>
        <h3 className={cn(size === 'l' ? 't-display-m' : 't-title-l')}>{title}</h3>
        <p className={cn('t-body', inverse ? 'text-asphalt-300' : 'text-asphalt-600')}>{text}</p>
        {fact && <div className={cn('mt-auto pt-3 t-label-l', inverse ? 'text-asphalt-50' : 'text-asphalt-950')}>{fact}</div>}
      </div>
    </article>
  )
}

/* ---------- Карточка предложения ---------- */
export function OfferCard({ offer, to, className, variant = 'default' }: { offer: Offer; to: string; className?: string; variant?: 'default' | 'wide' }) {
  return (
    <Link to={to} className={cn('group relative flex overflow-hidden rounded-2 border border-asphalt-200 bg-white transition-colors duration-fast hover:border-asphalt-950', variant === 'wide' ? 'flex-col md:flex-row' : 'flex-col', className)}>
      <div className={cn('relative overflow-hidden bg-asphalt-900', variant === 'wide' ? 'aspect-[16/9] md:aspect-auto md:w-1/2' : 'aspect-[16/9]')}>
        <img src={offer.image} alt="" loading="lazy" className="h-full w-full object-cover opacity-90 transition-transform duration-slow ease-out-brand group-hover:scale-[1.03]" />
        <div className="absolute inset-0 scrim-photo" />
        <div className="absolute left-4 top-4"><Tag tone={offer.accent ? 'signal' : 'dark'}>{offer.label}</Tag></div>
      </div>
      <div className={cn('flex flex-1 flex-col gap-3', variant === 'wide' ? 'p-6 md:p-8' : 'p-5')}>
        <h3 className={cn(variant === 'wide' ? 't-display-m' : 't-title-l', 'group-hover:text-signal-700 transition-colors duration-fast')}>{offer.title}</h3>
        <p className="t-body text-asphalt-600">{offer.short}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-2 t-btn text-asphalt-950">{offer.cta}<ArrowRight className="size-4 transition-transform duration-fast group-hover:translate-x-0.5" /></span>
      </div>
    </Link>
  )
}

export { fuelLabel }
