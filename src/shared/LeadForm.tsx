import { useState, type FormEvent } from 'react'
import { CheckCircle2, Phone } from 'lucide-react'
import { Button } from '../ui/Button'
import { Checkbox, Input, Select } from '../ui/Form'
import { tariffs, type TariffId } from '../data/tariffs'
import { company } from '../data/company'
import { cn, phoneHref } from '../lib/format'

export interface LeadFormProps {
  inverse?: boolean
  submitLabel?: string
  withTariff?: boolean
  defaultTariff?: TariffId | ''
  context?: string          // например «Kia K5»
  compact?: boolean         // одна строка на десктопе
  className?: string
  successTitle?: string
  successText?: string
  onSuccess?: () => void
  legalVariant?: 'short' | 'full'
}

/** Форма заявки с fake submit: 500–800 ms loading → success state. Ничего никуда не отправляет. */
export function LeadForm({
  inverse, submitLabel = 'Оставить заявку', withTariff, defaultTariff = '', context, compact, className,
  successTitle = 'Спасибо! Заявка принята.', successText = 'Менеджер свяжется с вами в ближайшее время.', onSuccess, legalVariant = 'short',
}: LeadFormProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [tariff, setTariff] = useState<TariffId | ''>(defaultTariff)
  const [agree, setAgree] = useState(true)
  const [state, setState] = useState<'idle' | 'loading' | 'success'>('idle')
  const [errors, setErrors] = useState<{ name?: string; phone?: string; agree?: string }>({})

  const validate = () => {
    const e: typeof errors = {}
    if (name.trim().length < 2) e.name = 'Введите имя'
    if (phone.replace(/\D/g, '').length < 10) e.phone = 'Введите номер телефона'
    if (!agree) e.agree = 'Нужно согласие на обработку данных'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = (ev: FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setState('loading')
    window.setTimeout(() => { setState('success'); onSuccess?.() }, 650)
  }

  const formatPhone = (v: string) => {
    const d = v.replace(/\D/g, '').replace(/^8/, '7').slice(0, 11)
    if (!d) return ''
    let out = '+7'
    if (d.length > 1) out += ' (' + d.slice(1, 4)
    if (d.length >= 4) out += ') ' + d.slice(4, 7)
    if (d.length >= 7) out += '-' + d.slice(7, 9)
    if (d.length >= 9) out += '-' + d.slice(9, 11)
    return out
  }

  if (state === 'success') {
    return (
      <div className={cn('flex flex-col items-start gap-4 rounded-2 border p-6 animate-fade-up', inverse ? 'border-[rgba(242,244,247,.14)] bg-asphalt-800' : 'border-green-600/30 bg-green-50', className)} role="status" aria-live="polite">
        <span className={cn('flex size-12 items-center justify-center rounded-1', inverse ? 'bg-signal-500 text-asphalt-950' : 'bg-green-600 text-white')}><CheckCircle2 className="size-6" /></span>
        <div>
          <div className="t-title-l">{successTitle}</div>
          <p className={cn('t-body mt-1', inverse ? 'text-asphalt-300' : 'text-asphalt-700')}>{successText}</p>
          {context && <p className={cn('t-small mt-2', inverse ? 'text-asphalt-400' : 'text-asphalt-600')}>Запрос: {context}</p>}
        </div>
        <a href={phoneHref(company.phone)} className={cn('inline-flex items-center gap-2 t-btn', inverse ? 'text-signal-400' : 'text-asphalt-950')}><Phone className="size-4" />Или позвоните: {company.phone}</a>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className={cn('flex flex-col gap-4', className)} noValidate>
      <div className={cn('grid gap-3', compact ? 'md:grid-cols-[1fr_1fr_auto] md:items-end' : 'grid-cols-1')}>
        <Input label="Имя" placeholder="Как к вам обращаться" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} inverse={inverse} autoComplete="name" />
        <Input label="Телефон" placeholder="+7 (___) ___-__-__" inputMode="tel" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} error={errors.phone} inverse={inverse} autoComplete="tel" />
        {withTariff && (
          <Select label="Предпочтительный тариф" value={tariff} onChange={(e) => setTariff(e.target.value as TariffId | '')} inverse={inverse}>
            <option value="">Не знаю, помогите выбрать</option>
            {tariffs.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </Select>
        )}
        {compact && <Button type="submit" size="l" loading={state === 'loading'} className="md:mb-0">{submitLabel}</Button>}
      </div>
      {!compact && <Button type="submit" size="l" full loading={state === 'loading'}>{state === 'loading' ? 'Отправляем…' : submitLabel}</Button>}
      <Checkbox
        checked={agree} onChange={(e) => setAgree(e.target.checked)} inverse={inverse} error={errors.agree}
        label={legalVariant === 'full'
          ? <>Согласен(а) с <span className="underline underline-offset-2">политикой конфиденциальности</span>, обработкой персональных данных и условиями договора оферты</>
          : <>Согласен(а) с обработкой персональных данных</>}
      />
      <p className={cn('t-caption !font-normal', inverse ? 'text-asphalt-500' : 'text-asphalt-500')}>Прототип: данные никуда не отправляются.</p>
    </form>
  )
}
