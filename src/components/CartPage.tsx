import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { CartEntry } from '../data/shop'
import { formatPrice, getStockStatus, quantityInCart } from '../data/shop'
import Icon from './Icon'
import QuantityControl from './QuantityControl'

type CartPageProps = {
  items: CartEntry[]
  onQuantityChange: (productId: string, size: string, quantity: number) => void
  onSizeChange: (productId: string, originalSize: string, nextSize: string) => void
  onRemove: (productId: string, size: string) => void
  onOpenProduct: (productId: string) => void
  onContinue: () => void
}

type SizeEdit = { productId: string; originalSize: string; nextSize: string }

export default function CartPage({ items, onQuantityChange, onSizeChange, onRemove, onOpenProduct, onContinue }: CartPageProps) {
  const editorId = useId()
  const editorRef = useRef<HTMLFormElement>(null)
  const editButtonsRef = useRef(new Map<string, HTMLButtonElement>())
  const [sizeEdit, setSizeEdit] = useState<SizeEdit | null>(null)
  const [sizeNotice, setSizeNotice] = useState('')
  const editingKey = sizeEdit ? `${sizeEdit.productId}-${sizeEdit.originalSize}` : null
  const lines = items.map((item) => ({ ...item, subtotal: item.product.price * item.quantity }))
  const count = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = lines.reduce((sum, item) => sum + item.subtotal, 0)

  useEffect(() => {
    if (!editingKey) return
    editorRef.current?.querySelector<HTMLInputElement>('input:checked')?.focus({ preventScroll: true })
  }, [editingKey])

  function returnFocus(productId: string, size: string) {
    window.requestAnimationFrame(() => editButtonsRef.current.get(`${productId}-${size}`)?.focus({ preventScroll: true }))
  }

  function cancelSizeEdit() {
    if (!sizeEdit) return
    returnFocus(sizeEdit.productId, sizeEdit.originalSize)
    setSizeEdit(null)
    setSizeNotice('Size change cancelled.')
  }

  function confirmSizeEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!sizeEdit) return
    const { productId, originalSize, nextSize } = sizeEdit
    const item = items.find((entry) => entry.productId === productId && entry.size === originalSize)
    if (!item || !item.product.sizes.includes(nextSize) || originalSize === nextSize) return
    const existing = items.find((entry) => entry.productId === productId && entry.size === nextSize)
    onSizeChange(productId, originalSize, nextSize)
    setSizeEdit(null)
    const name = item.product.name.match(/^"([^"]+)"/)?.[1] ?? item.product.name
    setSizeNotice(existing ? `${name}, size ${nextSize}, combined into ${existing.quantity + item.quantity} pieces.` : `${name} updated to size ${nextSize}.`)
    returnFocus(productId, nextSize)
  }

  return (
    <section aria-labelledby="cart-title" className="mx-[3%] min-w-0">
      <header className="mb-9 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-[12px] font-medium tracking-[0.16em] text-[#b4c29f] uppercase">Your everyday rotation</p>
          <h1 id="cart-title" className="text-[clamp(2rem,3.4vw,3.25rem)] leading-[1.05] font-black tracking-[-0.05em] uppercase">Your cart.</h1>
        </div>
        <p className="text-[11px] text-[var(--muted)]">{count} {count === 1 ? 'piece' : 'pieces'}</p>
      </header>
      <p role="status" aria-live="polite" className="sr-only">{sizeNotice}</p>

      {items.length === 0 ? (
        <div className="flex min-h-[55svh] flex-col items-center justify-center py-16 text-center">
          <Icon name="cart" className="mb-6 size-10 text-[var(--accent)]" />
          <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-black tracking-[-0.04em] uppercase">Your rotation starts here.</h2>
          <p className="mt-4 max-w-xs text-[12px] leading-relaxed text-[var(--muted)]">Your cart is empty. Find a piece that feels like you.</p>
          <button type="button" onClick={onContinue} className="mt-7 min-h-12 rounded-full bg-[var(--accent)] px-7 text-[12px]! font-semibold! text-[#171b13]">Explore the collection</button>
        </div>
      ) : (
        <div className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <ul aria-label="Cart items" className="min-w-0 space-y-4">
            {items.map(({ product, size, quantity }) => {
              const available = Math.max(0, product.quantity - quantityInCart(items, product.id))
              const max = available + quantity
              const stock = getStockStatus(product.quantity, available)
              const label = `${product.name}, size ${size}`
              const itemKey = `${product.id}-${size}`
              const editing = editingKey === itemKey
              const matchingSize = editing && sizeEdit?.nextSize !== size && items.some((item) => item.productId === product.id && item.size === sizeEdit?.nextSize)
              return (
                <li key={itemKey} className="glass-panel relative grid min-w-0 grid-cols-[5rem_minmax(0,1fr)] gap-4 rounded-2xl p-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:p-5">
                  <button type="button" onClick={() => { if (editing) setSizeEdit(null); onRemove(product.id, size) }} aria-label={`Remove ${label}`} title={`Remove size ${size}`} className="absolute top-3 right-3 z-10 flex size-8 items-center justify-center rounded-full text-[var(--muted)] transition-colors hover:bg-white/10 hover:text-[var(--accent)] motion-reduce:transition-none"><Icon name="trash" className="size-4" /></button>
                  <button type="button" onClick={() => onOpenProduct(product.id)} aria-label={`View ${product.name}`} className="relative aspect-[3/4] self-start overflow-hidden rounded-lg">
                    <img src={product.images.transparent} alt={product.name} className="absolute top-0 -left-1/4 h-full w-[150%] max-w-none object-contain drop-shadow-[0_10px_10px_#00000030]" />
                  </button>
                  <div className="min-w-0">
                    <p className="pr-10 text-[8px] tracking-[0.12em] text-[var(--muted)] uppercase">{product.category}</p>
                    <h2 className="mt-4 text-[13px] leading-snug font-semibold"><button type="button" onClick={() => onOpenProduct(product.id)} className="text-left text-[13px]! font-semibold! hover:text-[var(--accent)]">{product.name}</button></h2>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <span aria-label={`Selected size: ${size}`} className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-[#d8dfcf]">Size {size}</span>
                      <button ref={(node) => { if (node) editButtonsRef.current.set(itemKey, node); else editButtonsRef.current.delete(itemKey) }} type="button" aria-label={`Edit size for ${label}`} aria-expanded={editing} aria-controls={editing ? editorId : undefined} onClick={() => { setSizeNotice(''); setSizeEdit({ productId: product.id, originalSize: size, nextSize: size }) }} className="min-h-8 text-[10px]! text-[var(--accent)] underline underline-offset-4 hover:text-[#e2edca]">Edit size</button>
                      <p className="text-[11px] text-[var(--muted)]">{formatPrice(product.price)} each</p>
                    </div>
                    <div className="mt-4">
                      <p className="mb-2 text-[8px] tracking-[0.12em] text-[var(--muted)] uppercase">Quantity</p>
                      <QuantityControl compact label={label} value={quantity} max={max} onChange={(value) => onQuantityChange(product.id, size, value)} />
                    </div>
                    <div role="status" aria-atomic="true">
                      {stock.state !== 'available' && <p className={`mt-3 text-[12px] leading-relaxed ${stock.state === 'low' ? 'text-amber-200' : 'text-[var(--muted)]'}`}>{stock.message}</p>}
                    </div>
                  </div>
                  {editing && sizeEdit && (
                    <form ref={editorRef} id={editorId} aria-label={`Edit size for ${label}`} onSubmit={confirmSizeEdit} onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); cancelSizeEdit() } }} className="col-span-2 grid min-w-0 gap-4 border-t border-white/10 pt-4 sm:grid-cols-[auto_1fr]">
                      <fieldset>
                        <legend className="mb-3 text-[9px] tracking-[0.12em] text-[var(--muted)] uppercase">Choose a size</legend>
                        <div className="flex flex-wrap gap-3">
                          {product.sizes.map((option) => (
                            <label key={option} className="cursor-pointer">
                              <input type="radio" name={`${editorId}-size`} value={option} checked={sizeEdit.nextSize === option} onChange={() => setSizeEdit({ ...sizeEdit, nextSize: option })} aria-label={`New size ${option} for ${label}`} className="peer sr-only" />
                              <span className="flex size-10 items-center justify-center rounded-full border border-white/25 text-[11px] text-[#d8dfcf] transition-colors peer-checked:border-[var(--accent)] peer-checked:bg-[var(--accent)] peer-checked:text-[#171b13] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--accent)] hover:border-[var(--accent)] motion-reduce:transition-none">{option}</span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                      <div className="flex flex-wrap items-end gap-3 sm:justify-end">
                        <button type="submit" disabled={sizeEdit.nextSize === size} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 text-[11px]! font-semibold! text-[#171b13] hover:bg-[#deedbf] disabled:cursor-default disabled:opacity-40"><Icon name="check" className="size-3.5" />Confirm</button>
                        <button type="button" onClick={cancelSizeEdit} className="min-h-10 rounded-full border border-white/20 bg-white/5 px-4 text-[11px]! text-[#d8dfcf] hover:bg-white/10">Cancel</button>
                      </div>
                      {matchingSize && <p className="text-[10px] leading-relaxed text-[var(--muted)] sm:col-span-2">Size {sizeEdit.nextSize} is already in your cart. Confirm combines both quantities.</p>}
                    </form>
                  )}
                </li>
              )
            })}
          </ul>

          <aside aria-label="Cart summary" className="glass-panel h-fit min-w-0 rounded-2xl p-6 xl:sticky xl:top-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-[10px] font-semibold tracking-[0.12em] uppercase">Your selection</h2>
              <span className="text-[8px] tracking-[0.12em] text-[var(--muted)] uppercase">Subtotal</span>
            </div>
            <ul aria-label="Selection breakdown" tabIndex={0} className="mt-5 max-h-64 space-y-3 overflow-y-auto overscroll-contain pr-1 [scrollbar-color:#d0e5a440_transparent] [scrollbar-width:thin] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]">
              {lines.map(({ product, size, quantity, subtotal }) => (
                <li key={`${product.id}-${size}`} className="min-w-0 border-b border-white/10 pb-3 last:border-0 last:pb-0">
                  <p aria-label={product.name} title={product.name} className="text-[12px] leading-snug font-semibold">{product.name.match(/^"([^"]+)"/)?.[1] ?? product.name}</p>
                  <p className="mt-2 text-[10px] text-[var(--muted)]">Qty {quantity} <span aria-hidden="true" className="mx-1">·</span> Size {size}</p>
                  <div className="mt-2 flex flex-wrap items-baseline justify-between gap-3 tabular-nums">
                    <p className="text-[10px] text-[var(--muted)]">{formatPrice(product.price)} × {quantity} =</p>
                    <p aria-label={`Selection subtotal for ${product.name}, size ${size}: ${formatPrice(subtotal)}`} className="text-[14px] font-semibold tracking-[-0.025em]">{formatPrice(subtotal)}</p>
                  </div>
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-4 text-[12px]">
              <div className="flex justify-between gap-4 text-[var(--muted)]"><dt>Pieces</dt><dd className="tabular-nums">{count}</dd></div>
              <div className="flex items-baseline justify-between gap-4 border-t border-white/10 pt-5"><dt className="font-medium">Total</dt><dd aria-label={`Cart total: ${formatPrice(total)}`} aria-live="polite" aria-atomic="true" className="text-2xl font-bold tracking-[-0.04em] tabular-nums">{formatPrice(total)}</dd></div>
            </dl>
            <button type="button" disabled aria-describedby="checkout-status" className="mt-7 min-h-12 w-full cursor-default rounded-full bg-[var(--accent)] px-4 text-[11px]! font-semibold! text-[#171b13] opacity-55">Check out</button>
            <p id="checkout-status" className="mt-3 text-center text-[10px] leading-relaxed text-[var(--muted)]">Checkout is coming soon.</p>
          </aside>
        </div>
      )}
    </section>
  )
}
