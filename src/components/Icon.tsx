import type { ReactNode } from 'react'

export type IconName =
  | 'home'
  | 'panel'
  | 'shirt'
  | 'box'
  | 'layers'
  | 'cart'
  | 'info'
  | 'search'
  | 'chevron'
  | 'arrow'
  | 'check'
  | 'star'
  | 'trash'
  | 'plus'

const paths: Record<IconName, ReactNode> = {
  home: <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z" />,
  panel: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16m7-11-3 3 3 3" />
    </>
  ),
  shirt: (
    <>
      <path d="m8 3-5 3-2 5 5 2 1-2v10h10V11l1 2 5-2-2-5-5-3" />
      <path d="M8 3c0 5 8 5 8 0M9 13h6" />
    </>
  ),
  box: (
    <>
      <path d="m12 3 9 5v8l-9 5-9-5V8l9-5Z" />
      <path d="m3 8 9 5 9-5M12 13v8M7.5 5.5l9 5" />
    </>
  ),
  layers: <path d="m12 3 10 5-10 5L2 8l10-5ZM2 12l10 5 10-5M2 16l10 5 10-5" />,
  cart: (
    <>
      <path d="M3 3h2l2.5 12h11l2-8H6" />
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6m0-10v.01" />
    </>
  ),
  chevron: <path d="m8 10 4 4 4-4" />,
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  check: <path d="m5 12 4 4L19 6" />,
  star: <path d="m12 3 2.78 5.63 6.22.9-4.5 4.39 1.06 6.2L12 17.2l-5.56 2.92 1.06-6.2L3 9.53l6.22-.9L12 3Z" />,
  trash: <path d="M3 6h18M9 6V4h6v2m4 0-1 14H6L5 6m5 4v6m4-6v6" />,
  plus: <path d="M12 5v14M5 12h14" />,
}

type IconProps = {
  name: IconName
  className?: string
}

export default function Icon({ name, className = '' }: IconProps) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}
