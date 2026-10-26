type QuantityControlProps = {
  value: number
  max: number
  min?: number
  label: string
  compact?: boolean
  onChange: (quantity: number) => void
}

export default function QuantityControl({ value, max, min = 1, label, compact = false, onChange }: QuantityControlProps) {
  const buttonClass = `${compact ? 'size-8' : 'size-11'} flex shrink-0 items-center justify-center rounded-full text-[18px]! text-[#e8eddf] transition-colors hover:bg-white/10 disabled:cursor-default disabled:opacity-25 disabled:hover:bg-transparent motion-reduce:transition-none`

  return (
    <div role="group" aria-label={`Quantity for ${label}`} className="inline-flex shrink-0 items-center rounded-full border border-white/15 bg-white/[0.035] p-0.5">
      <button type="button" aria-label={`Decrease quantity for ${label}`} disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))} className={buttonClass}>−</button>
      <output aria-label={`Selected quantity for ${label}`} className="min-w-6 text-center text-[12px] text-[#f0f0eb] tabular-nums">{value}</output>
      <button type="button" aria-label={`Increase quantity for ${label}`} disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))} className={buttonClass}>+</button>
    </div>
  )
}
