import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Menu, Phone, X, Send } from 'lucide-react'
import { Button } from '../ui/Button'
import { Container, Logo } from '../ui/Primitives'
import { useLead } from '../shared/LeadContext'
import { ConceptSwitcher } from '../shared/ConceptSwitcher'
import { company, legalPages } from '../data/company'
import { cars } from '../data/cars'
import { cn, phoneHref } from '../lib/format'
import { useLockBody } from '../lib/hooks'

export const C1 = '/concept-1'

const nav = [
  { to: `${C1}#cars`, label: 'Автомобили' },
  { to: `${C1}#terms`, label: 'Условия' },
  { to: `${C1}#start`, label: 'Как начать' },
  { to: `${C1}#reviews`, label: 'Отзывы' },
  { to: `${C1}#blog`, label: 'Блог' },
  { to: `${C1}#faq`, label: 'FAQ' },
  { to: `${C1}/about`, label: 'О компании' },
]

export function Concept1Layout() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { openLead } = useLead()
  const { pathname } = useLocation()
  useLockBody(open)
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="flex min-h-dvh flex-col">
      <header className={cn('sticky top-0 z-[80] border-b transition-[background-color,border-color] duration-base', scrolled ? 'border-asphalt-200 bg-asphalt-50/95 backdrop-blur' : 'border-transparent bg-asphalt-50')}>
        <Container className="flex h-16 items-center justify-between gap-4 md:h-[72px]">
          <Logo to={C1} />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Основная навигация">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} className={({ isActive }) => cn('rounded-1 px-3 py-2 font-label text-[15px] font-bold tracking-[.01em] transition-colors duration-fast hover:bg-white', isActive && !n.to.includes('#') && 'text-signal-700')}>{n.label}</NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href={phoneHref(company.phone)} className="hidden items-center gap-2 rounded-1 px-3 py-2 t-btn text-asphalt-950 hover:bg-white transition-colors duration-fast md:inline-flex">
              <Phone className="size-4" />{company.phone}
            </a>
            <div className="hidden shrink-0 sm:block"><Button onClick={() => openLead({ title: 'Подобрать автомобиль', text: 'Ответьте на звонок менеджера — подберём машину под тариф и бюджет.', withTariff: true, submitLabel: 'Подобрать автомобиль' })}>Подобрать автомобиль</Button></div>
            <button type="button" className="flex size-11 items-center justify-center rounded-1 border border-asphalt-300 lg:hidden" aria-label={open ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </Container>
        {/* Мобильное меню */}
        <div className={cn('fixed inset-x-0 top-16 bottom-0 z-[79] bg-asphalt-950 text-asphalt-50 transition-[opacity,transform] duration-base ease-out-brand lg:hidden', open ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 -translate-y-2')}>
          <Container className="flex h-full flex-col gap-6 py-8">
            <nav className="flex flex-col" aria-label="Мобильная навигация">
              {nav.map((n, i) => (
                <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="flex items-center justify-between border-b border-[rgba(242,244,247,.14)] py-4 font-display text-[32px] font-bold leading-none">
                  {n.label}<span className="t-caption text-asphalt-500">0{i + 1}</span>
                </Link>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-3">
              <Button size="l" full onClick={() => { setOpen(false); openLead({ withTariff: true, title: 'Подобрать автомобиль' }) }}>Подобрать автомобиль</Button>
              <Button size="l" full variant="ghost-inverse" href={phoneHref(company.phone)} icon={<Phone className="size-4" />}>{company.phone}</Button>
              <p className="t-caption text-asphalt-400">Поддержка круглосуточно · {company.phoneSupport}</p>
            </div>
          </Container>
        </div>
      </header>

      <main className="flex-1"><Outlet /></main>

      <Concept1Footer />
      <MobileBar />
      <ConceptSwitcher />
    </div>
  )
}

function MobileBar() {
  const { openLead } = useLead()
  return (
    <div className="fixed inset-x-0 bottom-0 z-[85] flex gap-2 border-t border-asphalt-200 bg-white p-3 shadow-bar sm:hidden" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
      <Button variant="ghost" href={phoneHref(company.phone)} icon={<Phone className="size-4" />} aria-label="Позвонить" className="flex-1">Позвонить</Button>
      <Button className="flex-[1.4]" onClick={() => openLead({ withTariff: true, title: 'Подобрать автомобиль' })}>Подобрать авто</Button>
    </div>
  )
}

function Concept1Footer() {
  return (
    <footer className="bg-asphalt-950 text-asphalt-50 on-dark pb-24 sm:pb-0">
      <Container className="grid grid-cols-1 gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:py-16">
        <div className="flex flex-col gap-5">
          <Logo to={C1} inverse />
          <p className="t-small max-w-xs text-asphalt-300">Аренда автомобилей для работы в такси в Москве. 1000+ машин не старше 3 лет, без залога и дополнительных комиссий.</p>
          <div className="flex flex-col gap-1">
            <a href={phoneHref(company.phone)} className="t-title-l hover:text-signal-400 transition-colors duration-fast">{company.phone}</a>
            <span className="t-caption text-asphalt-400">поддержка круглосуточно · {company.phoneSupport}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost-inverse" size="s" href={company.telegram} target="_blank" rel="noreferrer" icon={<Send className="size-4" />}>Telegram</Button>
            <Button variant="ghost-inverse" size="s" href={`mailto:${company.email}`}>{company.email}</Button>
          </div>
        </div>
        <FooterCol title="Автомобили" links={cars.slice(0, 6).map((c) => ({ label: c.name, to: `${C1}#cars` }))} more={{ label: 'Все автомобили', to: `${C1}#cars` }} />
        <FooterCol title="Компания" links={[{ label: 'О компании', to: `${C1}/about` }, { label: 'Условия', to: `${C1}#terms` }, { label: 'Отзывы', to: `${C1}#reviews` }, { label: 'Блог', to: `${C1}/blog` }, { label: 'Контакты', to: `${C1}/contact` }]} />
        <FooterCol title="Документы" links={legalPages.map((p) => ({ label: p.title, to: `${C1}/documents#${p.slug}` }))} />
      </Container>
      <div className="border-t border-[rgba(242,244,247,.14)]">
        <Container className="flex flex-col gap-2 py-5 t-caption !font-normal text-asphalt-500 md:flex-row md:items-center md:justify-between">
          <span>{company.legalName} · ОГРН {company.legal.ogrn} · ИНН {company.legal.inn}</span>
          <span>{company.address} · {company.city}</span>
        </Container>
      </div>
    </footer>
  )
}

function FooterCol({ title, links, more }: { title: string; links: { label: string; to: string }[]; more?: { label: string; to: string } }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="t-label text-asphalt-400">{title}</div>
      <ul className="flex flex-col gap-2">
        {links.map((l) => <li key={l.label}><Link to={l.to} className="t-small text-asphalt-200 hover:text-signal-400 transition-colors duration-fast">{l.label}</Link></li>)}
        {more && <li><Link to={more.to} className="t-small text-signal-400 underline underline-offset-2">{more.label}</Link></li>}
      </ul>
    </div>
  )
}
