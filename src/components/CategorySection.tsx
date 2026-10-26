import { useId } from 'react'
import type { CSSProperties } from 'react'
import type { ProductInfo } from '../data/products'

type CategorySectionProps = {
  products: ProductInfo[]
  onCategorySelect: (category: string) => void
}

type CategoryStyle = CSSProperties & {
  '--category-fill': string
  '--category-ink': string
}

const categories = [
  {
    id: 'graphic-tees',
    name: 'Graphic Tees',
    productId: 'eternal-reverie',
    quote: 'Let the graphic do the talking.',
    fill: '#d9d1bf',
    ink: '#1b211c',
  },
  {
    id: 'hoodies',
    name: 'Hoodies',
    productId: 'overgrowth',
    quote: 'Stay grounded. Grow beyond.',
    fill: '#315543',
    ink: '#f2f0e9',
  },
  {
    id: 'sweatshirts',
    name: 'Sweatshirts',
    productId: 'ascension-ashes-rust',
    quote: 'Rebuilt for your own rebellion.',
    fill: '#9f3d2f',
    ink: '#fff5eb',
  },
  {
    id: 'tank-tops',
    name: 'Tank Tops',
    productId: 'static-void',
    quote: 'Less noise. More presence.',
    fill: '#3e4245',
    ink: '#f0f0e9',
  },
]

export default function CategorySection({ products, onCategorySelect }: CategorySectionProps) {
  const titleId = useId()
  const aboutTitleId = useId()

  return (
    <>
      <section id="categories" tabIndex={-1} aria-labelledby={titleId} className="mx-[3%] mt-24 mb-16 min-w-0 scroll-mt-8 outline-none md:mt-36">
        <h2 id={titleId} className="mb-8 text-[clamp(1.4rem,3vw,2.5rem)] leading-tight font-black tracking-[-0.04em] uppercase">
          Find your fit.
        </h2>

        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const product = products.find((item) => item.id === category.productId)
            if (!product) return null

            const categoryId = `${titleId}-${category.id}`
            const style: CategoryStyle = {
              '--category-fill': category.fill,
              '--category-ink': category.ink,
            }

            return (
              <a
                key={category.id}
                href={`#/products?category=${encodeURIComponent(category.name)}`}
                onClick={(event) => {
                  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
                  event.preventDefault()
                  onCategorySelect(category.name)
                }}
                aria-labelledby={categoryId}
                aria-describedby={`${categoryId}-quote`}
                style={style}
                className="group relative isolate block h-[clamp(28rem,42vw,40rem)] min-w-0 overflow-hidden no-underline outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-solid focus-visible:outline-[var(--accent)]"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 origin-bottom scale-y-0 bg-[var(--category-fill)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100 motion-reduce:transition-none [@media(hover:none)]:scale-y-100"
                />

                <img
                  src={product.images.transparent}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  className="pointer-events-none absolute top-0 -left-1/4 h-full w-[150%] max-w-none object-contain drop-shadow-[0_20px_18px_#00000040] transition-transform duration-500 ease-out group-hover:-translate-y-8 group-hover:scale-95 group-focus-visible:-translate-y-8 group-focus-visible:scale-95 motion-reduce:transition-none [@media(hover:none)]:-translate-y-8 [@media(hover:none)]:scale-95"
                />

                <div className="absolute inset-x-5 bottom-6 translate-y-3 text-[var(--category-ink)] opacity-0 transition-[opacity,translate] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-150 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:delay-150 motion-reduce:transition-none [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
                  <h3 id={categoryId} className="text-[clamp(1.25rem,1.65vw,1.75rem)] leading-tight font-black tracking-[-0.035em] uppercase">
                    {category.name}
                  </h3>
                  <p id={`${categoryId}-quote`} className="mt-2 max-w-[15rem] text-[12px] leading-relaxed">
                    {category.quote}
                  </p>
                </div>
              </a>
            )
          })}
        </div>
      </section>

      <section
        id="about"
        tabIndex={-1}
        aria-labelledby={aboutTitleId}
        className="mx-[3%] mt-24 min-w-0 scroll-mt-8 py-6 outline-none md:mt-36"
      >
        <header className="flex flex-wrap items-center justify-between gap-3 text-[8px] tracking-[0.18em] text-[var(--muted)] uppercase md:text-[9px]">
          <p>CID / About the label</p>
          <p>Independent streetwear</p>
        </header>

        <div className="mt-10 grid min-w-0 gap-8 lg:mt-14 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <h2 id={aboutTitleId} className="max-w-[12ch] text-[clamp(2.25rem,5.6vw,5.5rem)] leading-[0.98] font-black tracking-[-0.055em] uppercase">
            Streetwear.<br />On your terms.
          </h2>
          <div className="max-w-[30rem] self-end text-[13px] leading-[1.9] text-[var(--muted)]">
            <p>
              CID stands for <span className="text-[#e3e7dc]">Concept. Identity. Design.</span> A space for self-expression through oversized silhouettes, graphic storytelling, and pieces with character.
            </p>
            <p className="mt-5">
              From graphic tees and tank tops to heavyweight hoodies and deconstructed sweatshirts, our collection brings together expressive artwork and an independent point of view. Wear what feels like you.
            </p>
          </div>
        </div>

        <dl className="mt-12 grid gap-7 border-t border-white/15 pt-7 md:mt-16 md:grid-cols-3 md:gap-10">
          {[
            { name: 'Concept', text: 'Every piece begins with a different perspective.' },
            { name: 'Identity', text: 'Your individuality gives it meaning.' },
            { name: 'Design', text: 'Expressive details. Everyday silhouettes.' },
          ].map(({ name, text }, index) => (
            <div key={name}>
              <dt className="flex items-baseline gap-3 text-[13px] font-bold tracking-[0.04em] uppercase">
                <span className="text-[8px] font-normal tracking-[0.12em] text-[var(--accent)]">0{index + 1}</span>
                {name}.
              </dt>
              <dd className="mt-3 max-w-[17rem] text-[12px] leading-relaxed text-[var(--muted)]">{text}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  )
}
