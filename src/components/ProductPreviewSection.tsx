import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { ProductInfo } from '../data/products'
import type { ProductActions } from '../data/shop'
import Icon from './Icon'
import ProductCard from './ProductCard'

type ProductPreviewSectionProps = {
  products: ProductInfo[]
  onViewAll: () => void
  shop: ProductActions
  featuredProductId?: string
}

export default function ProductPreviewSection({ products, onViewAll, shop, featuredProductId }: ProductPreviewSectionProps) {
  const titleId = useId()
  const rowId = useId()
  const rowRef = useRef<HTMLUListElement>(null)
  const [scrollable, setScrollable] = useState({ previous: false, next: false })
  const [shuffleSeed] = useState(() => Math.floor(Math.random() * 2 ** 32))
  const previewProducts = useMemo(() => {
    // Shuffle a copy once per Home visit. A stable seed keeps ordinary renders
    // from reordering cards and lets later catalog changes appear normally.
    const shuffled = [...products]
    let randomState = shuffleSeed
    for (let index = shuffled.length - 1; index > 0; index--) {
      randomState = (Math.imul(randomState, 1664525) + 1013904223) >>> 0
      const swapIndex = Math.floor((randomState / 2 ** 32) * (index + 1))
      const swapped = shuffled[swapIndex]
      shuffled[swapIndex] = shuffled[index]
      shuffled[index] = swapped
    }
    const featured = products.find((product) => product.id === featuredProductId)
    return [...(featured ? [featured] : []), ...shuffled.filter((product) => product.id !== featured?.id)].slice(0, 6)
  }, [products, shuffleSeed, featuredProductId])

  const updateNavigation = useCallback(() => {
    const row = rowRef.current
    if (!row) return

    const previous = row.scrollLeft > 2
    const next = row.scrollWidth - row.clientWidth - row.scrollLeft > 2
    setScrollable((current) => (
      current.previous === previous && current.next === next ? current : { previous, next }
    ))
  }, [])

  useEffect(() => {
    const row = rowRef.current
    if (!row) return

    const observer = new ResizeObserver(updateNavigation)
    observer.observe(row)
    return () => observer.disconnect()
  }, [products.length, updateNavigation])

  function scrollProducts(direction: -1 | 1) {
    const row = rowRef.current
    if (!row) return

    const first = row.children[0] as HTMLElement | undefined
    const second = row.children[1] as HTMLElement | undefined
    const distance = first && second ? second.offsetLeft - first.offsetLeft : row.clientWidth
    row.scrollBy({
      left: direction * distance,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    })
  }

  return (
    <section aria-labelledby={titleId} className="mx-[3%] mt-24 mb-16 min-w-0 md:mt-36">
      <header className="mb-6 flex items-center justify-between gap-6">
        <h2 id={titleId} className="text-[clamp(1.4rem,3vw,2.5rem)] leading-tight font-black tracking-[-0.04em] uppercase">
          The collection.
        </h2>
        <a
          href="#/products"
          onClick={(event) => { if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) { event.preventDefault(); onViewAll() } }}
          aria-label="View all products"
          className="inline-flex shrink-0 items-center gap-2 py-2 text-[10px] tracking-[0.1em] text-[#c9d5bc] uppercase transition-colors hover:text-[var(--accent)] motion-reduce:transition-none"
        >
          View all <Icon name="arrow" className="size-4 -rotate-45" />
        </a>
      </header>

      <ul
        ref={rowRef}
        id={rowId}
        aria-label="Product previews"
        tabIndex={0}
        onScroll={updateNavigation}
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto overscroll-x-contain scroll-smooth px-4 pt-4 pb-8 outline-none [scrollbar-color:#d0e5a440_transparent] [scrollbar-width:thin] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-[var(--accent)] motion-reduce:scroll-auto"
      >
        {previewProducts.map((product) => (
          <li key={product.id} className="w-full max-w-md shrink-0 basis-full snap-start sm:basis-[46%] lg:basis-[40%]">
            <ProductCard product={product} shop={shop} />
          </li>
        ))}
      </ul>

      <div role="group" aria-label="Product preview navigation" className="mt-4 flex justify-end gap-3">
        <button
          type="button"
          aria-label="Scroll products left"
          aria-controls={rowId}
          disabled={!scrollable.previous}
          onClick={() => scrollProducts(-1)}
          className="flex size-11 items-center justify-center rounded-full border border-white/25 bg-white/[0.035] text-[#e4e7df] transition-colors enabled:hover:border-[var(--accent)] enabled:hover:bg-white/10 enabled:hover:text-[var(--accent)] disabled:cursor-default disabled:opacity-30 motion-reduce:transition-none"
        >
          <Icon name="arrow" className="rotate-180" />
        </button>
        <button
          type="button"
          aria-label="Scroll products right"
          aria-controls={rowId}
          disabled={!scrollable.next}
          onClick={() => scrollProducts(1)}
          className="flex size-11 items-center justify-center rounded-full border border-white/25 bg-white/[0.035] text-[#e4e7df] transition-colors enabled:hover:border-[var(--accent)] enabled:hover:bg-white/10 enabled:hover:text-[var(--accent)] disabled:cursor-default disabled:opacity-30 motion-reduce:transition-none"
        >
          <Icon name="arrow" />
        </button>
      </div>
    </section>
  )
}
