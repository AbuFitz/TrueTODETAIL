'use client'

import { useState, useEffect } from 'react'

const navLinks = [
  { label: 'Packages', href: '#packages' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar({ onBookNow }: { onBookNow: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      {/* ── MAIN NAV ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
          scrolled ? 'shadow-[0_1px_0_rgba(0,0,0,0.07)]' : 'border-b border-black/[0.06]'
        }`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center h-[64px] px-8 md:px-12">

          {/* LOGO */}
          <a href="#" className="flex items-center flex-shrink-0 group">
            <span
              className="font-display text-site-black leading-none"
              style={{ fontSize: '22px', letterSpacing: '0.06em' }}
            >
              TRUE TO
            </span>
            <span
              className="font-display text-orange leading-none"
              style={{ fontSize: '22px', letterSpacing: '0.06em' }}
            >
              &nbsp;DETAIL
            </span>
          </a>

          <div className="flex-1" />

          {/* Desktop nav — clean text links, no backgrounds */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="btn-nav h-[64px]">
                {link.label}
              </a>
            ))}

            <div className="w-px h-5 bg-black/12 mx-4 flex-shrink-0" />

            <button
              onClick={onBookNow}
              className="flex items-center gap-3 bg-site-black text-white
                         font-body font-semibold text-[12px] tracking-[0.1em] uppercase
                         px-6 py-3 hover:bg-orange transition-colors duration-200 flex-shrink-0"
            >
              Book Now
              <span className="w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 flex-shrink-0"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-[5px]">
              <span className={`block h-[1.5px] bg-site-black transition-all duration-300 ${menuOpen ? 'w-6 rotate-45 translate-y-[6.5px]' : 'w-6'}`} />
              <span className={`block h-[1.5px] bg-site-black transition-all duration-300 ${menuOpen ? 'opacity-0 w-4' : 'w-4'}`} />
              <span className={`block h-[1.5px] bg-site-black transition-all duration-300 ${menuOpen ? 'w-6 -rotate-45 -translate-y-[6.5px]' : 'w-6'}`} />
            </div>
          </button>

        </div>
      </nav>

      {/* ── MOBILE FULLSCREEN MENU ── */}
      <div
        className={`fixed inset-0 z-40 bg-site-black flex flex-col pt-[64px] overflow-y-auto
                    transition-opacity duration-250 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="px-8 pt-10 pb-2">
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-white/20">Menu</p>
        </div>
        {navLinks.map((link, i) => (
          <a
            key={link.label}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-between px-8 py-7 border-t border-white/[0.06] group"
          >
            <div className="flex items-baseline gap-5">
              <span className="font-body text-[10px] text-white/20 tabular-nums w-5">0{i + 1}</span>
              <span className="font-display text-[52px] uppercase leading-none text-white group-hover:text-orange transition-colors duration-150">
                {link.label}
              </span>
            </div>
            <span className="text-white/20 group-hover:text-orange transition-colors text-lg">↗</span>
          </a>
        ))}

        <div className="px-8 py-8 mt-auto border-t border-white/[0.06]">
          <button
            onClick={() => { setMenuOpen(false); onBookNow() }}
            className="w-full bg-orange text-white py-4 font-body font-semibold
                       text-[12px] tracking-[0.1em] uppercase flex items-center
                       justify-between px-6 hover:bg-orange-dark transition-colors"
          >
            Book Your Pack
            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
          </button>
          <p className="font-body text-[11px] tracking-wider text-white/25 mt-5">
            07984 237149 · Mon–Sat 8am–7pm
          </p>
        </div>
      </div>
    </>
  )
}
