import Icon from './Icon'
import type { IconName } from './Icon'

export type NavigationItem = {
  label: string
  icon: IconName
  sectionId?: string
  count?: number
}

type SidebarProps = {
  items: NavigationItem[]
  activePage: string
  onNavigate: (page: string) => void
}

export default function Sidebar({
  items,
  activePage,
  onNavigate,
}: SidebarProps) {
  return (
    <aside className="fixed top-1/2 left-7 z-30 -translate-y-1/2 max-[760px]:left-3 [@media(360px<height<=500px)]:top-[72px] [@media(max-height:500px)]:translate-y-0 [@media(max-height:360px)]:top-[68px]" aria-label="Sidebar">
      <nav aria-label="Main navigation" className="flex flex-col gap-3 border-l border-white/15 pl-3 max-[760px]:pl-2.5 [@media(360px<height<=500px)]:gap-1.5 [@media(max-height:360px)]:gap-0.5">
        {items.map(({ label, icon, sectionId, count }) => (
          <button
            key={label}
            type="button"
            onClick={() => onNavigate(label)}
            aria-label={count ? `${label}, ${count} ${count === 1 ? 'item' : 'items'}` : label}
            aria-current={activePage === label ? (sectionId ? 'location' : 'page') : undefined}
            className={`group relative flex size-[46px] items-center justify-center rounded-[9px] transition-colors duration-150 before:absolute before:top-1/2 before:-left-[13px] before:h-[22px] before:w-0.5 before:-translate-y-1/2 before:bg-[var(--accent)] hover:bg-[var(--accent)]/5 hover:text-[var(--accent)] focus-visible:bg-[var(--accent)]/5 focus-visible:text-[var(--accent)] motion-reduce:transition-none max-[760px]:size-11 max-[760px]:before:-left-[11px] [@media(max-height:500px)]:size-11 ${activePage === label ? 'text-[var(--accent)] before:opacity-100' : 'text-[#969da2] before:opacity-0'}`}
          >
            <Icon name={icon} className="shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5 motion-reduce:transition-none" />
            {!!count && <span aria-hidden="true" className="absolute -top-0.5 -right-0.5 flex min-w-4 items-center justify-center rounded-full bg-[var(--accent)] px-1 py-0.5 text-[8px] leading-none font-bold text-[#171b13]">{count}</span>}
            <span className="pointer-events-none invisible absolute top-1/2 left-[calc(100%_+_12px)] -translate-x-1 -translate-y-1/2 rounded-lg border border-white/10 bg-[#202428]/95 px-[13px] py-[9px] text-[12px] whitespace-nowrap text-[#e8eddf] opacity-0 shadow-[0_8px_24px_#0004] backdrop-blur-lg transition-[opacity,transform] duration-150 group-hover:visible group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:visible group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:transition-none" aria-hidden="true">{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
