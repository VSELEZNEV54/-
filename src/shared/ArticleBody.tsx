import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Block } from '../data/articles'
import { Accordion } from '../ui/Accordion'
import { Callout, Table } from '../ui/Primitives'
import { asset } from '../lib/asset'

export type LinkKind = 'car' | 'tariff' | 'article' | 'calc' | 'terms' | 'cars' | 'offers' | 'faq'
export type LinkResolver = (kind: LinkKind, slug: string) => string

const LINK_RE = /\[([^\]]+)\]\((car|tariff|article|calc|terms|cars|offers|faq):([^)]*)\)/g

/** Разбор [текст](kind:slug) во внутренние ссылки концепции */
export function renderInline(text: string, resolve: LinkResolver): ReactNode {
  const out: ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null
  const re = new RegExp(LINK_RE.source, 'g')
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    out.push(<Link key={m.index} to={resolve(m[2] as LinkKind, m[3])} className="text-signal-700 underline decoration-1 underline-offset-[3px] transition-colors duration-fast hover:text-signal-500">{m[1]}</Link>)
    last = m.index + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out.map((n, i) => <Fragment key={i}>{n}</Fragment>)
}

export function ArticleBody({ blocks, resolve }: { blocks: Block[]; resolve: LinkResolver }) {
  return (
    <div className="prose-tm">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'p': return <p key={i} className="text-asphalt-800">{renderInline(b.text, resolve)}</p>
          case 'h2': return <h2 key={i}>{renderInline(b.text, resolve)}</h2>
          case 'list': return b.ordered
            ? <ol key={i}>{b.items.map((it, j) => <li key={j}>{renderInline(it, resolve)}</li>)}</ol>
            : <ul key={i}>{b.items.map((it, j) => <li key={j}>{renderInline(it, resolve)}</li>)}</ul>
          case 'callout': return <Callout key={i} title={b.title} tone={b.tone ?? 'signal'}>{renderInline(b.text, resolve)}</Callout>
          case 'table': return <Table key={i} caption={b.caption} head={b.head} rows={b.rows} />
          case 'quote': return (
            <blockquote key={i} className="border-l-4 border-asphalt-950 pl-5 py-1">
              <p className="t-lead text-asphalt-950">«{b.text}»</p>
              {b.author && <footer className="t-caption text-asphalt-500 mt-2">— {b.author}</footer>}
            </blockquote>
          )
          case 'faq': return (
            <div key={i}>
              <h2>Вопросы по теме</h2>
              <Accordion items={b.items.map((it, j) => ({ id: `faq-${i}-${j}`, title: it.q, content: it.a }))} />
            </div>
          )
          case 'image': return (
            <figure key={i}>
              <img src={asset(b.src)} alt={b.caption ?? ''} className="w-full rounded-2 object-cover" loading="lazy" />
              {b.caption && <figcaption className="t-caption text-asphalt-500 mt-2">{b.caption}</figcaption>}
            </figure>
          )
        }
      })}
    </div>
  )
}
