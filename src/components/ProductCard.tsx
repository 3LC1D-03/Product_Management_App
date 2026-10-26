import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent, MouseEvent, PointerEvent } from 'react'
import type { ProductInfo } from '../data/products'
import type { ProductActions } from '../data/shop'
import { formatPrice, getStockStatus } from '../data/shop'
import Icon from './Icon'
import QuantityControl from './QuantityControl'
import StarRating from './StarRating'

type ProductCardProps = {
  product: ProductInfo
  className?: string
  shop: ProductActions
}

const faceClassName = 'absolute inset-0 rounded-2xl border border-white/15 shadow-[0_16px_40px_#00000025,inset_0_1px_0_#ffffff12] [backface-visibility:hidden] transition-[border-color,background-color,box-shadow] duration-200 group-hover:border-[#d0e5a44d] group-has-[:focus-visible]:border-[#d0e5a44d] motion-reduce:transition-none'

export default function ProductCard({ product, shop, className = '' }: ProductCardProps) {
  const titleId = useId()
  const sizeId = useId()
  const panelId = useId()
  const cardRef = useRef<HTMLElement>(null)
  const panelRef = useRef<HTMLFormElement>(null)
  const addButtonRef = useRef<HTMLButtonElement>(null)
  const sizeRef = useRef<HTMLInputElement>(null)
  const [configuring, setConfiguring] = useState(false)
  const selection = shop.getSelection(product.id)
  const available = shop.getAvailableQuantity(product.id)
  const stock = getStockStatus(product.quantity, available)
  const quantity = available > 0 ? selection.quantity : 0
  const price = formatPrice(product.price)
  const shortName = product.name.match(/^"([^"]+)"/)?.[1] ?? product.name

  useEffect(() => {
    if (!configuring) return
    const focusTarget = panelRef.current?.querySelector<HTMLInputElement>('input:checked') ?? sizeRef.current
    focusTarget?.focus({ preventScroll: true })
    cardRef.current?.scrollIntoView({
      block: 'nearest', inline: 'nearest',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    })
  }, [configuring])

  function openProduct(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.preventDefault()
    shop.onOpenProduct(product.id)
  }

  function openConfiguration() {
    if (available === 0) {
      shop.onViewCart()
    } else {
      resetTilt()
      setConfiguring(true)
    }
  }

  function closeConfiguration() {
    const focused = document.activeElement
    const restoreKeyboardFocus = focused instanceof HTMLElement && focused.matches(':focus-visible')
    if (focused instanceof HTMLElement && panelRef.current?.contains(focused)) focused.blur()
    resetTilt()
    setConfiguring(false)
    if (restoreKeyboardFocus) window.requestAnimationFrame(() => addButtonRef.current?.focus({ preventScroll: true }))
  }

  function confirmAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (selection.size && shop.onAddToCart(product.id)) closeConfiguration()
  }

  function resetTilt() {
    cardRef.current?.style.setProperty('--card-rotate-x', '0deg')
    cardRef.current?.style.setProperty('--card-rotate-y', '0deg')
  }

  function updateTilt(event: PointerEvent<HTMLDivElement>) {
    const card = cardRef.current
    if (!card) return
    if (configuring || event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      resetTilt()
      return
    }

    // Measure the stationary wrapper so the tilted surface cannot cause jitter.
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)) - 0.5
    const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height)) - 0.5
    card.style.setProperty('--card-rotate-x', `${-y * 8}deg`)
    card.style.setProperty('--card-rotate-y', `${x * 8}deg`)
  }

  return (
    <div
      onPointerEnter={updateTilt}
      onPointerMove={updateTilt}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
      className="relative w-full min-w-0 [perspective:1200px] hover:z-10"
    >
      <article
        ref={cardRef}
        aria-labelledby={configuring ? `${panelId}-title` : titleId}
        className={`group relative aspect-[4/5] min-h-[26rem] w-full min-w-0 scroll-my-4 text-[#efefea] [transform-style:preserve-3d] [transform:rotateX(var(--card-rotate-x,0deg))_rotateY(var(--card-rotate-y,0deg))] transition-transform duration-200 ease-out outline-none motion-reduce:transform-none motion-reduce:transition-none ${className}`}
      >
        <div className={`absolute inset-0 [transform-style:preserve-3d] transition-transform duration-500 ease-in-out motion-reduce:transition-none ${configuring ? '[transform:rotateY(180deg)]' : '[transform:rotateY(0deg)]'}`}>
          <div inert={configuring} aria-hidden={configuring} className={`${faceClassName} overflow-hidden bg-white/[0.045] backdrop-blur-2xl [transform:rotateY(0deg)] group-hover:bg-white/[0.065] [@media(prefers-reduced-transparency:reduce)]:bg-[#222428] [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none`}>
            <StarRating
              rating={product.rating}
              className="pointer-events-none absolute top-5 left-5 z-20 inline-flex items-center gap-2 text-white drop-shadow-[0_1px_3px_#00000080]"
            />
            <div role="status" aria-atomic="true" className="pointer-events-none absolute top-4 right-4 z-20">
              {stock.state !== 'available' && (
                <span title={stock.message} aria-label={`${product.name}: ${stock.message}`} className={`inline-flex rounded-full border px-2.5 py-1.5 text-[12px] font-medium backdrop-blur-xl ${stock.state === 'low' ? 'border-amber-300/25 bg-amber-300/10 text-amber-200' : stock.state === 'sold-out' ? 'border-white/15 bg-[#171c1d]/80 text-[#b6babc]' : 'border-[#d0e5a433] bg-[#171c1d]/80 text-[var(--accent)]'}`}>
                  {stock.state === 'low' ? `Low stock · ${stock.remaining}` : stock.state === 'sold-out' ? 'Sold out' : 'All in your cart'}
                </span>
              )}
            </div>

            <a href={`#/products/${product.id}`} onClick={openProduct} aria-label={`View ${product.name}`} className="absolute inset-x-0 top-4 h-[calc(100%_-_4rem)] rounded-xl transition-[height] duration-300 group-hover:h-[calc(100%_-_8rem)] group-has-[:focus-visible]:h-[calc(100%_-_8rem)] motion-reduce:transition-none [@media(hover:none)]:h-[calc(100%_-_8rem)]">
              <img
                src={product.images.transparent}
                alt={product.name}
                loading="lazy"
                decoding="async"
                className="pointer-events-none absolute top-0 -left-1/4 h-full w-[150%] max-w-none object-contain drop-shadow-[0_18px_16px_#00000030] transition-transform duration-500 ease-out group-hover:-translate-y-6 group-hover:scale-90 group-has-[:focus-visible]:-translate-y-6 group-has-[:focus-visible]:scale-90 motion-reduce:transform-none motion-reduce:transition-none [@media(hover:none)]:-translate-y-6 [@media(hover:none)]:scale-90"
              />
            </a>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#141819e6] via-[#14181955] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-has-[:focus-visible]:opacity-100 motion-reduce:transition-none [@media(hover:none)]:opacity-100"
            />

            <div className="absolute inset-x-5 bottom-5">
              <div className="mb-4 translate-y-3 opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-has-[:focus-visible]:translate-y-0 group-has-[:focus-visible]:opacity-100 motion-reduce:transform-none motion-reduce:transition-none [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
                <p className="text-[9px] tracking-[0.16em] text-[#bac6ac] uppercase">
                  {product.category}
                </p>
                <h3 id={titleId} className="mt-2 text-[14px] leading-snug font-semibold tracking-[-0.015em] text-[#efefea]">
                  <a href={`#/products/${product.id}`} onClick={openProduct} className="hover:text-[var(--accent)]">{product.name}</a>
                </h3>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <p aria-label={`Price: ${price}`} className="text-2xl leading-none font-bold tracking-[-0.045em] tabular-nums">
                  {price}
                </p>
                <button
                  ref={addButtonRef}
                  type="button"
                  disabled={product.quantity === 0}
                  onClick={openConfiguration}
                  aria-expanded={configuring}
                  aria-controls={panelId}
                  aria-label={product.quantity === 0 ? `${product.name} is sold out` : available === 0 ? `View cart for ${product.name}` : `Add ${product.name} to cart`}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#d0e5a433] bg-[var(--accent)] px-4 text-[11px]! font-semibold! whitespace-nowrap text-[#171b13] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-has-[:focus-visible]:opacity-100 motion-reduce:transition-none disabled:cursor-default disabled:opacity-40 [@media(hover:none)]:opacity-100"
                >
                  <Icon name="cart" className="size-3.5" />
                  {product.quantity === 0 ? 'Sold out' : available === 0 ? 'View Cart' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>

          <form
            ref={panelRef}
            id={panelId}
            inert={!configuring}
            aria-hidden={!configuring}
            aria-label={`Configure ${product.name}`}
            onSubmit={confirmAdd}
            onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeConfiguration() } }}
            className={`${faceClassName} flex flex-col gap-5 overflow-y-auto bg-[#171c1d]/95 p-5 backdrop-blur-2xl [transform:rotateY(180deg)] [@media(prefers-reduced-transparency:reduce)]:bg-[#171c1d] [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none`}
          >
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-[9px] tracking-[0.16em] text-[#bac6ac] uppercase">{product.category}</p>
                <button type="button" onClick={closeConfiguration} aria-label={`Cancel adding ${product.name}`} className="min-h-8 text-[10px]! text-[var(--muted)] underline underline-offset-4 hover:text-[var(--accent)]">Cancel</button>
              </div>
              <h3 id={`${panelId}-title`} title={product.name} className="text-[22px] leading-tight font-bold tracking-[-0.035em]">{shortName}</h3>
              <p className="mt-2 text-[11px] text-[var(--muted)]">{price} each</p>
              <p role="status" aria-atomic="true" className={`mt-2 text-[12px] leading-relaxed ${stock.state === 'low' ? 'text-amber-200' : 'text-[var(--muted)]'}`}>{stock.message}</p>
            </div>
            <fieldset>
              <legend className="mb-3 text-[9px] tracking-[0.12em] text-[var(--muted)] uppercase">Select size</legend>
              <div className="flex gap-3">
                {product.sizes.map((size, index) => (
                  <label key={size} className="cursor-pointer">
                    <input ref={index === 0 ? sizeRef : undefined} type="radio" name={sizeId} value={size} checked={selection.size === size} onChange={() => shop.onSizeChange(product.id, size)} aria-label={`Size ${size} for ${product.name}`} className="peer sr-only" />
                    <span className="flex size-10 items-center justify-center rounded-full border border-white/25 text-[11px] transition-colors peer-checked:border-[var(--accent)] peer-checked:bg-[var(--accent)] peer-checked:text-[#171b13] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--accent)] hover:border-[var(--accent)] motion-reduce:transition-none">{size}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="flex flex-wrap items-end justify-between gap-3 border-t border-white/10 pt-4">
              <div>
                <p className="mb-2 text-[9px] tracking-[0.12em] text-[var(--muted)] uppercase">Quantity</p>
                <QuantityControl compact label={product.name} value={quantity} min={available > 0 ? 1 : 0} max={available} onChange={(value) => shop.onQuantityChange(product.id, value)} />
              </div>
              <div className="pb-1 text-right">
                <p className="mb-2 text-[9px] tracking-[0.12em] text-[var(--muted)] uppercase">Subtotal</p>
                <p aria-label={`Subtotal: ${formatPrice(product.price * quantity)}`} className="text-[19px] leading-none font-semibold tracking-[-0.035em] tabular-nums">{formatPrice(product.price * quantity)}</p>
              </div>
            </div>
            <button type="submit" disabled={!selection.size || available === 0} aria-label={`Confirm add ${product.name} to cart`} className="mt-auto inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 text-[11px]! font-semibold! text-[#171b13] transition-colors hover:bg-[#deedbf] disabled:cursor-default disabled:opacity-45 motion-reduce:transition-none">
              <Icon name="cart" className="size-4" /> {selection.size ? 'Confirm Add' : 'Select a size to continue'}
            </button>
          </form>
        </div>
      </article>
    </div>
  )
}
