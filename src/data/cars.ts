import type { TariffId } from './tariffs'

export type Fuel = 'petrol' | 'electric'
export type Body = 'sedan' | 'crossover'

export interface Car {
  slug: string
  brand: string
  model: string
  name: string
  tariff: TariffId
  priceFrom: number             // ₽/день — подтверждено текущим сайтом
  gearbox: 'АКПП' | 'Робот'
  engine: string                // объём двигателя, подтверждено
  fuel: Fuel
  consumption: string           // расход, подтверждено
  consumptionValue: number | null // л/100 км для сравнения
  body: Body
  bodyLabel: string
  yearNote: string
  images: { cover: string; gallery: string[]; interior?: string }
  benefit: string               // ключевой аргумент в карточке
  forDriver: { title: string; text: string }[]
  fitsIf: string[]
  popularity: number
  tags: string[]
  relatedArticles: string[]
}

const YEAR_NOTE = 'Не старше 3 лет'

export const cars: Car[] = [
  {
    slug: 'kia-rio', brand: 'Kia', model: 'Rio', name: 'Kia Rio', tariff: 'econom',
    priceFrom: 1300, gearbox: 'АКПП', engine: '1,6 л', fuel: 'petrol', consumption: '7,5 л / 100 км', consumptionValue: 7.5,
    body: 'sedan', bodyLabel: 'Седан', yearNote: YEAR_NOTE,
    images: { cover: '/img/cars/kia-rio-1.jpg', gallery: ['/img/cars/kia-rio-1.jpg', '/img/cars/kia-rio-2.jpg', '/img/cars/kia-rio-3.jpg', '/img/cars/kia-rio-4.jpg'], interior: '/img/cars/kia-rio-int.jpg' },
    benefit: 'Самая доступная аренда в парке',
    forDriver: [
      { title: 'Порог входа', text: 'Самый низкий ежедневный платёж в парке. В слабую неделю проще отбить аренду, чем на любой другой машине.' },
      { title: 'Плотность заказов', text: 'Эконом — самый загруженный тариф агрегаторов: коротких поездок много, простоя между ними мало.' },
      { title: 'Расход', text: '7,5 л на 100 км при двигателе 1,6 л. Экономика смены считается на пальцах.' },
      { title: 'Габариты', text: 'Компактный седан: удобно парковаться у подъездов и в плотном потоке центра.' },
    ],
    fitsIf: ['только начинаете работать в такси', 'хотите минимальную аренду и предсказуемый расход', 'планируете много коротких поездок по городу'],
    popularity: 10, tags: ['эконом', 'седан', 'бензин', 'самая низкая аренда'],
    relatedArticles: ['kak-vibrat-kia-dlya-taksi', 'ekonom-ili-komfort', 'kak-nachat-rabotat-v-taksi'],
  },
  {
    slug: 'kia-optima', brand: 'Kia', model: 'Optima', name: 'Kia Optima', tariff: 'comfort',
    priceFrom: 1800, gearbox: 'АКПП', engine: '2,0 л', fuel: 'petrol', consumption: '8,2 л / 100 км', consumptionValue: 8.2,
    body: 'sedan', bodyLabel: 'Седан', yearNote: YEAR_NOTE,
    images: { cover: '/img/cars/kia-optima-1.webp', gallery: ['/img/cars/kia-optima-1.webp', '/img/cars/kia-optima-2.jpg', '/img/cars/kia-optima-3.webp', '/img/cars/kia-optima-4.jpg'], interior: '/img/cars/kia-optima-int.webp' },
    benefit: 'Самый доступный вход в Комфорт',
    forDriver: [
      { title: 'Цена класса', text: 'Комфорт по цене, близкой к Эконому: 1 800 ₽/день против 1 300 ₽ у Rio при заметно более высоком чеке.' },
      { title: 'Салон', text: 'Полноразмерный седан: пассажирам на заднем ряду просторно, багажник берёт чемоданы для аэропортовых заказов.' },
      { title: 'Двигатель', text: '2,0 л — уверенный разгон на МКАД и трассе. Расход 8,2 л — плата за объём.' },
      { title: 'Отзывы', text: 'Водители парка отмечают Optima как машину, на которой возвращаются после других моделей.' },
    ],
    fitsIf: ['хотите перейти из Эконома в Комфорт без резкого роста аренды', 'работаете на длинных поездках', 'цените просторный седан'],
    popularity: 8, tags: ['комфорт', 'седан', 'бензин'],
    relatedArticles: ['kak-vibrat-kia-dlya-taksi', 'ekonom-ili-komfort'],
  },
  {
    slug: 'geely-coolray', brand: 'Geely', model: 'Coolray', name: 'Geely Coolray', tariff: 'comfort',
    priceFrom: 2000, gearbox: 'АКПП', engine: '1,5 л', fuel: 'petrol', consumption: '6,1 л / 100 км', consumptionValue: 6.1,
    body: 'crossover', bodyLabel: 'Кроссовер', yearNote: YEAR_NOTE,
    images: { cover: '/img/cars/geely-coolray-1.webp', gallery: ['/img/cars/geely-coolray-1.webp', '/img/cars/geely-coolray-2.webp', '/img/cars/geely-coolray-3.webp', '/img/cars/geely-coolray-4.jpg'], interior: '/img/cars/geely-coolray-int.jpg' },
    benefit: 'Самый экономичный бензиновый расход',
    forDriver: [
      { title: 'Расход', text: '6,1 л на 100 км — самый низкий среди бензиновых машин парка. На длинной смене это ощутимая разница в топливе.' },
      { title: 'Посадка', text: 'Кроссовер: высокая посадка, хороший обзор, проще держать спину в 10–12-часовой смене.' },
      { title: 'Свежесть', text: 'Современный кроссовер с мультимедиа и камерой: пассажиры Комфорта ставят такие машины выше.' },
      { title: 'Тариф', text: 'Комфорт: чек выше Эконома при аренде 2 000 ₽/день.' },
    ],
    fitsIf: ['хотите тратить меньше на топливо', 'предпочитаете высокую посадку кроссовера', 'работаете в Комфорте на длинных сменах'],
    popularity: 9, tags: ['комфорт', 'кроссовер', 'бензин', 'низкий расход'],
    relatedArticles: ['kak-vibrat-avto-dlya-taksi', 'ekonom-ili-komfort', 'top-5-modelei'],
  },
  {
    slug: 'evolute-i-pro', brand: 'Evolute', model: 'i-Pro', name: 'Evolute i-Pro', tariff: 'comfort',
    priceFrom: 2000, gearbox: 'АКПП', engine: 'Электро', fuel: 'electric', consumption: '350 км на одном заряде', consumptionValue: null,
    body: 'sedan', bodyLabel: 'Седан', yearNote: YEAR_NOTE,
    images: { cover: '/img/cars/evolute-i-pro-1.webp', gallery: ['/img/cars/evolute-i-pro-1.webp', '/img/cars/evolute-i-pro-2.jpg', '/img/cars/evolute-i-pro-3.webp', '/img/cars/evolute-i-pro-4.jpg'], interior: '/img/cars/evolute-i-pro-int.webp' },
    benefit: 'Электромобиль: заряд вместо бензина',
    forDriver: [
      { title: 'Топливо', text: 'Стоимость зарядки ниже стоимости бензина на тот же пробег. Экономия зависит от того, где и когда заряжаетесь.' },
      { title: 'Запас хода', text: '350 км на одном заряде: обычная городская смена без промежуточной зарядки, но маршрут смены стоит планировать.' },
      { title: 'Тишина', text: 'Электромотор: без вибраций и шума двигателя, что заметно на 10-часовой смене и нравится пассажирам.' },
      { title: 'Тариф', text: 'Комфорт при аренде 2 000 ₽/день, как у Coolray.' },
    ],
    fitsIf: ['хотите снизить расходы на топливо', 'готовы планировать смену вокруг зарядки', 'работаете в Комфорте в пределах города'],
    popularity: 6, tags: ['комфорт', 'электро', 'седан'],
    relatedArticles: ['elektromobili-v-taksi', 'kak-vibrat-avto-dlya-taksi'],
  },
  {
    slug: 'kia-k5', brand: 'Kia', model: 'K5', name: 'Kia K5', tariff: 'comfort-plus',
    priceFrom: 2900, gearbox: 'АКПП', engine: '2,0 л', fuel: 'petrol', consumption: '9,2 л / 100 км', consumptionValue: 9.2,
    body: 'sedan', bodyLabel: 'Седан', yearNote: YEAR_NOTE,
    images: { cover: '/img/cars/kia-k5-1.jpg', gallery: ['/img/cars/kia-k5-1.jpg', '/img/cars/kia-k5-2.jpg', '/img/cars/kia-k5-3.webp'], interior: '/img/cars/kia-k5-int.webp' },
    benefit: 'Эталонный седан Комфорт+',
    forDriver: [
      { title: 'Класс', text: 'K5 — одна из самых узнаваемых машин Комфорт+: пассажиры её знают, агрегаторы принимают без вопросов.' },
      { title: 'Салон', text: 'Длинная база, просторный задний ряд, большой багажник. Аэропорт и вокзалы — её работа.' },
      { title: 'Двигатель', text: '2,0 л и АКПП: спокойный разгон с полной загрузкой. Расход 9,2 л — самый высокий в классе, это надо считать.' },
      { title: 'Аренда', text: '2 900 ₽/день против 2 400–2 500 ₽ у Bestune и Shine Max. Переплата за имя и салон.' },
    ],
    fitsIf: ['работаете в Комфорт+ и хотите узнаваемую машину', 'много ездите в аэропорты с багажом', 'готовы платить больше аренды ради салона'],
    popularity: 9, tags: ['комфорт+', 'седан', 'бензин'],
    relatedArticles: ['kia-k5-ili-dongfeng-shine-max', 'kak-vibrat-mashinu-dlya-komfort-plus', 'kak-vibrat-kia-dlya-taksi'],
  },
  {
    slug: 'dongfeng-shine-max', brand: 'Dongfeng', model: 'Shine Max', name: 'Dongfeng Shine Max', tariff: 'comfort-plus',
    priceFrom: 2500, gearbox: 'АКПП', engine: '1,5 л', fuel: 'petrol', consumption: '6,2 л / 100 км', consumptionValue: 6.2,
    body: 'sedan', bodyLabel: 'Седан', yearNote: YEAR_NOTE,
    images: { cover: '/img/cars/dongfeng-shine-max-1.jpg', gallery: ['/img/cars/dongfeng-shine-max-1.jpg', '/img/cars/dongfeng-shine-max-2.jpg'], interior: '/img/cars/dongfeng-shine-max-int.webp' },
    benefit: 'Комфорт+ с расходом 6,2 л',
    forDriver: [
      { title: 'Экономика', text: 'Самый низкий расход в Комфорт+: 6,2 л против 9,2 л у K5. На 300 км смены это ощутимая разница в топливе.' },
      { title: 'Аренда', text: '2 500 ₽/день — на 400 ₽ дешевле K5 при том же тарифе.' },
      { title: 'Салон', text: 'Просторный седан с современным интерьером. Водители парка выделяют его как машину «сел и поехал».' },
      { title: 'Отзывы', text: 'В отзывах его советуют кураторы парка для Комфорт+: без проблем в эксплуатации.' },
    ],
    fitsIf: ['хотите Комфорт+ с минимальными расходами на топливо', 'считаете экономику смены, а не только чек', 'предпочитаете свежую современную машину'],
    popularity: 8, tags: ['комфорт+', 'седан', 'бензин', 'низкий расход'],
    relatedArticles: ['kia-k5-ili-dongfeng-shine-max', 'kak-vibrat-mashinu-dlya-komfort-plus'],
  },
  {
    slug: 'faw-bestune-b70', brand: 'FAW', model: 'Bestune B70', name: 'FAW Bestune B70', tariff: 'comfort-plus',
    priceFrom: 2400, gearbox: 'АКПП', engine: '1,5 л', fuel: 'petrol', consumption: '9,5 л / 100 км', consumptionValue: 9.5,
    body: 'sedan', bodyLabel: 'Седан', yearNote: YEAR_NOTE,
    images: { cover: '/img/cars/faw-bestune-b70-1.webp', gallery: ['/img/cars/faw-bestune-b70-1.webp', '/img/cars/faw-bestune-b70-2.webp', '/img/cars/faw-bestune-b70-3.webp'], interior: '/img/cars/faw-bestune-b70-int.webp' },
    benefit: 'Самая доступная аренда в Комфорт+',
    forDriver: [
      { title: 'Аренда', text: '2 400 ₽/день — самый низкий платёж в Комфорт+. Дешевле K5 на 500 ₽ каждый день.' },
      { title: 'Внешность', text: 'Фастбэк с выразительным дизайном: пассажиры Комфорт+ обращают внимание на машину.' },
      { title: 'Расход', text: '9,5 л на 100 км — выше, чем у Shine Max. Экономия на аренде частично уходит в топливо.' },
      { title: 'Комфорт', text: 'Мягкая подвеска и тихий салон на длинных заказах.' },
    ],
    fitsIf: ['хотите войти в Комфорт+ с минимальной арендой', 'ездите в основном по городу с короткими простоями', 'цените внешний вид машины'],
    popularity: 7, tags: ['комфорт+', 'седан', 'бензин'],
    relatedArticles: ['kak-vibrat-mashinu-dlya-komfort-plus', 'kia-k5-ili-dongfeng-shine-max'],
  },
  {
    slug: 'chery-tiggo-7-pro', brand: 'Chery', model: 'Tiggo 7 Pro', name: 'Chery Tiggo 7 Pro', tariff: 'comfort-plus',
    priceFrom: 2400, gearbox: 'Робот', engine: '2,0 л', fuel: 'petrol', consumption: '8,2 л / 100 км', consumptionValue: 8.2,
    body: 'crossover', bodyLabel: 'Кроссовер', yearNote: YEAR_NOTE,
    images: { cover: '/img/cars/chery-tiggo-7-pro-1.webp', gallery: ['/img/cars/chery-tiggo-7-pro-1.webp', '/img/cars/chery-tiggo-7-pro-2.jpg', '/img/cars/chery-tiggo-7-pro-3.webp', '/img/cars/chery-tiggo-7-pro-4.webp'], interior: '/img/cars/chery-tiggo-7-pro-int.webp' },
    benefit: 'Кроссовер Комфорт+ по цене седана',
    forDriver: [
      { title: 'Аренда', text: '2 400 ₽/день, как у Bestune B70, но с высокой посадкой кроссовера.' },
      { title: 'Отзывы', text: 'Самая упоминаемая машина в отзывах парка: «свежая и приятная», «проблемы решаются оперативно».' },
      { title: 'Салон', text: 'Просторный задний ряд, большой багажник, панорамная обзорность.' },
      { title: 'Коробка', text: 'Роботизированная коробка: плавнее в потоке, но требует спокойного стиля вождения.' },
    ],
    fitsIf: ['хотите кроссовер в Комфорт+', 'много работаете зимой и цените клиренс', 'ориентируетесь на отзывы других водителей парка'],
    popularity: 9, tags: ['комфорт+', 'кроссовер', 'бензин'],
    relatedArticles: ['kak-vibrat-mashinu-dlya-komfort-plus', 'top-5-modelei'],
  },
  {
    slug: 'chery-tiggo-8-pro-max', brand: 'Chery', model: 'Tiggo 8 Pro Max', name: 'Chery Tiggo 8 Pro Max', tariff: 'comfort-plus',
    priceFrom: 4500, gearbox: 'Робот', engine: '2,0 л', fuel: 'petrol', consumption: '7,3 л / 100 км', consumptionValue: 7.3,
    body: 'crossover', bodyLabel: 'Кроссовер', yearNote: YEAR_NOTE,
    images: { cover: '/img/cars/chery-tiggo-8-pro-max-1.jpg', gallery: ['/img/cars/chery-tiggo-8-pro-max-1.jpg', '/img/cars/chery-tiggo-8-pro-max-2.jpg', '/img/cars/chery-tiggo-8-pro-max-3.jpg', '/img/cars/chery-tiggo-8-pro-max-4.jpg'], interior: '/img/cars/chery-tiggo-8-pro-max-int.jpg' },
    benefit: 'Большой кроссовер для семейных и аэропортовых заказов',
    forDriver: [
      { title: 'Пространство', text: 'Самый большой автомобиль в парке: просторный салон и багажник под несколько чемоданов.' },
      { title: 'Аренда', text: '4 500 ₽/день — самая высокая в парке. Подходит тем, у кого уже есть стабильная база длинных заказов.' },
      { title: 'Расход', text: '7,3 л при 2,0 л — умеренно для машины такого размера.' },
      { title: 'Комфорт', text: 'Премиальный салон: тише и мягче остальных машин Комфорт+.' },
    ],
    fitsIf: ['работаете на длинных и аэропортовых заказах', 'хотите максимум пространства и комфорта в Комфорт+', 'уверены в загрузке при высокой аренде'],
    popularity: 5, tags: ['комфорт+', 'кроссовер', 'бензин', 'большой салон'],
    relatedArticles: ['kak-vibrat-mashinu-dlya-komfort-plus', 'top-5-modelei'],
  },
  {
    slug: 'hongqi-h5', brand: 'Hongqi', model: 'H5', name: 'Hongqi H5', tariff: 'business',
    priceFrom: 3500, gearbox: 'АКПП', engine: '2,0 л', fuel: 'petrol', consumption: '6,8 л / 100 км', consumptionValue: 6.8,
    body: 'sedan', bodyLabel: 'Седан', yearNote: YEAR_NOTE,
    images: { cover: '/img/cars/hongqi-h5-1.webp', gallery: ['/img/cars/hongqi-h5-1.webp', '/img/cars/hongqi-h5-2.webp', '/img/cars/hongqi-h5-3.webp'] },
    benefit: 'Единственный Бизнес в парке',
    forDriver: [
      { title: 'Чек', text: 'Бизнес — самый высокий чек агрегаторов. Заказов меньше, каждая поездка дороже.' },
      { title: 'Внешность', text: 'Представительский чёрный седан: пассажиры Бизнеса ожидают именно такой уровень.' },
      { title: 'Расход', text: '6,8 л при 2,0 л — экономичнее большинства машин Комфорт+.' },
      { title: 'Требования', text: 'Бизнес строже к внешнему виду водителя и стилю вождения. Подходит тем, кто уже работал в Комфорт+.' },
    ],
    fitsIf: ['имеете опыт в Комфорт+ и хотите расти', 'работаете с корпоративными и аэропортовыми заказами', 'готовы к высокой аренде ради высокого чека'],
    popularity: 6, tags: ['бизнес', 'седан', 'бензин'],
    relatedArticles: ['kak-vibrat-avto-dlya-taksi', 'skolko-mozhno-zarabotat'],
  },
]

