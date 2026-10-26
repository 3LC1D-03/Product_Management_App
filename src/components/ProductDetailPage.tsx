import { useId, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { ProductInfo } from '../data/products'
import type { ProductActions } from '../data/shop'
import { formatPrice, getStockStatus } from '../data/shop'
import Icon from './Icon'
import QuantityControl from './QuantityControl'
import StarRating from './StarRating'

type ProductDetailPageProps = {
  product: ProductInfo
  shop: ProductActions
  onBack: () => void
  onCategory: (category: string) => void
}

export default function ProductDetailPage({ product, shop, onBack, onCategory }: ProductDetailPageProps) {
  const sizeId = useId()
  const sizeRef = useRef<HTMLInputElement>(null)
  const [sizeError, setSizeError] = useState(false)
  const selection = shop.getSelection(product.id)
  const available = shop.getAvailableQuantity(product.id)
  const stock = getStockStatus(product.quantity, available)
  const quantity = available > 0 ? selection.quantity : 0
  const nameParts = product.name.match(/^"([^"]+)"\s*(.*)$/)

  function addProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selection.size) {
      setSizeError(true)
      sizeRef.current?.focus({ preventScroll: true })
      return
    }
    shop.onAddToCart(product.id)
  }

  return (
    <section aria-labelledby="product-title" className="mx-[3%] min-w-0">
      <button type="button" onClick={onBack} className="mb-6 inline-flex min-h-10 items-center gap-2 text-[10px]! tracking-[0.08em] text-[var(--muted)] uppercase hover:text-[var(--accent)]">
        <Icon name="arrow" className="size-4 rotate-180" /> Back to collection
      </button>

      <div className="grid min-w-0 gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14 xl:gap-20">
        <div className="relative flex h-[clamp(18rem,45vw,34rem)] min-w-0 items-center justify-center self-start overflow-hidden">
          <img src={product.images.transparent} alt={product.name} fetchPriority="high" className="h-full w-[165%] max-w-none shrink-0 object-contain drop-shadow-[0_30px_30px_#00000050]" />
        </div>

        <div className="min-w-0">
          <button type="button" onClick={() => onCategory(product.category)} className="mb-4 text-[9px]! tracking-[0.18em] text-[var(--accent)] uppercase hover:underline hover:underline-offset-4">{product.category}</button>
          <h1 id="product-title" aria-label={product.name} className="text-[clamp(2.2rem,4.2vw,4.5rem)] leading-[0.98] font-black tracking-[-0.055em] break-words uppercase">{nameParts?.[1] ?? product.name}</h1>
          {nameParts?.[2] && <p className="mt-4 max-w-md text-[13px] leading-relaxed text-[#c4cbc0]">{nameParts[2]}</p>}
          <StarRating rating={product.rating} showValue size="md" className="mt-5" />

          <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
            <p aria-label={`Unit price: ${formatPrice(product.price)}`} className="text-[clamp(1.75rem,3vw,2.75rem)] leading-none font-bold tracking-[-0.05em] tabular-nums">{formatPrice(product.price)}</p>
            <p role="status" aria-atomic="true" className={`rounded-full text-[12px] leading-relaxed ${stock.state === 'low' ? 'border border-amber-300/25 bg-amber-300/10 px-3 py-2 text-amber-200' : 'text-[var(--muted)]'}`}>
              {stock.message}
            </p>
          </div>

          {available > 0 ? (
            <form onSubmit={addProduct} className="mt-6">
              <fieldset aria-describedby={sizeError ? `${sizeId}-error` : undefined}>
                <legend className="mb-3 text-[9px] tracking-[0.14em] text-[var(--muted)] uppercase">Select size</legend>
                <div className="flex gap-3">
                  {product.sizes.map((size, index) => (
                    <label key={size} className="cursor-pointer">
                      <input ref={index === 0 ? sizeRef : undefined} type="radio" name={sizeId} value={size} checked={selection.size === size} onChange={() => { shop.onSizeChange(product.id, size); setSizeError(false) }} aria-label={`Size ${size}`} className="peer sr-only" />
                      <span className="flex size-12 items-center justify-center rounded-full border border-white/25 text-[11px] text-[#d8dfcf] transition-colors peer-checked:border-[var(--accent)] peer-checked:bg-[var(--accent)] peer-checked:text-[#171b13] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-[var(--accent)] hover:border-[var(--accent)] motion-reduce:transition-none">{size}</span>
                    </label>
                  ))}
                </div>
                {sizeError && <p id={`${sizeId}-error`} role="alert" className="mt-3 text-[11px] text-[var(--accent)]">Choose a size before adding this piece.</p>}
              </fieldset>

              <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
                <div>
                  <p className="mb-3 text-[9px] tracking-[0.14em] text-[var(--muted)] uppercase">Quantity</p>
                  <QuantityControl label={product.name} value={quantity} max={available} onChange={(value) => shop.onQuantityChange(product.id, value)} />
                </div>
                <div className="pb-1 text-right">
                  <p className="mb-3 text-[9px] tracking-[0.14em] text-[var(--muted)] uppercase">Subtotal</p>
                  <p aria-label={`Subtotal: ${formatPrice(product.price * quantity)}`} className="text-2xl leading-none font-bold tracking-[-0.04em] tabular-nums">{formatPrice(product.price * quantity)}</p>
                </div>
              </div>
              <button type="submit" className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-[var(--accent)] px-6 text-[12px]! font-semibold! text-[#171b13] transition-colors hover:bg-[#deedbf] motion-reduce:transition-none">
                <Icon name="cart" className="size-4" /> Add to Cart
              </button>
            </form>
          ) : product.quantity > 0 ? (
            <button type="button" onClick={shop.onViewCart} className="mt-7 min-h-12 w-full rounded-full bg-[var(--accent)] px-6 text-[12px]! font-semibold! text-[#171b13]">View Cart</button>
          ) : (
            <button type="button" disabled className="mt-7 min-h-12 w-full cursor-default rounded-full border border-white/15 bg-white/5 text-[12px]! text-[var(--muted)]">Sold out</button>
          )}

        </div>
      </div>

      <div className="mt-10 grid min-w-0 gap-8 border-t border-white/10 pt-7 lg:mt-14 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:pt-10 xl:gap-20">
        <div className="min-w-0">
          <h2 className="text-[10px] font-semibold tracking-[0.12em] uppercase">The piece</h2>
          <p className="mt-4 text-[13px] leading-[1.9] text-[var(--muted)]">{product.description}</p>
        </div>
        <div className="min-w-0">
          <h2 className="text-[10px] font-semibold tracking-[0.12em] uppercase">Specifications</h2>
          <ul className="mt-4 space-y-3 text-[12px] leading-relaxed text-[var(--muted)]">
            {product.specifications.map((specification) => <li key={specification} className="flex gap-3"><span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-[var(--accent)]/60" />{specification}</li>)}
          </ul>
        </div>
      </div>
    </section>
  )
}
