import { type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useDocumentTitle, useScrollRestoration } from '../lib/hooks'

/** Обёртка страницы: заголовок вкладки, скролл наверх, лёгкий page transition */
export function Page({ title, children }: { title: string; children: ReactNode }) {
  useDocumentTitle(title)
  useScrollRestoration()
  const { pathname } = useLocation()
  return <div key={pathname} className="animate-fade-in">{children}</div>
}
