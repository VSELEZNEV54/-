# Бриф для разработки страниц прототипа «Таксимания» (обе концепции)

Проект: Vite + React 19 + TypeScript + Tailwind v4 + React Router 7 + lucide-react.
Корень: `prototype/`. Dev-сервер уже запущен на http://localhost:5173 (не запускайте второй).
Проверка: `npx tsc -b` (ошибок быть не должно) и `npx vite build`.

## 0. Что уже есть (НЕ переписывать, только использовать)
- `src/index.css` — тема и утилиты типографики (см. §2).
- `src/data/*.ts` — вся фактура: `cars.ts`, `tariffs.ts`, `calculator.ts`, `company.ts`, `reviews.ts`, `faq.ts`, `offers.ts`, `articles.ts`. Читайте их целиком: там типы, хелперы и тексты.
- `src/ui/*.tsx` — UI-кит (см. §3). `src/shared/*.tsx` — LeadForm, LeadContext, Calculator, ArticleBody, Page, ConceptSwitcher, DocumentsPage, NotFound.
- `src/concept1/Layout.tsx` (экспорт `C1 = '/concept-1'`), `src/concept2/Layout.tsx` (экспорт `C2` и объект путей `c2`; поиска по сайту в прототипе нет).
- `src/App.tsx` — роутер. Имена экспортов страниц зафиксированы (`C1Home`, `C2CarPage` и т. д.) — не меняйте.
- Фото: `/public/img/cars/*` (в данных `car.images`), `/public/img/scenes/{hero-duo.jpg, parking-orange.jpg, parking-portrait.jpg, parking-tiggo7.jpg, manager-ok.webp, street-tiggo7.webp}`, `/public/img/blog/*` (в `articles`), `/public/img/logo/logo-mark.png`.
Если очень нужен новый общий компонент — создавайте его в папке своей концепции (`src/concept1/...` или `src/concept2/...`), а не в `ui/`.

## 1. Дизайн-система «Сигнал на асфальте» (обязательно)
- **Цвет.** Фон страницы бетон `bg-asphalt-50`, карточки белые `bg-white` с линией `border-asphalt-200`, «денежные» блоки (тарифы, калькулятор, заявка, цены) — асфальт `bg-asphalt-900`/`asphalt-950` с текстом `asphalt-50`. Оранжевый `signal-500` ТОЛЬКО для главного действия, плашки-сигнала и линии маршрута. **Одна оранжевая кнопка на экран/секцию.** Текст на оранжевом всегда тёмный `asphalt-950`. Оранжевый текст на светлом — `text-signal-700`, на тёмном — `text-signal-400`.
- **Шрифт.** Sofia Sans. Заголовки — Extra Condensed капсом через утилиты `t-display-xl` (только hero), `t-display-l` (заголовок раздела), `t-display-m` (подзаголовок) — обычный регистр, без капса, `t-display-s`. Цифры/цены — `t-number-xl`, `t-number-l` (tabular). Текст — `t-lead`, `t-body`, `t-small`, `t-caption`, метки капсом — `t-label`, `t-label-l`. Кнопки — `t-btn`.
- **Форма.** Прямые углы: `rounded-0` плашки/метки, `rounded-1` (4px) кнопки/поля/чипы, `rounded-2` (8px) карточки/панели/фото. Никаких `rounded-xl`, `rounded-full` (кроме точки статуса). Глубина — линиями (`border-asphalt-200`), тени только `shadow-pop` (модалка/дропдаун) и `shadow-bar`.
- **Плашка-сигнал.** Акцентное слово в заголовке — `<span className="plate">слово</span>` (оранжевая подложка, тёмный текст). На тёмном фоне можно `plate-light`. Не красить слова в оранжевый текст внутри display-заголовков.
- **Фото.** Только внутри `rounded-2` контейнера с `object-cover`, чаще 4:3 или 3:2. Текст поверх фото только через `scrim-photo`. Никаких оранжевых плашек поверх фото, кроме тега тарифа.
- **Единственная мягкая линия** — маршрут `<RouteLine />` (декор, редко).
- **Моушн.** `Reveal` для появления секций/карточек, hover через `transition-colors duration-fast`, раскрытия `duration-base`. Никаких тяжёлых эффектов, параллаксов, бликов, стекла, градиентов (кроме scrim на фото и тёмных подложек).
- **Сетка.** `<Container>` (1280 + поля `--margin`), секции `<Section>` (`section-y`), внутри группы `gap-8 md:gap-12`. Карточки в `grid gap-4 md:gap-6`.
- **Не делать:** жёлто-чёрную такси-эстетику, шашечки, неон, glassmorphism, одинаковые карточки с иконками (6 маленьких иконок в ряд), dashboard-вид, generic AI-landing.

## 2. Утилиты из index.css
`container-page`, `section-y`, `section-y-sm`, `plate`, `plate-dark`, `plate-light`, `hairline`, `surface` (белая карточка с линией и r-2), `surface-inverse`, `scrim-photo`, `no-scrollbar`, `tabular`, `ease-out-brand`, `duration-fast|base|slow`, `animate-fade-up`, `animate-fade-in`, `prose-tm` (типографика статьи), `range-input`. Класс `on-dark` на тёмных секциях (фокус-кольцо). Tailwind-цвета: `asphalt-0…950`, `signal-50…900`, `green-600/50`, `red-600/50`, `blue-600/50`, `amber-600/50`, `partner-yandex`. Шрифты: `font-text`, `font-label`, `font-display`.

