import type { TariffId } from './tariffs'
import { tariffById } from './tariffs'

/**
 * Формула с текущего сайта таксимания.рф:
 * выручка в неделю = дни × сумма за смену (по часам) × коэффициент тарифа.
 * Ставки ниже — ориентировочные и требуют подтверждения парком.
 */
export const HOURS_OPTIONS = [6, 7, 8, 9, 10, 11, 12] as const
export const DAYS_OPTIONS = [1, 2, 3, 4, 5, 6, 7] as const

export const DAILY_REVENUE_ECONOM: Record<number, number> = {
  6: 5000, 7: 5800, 8: 6600, 9: 7400, 10: 8200, 11: 9100, 12: 10000,
}

export function dailyRevenue(tariff: TariffId, hours: number) {
  const base = DAILY_REVENUE_ECONOM[hours] ?? DAILY_REVENUE_ECONOM[10]
  return Math.round(base * tariffById(tariff).multiplier)
}

export interface EstimateInput {
  tariff: TariffId
  days: number
  hours: number
  rentPerDay: number
  revenuePerDay?: number  // если водитель ввёл свою оценку
}

export interface Estimate {
  revenuePerDay: number
  revenueWeek: number
  rentWeek: number
  netWeek: number
  revenueMonth: number
  rentMonth: number
  netMonth: number
}

export function estimate(i: EstimateInput): Estimate {
  const revenuePerDay = i.revenuePerDay ?? dailyRevenue(i.tariff, i.hours)
  const revenueWeek = revenuePerDay * i.days
  const rentWeek = i.rentPerDay * i.days
  const netWeek = revenueWeek - rentWeek
  const WEEKS = 4
  return {
    revenuePerDay,
    revenueWeek, rentWeek, netWeek,
    revenueMonth: revenueWeek * WEEKS, rentMonth: rentWeek * WEEKS, netMonth: netWeek * WEEKS,
  }
}

export const DISCLAIMER = 'Расчёт ориентировочный и не является гарантией дохода. Выручка зависит от загрузки, района, времени работы и рейтинга водителя.'
