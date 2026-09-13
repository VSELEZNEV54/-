import { Link } from 'react-router-dom'
import { ArrowUpRight, Clock, Headset, Mail, MapPin, Phone, Send } from 'lucide-react'
import { Page } from '../../shared/Page'
import { LeadForm } from '../../shared/LeadForm'
import { useLead } from '../../shared/LeadContext'
import { Button } from '../../ui/Button'
import { Container, MapPlaceholder, NeedsConfirm, Section, SectionHeader } from '../../ui/Primitives'
import { C2, c2 } from '../Layout'
import { company, documents } from '../../data/company'
import { phoneHref } from '../../lib/format'
import { CheckList, ContentHead, InlineLink } from '../sections/ContentShared'

export function C2Contact() {
  const { openLead } = useLead()
  const rows = [
    { icon: MapPin, label: 'Адрес парка', value: <span>{company.address}<span className="block t-small text-asphalt-600">{company.city} · {company.addressNote}</span></span> },
    { icon: Phone, label: 'Телефон', value: <a href={phoneHref(company.phone)} className="hover:text-signal-700 transition-colors duration-fast">{company.phone}</a> },
    { icon: Headset, label: 'Поддержка водителей', value: <span><a href={phoneHref(company.phoneSupport)} className="hover:text-signal-700 transition-colors duration-fast">{company.phoneSupport}</a><span className="block t-small text-asphalt-600">{company.phoneSupportNote}, без перерывов и выходных</span></span> },
    { icon: Mail, label: 'Почта', value: <a href={`mailto:${company.email}`} className="hover:text-signal-700 transition-colors duration-fast">{company.email}</a> },
    { icon: Send, label: 'Telegram', value: <a href={company.telegram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-signal-700 transition-colors duration-fast">{company.telegram.replace('https://', '')}<ArrowUpRight className="size-4 text-asphalt-400" /></a> },
    { icon: Clock, label: 'Режим работы', value: <span>Поддержка: {company.hours.support.toLowerCase()}<span className="mt-1 flex flex-wrap items-center gap-2 t-small text-asphalt-600">Офис: {company.hours.office.toLowerCase()} {company.hours.officeNeedsConfirmation && <NeedsConfirm />}</span></span> },
  ]

  return (
    <Page title="Контакты таксопарка Таксимания — Загородное шоссе, Москва">
      <ContentHead
        crumbs={[{ label: 'Главная', to: C2 }, { label: 'Контакты' }]}
        label="Контакты"
        title="Контакты парка"
        lead={`${company.address}, ${company.city}. ${company.addressNote}. Поддержка водителей — круглосуточно, приезжать в парк можно сразу с документами.`}
      />

      <Section tight>
        <Container className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.25fr] lg:gap-10">
          <div className="flex flex-col gap-5">
            <ul className="flex flex-col divide-y divide-asphalt-200 rounded-2 border border-asphalt-200 bg-white">
              {rows.map((r) => (
                <li key={r.label} className="flex items-start gap-4 px-5 py-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-1 bg-asphalt-950 text-asphalt-50"><r.icon className="size-4" strokeWidth={1.75} /></span>
                  <span className="flex min-w-0 flex-col gap-0.5"><span className="t-caption text-asphalt-500">{r.label}</span><span className="t-title-m">{r.value}</span></span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => openLead({ title: 'Оставить заявку', withTariff: true })}>Оставить заявку</Button>
              <Button variant="ghost" href={phoneHref(company.phone)} icon={<Phone className="size-4" />}>Позвонить</Button>
              <Button variant="ghost" href={company.mapRoute} target="_blank" rel="noreferrer" iconRight={<ArrowUpRight className="size-4" />}>Построить маршрут</Button>
            </div>
          </div>
          <MapPlaceholder className="aspect-square sm:aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[320px]" />
        </Container>
      </Section>

      <Section tight className="border-y border-asphalt-200 bg-white">
        <Container className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          <div className="flex flex-col gap-4">
            <h2 className="t-display-m">Как добраться</h2>
            <p className="t-body text-asphalt-700">Парк находится на {company.address}: {company.addressNote.toLowerCase()}. На машине — маршрут строится в Яндекс Картах по кнопке выше.</p>
            <ul className="flex flex-col divide-y divide-asphalt-200 border-y border-asphalt-200 t-small">
              <li className="flex items-center justify-between gap-4 py-2.5"><span className="text-asphalt-600">Пешком от метро и МЦК</span><span className="font-semibold">5 минут</span></li>
              <li className="flex items-center justify-between gap-4 py-2.5"><span className="text-asphalt-600">Ближайшие станции</span><NeedsConfirm /></li>
              <li className="flex items-center justify-between gap-4 py-2.5"><span className="text-asphalt-600">Парковка для гостей</span><NeedsConfirm /></li>
              <li className="flex items-center justify-between gap-4 py-2.5"><span className="text-asphalt-600">Координаты</span><span className="tabular">{company.coords.lat}, {company.coords.lng}</span></li>
            </ul>
            <a href={company.mapRoute} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1.5 t-small font-semibold text-signal-700 transition-colors duration-fast hover:text-signal-500">Открыть в Яндекс Картах<ArrowUpRight className="size-4" /></a>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="t-display-m">Что взять с собой</h2>
            <p className="t-body text-asphalt-700">Оригиналы документов — оформление в парке занимает около 10 минут, если всё на руках.</p>
            <CheckList items={documents} size="s" />
            <InlineLink to={`${c2.terms}#documents`}>Требования и документы — в условиях аренды</InlineLink>
          </div>
        </Container>
      </Section>

      <Section tight>
        <Container className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <SectionHeader size="m" label="Заявка" title="Оставить заявку онлайн" lead="Менеджер перезвонит, уточнит тариф и наличие машины. Решение о выдаче — в течение 10 минут." />
          <div className="rounded-2 border border-asphalt-200 bg-white p-5 md:p-6"><LeadForm compact submitLabel="Оставить заявку" context="Контакты" /></div>
        </Container>
      </Section>

      <Section tight className="border-t border-asphalt-200 bg-white">
        <Container className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr] lg:gap-16">
          <SectionHeader size="m" label="Реквизиты" title="Юридическая информация" lead={<Link to={c2.documents} className="underline underline-offset-4 decoration-1 hover:text-signal-700 transition-colors duration-fast">Оферта и политики</Link>} />
          <dl className="grid grid-cols-1 gap-x-8 gap-y-3 rounded-2 border border-asphalt-200 bg-asphalt-50 p-6 t-small sm:grid-cols-[180px_1fr]">
            <dt className="text-asphalt-500">Наименование</dt><dd className="font-semibold">{company.legalName}</dd>
            <dt className="text-asphalt-500">ОГРН</dt><dd className="tabular">{company.legal.ogrn}</dd>
            <dt className="text-asphalt-500">ИНН / КПП</dt><dd className="tabular">{company.legal.inn} / {company.legal.kpp}</dd>
            <dt className="text-asphalt-500">Юридический адрес</dt><dd>{company.legal.address}</dd>
          </dl>
        </Container>
      </Section>
    </Page>
  )
}
