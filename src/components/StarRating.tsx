import Icon from './Icon'

type StarRatingProps = {
  rating: number
  showValue?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export default function StarRating({ rating, showValue = false, size = 'sm', className = '' }: StarRatingProps) {
  const starSize = size === 'md' ? 'size-4.5' : 'size-3.5'
  return (
    <div
      role="img"
      aria-label={`Rated ${rating.toFixed(1)} out of 5 stars`}
      className={`inline-flex items-center gap-2 text-white ${className}`}
    >
      <span aria-hidden="true" className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index} className={`relative inline-block ${starSize}`}>
            <Icon name="star" className={`${starSize} text-white/40`} />
            <span
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${Math.max(0, Math.min(1, rating - index)) * 100}%` }}
            >
              <Icon name="star" className={`${starSize} fill-white text-white`} />
            </span>
          </span>
        ))}
      </span>
      {showValue && <span aria-hidden="true" className={`${size === 'md' ? 'text-[12px]' : 'text-[10px]'} font-medium tabular-nums`}>{rating.toFixed(1)}</span>}
    </div>
  )
}
