import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { useLockBody } from '../lib/hooks'
import { cn } from '../lib/format'

export function Modal({ open, onClose, children, title, inverse, size = 'm' }: { open: boolean; onClose: () => void; children: ReactNode; title?: ReactNode; inverse?: boolean; size?: 'm' | 'l' }) {
  useLockBody(open)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-[rgba(20,24,28,.64)] animate-fade-in" onClick={onClose} />
      <div className={cn(
        'relative w-full overflow-hidden rounded-t-2 shadow-pop animate-fade-up sm:rounded-2',
        size === 'l' ? 'sm:max-w-3xl' : 'sm:max-w-lg',
        inverse ? 'bg-asphalt-900 text-asphalt-50 on-dark' : 'bg-white text-asphalt-950',
      )}>
        <div className="flex items-start justify-between gap-4 px-6 pt-6 sm:px-8 sm:pt-8">
          <div className="min-w-0">{title}</div>
          <button type="button" onClick={onClose} aria-label="Закрыть" className={cn('flex size-10 shrink-0 items-center justify-center rounded-1 border transition-colors duration-fast', inverse ? 'border-asphalt-700 hover:border-asphalt-300' : 'border-asphalt-200 hover:border-asphalt-950')}>
            <X className="size-5" />
          </button>
        </div>
        <div className="max-h-[80dvh] overflow-y-auto px-6 pb-6 pt-4 sm:px-8 sm:pb-8">{children}</div>
      </div>
    </div>
  )
}
