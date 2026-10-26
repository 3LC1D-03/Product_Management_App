import type { ProductInfo } from './products'

export type ProductSelection = { size: string | null; quantity: number }
export type CartItem = { productId: string; size: string; quantity: number }
export type CartEntry = CartItem & { product: ProductInfo }

export type ProductActions = {
  getSelection: (productId: string) => ProductSelection
  getAvailableQuantity: (productId: string) => number
  onQuantityChange: (productId: string, quantity: number) => void
  onSizeChange: (productId: string, size: string) => void
  onAddToCart: (productId: string) => boolean
  onOpenProduct: (productId: string) => void
  onViewCart: () => void
}

export const cartStorageKey = 'cid-cart-v1'

export function formatPrice(amount: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency', currency: 'PHP', minimumFractionDigits: Number.isInteger(amount) ? 0 : 2, maximumFractionDigits: 2,
  }).format(amount)
}

export function quantityInCart(items: CartItem[], productId: string) {
  return items.reduce((total, item) => total + (item.productId === productId ? item.quantity : 0), 0)
}

/** Inventory highlights use stored stock, independently of unpurchased cart quantities. */
export function getInventoryStatus(stock: number) {
  if (stock <= 0) return { state: 'sold-out', message: 'Sold out' } as const
  if (stock < 5) return { state: 'low', message: 'Low stock' } as const
  return { state: 'available', message: 'In stock' } as const
}

/** Purchase availability is shared across sizes; a cart does not change inventory. */
export function getStockStatus(stock: number, available = stock) {
  const remaining = Math.max(0, Math.min(stock, available))
  if (stock <= 0) return { state: 'sold-out', remaining: 0, message: 'Sold out' } as const
  if (remaining === 0) return { state: 'in-cart', remaining, message: 'All available stock is in your cart' } as const
  if (remaining < 5) return { state: 'low', remaining, message: `Low stock · Only ${remaining} left to add` } as const
  return { state: 'available', remaining, message: `${remaining} available to add` } as const
}

/** Move a whole cart line to a size, combining only the same product/size pair. */
export function updateCartItemSize(items: CartItem[], catalog: ProductInfo[], productId: string, originalSize: string, nextSize: string): CartItem[] {
  const product = catalog.find((entry) => entry.id === productId)
  const source = items.find((item) => item.productId === productId && item.size === originalSize)
  if (!product || !source || originalSize === nextSize || !product.sizes.includes(nextSize)) return items

  const existing = items.find((item) => item.productId === productId && item.size === nextSize)
  if (!existing) return items.map((item) => item === source ? { ...item, size: nextSize } : item)
  return items.flatMap((item) => {
    if (item === source) return []
    return [item === existing ? { ...item, quantity: item.quantity + source.quantity } : item]
  })
}

/** Ignore stale or malformed saved items and respect stock across all sizes. */
export function restoreCart(catalog: ProductInfo[]): CartItem[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(cartStorageKey) ?? '[]')
    if (!Array.isArray(saved)) return []
    const restored: CartItem[] = []
    for (const item of saved) {
      if (!item || typeof item !== 'object') continue
      const product = catalog.find((entry) => entry.id === item.productId)
      if (!product || !product.sizes.includes(item.size) || !Number.isInteger(item.quantity) || item.quantity < 1) continue
      const quantity = Math.min(item.quantity, Math.max(0, product.quantity - quantityInCart(restored, product.id)))
      if (quantity === 0) continue
      const existing = restored.find((entry) => entry.productId === product.id && entry.size === item.size)
      if (existing) existing.quantity += quantity
      else restored.push({ productId: product.id, size: item.size, quantity })
    }
    return restored
  } catch {
    return []
  }
}
