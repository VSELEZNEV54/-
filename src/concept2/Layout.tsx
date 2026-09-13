import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { ChevronDown, Clock, MapPin, Menu, Phone, Send, X, ArrowRight } from 'lucide-react'
import { Button } from '../ui/Button'
import { Container, Logo, Tag } from '../ui/Primitives'
import { useLead } from '../shared/LeadContext'
import { ConceptSwitcher } from '../shared/ConceptSwitcher'
import { company, legalPages } from '../data/company'
import { cars, minPriceForTariff } from '../data/cars'
import { tariffs } from '../data/tariffs'
import { cn, formatNumber, phoneHref } from '../lib/format'
import { useLockBody } from '../lib/hooks'

export const C2 = '/concept-2'
export const c2 = {
  home: C2,
  cars: `${C2}/cars`,
  car: (slug: string) => `${C2}/cars/${slug}`,
  tariffs: `${C2}/tariffs`,
  tariff: (slug: string) => `${C2}/tariffs/${slug}`,
  terms: `${C2}/rental-terms`,
  offers: `${C2}/offers`,
  offer: (slug: string) => `${C2}/offers/${slug}`,
  about: `${C2}/about`,
  reviews: `${C2}/reviews`,
  faq: `${C2}/faq`,
  blog: `${C2}/blog`,
  article: (slug: string) => `${C2}/blog/${slug}`,
  contact: `${C2}/contact`,
  compare: `${C2}/compare`,
  documents: `${C2}/documents`,
}

const mainNav = [
  { to: c2.cars, label: 'Автопарк', mega: true },
  { to: c2.tariffs, label: 'Тарифы' },
  { to: c2.terms, label: 'Условия аренды' },
  { to: c2.offers, label: 'Акции' },
  { to: c2.about, label: 'О компании' },
  { to: c2.reviews, label: 'Отзывы' },
  { to: c2.faq, label: 'FAQ' },
  { to: c2.blog, label: 'Блог' },
  { to: c2.contact, label: 'Контакты' },
]

