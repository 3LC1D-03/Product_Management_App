import Icon from './Icon'

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
}

export default function SearchBar({
  value,
  onChange,
  label = 'Search products',
  placeholder = 'Search products...',
}: SearchBarProps) {
  return (
    <div className="glass-panel flex w-full items-center gap-3 rounded-[10px] px-4 py-[13px] text-[#a4a6af] focus-within:border-[var(--accent)]/40 focus-within:ring-[3px] focus-within:ring-[var(--accent)]/5 max-[760px]:gap-2 max-[760px]:p-3">
      <Icon name="search" className="size-[17px] shrink-0" />
      <input
        type="search"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 w-full flex-1 bg-transparent text-[13px] leading-5 text-[#e7e7e5] outline-none placeholder:text-[#989aa4] focus-visible:outline-none"
      />
    </div>
  )
}