## 3. Компоненты (импорт из `../../ui/...` и `../../shared/...`)
- `Button` — `variant: 'primary'|'secondary'|'ghost'|'ghost-inverse'|'icon'|'link'`, `size: 'l'|'m'|'s'`, `full`, `loading`, `icon`, `iconRight`, `to` (Link) или `href` или `onClick`.
- `Input`, `Select`, `Checkbox`, `ChipGroup<T>({label, options:[{value,label,hint?}], value, onChange, inverse, columns?})`, `Slider({label,value,min,max,step?,onChange,format?,inverse})`.
- `Tabs<T>({items:[{id,label,count?}], value, onChange, inverse?, size?:'m'|'l'})` — на мобильном горизонтальный скролл.
- `Accordion({items:[{id,title,content,meta?}], inverse?, defaultOpen?, single?})`.
- `Modal({open,onClose,title?,children,inverse?,size?})`.
- Primitives: `Container`, `Section({inverse?, tight?, id?})`, `SectionHeader({label?, title, lead?, inverse?, align?, size?:'l'|'m', action?})`, `Reveal({delay?})`, `Plate({tone})`, `Tag({tone:'neutral'|'signal'|'dark'|'inverse'|'green'|'amber'})`, `Kicker`, `NeedsConfirm` (пометка «уточняется у парка» для заглушек), `Stat({value,unit?,label,inverse?,size?})`, `Price({value,size:'s'|'m'|'l'|'xl',inverse?,prefix?,suffix?})`, `Stars`, `Avatar`, `Breadcrumbs({items:[{label,to?}]})`, `Callout({title?,tone:'signal'|'info'|'dark'|'amber'})`, `Table({head,rows,caption?,highlightCol?})`, `Logo`, `RouteLine`, `MapPlaceholder`.
- Cards: `CarCard({car,to?,onLead?,variant:'landing'|'catalog'|'compact',showSpecs?})`, `ArticleCard({article,to,variant:'default'|'featured'|'row',categoryLabel?})`, `ReviewCard({review,inverse?,carTo?,compact?})`, `FeatureCard({label,title,text,fact?,image?,icon?,inverse?,size?})`, `OfferCard({offer,to,variant:'default'|'wide'})`.
- Shared: `useLead().openLead({title?,text?,context?,tariff?,withTariff?,submitLabel?})` — открывает модалку заявки (fake submit уже внутри). `LeadForm({inverse?,submitLabel?,withTariff?,defaultTariff?,context?,compact?,legalVariant?})` — инлайн-форма. `Calculator({variant:'full'|'car'|'compact', car?, inverse?, defaultTariff?, onLead?, carLink?})`. `ArticleBody({blocks, resolve})` где `resolve(kind, slug)` → путь; kinds: `car|tariff|article|calc|terms|cars|offers|faq`. `Page({title})` — обёртка каждой страницы (title вкладки + скролл наверх + fade).

## 4. Данные (src/data)
- `cars`, `carBySlug`, `carsByTariff`, `electricCars`, `minPriceForTariff`, `brands`, `relatedCars(car,n)`, `fuelLabel`, `pickerPriorities`, `pickCars(tariff|'any', priority)`.
- `tariffs`, `tariffById`, `tariffName`, тип `TariffId`.
- `estimate`, `dailyRevenue`, `DISCLAIMER`, `HOURS_OPTIONS`, `DAYS_OPTIONS`.
- `company`, `stats`, `heroStats`, `values` (5 карточек «Почему»), `systemParts` (Автомобиль + Оформление + …), `steps` (4 шага), `requirements`, `documents`, `perks`, `legalPages`.
- `reviews`, `featuredReviews`, `reviewsByCar`, `reviewsByTag`, `reviewsForTariff`, `overallRating`, `reviewTagLabels`.
- `faq`, `faqByGroup`, `faqGroups`, `faqGroupLabels`, `objections` (для блока возражений), `carFaq`. У элементов с `needsConfirmation` показывайте `<NeedsConfirm />` рядом с ответом.
- `offers`, `offerBySlug`.
- `articles`, `articleBySlug`, `articlesByCategory`, `articlesForCar`, `articlesForTariff`, `articleWords`, `relatedArticles`, `categoryLabels`, `c1Categories`, `c2Categories`, `c2CategoryOf`.

## 5. Копирайтинг
Конкретно, коротко, цифры. Никаких «динамично развивающаяся компания», «индивидуальный подход», «высокое качество». Не выдумывать коммерческие условия и факты: всё из `data/`. Если чего-то нет — нейтральная формулировка + `<NeedsConfirm />`. Lorem ipsum запрещён. CTA разные по контексту: «Выбрать автомобиль», «Подобрать автомобиль», «Рассчитать заработок», «Узнать наличие», «Сравнить автомобили», «Получить условия», «Оставить заявку», «Позвонить».

## 6. Адаптив
Mobile-first, проверять 390 и 1440. Снизу на мобильном есть фиксированная панель (72px) — футер уже учитывает. Шапка sticky 64/72px: якорные секции — `scroll-mt-20`, sticky-панели — `top-24`. Горизонтальные ленты на мобильном: `-mx-[var(--margin)] px-[var(--margin)] overflow-x-auto no-scrollbar flex gap-4 snap-x` с карточками `min-w-[80%] snap-start`.

## 7. Проверка своей работы
1. `npx tsc -b` без ошибок. 2. Можно открыть страницы в браузере (инструмент браузера): создайте СВОЮ вкладку через `tabs_create` и всегда передавайте её `tabId`; чужие вкладки не закрывать. 3. Проверьте все ссылки внутри своих страниц на реальные маршруты. 4. В отчёте перечислите файлы и что осталось нерешённым.
