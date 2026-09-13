import { ArticleCard } from '../../ui/Cards'
import { c2CategoryOf, categoryLabels, type Article } from '../../data/articles'
import { c2 } from '../Layout'
import { cn } from '../../lib/format'

/** Список статей строками (перелинковка), в 1 или 2 колонки */
export function ArticlesRows({ articles, max = 4, columns = 1, className }: { articles: Article[]; max?: number; columns?: 1 | 2; className?: string }) {
  const list = articles.slice(0, max)
  if (list.length === 0) return null
  return (
    <div className={cn('border-t border-asphalt-200', columns === 2 && 'md:grid md:grid-cols-2 md:gap-x-8', className)}>
      {list.map((a) => (
        <ArticleCard key={a.slug} article={a} to={c2.article(a.slug)} variant="row" categoryLabel={categoryLabels[c2CategoryOf(a.category)]} />
      ))}
    </div>
  )
}
