# Таксимания — прототип редизайна: две концепции в одном проекте

Frontend-only прототип (без backend, API, авторизации). При открытии — экран выбора концепции,
дальше два разных сайта одного бренда на общей дизайн-системе «Сигнал на асфальте».

| Маршрут | Что это |
|---|---|
| `/` | Экран выбора концепции (100vh, две половины, hover расширяет сторону) |
| `/concept-1` | **Концепция 1 · Сайт кодом + статьи под SEO** — компактный продающий сайт: главная (одностраничная), `about`, `contact`, `blog`, `blog/:slug`, `documents` |
| `/concept-2` | **Концепция 2 · SEO-лайнер** — платформа: `cars`, `cars/:slug`, `tariffs`, `tariffs/:slug`, `rental-terms`, `offers`, `offers/:slug`, `about`, `reviews`, `faq`, `blog`, `blog/:slug`, `contact`, `compare`, `documents` |

Внутри обоих сайтов есть фиксированный переключатель «01 / 02» (только для презентации).

## Запуск

```bash
npm install
npm run dev
```

Сборка: `npm run build`, предпросмотр сборки: `npm run preview`.

## Стек

React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router 7 · lucide-react.
Шрифты: Sofia Sans / Condensed / Extra Condensed с Google Fonts (подключены в `index.html`).

## Структура

```
src/
  index.css            тема Tailwind из токенов + утилиты типографики (t-display-l, t-lead, plate …)
  tokens.css           токены дизайн-системы «Таксимания 2.0» (копия ../tokens.css)
  data/                вся фактура: cars, tariffs, calculator, company, reviews, faq, offers, articles
  ui/                  дизайн-система: Button, Form (Input/Select/Checkbox/ChipGroup/Slider), Tabs,
                       Accordion, Modal, Primitives (Section, SectionHeader, Stat, Price, Table, …), Cards
  shared/              LeadForm (fake submit), LeadContext (модалка заявки), Calculator, ArticleBody,
                       ConceptSwitcher, Page, DocumentsPage, NotFound
  selector/            экран выбора концепции
  concept1/            Layout + pages + sections концепции 01
  concept2/            Layout (мегаменю) + pages + sections концепции 02
public/img/            фото машин и сцен с текущего сайта, обложки блога, логотип
docs/                  бриф по дизайн-системе для разработки, инвентарь контента
```

Карточки, страницы машин, тарифов, статей и предложений генерируются из `src/data/*` —
добавление новой машины или статьи = одна запись в массиве.

## Формы и интерактив

Все формы работают в режиме fake submit: валидация → 650 мс загрузки → success-state
«Спасибо! Заявка принята. Менеджер свяжется с вами в ближайшее время». Данные никуда не отправляются.
Калькулятор использует формулу текущего сайта (дни × выручка за смену по часам × коэффициент тарифа)
и всегда показывает дисклеймер «Расчёт ориентировочный и не является гарантией дохода».

## Что подтверждено, а что заглушка

См. `docs/CONTENT_INVENTORY.md`. В интерфейсе заглушки помечены меткой «уточняется у парка».
