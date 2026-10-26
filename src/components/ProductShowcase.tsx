import { useId, useMemo, useRef, useState } from 'react'
import type { FormEvent, MouseEvent } from 'react'
import type { ProductInfo } from '../data/products'
import type { ProductActions } from '../data/shop'
import { formatPrice, getStockStatus } from '../data/shop'
import Icon from './Icon'
import QuantityControl from './QuantityControl'
import StarRating from './StarRating'

type ProductShowcaseProps = {
  products: ProductInfo[]
  shop: ProductActions
  featuredProductId?: string
}

const sizeLabels: Record<string, string> = {
  S: 'Small',
  M: 'Medium',
  XL: 'Extra large',
}

export default function ProductShowcase({ products: catalog, shop, featuredProductId }: ProductShowcaseProps) {
  const purchaseId = useId()
  const sizeRef = useRef<HTMLInputElement>(null)
  const [sizeErrorId, setSizeErrorId] = useState<string | null>(null)
  const [shuffleSeed] = useState(() => Math.floor(Math.random() * 2 ** 32))
  const products = useMemo(() => {
    const shuffled = [...catalog]
    let randomState = shuffleSeed
    for (let index = shuffled.length - 1; index > 0; index--) {
      randomState = (Math.imul(randomState, 1664525) + 1013904223) >>> 0
      const swapIndex = Math.floor((randomState / 2 ** 32) * (index + 1))
      const swapped = shuffled[swapIndex]
      shuffled[swapIndex] = shuffled[index]
      shuffled[index] = swapped
    }

    // Lead with the newest addition, then represent every clothing category
    // before filling the remaining places from the shuffled catalog.
    const featured = catalog.find((product) => product.id === featuredProductId)
    const categories = new Set<string>(featured ? [featured.category] : [])
    const representatives = shuffled.filter((product) => {
      if (categories.has(product.category)) return false
      categories.add(product.category)
      return true
    })
    const selected = [...(featured ? [featured] : []), ...representatives]
    const selectedIds = new Set(selected.map((product) => product.id))
    return [...selected, ...shuffled.filter((product) => !selectedIds.has(product.id))].slice(0, 6)
  }, [catalog, shuffleSeed, featuredProductId])
  const [activeIndex, setActiveIndex] = useState(0)
  const product = products[activeIndex]

  if (!product) return null

  const selection = shop.getSelection(product.id)
  const available = shop.getAvailableQuantity(product.id)
  const stock = getStockStatus(product.quantity, available)
  const quantity = available > 0 ? selection.quantity : 0
  const sizeError = sizeErrorId === product.id

  function changeProduct(direction: -1 | 1) {
    setSizeErrorId(null)
    setActiveIndex((current) => (current + direction + products.length) % products.length)
  }

  function openProduct(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.preventDefault()
    shop.onOpenProduct(product.id)
  }

  function addProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (available === 0) return
    if (!selection.size) {
      setSizeErrorId(product.id)
      sizeRef.current?.focus({ preventScroll: true })
      sizeRef.current?.closest('fieldset')?.scrollIntoView({
        block: 'nearest',
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      })
      return
    }
    shop.onAddToCart(product.id)
  }

  // Keep the collection name prominent without dropping the full product name.
  const nameParts = product.name.match(/^"([^"]+)"\s*(.*)$/)
  const title = nameParts?.[1] ?? product.name
  const useCompactTitle = title.length > 22 || title.split(/\s+/).some((word) => word.length > 8)
  const subtitle = nameParts?.[2]
  const price = formatPrice(product.price)

  return (
    <section
      aria-labelledby="showcase-title"
      aria-roledescription="carousel"
      className="relative isolate grid min-h-[var(--showcase-height)] w-full grid-cols-[minmax(0,1fr)] content-start overflow-hidden px-[3%] pt-24 pb-6 lg:block lg:h-[var(--showcase-height)] lg:min-h-[42rem] lg:px-0 lg:py-0"
    >
      <div
        aria-live="polite"
        aria-atomic="true"
        className="relative z-20 min-w-0 lg:absolute lg:top-[max(8.5rem,16%)] lg:left-[3%] lg:w-[29%]"
      >
        <div key={product.id} className="motion-safe:animate-showcase-text-in">
          <h1
            id="showcase-title"
            aria-label={product.name}
            className={`text-[clamp(2rem,7vw,3rem)] leading-[0.94] font-black tracking-[-0.055em] break-words text-[#efefea] uppercase ${useCompactTitle ? 'lg:text-[clamp(2rem,3.6vw,4.1rem)]' : 'lg:text-[clamp(2.25rem,4.6vw,5rem)]'}`}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 max-w-[30rem] text-[13px] leading-relaxed font-medium text-[#d2d5cd] lg:max-w-[16rem]">
              {subtitle}
            </p>
          )}
          <p className="mt-5 line-clamp-4 max-w-[30rem] text-[12px] leading-[1.85] text-[#a8adb1] lg:line-clamp-6 lg:max-w-[17rem]">
            {product.description}
          </p>
        </div>
      </div>

      <form
        id={purchaseId}
        aria-label={`Configure showcased ${product.name}`}
        onSubmit={addProduct}
        className="relative z-20 mt-5 w-fit min-w-48 max-w-full lg:absolute lg:top-[max(8.5rem,16%)] lg:right-[3%] lg:mt-0 lg:w-48"
      >
        <fieldset disabled={available === 0} aria-describedby={sizeError ? `${purchaseId}-error` : undefined}>
          <legend className="sr-only">Select size</legend>
          <div className="flex justify-between gap-2.5">
            {product.sizes.map((size, index) => (
              <label key={size} title={sizeLabels[size] ?? size} className="cursor-pointer">
                <input ref={index === 0 ? sizeRef : undefined} type="radio" name={`${purchaseId}-${product.id}`} value={size} checked={selection.size === size} onChange={() => { shop.onSizeChange(product.id, size); setSizeErrorId(null) }} aria-label={`Size ${size} for showcased ${product.name}`} className="peer sr-only" />
                <span className="flex size-10 items-center justify-center rounded-full border border-white/25 text-[12px] font-medium text-[#d8dfcf] transition-colors peer-checked:border-[var(--accent)] peer-checked:bg-[var(--accent)] peer-checked:text-[#171b13] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-[var(--accent)] peer-disabled:cursor-default peer-disabled:opacity-40 hover:border-[var(--accent)] motion-reduce:transition-none">{size}</span>
              </label>
            ))}
          </div>
          {sizeError && <p id={`${purchaseId}-error`} role="alert" className="mt-3 text-[12px] leading-relaxed text-[var(--accent)]">Choose a size before adding this piece.</p>}
        </fieldset>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/20 pt-4">
          <p className="text-[12px] tracking-[0.08em] text-[var(--muted)] uppercase">Quantity</p>
          <QuantityControl compact label={`showcased ${product.name}`} value={quantity} min={available > 0 ? 1 : 0} max={available} onChange={(value) => shop.onQuantityChange(product.id, value)} />
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-3">
          <p className="text-[12px] tracking-[0.08em] text-[var(--muted)] uppercase">Subtotal</p>
          <p aria-label={`Showcase subtotal: ${formatPrice(product.price * quantity)}`} className="text-[14px] font-semibold tracking-[-0.03em] tabular-nums">{formatPrice(product.price * quantity)}</p>
        </div>
      </form>

      <div className="pointer-events-none relative z-10 mt-3 flex h-72 min-w-0 items-center justify-center sm:h-96 lg:absolute lg:inset-x-0 lg:top-[18%] lg:bottom-[18%] lg:mt-0 lg:h-auto">
        <a href={`#/products/${product.id}`} onClick={openProduct} aria-label={`View showcased ${product.name}`} className="pointer-events-auto relative block h-full w-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] lg:w-[64%]">
          {products.map((item, index) => {
            // Keep the neighboring cutouts on either side so navigation wraps
            // smoothly from the last product back to the first.
            const distance = (index - activeIndex + products.length) % products.length
            const offset = distance > products.length / 2 ? distance - products.length : distance
            const active = index === activeIndex

            return (
              <img
                key={item.id}
                src={item.images.transparent}
                alt={active ? item.name : ''}
                aria-hidden={!active}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                decoding="async"
                className="absolute inset-0 h-full w-full max-w-none object-contain drop-shadow-[0_28px_24px_#00000050] transition-[transform,opacity] duration-[650ms,450ms] ease-[cubic-bezier(.22,.68,.18,1),ease] motion-reduce:transition-none"
                style={{ transform: `translateX(${offset * 100}%)`, opacity: active ? 1 : 0 }}
              />
            )
          })}
        </a>
      </div>

      <div
        role="group"
        aria-label="Product navigation"
        className="relative z-20 mt-2 flex justify-end gap-2.5 lg:absolute lg:right-[3%] lg:bottom-[22%] lg:mt-0"
      >
        <button
          type="button"
          disabled={products.length < 2}
          onClick={() => changeProduct(-1)}
          aria-label="Previous product"
          className="flex size-11 items-center justify-center rounded-full border border-white/30 bg-white/[0.025] text-[#e4e7df] transition-colors duration-150 hover:border-[var(--accent)] hover:bg-white/10 hover:text-[var(--accent)] disabled:cursor-default disabled:opacity-40 motion-reduce:transition-none"
        >
          <Icon name="arrow" className="rotate-180" />
        </button>
        <button
          type="button"
          disabled={products.length < 2}
          onClick={() => changeProduct(1)}
          aria-label="Next product"
          className="flex size-11 items-center justify-center rounded-full border border-white/30 bg-white/[0.025] text-[#e4e7df] transition-colors duration-150 hover:border-[var(--accent)] hover:bg-white/10 hover:text-[var(--accent)] disabled:cursor-default disabled:opacity-40 motion-reduce:transition-none"
        >
          <Icon name="arrow" />
        </button>
      </div>

      <div key={`summary-${product.id}`} className="relative z-20 mt-6 grid grid-cols-[1fr_auto] items-end gap-6 motion-safe:animate-showcase-text-in lg:absolute lg:right-[3%] lg:bottom-[4%] lg:left-[3%] lg:mt-0 lg:grid-cols-[1fr_auto_1fr]">
        <div className="max-w-[15rem] pb-1">
          <StarRating rating={product.rating} showValue size="md" className="mb-3" />
          <p className="text-[12px] tracking-[0.12em] text-[#91998c] uppercase">
            Category
          </p>
          <p className="mt-2 text-[12px] leading-relaxed text-[#b8beb3]">
            {product.category}
          </p>
        </div>

        <p
          aria-label={`Price: ${price}`}
          className="pb-1 text-[clamp(1.75rem,3vw,2.75rem)] leading-none font-bold tracking-[-0.055em] text-[#f0f0eb] tabular-nums"
        >
          {price}
        </p>

        <div className="col-span-2 flex items-center justify-between gap-4 lg:col-span-1 lg:justify-end">
          <div role="status" aria-atomic="true" aria-label={stock.message} title={stock.message} className={`rounded-xl text-center ${stock.state === 'low' ? 'border border-amber-300/25 bg-amber-300/10 px-3 py-2 text-amber-200' : 'text-[#d7decf]'}`}>
            <p className={`text-[12px] tracking-[0.08em] uppercase ${stock.state === 'low' ? 'text-amber-200' : 'text-[#929b8a]'}`}>{stock.state === 'low' ? 'Low stock' : stock.state === 'sold-out' ? 'Sold out' : stock.state === 'in-cart' ? 'All in cart' : 'Available'}</p>
            <p className="mt-1.5 text-[15px] leading-none tabular-nums">{stock.remaining}</p>
            {stock.state === 'low' && <p className="mt-1 text-[12px]">left to add</p>}
          </div>
          <button
            type={available > 0 ? 'submit' : 'button'}
            form={purchaseId}
            disabled={product.quantity === 0}
            onClick={available === 0 && product.quantity > 0 ? shop.onViewCart : undefined}
            aria-label={product.quantity === 0 ? `Showcased ${product.name} is sold out` : available === 0 ? `View cart for showcased ${product.name}` : `Add showcased ${product.name} to cart`}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-7 text-[12px]! font-semibold! whitespace-nowrap text-[#171b13] transition-colors hover:bg-[#deedbf] disabled:cursor-default disabled:opacity-40 motion-reduce:transition-none"
          >
            <Icon name="cart" className="size-4" /> {product.quantity === 0 ? 'Sold out' : available === 0 ? 'View Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </section>
  )
}
