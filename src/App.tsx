import { useEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import AddProductPage from './components/AddProductPage'
import Brand from './components/Brand'
import CartPage from './components/CartPage'
import CategorySection from './components/CategorySection'
import EditorialSection from './components/EditorialSection'
import Footer from './components/Footer'
import ProductDetailPage from './components/ProductDetailPage'
import ProfileMenu from './components/ProfileMenu'
import ProductShowcase from './components/ProductShowcase'
import ProductPreviewSection from './components/ProductPreviewSection'
import ProductsPage from './components/ProductsPage'
import type { SortOrder } from './components/ProductsPage'
import Sidebar from './components/Sidebar'
import type { NavigationItem } from './components/Sidebar'
import { products as defaultProducts } from './data/products'
import { createProduct, customProductsStorageKey, restoreCustomProducts } from './data/catalog'
import type { ProductDraft } from './data/catalog'
import { editorial } from './data/editorial'
import { cartStorageKey, quantityInCart, restoreCart, updateCartItemSize } from './data/shop'
import type { CartItem, ProductActions, ProductSelection } from './data/shop'
import './App.css'

const navigation: NavigationItem[] = [
  { label: 'Home', icon: 'home' },
  { label: 'Products', icon: 'shirt' },
  { label: 'Categories', icon: 'layers', sectionId: 'categories' },
  { label: 'About', icon: 'info', sectionId: 'about' },
  { label: 'Cart', icon: 'cart' },
]

type Destination = 'Home' | 'Products' | 'Categories' | 'About' | 'Cart'
type View = { destination: Destination; productId?: string; category?: string | null; addingProduct?: boolean }

function readView(): View {
  const [path = '', query = ''] = window.location.hash.slice(1).split('?')
  if (path === '/products/new') return { destination: 'Products', addingProduct: true }
  if (path.startsWith('/products/')) {
    try { return { destination: 'Products', productId: decodeURIComponent(path.slice('/products/'.length)) } }
    catch { return { destination: 'Products' } }
  }
  if (path === '/products' || path === 'products') {
    const category = new URLSearchParams(query).get('category')
    return { destination: 'Products', category: category || null }
  }
  if (path === '/cart') return { destination: 'Cart' }
  if (path === 'categories') return { destination: 'Categories' }
  if (path === 'about') return { destination: 'About' }
  return { destination: 'Home' }
}

function viewHash(view: View) {
  if (view.addingProduct) return '#/products/new'
  if (view.productId) return `#/products/${encodeURIComponent(view.productId)}`
  if (view.destination === 'Products') return `#/products${view.category ? `?category=${encodeURIComponent(view.category)}` : ''}`
  if (view.destination === 'Cart') return '#/cart'
  if (view.destination === 'Categories') return '#categories'
  if (view.destination === 'About') return '#about'
  return '#/'
}

function positionView(view: View, scrollY = 0) {
  const sectionId = view.destination === 'Categories' ? 'categories' : view.destination === 'About' ? 'about' : null
  const target = document.getElementById(sectionId ?? 'main-content')
  if (sectionId) {
    target?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  } else {
    window.scrollTo({ top: scrollY, behavior: 'instant' })
  }
  target?.focus({ preventScroll: true })
}

function App() {
  const [customProducts, setCustomProducts] = useState(() => restoreCustomProducts(defaultProducts))
  const products = useMemo(() => [...customProducts, ...defaultProducts], [customProducts])
  const [view, setView] = useState<View>(readView)
  const [productCategory, setProductCategory] = useState<string | null>(view.category ?? null)
  const [query, setQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<SortOrder>('featured')
  const [selections, setSelections] = useState<Record<string, ProductSelection>>({})
  const [cartItems, setCartItems] = useState<CartItem[]>(() => restoreCart(products))
  const [notice, setNotice] = useState<{ message: string; productId?: string } | null>(null)
  const activeDestination = view.destination
  const activePage = activeDestination === 'Categories' || activeDestination === 'About' ? 'Home' : activeDestination
  const detailProduct = products.find((product) => product.id === view.productId)
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const navigationItems = navigation.map((item) => item.label === 'Cart' ? { ...item, count: cartCount } : item)
  const cartEntries = cartItems.flatMap((item) => {
    const product = products.find((entry) => entry.id === item.productId)
    return product ? [{ ...item, product }] : []
  })

  useEffect(() => {
    const originalRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    function syncLocation() {
      const next = readView()
      flushSync(() => {
        setView(next)
        if (next.destination === 'Products' && !next.productId && !next.addingProduct) setProductCategory(next.category ?? null)
      })
      positionView(next, Number(window.history.state?.scrollY) || 0)
    }
    window.addEventListener('hashchange', syncLocation)
    positionView(readView())
    return () => {
      window.removeEventListener('hashchange', syncLocation)
      window.history.scrollRestoration = originalRestoration
    }
  }, [])

  useEffect(() => {
    try { localStorage.setItem(cartStorageKey, JSON.stringify(cartItems)) }
    catch { /* The in-memory cart stays usable if browser storage is unavailable. */ }
  }, [cartItems])

  useEffect(() => {
    if (!notice) return
    const timeout = window.setTimeout(() => setNotice(null), 5000)
    return () => window.clearTimeout(timeout)
  }, [notice])

  function goTo(next: View) {
    const previousHash = window.location.hash || '#/'
    window.history.replaceState({ ...window.history.state, scrollY: window.scrollY }, '', window.location.href)
    if (window.location.hash !== viewHash(next)) {
      window.history.pushState({ returnHash: next.productId || next.addingProduct ? previousHash : null }, '', viewHash(next))
    }
    flushSync(() => {
      setView(next)
      if (next.destination === 'Products' && !next.productId && !next.addingProduct) setProductCategory(next.category ?? null)
    })
    positionView(next)
  }

  function navigate(destination: string, category: string | null = null) {
    const item = navigation.find((entry) => entry.label === destination)
    if (!item) return
    if (destination === 'Cart') setNotice(null)
    if (destination === 'Products') {
      setQuery('')
      setSortOrder('featured')
    }
    goTo({ destination: destination as Destination, category })
  }

  function changeCategory(category: string | null) {
    setProductCategory(category)
    const next: View = { destination: 'Products', category }
    setView(next)
    window.history.replaceState(window.history.state, '', viewHash(next))
  }

  function backToCollection() {
    const previous: unknown = window.history.state?.returnHash
    if (typeof previous === 'string' && /^#\/products(?:\?|$)/.test(previous)) window.history.back()
    else navigate('Products')
  }

  function addProduct(draft: ProductDraft): string | null {
    try {
      const product = createProduct(draft)
      const nextProducts = [product, ...customProducts]
      // Commit storage first, so a failed save keeps the form and its image intact.
      localStorage.setItem(customProductsStorageKey, JSON.stringify(nextProducts))
      setCustomProducts(nextProducts)
      setQuery('')
      setSortOrder('featured')
      setNotice({ message: `${product.name} added to the collection.`, productId: product.id })
      goTo({ destination: 'Products' })
      return null
    } catch (error) {
      if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        return 'Your browser storage is full. Choose a smaller image and try again.'
      }
      return 'The product could not be saved in this browser. Check that site storage is available and try again.'
    }
  }

  function getAvailableQuantity(productId: string) {
    const product = products.find((entry) => entry.id === productId)
    return Math.max(0, (product?.quantity ?? 0) - quantityInCart(cartItems, productId))
  }

  function getSelection(productId: string): ProductSelection {
    const selection = selections[productId]
    return {
      size: selection?.size ?? null,
      quantity: Math.min(selection?.quantity ?? 1, Math.max(1, getAvailableQuantity(productId))),
    }
  }

  function changeQuantity(productId: string, quantity: number) {
    const available = getAvailableQuantity(productId)
    if (!Number.isFinite(quantity) || available === 0) return
    setSelections((current) => ({ ...current, [productId]: { size: current[productId]?.size ?? null, quantity: Math.max(1, Math.min(available, Math.trunc(quantity))) } }))
  }

  function changeSize(productId: string, size: string) {
    if (!products.find((product) => product.id === productId)?.sizes.includes(size)) return
    setSelections((current) => ({ ...current, [productId]: { size, quantity: current[productId]?.quantity ?? 1 } }))
  }

  function addToCart(productId: string) {
    const product = products.find((entry) => entry.id === productId)
    const selection = getSelection(productId)
    if (!product || !selection.size || !product.sizes.includes(selection.size) || getAvailableQuantity(productId) < selection.quantity) return false
    const size = selection.size
    setCartItems((current) => {
      if (product.quantity - quantityInCart(current, productId) < selection.quantity) return current
      const existing = current.find((item) => item.productId === productId && item.size === size)
      return existing
        ? current.map((item) => item === existing ? { ...item, quantity: item.quantity + selection.quantity } : item)
        : [...current, { productId, size, quantity: selection.quantity }]
    })
    setSelections((current) => ({ ...current, [productId]: { size, quantity: 1 } }))
    const shortName = product.name.match(/^"([^"]+)"/)?.[1] ?? product.name
    setNotice({ message: `${selection.quantity} × ${shortName} · Size ${size} added to your cart.` })
    return true
  }

  function changeCartQuantity(productId: string, size: string, quantity: number) {
    if (!Number.isFinite(quantity)) return
    setCartItems((current) => {
      const product = products.find((entry) => entry.id === productId)
      const target = current.find((item) => item.productId === productId && item.size === size)
      if (!product || !target) return current
      const max = product.quantity - quantityInCart(current, productId) + target.quantity
      return current.map((item) => item === target ? { ...item, quantity: Math.max(1, Math.min(max, Math.trunc(quantity))) } : item)
    })
  }

  function changeCartSize(productId: string, originalSize: string, nextSize: string) {
    setCartItems((current) => updateCartItemSize(current, products, productId, originalSize, nextSize))
  }

  const shop: ProductActions = {
    getSelection, getAvailableQuantity, onQuantityChange: changeQuantity, onSizeChange: changeSize,
    onAddToCart: addToCart, onOpenProduct: (productId) => goTo({ destination: 'Products', productId }),
    onViewCart: () => navigate('Cart'),
  }

  return (
    <div className="relative isolate min-h-svh overflow-x-clip bg-[radial-gradient(ellipse_at_84%_0%,#5459624f,transparent_45%),radial-gradient(ellipse_at_70%_90%,#475b3c42,transparent_42%),radial-gradient(ellipse_at_4%_50%,#36333e40,transparent_42%),linear-gradient(#0c0d10,#0c0d10)] p-4 [--sidebar-width:80px] [--showcase-height:calc(100svh_-_32px)] max-[760px]:p-3 max-[760px]:[--sidebar-width:60px] max-[760px]:[--showcase-height:calc(100svh_-_24px)] before:pointer-events-none before:fixed before:top-[14%] before:right-[13%] before:-z-1 before:h-[64vh] before:w-[34vw] before:rounded-full before:bg-[#7d849228] before:blur-[90px] before:rotate-[-30deg]">
      <a href="#main-content" onClick={(event) => {
        event.preventDefault()
        const main = document.getElementById('main-content')
        main?.focus({ preventScroll: true })
        main?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
      }} className="fixed -top-24 left-8 z-100 rounded-md bg-[var(--accent)] p-3 text-[13px] font-medium text-[#151713] focus:top-2.5">Skip to content</a>
      <Brand onHome={() => navigate('Home')} />
      <Sidebar items={navigationItems} activePage={activeDestination} onNavigate={navigate} />
      <div className="ml-[var(--sidebar-width)] min-w-0 [--topbar-height:72px] max-[760px]:[--topbar-height:54px]">
        <header className="relative z-10 flex min-h-[var(--topbar-height)] items-center justify-end gap-4 pr-[3%] pl-[max(80px,3%)] max-[760px]:gap-2.5 max-[760px]:pl-[30px]"><ProfileMenu /></header>
        <main id="main-content" className={activePage === 'Home' ? '-mt-[var(--topbar-height)] pt-0 outline-none' : view.addingProduct ? 'pt-4 outline-none' : 'pt-[38px] outline-none max-[760px]:pt-7'} tabIndex={-1}>
          {activePage === 'Home' ? (
            <>
              <ProductShowcase products={products} shop={shop} featuredProductId={customProducts[0]?.id} />
              <EditorialSection campaign={editorial.campaign} detail={editorial.detail} />
              <ProductPreviewSection products={products} shop={shop} featuredProductId={customProducts[0]?.id} onViewAll={() => navigate('Products')} />
              <CategorySection products={products} onCategorySelect={(category) => navigate('Products', category)} />
            </>
          ) : activePage === 'Products' ? (
            view.addingProduct ? (
              <AddProductPage categories={[...new Set(products.map((product) => product.category))]} onCreate={addProduct} onBack={backToCollection} />
            ) : view.productId ? (
              detailProduct ? <ProductDetailPage key={detailProduct.id} product={detailProduct} shop={shop} onBack={backToCollection} onCategory={(category) => navigate('Products', category)} /> : (
                <section className="mx-[3%] py-16"><h1 className="text-3xl font-black tracking-[-0.04em] uppercase">Piece not found.</h1><button type="button" onClick={() => navigate('Products')} className="mt-6 min-h-11 rounded-full bg-[var(--accent)] px-6 text-[12px]! text-[#171b13]">Back to collection</button></section>
              )
            ) : <ProductsPage products={products} shop={shop} category={productCategory} onCategoryChange={changeCategory} query={query} onQueryChange={setQuery} sortOrder={sortOrder} onSortOrderChange={setSortOrder} onAddProduct={() => { setNotice(null); goTo({ destination: 'Products', addingProduct: true }) }} />
          ) : (
            <CartPage items={cartEntries} onQuantityChange={changeCartQuantity} onSizeChange={changeCartSize} onRemove={(productId, size) => setCartItems((current) => current.filter((item) => item.productId !== productId || item.size !== size))} onOpenProduct={shop.onOpenProduct} onContinue={() => navigate('Products')} />
          )}
        </main>
        <Footer items={navigationItems} activePage={activeDestination} onNavigate={navigate} />
      </div>

      {notice && (
        <div role="status" aria-live="polite" className="fixed right-4 bottom-4 z-50 w-[min(26rem,calc(100vw_-_6rem))] rounded-2xl border border-[var(--accent)]/25 bg-[#202627]/95 p-4 shadow-[0_16px_50px_#00000060] backdrop-blur-2xl">
          <div className="flex items-start justify-between gap-4"><p className="text-[12px] leading-relaxed text-[#e5ebdd]">{notice.message}</p><button type="button" aria-label="Dismiss notification" onClick={() => setNotice(null)} className="flex size-7 shrink-0 items-center justify-center rounded-full text-[18px]! text-[var(--muted)] hover:bg-white/10">×</button></div>
          <button type="button" onClick={() => { setNotice(null); if (notice.productId) shop.onOpenProduct(notice.productId); else navigate('Cart') }} className="mt-3 min-h-8 text-[10px]! font-medium! text-[var(--accent)] underline underline-offset-4">{notice.productId ? 'View product' : 'View Cart'}</button>
        </div>
      )}
    </div>
  )
}

export default App
