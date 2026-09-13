export const formatNumber = (n: number) =>
  new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(Math.round(n))

export const formatPrice = (n: number) => `${formatNumber(n)} ₽`

export const priceFrom = (n: number) => `от ${formatNumber(n)} ₽/день`

export function plural(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few
  return many
}

export const pluralWith = (n: number, one: string, few: string, many: string) =>
  `${n} ${plural(n, one, few, many)}`

export function formatDate(iso: string) {
  const d = new Date(iso)
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(d)
}

export function readingTime(words: number) {
  const min = Math.max(2, Math.round(words / 180))
  return `${min} мин`
}

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export const phoneHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`
