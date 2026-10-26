import Icon from './Icon'

type FooterProps = {
  items: readonly { label: string; sectionId?: string }[]
  activePage: string
  onNavigate: (page: string) => void
}

export default function Footer({ items, activePage, onNavigate }: FooterProps) {
  function backToTop() {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    })
    document.getElementById('main-content')?.focus({ preventScroll: true })
  }

  return (
    <footer aria-label="CID footer" className="mx-[3%] mt-20 border-t border-white/10 pt-9 pb-5 md:mt-24 md:pt-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)] md:gap-12">
        <div className="min-w-0">
          <span className="block text-[46px] leading-[0.95] font-black tracking-[-3px] max-[760px]:text-[34px] max-[760px]:tracking-[-2px]">CID</span>
          <p className="mt-3 text-[8px] tracking-[0.18em] text-[var(--muted)] uppercase md:text-[9px]">
            Concept. Identity. Design.
          </p>
          <p className="mt-4 max-w-[22rem] text-[12px] leading-relaxed text-[var(--muted)]">
            An expression of individuality through streetwear.
          </p>
        </div>

        <nav aria-label="Footer navigation" className="min-w-0">
          <h2 className="text-[11px] font-medium tracking-[0.18em] text-[var(--muted)] uppercase">
            Explore
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
            {items.map(({ label, sectionId }) => (
              <li key={label}>
                <button
                  type="button"
                  onClick={() => onNavigate(label)}
                  aria-current={activePage === label ? (sectionId ? 'location' : 'page') : undefined}
                  className={`min-h-11 py-1 text-left text-[12px] hover:text-[var(--accent)] ${activePage === label ? 'text-[var(--accent)]' : 'text-[#d2d5cd]'}`}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-white/10 pt-5">
        <p className="text-[9px] tracking-[0.04em] text-[var(--muted)]">
          © {new Date().getFullYear()} CID. All rights reserved.
        </p>
        <button
          type="button"
          onClick={backToTop}
          className="inline-flex min-h-11 items-center gap-2 py-1 text-[11px] font-medium tracking-[0.12em] text-[#d2d5cd] uppercase hover:text-[var(--accent)]"
        >
          Back to top <Icon name="arrow" className="size-4 -rotate-90" />
        </button>
      </div>
    </footer>
  )
}
