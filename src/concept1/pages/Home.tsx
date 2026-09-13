import { Page } from '../../shared/Page'
import { Hero } from '../sections/Hero'
import { CarSelector } from '../sections/CarSelector'
import { Picker } from '../sections/Picker'
import { Economics } from '../sections/Economics'
import { Why } from '../sections/Why'
import { System } from '../sections/System'
import { Steps } from '../sections/Steps'
import { Terms } from '../sections/Terms'
import { Reviews } from '../sections/Reviews'
import { Trust } from '../sections/Trust'
import { FaqSection } from '../sections/Faq'
import { BlogTeaser } from '../sections/BlogTeaser'
import { FinalCta } from '../sections/FinalCta'

/** Концепция 1 — Сайт кодом + статьи под SEO: одна страница, ритм лендинга */
export function C1Home() {
  return (
    <Page title="Аренда авто под такси в Москве — Таксимания">
      <Hero />
      <CarSelector />
      <Picker />
      <Economics />
      <Why />
      <System />
      <Steps />
      <Terms />
      <Reviews />
      <Trust />
      <BlogTeaser />
      <FaqSection />
      <FinalCta />
    </Page>
  )
}
