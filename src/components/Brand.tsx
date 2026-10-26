type BrandProps = {
  onHome: () => void
}

export default function Brand({ onHome }: BrandProps) {
  return (
    <a
      className="fixed top-[26px] left-7 z-30 inline-flex min-h-11 w-fit items-center text-[#f4f4f0] no-underline max-[760px]:top-[22px] max-[760px]:left-5 [@media(max-height:500px)]:top-2.5"
      href="#/"
      aria-label="CID home"
      onClick={(event) => { if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) { event.preventDefault(); onHome() } }}
    >
      <span className="text-[46px] leading-[0.95] font-black tracking-[-3px] max-[760px]:text-[34px] max-[760px]:tracking-[-2px] [@media(max-height:500px)]:text-[32px]">CID</span>
    </a>
  )
}
