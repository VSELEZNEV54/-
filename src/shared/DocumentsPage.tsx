import { Page } from './Page'
import { Breadcrumbs, Container, Section, SectionHeader, NeedsConfirm } from '../ui/Primitives'
import { company, legalPages } from '../data/company'

/** Юридические страницы: заглушка со структурой, тексты берутся с текущего сайта при переносе */
export function DocumentsPage({ base, homeLabel = 'Главная' }: { base: string; homeLabel?: string }) {
  return (
    <Page title="Документы — Таксимания">
      <Section tight>
        <Container className="flex flex-col gap-8">
          <Breadcrumbs items={[{ label: homeLabel, to: base }, { label: 'Документы' }]} />
          <SectionHeader label="Юридическая информация" title="Документы" lead="Реквизиты и политики компании. Тексты политик переносятся с текущего сайта без изменений." />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
            <nav className="flex flex-col gap-1 lg:sticky lg:top-24 lg:self-start" aria-label="Документы">
              {legalPages.map((p) => <a key={p.slug} href={`#${p.slug}`} className="rounded-1 px-3 py-2 t-small hover:bg-white transition-colors duration-fast">{p.title}</a>)}
            </nav>
            <div className="flex flex-col gap-6">
              <article id="requisites" className="surface p-6 scroll-mt-24">
                <h2 className="t-title-l mb-4">Реквизиты</h2>
                <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-[180px_1fr] t-small">
                  <dt className="text-asphalt-500">Наименование</dt><dd>{company.legalName}</dd>
                  <dt className="text-asphalt-500">ОГРН</dt><dd className="tabular">{company.legal.ogrn}</dd>
                  <dt className="text-asphalt-500">ИНН</dt><dd className="tabular">{company.legal.inn}</dd>
                  <dt className="text-asphalt-500">КПП</dt><dd className="tabular">{company.legal.kpp}</dd>
                  <dt className="text-asphalt-500">Юридический адрес</dt><dd>{company.legal.address}</dd>
                  <dt className="text-asphalt-500">Парк</dt><dd>{company.address}, {company.city}</dd>
                  <dt className="text-asphalt-500">Телефон</dt><dd>{company.phone}</dd>
                  <dt className="text-asphalt-500">Почта</dt><dd>{company.email}</dd>
                </dl>
              </article>
              {legalPages.filter((p) => p.slug !== 'requisites').map((p) => (
                <article key={p.slug} id={p.slug} className="surface p-6 scroll-mt-24">
                  <div className="flex flex-wrap items-center gap-3 mb-3"><h2 className="t-title-l">{p.title}</h2><NeedsConfirm /></div>
                  <p className="t-body text-asphalt-600">Текст документа переносится с текущего сайта таксимания.рф ({company.siteUrl}/{p.slug}). В прототипе показана только структура страницы: заголовок, дата редакции, оглавление и разделы.</p>
                  <ol className="mt-4 grid gap-1 t-small text-asphalt-500 sm:grid-cols-2">
                    {['Общие положения', 'Термины и определения', 'Права и обязанности сторон', 'Порядок обработки', 'Ответственность', 'Заключительные положения'].map((s, i) => <li key={s}>{i + 1}. {s}</li>)}
                  </ol>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </Page>
  )
}
