'use client'

import type { CSSProperties, ReactNode } from 'react'

// Server-rendered pages (service and area pages) can't attach onClick
// handlers themselves. This opens the booking popup via the same
// ttd:book-now event SiteFooter and the homepage already listen for, so
// "Book" never navigates away from the page the visitor is reading.
export default function BookNowButton({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('ttd:book-now'))}
      style={{ border: 'none', cursor: 'pointer', ...style }}
    >
      {children}
    </button>
  )
}