export const carBySlug = (slug: string) => cars.find((c) => c.slug === slug)
export const carsByTariff = (t: TariffId) => cars.filter((c) => c.tariff === t)
export const electricCars = () => cars.filter((c) => c.fuel === 'electric')
export const minPriceForTariff = (t: TariffId) => Math.min(...carsByTariff(t).map((c) => c.priceFrom))
export const brands = Array.from(new Set(cars.map((c) => c.brand))).sort()
export const relatedCars = (car: Car, n = 3) =>
  cars.filter((c) => c.slug !== car.slug && c.tariff === car.tariff).slice(0, n).length >= 2
    ? cars.filter((c) => c.slug !== car.slug && c.tariff === car.tariff).slice(0, n)
    : cars.filter((c) => c.slug !== car.slug).sort((a, b) => Math.abs(a.priceFrom - car.priceFrom) - Math.abs(b.priceFrom - car.priceFrom)).slice(0, n)

export const fuelLabel = (f: Fuel) => (f === 'electric' ? 'Электро' : 'Бензин')

export type PickerPriority = 'cheap' | 'balance' | 'check' | 'comfort' | 'electric'
export const pickerPriorities: { id: PickerPriority; label: string; hint: string }[] = [
  { id: 'cheap', label: 'Минимальная аренда', hint: 'самый низкий ежедневный платёж' },
  { id: 'balance', label: 'Баланс аренды и заработка', hint: 'умеренная аренда, хороший чек' },
  { id: 'check', label: 'Высокий средний чек', hint: 'готов платить больше аренды' },
  { id: 'comfort', label: 'Комфорт в смене', hint: 'просторный салон, высокая посадка' },
  { id: 'electric', label: 'Электромобиль', hint: 'зарядка вместо бензина' },
]

