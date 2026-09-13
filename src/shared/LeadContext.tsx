import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { Modal } from '../ui/Modal'
import { LeadForm } from './LeadForm'
import type { TariffId } from '../data/tariffs'
import { Kicker } from '../ui/Primitives'

export interface LeadOptions {
  title?: string
  text?: string
  context?: string      // «Kia K5» — попадёт в success-state
  tariff?: TariffId | ''
  withTariff?: boolean
  submitLabel?: string
}

interface LeadCtx { openLead: (opts?: LeadOptions) => void; closeLead: () => void }

const Ctx = createContext<LeadCtx>({ openLead: () => {}, closeLead: () => {} })
export const useLead = () => useContext(Ctx)

export function LeadProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [opts, setOpts] = useState<LeadOptions>({})
  const openLead = useCallback((o: LeadOptions = {}) => { setOpts(o); setOpen(true) }, [])
  const closeLead = useCallback(() => setOpen(false), [])
  const value = useMemo(() => ({ openLead, closeLead }), [openLead, closeLead])
  return (
    <Ctx.Provider value={value}>
      {children}
      <Modal
        open={open} onClose={closeLead}
        title={
          <div className="flex flex-col gap-2">
            <Kicker>Заявка</Kicker>
            <div className="t-display-m">{opts.title ?? 'Оставить заявку'}</div>
            <p className="t-body text-asphalt-600">{opts.text ?? (opts.context ? `Уточним наличие: ${opts.context}. Менеджер перезвонит и назовёт условия.` : 'Менеджер перезвонит, уточнит тариф и наличие машины.')}</p>
          </div>
        }
      >
        <LeadForm
          key={open ? 'open' : 'closed'}
          context={opts.context}
          defaultTariff={opts.tariff ?? ''}
          withTariff={opts.withTariff}
          submitLabel={opts.submitLabel ?? 'Оставить заявку'}
          legalVariant="full"
        />
      </Modal>
    </Ctx.Provider>
  )
}