export function Concept2Layout() {
  const [open, setOpen] = useState(false)
  const [mega, setMega] = useState(false)
  const { openLead } = useLead()
  const { pathname } = useLocation()
  const megaRef = useRef<HTMLDivElement>(null)
  useLockBody(open)
  useEffect(() => { setOpen(false); setMega(false) }, [pathname])

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Верхняя утилитарная полоса */}
      <div className="hidden border-b border-asphalt-200 bg-white lg:block">
        <Container className="flex h-9 items-center justify-between gap-6 t-caption text-asphalt-600 whitespace-nowrap">
          <div className="flex min-w-0 items-center gap-5">
            <span className="hidden items-center gap-1.5 xl:inline-flex"><MapPin className="size-3.5 shrink-0" />{company.address} · {company.addressNote}</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="size-3.5 shrink-0" />Поддержка {company.hours.support.toLowerCase()}</span>
          </div>
          <div className="flex shrink-0 items-center gap-5">
            <a href={company.telegram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-asphalt-950 transition-colors duration-fast"><Send className="size-3.5" />Telegram</a>
            <a href={phoneHref(company.phoneSupport)} className="font-semibold text-asphalt-800 hover:text-asphalt-950 transition-colors duration-fast">{company.phoneSupport} · круглосуточно</a>
          </div>
        </Container>
      </div>

      <header className="sticky top-0 z-[80] border-b border-asphalt-200 bg-asphalt-50/95 backdrop-blur">
        <Container className="flex h-16 items-center gap-4 md:h-[72px]">
          <Logo to={C2} />
          <nav className="ml-6 hidden flex-1 items-center gap-1 lg:flex xl:ml-10" aria-label="Основная навигация" onMouseLeave={() => setMega(false)}>
            {mainNav.map((n) => (
              <div key={n.to} className="relative" onMouseEnter={() => n.mega && setMega(true)}>
                <NavLink to={n.to} end={n.to === c2.cars ? false : undefined} className={({ isActive }) => cn('inline-flex items-center gap-1 whitespace-nowrap rounded-1 px-2.5 py-2 font-label text-[14px] font-bold tracking-[.01em] transition-colors duration-fast hover:bg-white xl:px-3 xl:text-[15px]', isActive && 'text-signal-700')}>
                  {n.label}{n.mega && <ChevronDown className="size-3.5" />}
                </NavLink>
              </div>
            ))}
            {/* Мегаменю автопарка */}
            <div ref={megaRef} className={cn('absolute left-0 right-0 top-full border-b border-asphalt-200 bg-white shadow-pop transition-[opacity,transform] duration-base ease-out-brand', mega ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 -translate-y-1')} onMouseEnter={() => setMega(true)}>
              <Container className="grid grid-cols-[1.2fr_2fr_1fr] gap-8 py-7">
                <div>
                  <div className="t-label text-asphalt-500 mb-3">По тарифу</div>
                  <ul className="flex flex-col">
                    {tariffs.map((t) => (
                      <li key={t.id}><Link to={c2.tariff(t.slug)} className="flex items-center justify-between rounded-1 px-2 py-2 hover:bg-asphalt-50 transition-colors duration-fast"><span className="t-title-m">{t.name}</span><span className="t-caption text-asphalt-500 tabular">от {formatNumber(minPriceForTariff(t.id))} ₽</span></Link></li>
                    ))}
                    <li><Link to={`${c2.cars}?fuel=electric`} className="flex items-center justify-between rounded-1 px-2 py-2 hover:bg-asphalt-50 transition-colors duration-fast"><span className="t-title-m">Электромобили</span><Tag tone="signal">Электро</Tag></Link></li>
                  </ul>
                </div>
                <div>
                  <div className="t-label text-asphalt-500 mb-3">Все автомобили</div>
                  <ul className="grid grid-cols-2 gap-x-6">
                    {cars.map((c) => (
                      <li key={c.slug}><Link to={c2.car(c.slug)} className="flex items-center gap-3 rounded-1 px-2 py-1.5 hover:bg-asphalt-50 transition-colors duration-fast"><img src={c.images.cover} alt="" className="size-10 rounded-1 object-cover" /><span className="min-w-0"><span className="block t-small font-semibold truncate">{c.name}</span><span className="block t-caption !font-normal text-asphalt-500">от {formatNumber(c.priceFrom)} ₽/день</span></span></Link></li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-3 rounded-2 bg-asphalt-950 p-5 text-asphalt-50">
                  <div className="t-label text-signal-400">Не знаете, что выбрать?</div>
                  <p className="t-small text-asphalt-300">Сравните машины по аренде, расходу и тарифу или получите подбор от менеджера.</p>
                  <Button variant="primary" size="s" to={c2.compare} iconRight={<ArrowRight className="size-4" />}>Сравнить автомобили</Button>
                  <Button variant="ghost-inverse" size="s" onClick={() => openLead({ withTariff: true, title: 'Подобрать автомобиль' })}>Подобрать автомобиль</Button>
                </div>
              </Container>
            </div>
          </nav>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <div className="hidden sm:block"><Button onClick={() => openLead({ title: 'Оставить заявку', withTariff: true })}>Оставить заявку</Button></div>
            <button type="button" className="flex size-11 items-center justify-center rounded-1 border border-asphalt-300 lg:hidden" aria-label={open ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </Container>

        {/* Мобильное меню */}
        <div className={cn('fixed inset-x-0 top-16 bottom-0 z-[79] overflow-y-auto bg-asphalt-950 text-asphalt-50 transition-[opacity,transform] duration-base ease-out-brand lg:hidden', open ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 -translate-y-2')}>
          <Container className="flex flex-col gap-6 py-6">
            <div className="grid grid-cols-2 gap-2">
              {tariffs.map((t) => <Link key={t.id} to={c2.tariff(t.slug)} className="rounded-1 border border-[rgba(242,244,247,.14)] p-3"><span className="block t-label text-signal-400">{t.name}</span><span className="block t-caption !font-normal text-asphalt-400">от {formatNumber(minPriceForTariff(t.id))} ₽/день</span></Link>)}
            </div>
            <nav className="flex flex-col" aria-label="Мобильная навигация">
              {mainNav.map((n) => (
                <Link key={n.to} to={n.to} className="flex items-center justify-between border-b border-[rgba(242,244,247,.14)] py-3.5 font-display text-[26px] font-bold leading-none">{n.label}<ArrowRight className="size-5 text-asphalt-500" /></Link>
              ))}
            </nav>
            <div className="flex flex-col gap-3">
              <Button size="l" full onClick={() => { setOpen(false); openLead({ withTariff: true }) }}>Оставить заявку</Button>
              <Button size="l" full variant="ghost-inverse" href={phoneHref(company.phone)} icon={<Phone className="size-4" />}>{company.phone}</Button>
              <p className="t-caption text-asphalt-400">{company.address} · {company.addressNote}</p>
            </div>
          </Container>
        </div>
      </header>

      <main className="flex-1"><Outlet /></main>
      <Concept2Footer />
      <MobileBar />
      <ConceptSwitcher />
    </div>
  )
}

function MobileBar() {
  const { openLead } = useLead()
  return (
    <div className="fixed inset-x-0 bottom-0 z-[85] flex gap-2 border-t border-asphalt-200 bg-white p-3 shadow-bar sm:hidden" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
      <Button variant="ghost" href={phoneHref(company.phone)} icon={<Phone className="size-4" />} className="flex-1">Позвонить</Button>
      <Button className="flex-[1.4]" onClick={() => openLead({ withTariff: true })}>Оставить заявку</Button>
    </div>
  )
}

function Concept2Footer() {
  return (
    <footer className="bg-asphalt-950 text-asphalt-50 on-dark pb-24 sm:pb-0">
      <Container className="grid grid-cols-1 gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr] md:py-16">
        <div className="flex flex-col gap-5 md:col-span-2 lg:col-span-1">
          <Logo to={C2} inverse />
          <p className="t-small max-w-xs text-asphalt-300">Аренда автомобилей для работы в такси в Москве. Официальный партнёр Яндекс Go. 1000+ машин не старше 3 лет.</p>
          <a href={phoneHref(company.phone)} className="t-title-l hover:text-signal-400 transition-colors duration-fast">{company.phone}</a>
          <span className="t-caption text-asphalt-400 -mt-3">поддержка круглосуточно · {company.phoneSupport}</span>
          <div className="flex gap-2"><Button variant="ghost-inverse" size="s" href={company.telegram} target="_blank" rel="noreferrer" icon={<Send className="size-4" />}>Telegram</Button><Button variant="ghost-inverse" size="s" href={`mailto:${company.email}`}>Почта</Button></div>
        </div>
        <FooterCol title="Автомобили" links={[...tariffs.map((t) => ({ label: `Тариф ${t.name}`, to: c2.tariff(t.slug) })), { label: 'Электромобили', to: `${c2.cars}?fuel=electric` }, { label: 'Все автомобили', to: c2.cars }, { label: 'Сравнение', to: c2.compare }]} />
        <FooterCol title="Модели" links={cars.map((c) => ({ label: c.name, to: c2.car(c.slug) }))} />
        <FooterCol title="Компания" links={[{ label: 'О компании', to: c2.about }, { label: 'Условия аренды', to: c2.terms }, { label: 'Акции', to: c2.offers }, { label: 'Отзывы', to: c2.reviews }, { label: 'FAQ', to: c2.faq }, { label: 'Блог', to: c2.blog }, { label: 'Контакты', to: c2.contact }]} />
        <FooterCol title="Документы" links={legalPages.map((p) => ({ label: p.title, to: `${c2.documents}#${p.slug}` }))} />
      </Container>
      <div className="border-t border-[rgba(242,244,247,.14)]">
        <Container className="flex flex-col gap-2 py-5 t-caption !font-normal text-asphalt-500 md:flex-row md:items-center md:justify-between">
          <span>{company.legalName} · ОГРН {company.legal.ogrn} · ИНН {company.legal.inn} · КПП {company.legal.kpp}</span>
          <span>{company.address} · {company.city}</span>
        </Container>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="t-label text-asphalt-400">{title}</div>
      <ul className="flex flex-col gap-1.5">{links.map((l) => <li key={l.label}><Link to={l.to} className="t-small text-asphalt-200 hover:text-signal-400 transition-colors duration-fast">{l.label}</Link></li>)}</ul>
    </div>
  )
}
