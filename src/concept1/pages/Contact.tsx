import type { ReactNode } from 'react'
import { Building2, Car, Footprints, Mail, Navigation, Phone, Send, type LucideIcon } from 'lucide-react'
import { Page } from '../../shared/Page'
import { useLead } from '../../shared/LeadContext'
import { LeadForm } from '../../shared/LeadForm'
import { Button } from '../../ui/Button'
import { Breadcrumbs, Container, MapPlaceholder, NeedsConfirm, Section, SectionHeader, Tag } from '../../ui/Primitives'
import { company } from '../../data/company'
import { phoneHref } from '../../lib/format'
import { C1 } from '../Layout'

export function C1Contact() {
  const { openLead } = useLead()
  const routes: { icon: LucideIcon; title: string; text: ReactNode }[] = [
    { icon: Footprints, title: 'Пешком', text: <>5 минут от метро и МЦК. Ближайшие станции: <NeedsConfirm /></> },
    { icon: Car, title: 'На автомобиле', text: <>Маршрут в Яндекс Картах по кнопке «Построить маршрут». Координаты: {company.coords.lat}, {company.coords.lng}.</> },
    { icon: Building2, title: 'Юридический адрес', text: `${company.legalName}, ${company.legal.address}` },
  ]

  return (
    <Page title="Контакты — Таксимания">
      <section className="pb-12 pt-6 md:pb-16 md:pt-10">
        <Container className="flex flex-col gap-8 md:gap-12">
          <Breadcrumbs items={[{ label: 'Главная', to: C1 }, { label: 'Контакты' }]} />
          <SectionHeader
            label="Контакты"
            title={<>Приезжайте <span className="plate">в парк</span></>}
            lead={`${company.address}, ${company.city}. ${company.addressNote}. Поддержка отвечает круглосуточно.`}
          />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="flex flex-col gap-6 lg:col-span-5">
              <div className="surface flex flex-col gap-5 p-6">
                <div>
                  <div className="t-caption text-asphalt-500">Отдел аренды</div>
                  <a href={phoneHref(company.phone)} className="t-display-s sm:t-display-m tabular text-asphalt-950 transition-colors duration-fast hover:text-signal-700">{company.phone}</a>
                </div>
                <div className="flex flex-wrap items-end gap-3">
                  <div>
                    <div className="t-caption text-asphalt-500">Поддержка водителей</div>
                    <a href={phoneHref(company.phoneSupport)} className="t-title-l tabular text-asphalt-950 transition-colors duration-fast hover:text-signal-700">{company.phoneSupport}</a>
                  </div>
                  <Tag tone="green" className="mb-1">24/7</Tag>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="ghost" size="s" href={`mailto:${company.email}`} icon={<Mail className="size-4" />}>{company.email}</Button>
                  <Button variant="ghost" size="s" href={company.telegram} target="_blank" rel="noreferrer" icon={<Send className="size-4" />}>Telegram</Button>
                </div>
              </div>

              <div className="surface flex flex-col gap-4 p-6">
                <div className="t-label text-signal-700">Режим работы</div>
                <dl className="flex flex-col gap-3">
                  <div>
                    <dt className="t-caption text-asphalt-500">Поддержка</dt>
                    <dd className="t-body">{company.hours.support}</dd>
                  </div>
                  <div>
                    <dt className="t-caption text-asphalt-500">Офис и выдача автомобилей</dt>
                    <dd className="flex flex-wrap items-center gap-2 t-body">{company.hours.office}{company.hours.officeNeedsConfirmation && <NeedsConfirm />}</dd>
                  </div>
                </dl>
              </div>

              <div className="surface flex flex-col gap-4 p-6">
                <div className="t-label text-signal-700">Адрес</div>
                <div className="t-title-l">{company.address}</div>
                <p className="t-body text-asphalt-600">{company.city} · {company.addressNote}</p>
                <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:flex-wrap">
                  <Button href={company.mapRoute} target="_blank" rel="noreferrer" icon={<Navigation className="size-4" />}>Построить маршрут</Button>
                  <Button variant="ghost" href={phoneHref(company.phone)} icon={<Phone className="size-4" />}>Позвонить</Button>
                  <Button variant="ghost" onClick={() => openLead({ title: 'Оставить заявку', withTariff: true })}>Оставить заявку</Button>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7">
              <MapPlaceholder className="aspect-square sm:aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[320px]" label={`${company.address} · ${company.addressNote}`} />
            </div>
          </div>
        </Container>
      </section>

      <Section tight className="bg-white">
        <Container className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <SectionHeader size="m" label="Как добраться" title="5 минут пешком от метро и МЦК" lead="Парк находится на Загородном шоссе. Если едете впервые — позвоните, менеджер подскажет вход." />
          </div>
          <ul className="flex flex-col divide-y divide-asphalt-200 border-y border-asphalt-200 lg:col-span-7">
            {routes.map((r) => (
              <li key={r.title} className="flex gap-4 py-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-1 bg-signal-50 text-signal-700"><r.icon className="size-5" strokeWidth={1.75} /></span>
                <div className="flex min-w-0 flex-col gap-1">
                  <div className="t-title-m">{r.title}</div>
                  <p className="flex flex-wrap items-center gap-1.5 t-body text-asphalt-600">{r.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="surface flex flex-col gap-6 p-6 md:p-8">
            <div>
              <h2 className="t-display-m">Не хотите звонить? Оставьте номер</h2>
              <p className="mt-2 t-body text-asphalt-600">Менеджер перезвонит, уточнит тариф и наличие машины.</p>
            </div>
            <LeadForm compact submitLabel="Оставить заявку" />
          </div>
        </Container>
      </Section>
    </Page>
  )
}
