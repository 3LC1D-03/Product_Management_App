import { useId } from 'react'
import Icon from './Icon'

type EditorialImage = {
  src: string
  alt: string
  caption: string
}

type EditorialSectionProps = {
  campaign: EditorialImage
  detail: EditorialImage
}

export default function EditorialSection({ campaign, detail }: EditorialSectionProps) {
  const titleId = useId()
  const identityTitleId = useId()

  return (
    <>
      <section
        id="cid-editorial"
        aria-labelledby={titleId}
        className="mx-[3%] mt-12 mb-12 scroll-mt-6"
      >
        <header className="mb-7 flex items-center justify-between gap-4 pb-5 text-[8px] tracking-[0.18em] uppercase md:text-[9px]">
          <p className="text-[#dde4d4]">
            CID <span className="mx-1 text-[#727e70]">/</span> Editorial <span className="text-[var(--accent)]">001</span>
          </p>
          <p className="text-[#9ba49b]">Campaign — Lookbook</p>
        </header>

        <div className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
          <figure className="relative min-w-0 overflow-hidden rounded-xl bg-[#131717]">
            <img
              src={campaign.src}
              alt={campaign.alt}
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full object-cover object-[center_32%]"
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/65 to-transparent" />
            <figcaption className="absolute right-6 bottom-6 left-6 flex items-center gap-2 text-[8px] tracking-[0.15em] text-[#e4e8de]">
              <span className="size-1 rounded-full bg-[var(--accent)]" aria-hidden="true" />
              {campaign.caption}
            </figcaption>
          </figure>

          <div className="flex min-w-0 flex-col">
            <div className="pt-1">
              <h2
                id={titleId}
                aria-label="Wear your identity."
                className="text-[clamp(2rem,3.3vw,3.6rem)] leading-[1.02] font-extrabold tracking-[-0.045em] text-[#edefe7] uppercase"
              >
                <span className="block">Wear your</span>
                <span className="block">identity.</span>
              </h2>
              <p className="mt-5 max-w-[26rem] text-[13px] leading-[1.9] text-[#b1b7b5]">
                A new perspective on streetwear. Built around individuality and creative expression.
              </p>
              <p className="mt-7 text-[8px] tracking-[0.22em] text-[#8e9b87] uppercase">
                Concept. Identity. Design.
              </p>
            </div>

            <figure className="mt-10 ml-auto w-[88%] lg:mt-auto lg:pt-14">
              <img
                src={detail.src}
                alt={detail.alt}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full rounded-lg object-cover"
              />
              <figcaption className="mt-3 text-[7px] tracking-[0.17em] text-[#9da79a] md:text-[8px]">
                {detail.caption}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section
        id="cid-identity"
        aria-labelledby={identityTitleId}
        className="@container mx-[3%] mt-24 mb-12 flex min-w-0 flex-col py-8 md:mt-36 md:py-12 lg:min-h-[80svh]"
      >
        <header className="flex items-center justify-between gap-4 text-[8px] tracking-[0.16em] text-[var(--muted)] uppercase md:text-[9px]">
          <p>CID® / The philosophy</p>
          <p className="shrink-0">004 — Identity</p>
        </header>

        <h2
          id={identityTitleId}
          className="mt-12 text-[clamp(2.5rem,19cqw,17rem)] leading-[0.87] font-black tracking-[-0.065em] uppercase md:mt-16"
        >
          <span className="block">Concept.</span>
          <span className="block">Identity.</span>
          <span className="block">Design.</span>
        </h2>

        <div className="mt-12 grid gap-4 border-t border-white/15 pt-6 md:mt-16 md:grid-cols-2 md:gap-12 md:pt-8">
          <h3 className="max-w-[22rem] text-[clamp(1.1rem,2vw,1.65rem)] leading-tight font-bold tracking-[-0.025em] uppercase">
            More than what you wear.
          </h3>
          <p className="max-w-[25rem] text-[13px] leading-[1.9] text-[var(--muted)] md:justify-self-end">
            An expression of individuality, creativity, and the freedom to define your own identity.
          </p>
        </div>

        <footer className="mt-12 flex items-center justify-between gap-4 text-[7px] tracking-[0.16em] text-[var(--muted)] uppercase md:mt-16 md:text-[8px]">
          <p>Concept / Identity / Design</p>
          <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center">
            <Icon name="arrow" className="size-5 rotate-45 md:size-6" />
          </span>
        </footer>
      </section>
    </>
  )
}
