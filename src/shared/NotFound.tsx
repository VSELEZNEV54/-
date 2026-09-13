import { Page } from './Page'
import { Button } from '../ui/Button'
import { Container, Section } from '../ui/Primitives'

export function NotFound({ base = '/' }: { base?: string }) {
  return (
    <Page title="Страница не найдена — Таксимания">
      <Section>
        <Container className="flex flex-col items-start gap-6">
          <span className="t-number-xl text-asphalt-200">404</span>
          <h1 className="t-display-l">Такой страницы нет</h1>
          <p className="t-lead text-asphalt-600 max-w-xl">Возможно, ссылка устарела. Вернитесь на главную или выберите автомобиль.</p>
          <div className="flex gap-3"><Button to={base} size="l">На главную</Button><Button to="/" variant="ghost" size="l">К выбору концепции</Button></div>
        </Container>
      </Section>
    </Page>
  )
}
