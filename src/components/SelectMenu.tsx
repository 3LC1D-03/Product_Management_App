import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import Icon from './Icon'

type SelectMenuProps<Value extends string> = {
  label: string
  value: Value
  options: readonly { value: Value; label: string }[]
  onChange: (value: Value) => void
  id?: string
  invalid?: boolean
  describedBy?: string
}

export default function SelectMenu<Value extends string>({ label, value, options, onChange, id, invalid, describedBy }: SelectMenuProps<Value>) {
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value))
  const selected = options[selectedIndex]

  useEffect(() => {
    if (!open) return
    listRef.current?.focus({ preventScroll: true })

    function dismissOutside(event: PointerEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false)
    }

    document.addEventListener('pointerdown', dismissOutside)
    return () => document.removeEventListener('pointerdown', dismissOutside)
  }, [open])

  function showOptions(index = selectedIndex) {
    setActiveIndex(index)
    setOpen(true)
  }

  function choose(index: number) {
    onChange(options[index].value)
    setOpen(false)
    triggerRef.current?.focus({ preventScroll: true })
  }

  function handleKeys(event: KeyboardEvent<HTMLUListElement>) {
    if (event.key === 'Tab') {
      // Let Tab continue from the trigger to the next or previous control.
      setOpen(false)
      triggerRef.current?.focus({ preventScroll: true })
    } else if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
      triggerRef.current?.focus({ preventScroll: true })
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      choose(activeIndex)
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((current) => (current + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length)
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      setActiveIndex(event.key === 'Home' ? 0 : options.length - 1)
    } else if (event.key.length === 1) {
      const nextIndex = options.findIndex((_, offset) => (
        options[(activeIndex + 1 + offset) % options.length].label.toLowerCase().startsWith(event.key.toLowerCase())
      ))
      if (nextIndex >= 0) {
        event.preventDefault()
        setActiveIndex((activeIndex + 1 + nextIndex) % options.length)
      }
    }
  }

  return (
    <div
      ref={rootRef}
      className="relative z-20 min-w-0"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
    >
      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        aria-label={`${label}: ${selected.label}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => open ? setOpen(false) : showOptions()}
        onKeyDown={(event) => {
          if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
            event.preventDefault()
            showOptions(event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : selectedIndex)
          }
        }}
        className={`glass-panel flex min-h-12 w-full items-center gap-3 rounded-[10px] px-4 text-left text-[12px] text-[#e7e7e5] transition-colors hover:bg-white/[0.08] motion-reduce:transition-none ${open ? 'border-[var(--accent)]/40 bg-white/[0.08]' : ''} ${invalid ? 'border-rose-300/60' : ''}`}
      >
        <span className="shrink-0 text-[12px] tracking-[0.04em] text-[var(--muted)] uppercase">{label}</span>
        <span className="min-w-0 flex-1 truncate">{selected.label}</span>
        <Icon name="chevron" className={`size-4 shrink-0 text-[var(--muted)] transition-transform duration-150 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={label}
          aria-activedescendant={`${listId}-${activeIndex}`}
          tabIndex={-1}
          onKeyDown={handleKeys}
          className="absolute top-full right-0 mt-2 w-full origin-top-right rounded-xl border border-white/15 bg-[#1d2226]/95 p-1.5 shadow-[0_20px_60px_#00000070,inset_0_1px_0_#ffffff0d] backdrop-blur-2xl outline-none sm:w-64 [@media(prefers-reduced-transparency:reduce)]:bg-[#202428] [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none"
        >
          {options.map((option, index) => (
            <li key={option.value} role="presentation">
              <button
                id={`${listId}-${index}`}
                type="button"
                role="option"
                aria-selected={option.value === value}
                tabIndex={-1}
                onPointerMove={() => setActiveIndex(index)}
                onClick={() => choose(index)}
                className={`flex min-h-11 w-full items-center justify-between gap-4 rounded-lg px-3 text-left text-[12px]! transition-colors motion-reduce:transition-none ${option.value === value
                  ? 'bg-[var(--accent)]/12 text-[var(--accent)]'
                  : 'text-[#c7cdc6]'} ${index === activeIndex ? 'ring-1 ring-white/15 ring-inset' : ''} ${index === activeIndex && option.value !== value ? 'bg-white/[0.07]' : ''}`}
              >
                {option.label}
                {option.value === value && <Icon name="check" className="size-4 shrink-0" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
