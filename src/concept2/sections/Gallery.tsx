import { useState } from 'react'
import { cn } from '../../lib/format'
import { asset } from '../../lib/asset'

/** Галерея машины: большое фото + превью, клик переключает */
export function Gallery({ images, alt, className }: { images: string[]; alt: string; className?: string }) {
  const list = Array.from(new Set(images)).slice(0, 5)
  const [active, setActive] = useState(0)
  const current = list[active] ?? list[0]
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="aspect-[4/3] overflow-hidden rounded-2 bg-asphalt-100">
        <img key={current} src={asset(current)} alt={alt} className="h-full w-full object-cover animate-fade-in" />
      </div>
      {list.length > 1 && (
        <ul className="grid gap-3" style={{ gridTemplateColumns: `repeat(${list.length}, minmax(0, 1fr))` }} aria-label="Фотографии автомобиля">
          {list.map((src, i) => (
            <li key={src}>
              <button
                type="button" onClick={() => setActive(i)} aria-pressed={i === active} aria-label={`Фото ${i + 1}`}
                className={cn('block aspect-[4/3] w-full overflow-hidden rounded-1 border-2 bg-asphalt-100 transition-colors duration-fast', i === active ? 'border-asphalt-950' : 'border-transparent hover:border-asphalt-400')}
              >
                <img src={asset(src)} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
