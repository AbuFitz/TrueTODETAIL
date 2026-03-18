'use client'

import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Packages', href: '#packages' },
  { label: 'About',    href: '#about'    },
  { label: 'Contact',  href: '#contact'  },
]

export default function Navbar({ onBookNow }: { onBookNow: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 h-16 flex items-center transition-all duration-300 ${
          scrolled
            ? 'bg-white/96 backdrop-blur-md shadow-[0_1px_0_rgba(12,12,12,0.06)]'
            : 'bg-white border-b border-[#0C0C0C]/[0.05]'
        }`}
      >
        <div className="w-full max-w-[1380px] mx-auto px-6 md:px-10 flex items-center h-full">

          {/* Logo */}
          <a href="#" className="flex-shrink-0 select-none">
            <span className="font-display tracking-[0.07em] text-ink" style={{ fontSize: '19px' }}>
              TRUE TO
            </span>
            <span className="font-display tracking-[0.07em] text-orange" style={{ fontSize: '19px' }}>
              &nbsp;DETAIL
            </span>
          </a>

          <div className="flex-1" />

          {/* Desktop links */}
          <div className="hidden md:flex items-center">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="px-5 h-16 inline-flex items-center font-body font-medium
                           text-[13px] tracking-[0.04em] text-ink/45 hover:text-ink
                           transition-colors duration-200 relative group"
              >
                {l.label}
                <span
                  className="absolute bottom-0 left-5 right-5 h-[2px] bg-orange
                             scale-x-0 group-hover:scale-x-100 transition-transform
                             duration-250 origin-left"
                />
              </a>
            ))}

            <div className="w-px h-5 bg-ink/10 mx-3 flex-shrink-0" />

            <button
              onClick={onBookNow}
              className="font-body font-semibold text-[12px] tracking-[0.08em] uppercase
                         bg-ink text-white px-5 py-2.5 ml-1
                         hover:bg-orange transition-colors duration-200 flex-shrink-0"
            >
              Book Now
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center gap-[5px] w-10 h-10"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <span
              className={`h-[1.5px] bg-ink transition-all duration-300 origin-center ${
                open ? 'w-6 rotate-45 translate-y-[6.5px]' : 'w-6'
              }`}
            />
            <span
              className={`h-[1.5px] bg-ink transition-all duration-300 ${
                open ? 'opacity-0 w-4' : 'w-4'
              }`}
            />
            <span
              className={`h-[1.5px] bg-ink transition-all duration-300 origin-center ${
                open ? 'w-6 -rotate-45 -translate-y-[6.5px]' : 'w-6'
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      <div
        className={`fixed inset-0 z-40 bg-ink flex flex-col pt-16 transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex-1 flex flex-col justify-center px-8 py-6">
          <p className="section-label text-white/20 mb-8">Navigation</p>
          {NAV_LINKS.map((l, i) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between py-5 border-b border-white/[0.06] group"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-body text-[10px] text-white/20 w-5 tabular-nums">0{i + 1}</span>
                <span
                  className="font-display text-white group-hover:text-orange
                             transition-colors duration-200 leading-none"
                  style={{ fontSize: '52px', letterSpacing: '0.04em' }}
                >
                  {l.label}
                </span>
              </div>
              <span className="text-white/20 group-hover:text-orange transition-colors text-sm">↗</span>
            </a>
          ))}
        </div>

        <div className="px-8 pb-10 border-t border-white/[0.06] pt-6">
          <button
            onClick={() => { setOpen(false); onBookNow() }}
            className="w-full bg-orange text-white font-body font-semibold
                       text-[12px] tracking-[0.1em] uppercase flex items-center
                       justify-between px-6 py-4 hover:bg-orange-dark transition-colors"
          >
            Book Your Detail
            <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
          </button>
          <p className="font-body text-[11px] text-white/20 mt-4 tracking-wider">
            07984 237149 · Mon–Sat 8am–7pm
          </p>
        </div>
      </div>
    </>
  )
}