/** Mock-подбор: 2–3 машины под тариф и приоритет */
export function pickCars(tariff: TariffId | 'any', priority: PickerPriority): Car[] {
  let pool = tariff === 'any' ? [...cars] : carsByTariff(tariff)
  if (priority === 'electric') {
    const el = electricCars()
    return el.length ? el.concat(pool.filter((c) => c.fuel !== 'electric').sort((a, b) => a.priceFrom - b.priceFrom).slice(0, 2)) : pool.slice(0, 3)
  }
  if (pool.length === 0) pool = [...cars]
  switch (priority) {
    case 'cheap':
      return pool.sort((a, b) => a.priceFrom - b.priceFrom).slice(0, 3)
    case 'check':
      return pool.sort((a, b) => b.priceFrom - a.priceFrom).slice(0, 3)
    case 'comfort':
      return pool.sort((a, b) => (b.body === 'crossover' ? 1 : 0) - (a.body === 'crossover' ? 1 : 0) || b.priceFrom - a.priceFrom).slice(0, 3)
    case 'balance':
    default:
      return pool.sort((a, b) => (a.consumptionValue ?? 5) * 100 + a.priceFrom / 10 - ((b.consumptionValue ?? 5) * 100 + b.priceFrom / 10)).slice(0, 3)
  }
}
