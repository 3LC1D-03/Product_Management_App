import type { ProductInfo } from './products'

export const customProductsStorageKey = 'cid-products-v1'
export const maxProductImageLength = 1_500_000

export type ProductDraft = {
  image: string
  name: string
  category: string
  description: string
  specifications: string
  rating: string
  price: string
  quantity: string
}

export type ProductFormErrors = Partial<Record<keyof ProductDraft, string>>

function validImage(image: string) {
  return image.length <= maxProductImageLength && /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(image)
}

export function validateProductDraft(draft: ProductDraft): ProductFormErrors {
  const errors: ProductFormErrors = {}
  if (!draft.image) errors.image = 'Choose a feature image.'
  else if (!validImage(draft.image)) errors.image = 'Choose a smaller PNG image.'
  if (!draft.name.trim()) errors.name = 'Enter a product name.'
  else if (draft.name.trim().length > 160) errors.name = 'Keep the product name within 160 characters.'
  if (!draft.category.trim()) errors.category = 'Choose a product category.'
  if (!draft.description.trim()) errors.description = 'Add a description of the piece.'
  if (!draft.specifications.trim()) errors.specifications = 'Add at least one product specification.'

  const rating = Number(draft.rating)
  if (!draft.rating.trim()) errors.rating = 'Enter a rating from 0 to 5.'
  else if (!Number.isFinite(rating) || rating < 0 || rating > 5) errors.rating = 'Rating must be between 0 and 5.'
  const price = Number(draft.price)
  if (!draft.price.trim()) errors.price = 'Enter a price in pesos.'
  else if (!/^\d+(?:\.\d{1,2})?$/.test(draft.price.trim()) || !Number.isFinite(price) || price <= 0 || price > Number.MAX_SAFE_INTEGER / 100) errors.price = 'Enter a price above zero, with up to two decimal places.'
  const quantity = Number(draft.quantity)
  if (!draft.quantity.trim()) errors.quantity = 'Enter the available stock.'
  else if (!/^\d+$/.test(draft.quantity.trim()) || !Number.isSafeInteger(quantity)) errors.quantity = 'Stock must be a whole number of zero or more.'
  return errors
}

export function createProduct(draft: ProductDraft): ProductInfo {
  if (Object.keys(validateProductDraft(draft)).length > 0) throw new Error('Complete the required product information.')
  return {
    id: `custom-${crypto.randomUUID()}`,
    name: draft.name.trim(),
    category: draft.category.trim(),
    description: draft.description.trim(),
    specifications: draft.specifications.split(/\r?\n/).map((line) => line.trim()).filter(Boolean),
    rating: Number(draft.rating),
    price: Number(draft.price),
    quantity: Number(draft.quantity),
    currency: 'PHP',
    sizes: ['S', 'M', 'XL'],
    images: { featured: draft.image, transparent: draft.image },
  }
}

/** Restore only complete products; saved entries cannot replace the default catalog. */
export function restoreCustomProducts(defaults: ProductInfo[]): ProductInfo[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(customProductsStorageKey) ?? '[]')
    if (!Array.isArray(saved)) return []
    const ids = new Set(defaults.map((product) => product.id))
    return saved.flatMap((entry: unknown) => {
      if (!entry || typeof entry !== 'object') return []
      const product = entry as Record<string, unknown>
      if (typeof product.id !== 'string' || !product.id.startsWith('custom-') || ids.has(product.id)
        || typeof product.name !== 'string' || typeof product.category !== 'string'
        || typeof product.description !== 'string' || !Array.isArray(product.specifications)
        || product.specifications.length === 0 || !product.specifications.every((line) => typeof line === 'string' && line.trim())
        || typeof product.rating !== 'number' || typeof product.price !== 'number' || typeof product.quantity !== 'number'
        || product.currency !== 'PHP' || !product.images || typeof product.images !== 'object') return []
      const images = product.images as Record<string, unknown>
      if (typeof images.featured !== 'string' || typeof images.transparent !== 'string' || !validImage(images.transparent)) return []
      const draft: ProductDraft = {
        image: images.featured, name: product.name, category: product.category, description: product.description,
        specifications: product.specifications.join('\n'), rating: String(product.rating), price: String(product.price), quantity: String(product.quantity),
      }
      if (Object.keys(validateProductDraft(draft)).length > 0) return []
      ids.add(product.id)
      return [{
        id: product.id, name: draft.name.trim(), category: draft.category.trim(), description: draft.description.trim(),
        specifications: draft.specifications.split('\n').map((line) => line.trim()).filter(Boolean),
        rating: product.rating, price: product.price, quantity: product.quantity,
        currency: 'PHP' as const, sizes: ['S', 'M', 'XL'],
        images: { featured: images.featured, transparent: images.transparent },
      }]
    })
  } catch {
    return []
  }
}
