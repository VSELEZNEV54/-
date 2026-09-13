import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { cn } from '../lib/format'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'ghost-inverse' | 'icon' | 'link'
export type ButtonSize = 'l' | 'm' | 's'

interface BaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  full?: boolean
  loading?: boolean
  icon?: ReactNode
  iconRight?: ReactNode
  children?: ReactNode
  className?: string
}

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { to?: undefined; href?: undefined }
type LinkProps = BaseProps & { to: string; href?: undefined; onClick?: () => void; target?: string; 'aria-label'?: string }
type AnchorProps = BaseProps & { href: string; to?: undefined; onClick?: () => void; target?: string; rel?: string; 'aria-label'?: string }

export type ButtonLikeProps = ButtonProps | LinkProps | AnchorProps

const base =
  'inline-flex items-center justify-center gap-2 select-none whitespace-nowrap rounded-1 t-btn transition-[background-color,color,border-color,transform] duration-fast ease-out-brand active:translate-y-px disabled:opacity-50 disabled:pointer-events-none'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-signal-500 text-asphalt-950 hover:bg-signal-400',
  secondary: 'bg-asphalt-950 text-white hover:bg-asphalt-800',
  ghost: 'bg-transparent text-asphalt-950 border border-asphalt-300 hover:border-asphalt-950 hover:bg-white',
  'ghost-inverse': 'bg-transparent text-asphalt-50 border border-[rgba(242,244,247,.28)] hover:border-asphalt-50 hover:bg-[rgba(242,244,247,.06)]',
  icon: 'bg-white text-asphalt-950 border border-asphalt-200 hover:border-asphalt-950 !px-0 aspect-square',
  link: 'bg-transparent text-signal-700 underline underline-offset-4 decoration-1 hover:text-signal-500 !px-0 !h-auto',
}

const sizes: Record<ButtonSize, string> = {
  l: 'h-14 px-7',
  m: 'h-12 px-[22px]',
  s: 'h-10 px-4 text-[15px]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonLikeProps>(function Button(props, ref) {
  const { variant = 'primary', size = 'm', full, loading, icon, iconRight, children, className, ...rest } = props as ButtonProps
  const cls = cn(base, variants[variant], sizes[size], full && 'w-full', className)
  const content = (
    <>
      {loading ? <Loader2 className="size-5 animate-spin" aria-hidden /> : icon}
      {children}
      {!loading && iconRight}
    </>
  )
  if ('to' in props && props.to) {
    const { to, onClick, target } = props as LinkProps
    return <Link to={to} onClick={onClick} target={target} className={cls} aria-label={props['aria-label']}>{content}</Link>
  }
  if ('href' in props && props.href) {
    const { href, onClick, target, rel } = props as AnchorProps
    return <a href={href} onClick={onClick} target={target} rel={rel} className={cls} aria-label={props['aria-label']}>{content}</a>
  }
  return (
    <button ref={ref} className={cls} disabled={loading || (rest as ButtonProps).disabled} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  )
})
