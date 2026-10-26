import { useId, useState } from 'react'
import Icon from './Icon'

type ProfileMenuProps = {
  name?: string
  initials?: string
  greeting?: string
  description?: string
}

export default function ProfileMenu({
  name = 'Guest',
  initials,
  greeting = 'Welcome to CID.',
  description = 'You’re browsing as a guest.',
}: ProfileMenuProps) {
  const [open, setOpen] = useState(false)
  const detailsId = useId()
  const avatarText = initials ?? name.trim().split(/\s+/).slice(0, 2)
    .map((part) => part.charAt(0)).join('').toUpperCase()

  return (
    <div className="relative z-30">
      <button
        type="button"
        aria-label={`${name} profile`}
        className={`glass-panel flex min-h-11 items-center gap-3 rounded-[11px] py-2 pr-[13px] pl-2 transition-colors duration-150 hover:bg-white/[0.06] motion-reduce:transition-none max-[760px]:rounded-[9px] max-[760px]:p-[5px] ${open ? 'bg-white/[0.06]' : ''}`}
        aria-expanded={open}
        aria-controls={detailsId}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="relative flex size-[37px] shrink-0 items-center justify-center rounded-[7px] border border-white/15 bg-linear-135 from-[#4d5056] to-[#2d3036] text-[14px] font-semibold text-[#e3e6dc] max-[760px]:size-[34px]">
          {avatarText}<span className="absolute -right-[3px] -bottom-[3px] size-[7px] rounded-full border-2 border-[#26282c] bg-[var(--accent)]" />
        </span>
        <span className="text-left max-[760px]:hidden">
          <strong className="block text-[13px] font-medium text-[#e4e4e4]">{name}</strong>
        </span>
        <Icon name="chevron" className="ml-[9px] size-[15px] text-[#9a9ca5] max-[760px]:hidden" />
      </button>
      {open && (
        <div id={detailsId} className="glass-panel absolute top-[calc(100%_+_10px)] right-0 w-[235px] rounded-xl bg-[#202227]/95 bg-none p-[18px] text-[13px] shadow-[0_12px_40px_#0005]">
          <strong className="font-semibold text-[#e9eae4]">{greeting}</strong>
          <p className="mt-[7px] mb-4 leading-relaxed text-[#abadb4]">{description}</p>
          <button className="flex min-h-11 w-full items-center justify-between border-t border-white/10 pt-2.5 text-[var(--accent)]" type="button" onClick={() => setOpen(false)}>
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
      )}
    </div>
  )
}
