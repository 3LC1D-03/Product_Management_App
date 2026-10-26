import type { ProductInfo } from '../data/products'
import type { ProductActions } from '../data/shop'
import { formatPrice, getInventoryStatus } from '../data/shop'
import Icon from './Icon'
import ProductCard from './ProductCard'
import SearchBar from './SearchBar'
import SelectMenu from './SelectMenu'

type ProductsPageProps = {
  products: ProductInfo[]
  category: string | null
  onCategoryChange: (category: string | null) => void
  query: string
  onQueryChange: (query: string) => void
  sortOrder: SortOrder
  onSortOrderChange: (order: SortOrder) => void
  shop: ProductActions
  onAddProduct: () => void
}

export type SortOrder = 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'

const sortOptions: { value: SortOrder; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name-asc', label: 'Name: A–Z' },
  { value: 'name-desc', label: 'Name: Z–A' },
]

export default function ProductsPage({ products, category, onCategoryChange, query, onQueryChange, sortOrder, onSortOrderChange, shop, onAddProduct }: ProductsPageProps) {
  const categories = [...new Set(products.map((product) => product.category))]
  const search = query.trim().toLowerCase()
  const hasFilters = query.length > 0 || category !== null
  const inventoryQuantity = products.reduce((sum, product) => sum + product.quantity, 0)
  const inventoryTotal = products.reduce((sum, product) => sum + product.price * product.quantity, 0)
  const lowStockCount = products.filter((product) => getInventoryStatus(product.quantity).state === 'low').length
  const visibleProducts = products.filter((product) => (
    (category === null || product.category === category)
    && product.name.toLowerCase().includes(search)
  ))

  if (sortOrder !== 'featured') {
    visibleProducts.sort((first, second) => {
      if (sortOrder === 'price-asc') return first.price - second.price
      if (sortOrder === 'price-desc') return second.price - first.price
      const nameOrder = first.name.localeCompare(second.name, 'en', { sensitivity: 'base', numeric: true })
      return sortOrder === 'name-asc' ? nameOrder : -nameOrder
    })
  }

  function clearFilters() {
    onQueryChange('')
    onCategoryChange(null)
  }

  return (
    <section id="products" aria-labelledby="products-title" className="mx-[3%] min-w-0">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div className="min-w-0">
          <p className="mb-2 text-[12px] font-medium tracking-[0.16em] text-[#b4c29f] uppercase">The everyday rotation</p>
          <h1 id="products-title" className="text-[clamp(2rem,3.4vw,3.25rem)] leading-[1.05] font-black tracking-[-0.05em] text-[#eeefea] uppercase">
            The collection.
          </h1>
          <p className="mt-3 text-[12px] leading-relaxed text-[var(--muted)]">
            Streetwear with a point of view. Yours.
          </p>
        </div>
      </header>

      <div className="mt-8 flex min-w-0 flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          {[null, ...categories].map((item) => (
            <button
              key={item ?? 'all'}
              type="button"
              aria-pressed={category === item}
              onClick={() => onCategoryChange(item)}
              className={`inline-flex min-h-12 items-center gap-2.5 rounded-full border px-4 py-2 text-[12px] transition-colors motion-reduce:transition-none ${category === item
                ? 'border-[var(--accent)] bg-[var(--accent)] text-[#171b13]'
                : 'border-white/10 bg-white/[0.025] text-[#b9c0b6] hover:border-white/25 hover:bg-white/[0.06] hover:text-[#efefea]'}`}
            >
              {item ?? 'All products'}
              <span className="text-[10px] tabular-nums opacity-65">
                {item === null ? products.length : products.filter((product) => product.category === item).length}
              </span>
            </button>
          ))}
        </div>

        <div className="grid w-full min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] lg:ml-auto lg:w-auto lg:grid-cols-[14rem_12.5rem_auto]">
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <SearchBar
              value={query}
              onChange={onQueryChange}
              label="Search products by name"
              placeholder="Search by product name..."
            />
          </div>
          <SelectMenu label="Sort by" value={sortOrder} options={sortOptions} onChange={onSortOrderChange} />
          <button type="button" onClick={onAddProduct} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-5 text-[12px] font-medium text-[var(--accent)] hover:border-[var(--accent)]/60 hover:bg-[var(--accent)]/15 motion-safe:transition-colors"><Icon name="plus" className="size-4" /> Add Product</button>
        </div>
      </div>

      <div className="mt-5 mb-6 flex min-h-8 flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <p role="status" aria-live="polite" aria-atomic="true" className="text-[12px] tracking-[0.04em] text-[var(--muted)]">
          Showing {visibleProducts.length} of {products.length} {products.length === 1 ? 'product' : 'products'}
        </p>
        {hasFilters && (
          <button type="button" onClick={clearFilters} className="min-h-8 text-[12px] text-[var(--accent)] underline decoration-[var(--accent)]/35 underline-offset-4 hover:decoration-[var(--accent)]">
            Clear filters
          </button>
        )}
      </div>

      <section aria-label="Product inventory" className="glass-panel mb-7 min-w-0 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-5">
          <div className="max-w-sm">
            <h2 className="text-[12px] font-semibold tracking-[0.08em] uppercase">Product inventory</h2>
            <p className="mt-2 text-[12px] leading-relaxed text-[var(--muted)]">Stock quantity × unit price across all products.</p>
            <p role="status" aria-atomic="true" className="text-[12px] text-amber-200">{lowStockCount > 0 && <span className="mt-2 inline-block">{lowStockCount} low-stock {lowStockCount === 1 ? 'product' : 'products'}</span>}</p>
          </div>
          <dl className="flex flex-wrap gap-x-8 gap-y-4">
            <div>
              <dt className="text-[12px] text-[var(--muted)]">Stock units</dt>
              <dd aria-label={`Catalog stock total: ${inventoryQuantity}`} aria-live="polite" aria-atomic="true" className="mt-1.5 text-[21px] font-semibold tracking-[-0.03em] tabular-nums">{inventoryQuantity}</dd>
            </div>
            <div>
              <dt className="text-[12px] text-[var(--muted)]">Inventory total</dt>
              <dd aria-label={`Product inventory total: ${formatPrice(inventoryTotal)}`} aria-live="polite" aria-atomic="true" className="mt-1.5 text-[21px] font-semibold tracking-[-0.03em] text-[var(--accent)] tabular-nums">{formatPrice(inventoryTotal)}</dd>
            </div>
          </dl>
        </div>
        <details className="group mt-5 border-t border-white/10 pt-3">
          <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-4 text-[12px] text-[#d4ddc8] hover:text-[var(--accent)] focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] [&::-webkit-details-marker]:hidden">
            View inventory breakdown
            <Icon name="chevron" className="size-4 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none" />
          </summary>
          <div tabIndex={0} aria-label="Scrollable inventory breakdown" className="mt-3 max-h-[32rem] overflow-auto overscroll-contain rounded-xl border border-white/10 [scrollbar-color:#d0e5a440_transparent] [scrollbar-width:thin] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]">
            <table aria-label="Product inventory" className="w-full min-w-[48rem] border-collapse text-left text-[12px]">
              <thead className="sticky top-0 z-10 bg-[#202627] text-[#c5cdbd]">
                <tr><th scope="col" className="px-4 py-3 font-medium">Product</th><th scope="col" className="px-4 py-3 font-medium">Unit price</th><th scope="col" className="px-4 py-3 text-right font-medium">Stock quantity</th><th scope="col" className="px-4 py-3 text-right font-medium">Inventory subtotal</th><th scope="col" className="px-4 py-3 font-medium">Stock status</th></tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {products.map((product) => {
                  const inventory = getInventoryStatus(product.quantity)
                  return (
                  <tr key={product.id} className="hover:bg-white/[0.025]">
                    <th scope="row" className="max-w-sm px-4 py-3 font-normal">
                      <a href={`#/products/${product.id}`} onClick={(event) => { if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); shop.onOpenProduct(product.id) }} className="flex items-center gap-3 hover:text-[var(--accent)]">
                        <img src={product.images.transparent} alt="" loading="lazy" className="size-12 shrink-0 object-contain" />
                        <span className="min-w-0"><span className="block leading-relaxed font-medium">{product.name}</span><span className="mt-1 block text-[12px] text-[var(--muted)]">{product.category}</span></span>
                      </a>
                    </th>
                    <td className="px-4 py-3 whitespace-nowrap tabular-nums">{formatPrice(product.price)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{product.quantity}</td>
                    <td className="px-4 py-3 text-right font-medium whitespace-nowrap tabular-nums">{formatPrice(product.price * product.quantity)}</td>
                    <td className="px-4 py-3"><span className={`inline-flex rounded-full border px-2.5 py-1 whitespace-nowrap ${inventory.state === 'low' ? 'border-amber-300/25 bg-amber-300/10 text-amber-200' : inventory.state === 'sold-out' ? 'border-white/15 bg-white/5 text-[var(--muted)]' : 'border-[var(--accent)]/20 bg-[var(--accent)]/5 text-[#c5d7ad]'}`}>{inventory.message}</span></td>
                  </tr>
                  )
                })}
              </tbody>
              <tfoot className="border-t border-white/15 bg-white/[0.025] font-semibold"><tr><th scope="row" className="px-4 py-3" colSpan={2}>All {products.length} products</th><td className="px-4 py-3 text-right tabular-nums">{inventoryQuantity}</td><td className="px-4 py-3 text-right whitespace-nowrap tabular-nums">{formatPrice(inventoryTotal)}</td><td /></tr></tfoot>
            </table>
          </div>
        </details>
      </section>

      {visibleProducts.length > 0 ? (
        <ul aria-label="Products" className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {visibleProducts.map((product) => (
            <li key={product.id} className="min-w-0">
              <ProductCard product={product} shop={shop} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex min-h-80 flex-col items-center justify-center py-16 text-center">
          <Icon name="search" className="mb-5 size-8 text-[var(--accent)]" />
          <h2 className="text-2xl font-black tracking-[-0.04em] uppercase">No pieces found.</h2>
          <p className="mt-3 max-w-xs text-[12px] leading-relaxed text-[var(--muted)]">
            Try a different product name or clear your filters to see the full collection.
          </p>
          <button type="button" onClick={clearFilters} className="mt-6 min-h-11 rounded-full bg-[var(--accent)] px-5 text-[11px]! font-semibold! text-[#171b13]">
            Clear filters
          </button>
        </div>
      )}
    </section>
  )
}
