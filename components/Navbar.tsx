'use client'

import { useState, useEffect } from 'react'

const navLinks = [
  { label: 'PACKAGES', href: '#packages' },
  { label: 'SERVICES', href: '#services' },
  { label: 'ABOUT', href: '#about' },
  { label: 'CONTACT', href: '#contact' },
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
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-200 overflow-visible ${
          scrolled ? 'shadow-[0_2px_16px_rgba(0,0,0,0.08)]' : ''
        }`}
      >
        <div className="flex items-stretch h-[68px]">

          {/* LOGO — Space Grotesk Bold, tight tracking like reference */}
          <a
            href="#"
            className="flex items-center pl-8 pr-10 flex-shrink-0 hover:opacity-80 transition-opacity duration-150"
          >
            <span
              className="font-wordmark font-bold uppercase text-site-black leading-none"
              style={{ fontSize: '20px', letterSpacing: '0.04em' }}
            >
              TRUE TO <span className="text-orange">DETAIL</span>
            </span>
          </a>

          <div className="flex-1" />

          {/* Desktop nav — orange link buttons + black CTA */}
          <div className="hidden md:flex items-stretch">

            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="btn-nav h-full"
              >
                {link.label}
              </a>
            ))}

            {/* BOOK NOW button — black, wider, protrudes slightly like reference */}
            <button
              onClick={onBookNow}
              className="relative flex items-center justify-between bg-site-black text-white
                         font-body font-semibold text-[11px] tracking-[0.14em] uppercase
                         hover:bg-orange transition-colors duration-150 flex-shrink-0"
              style={{
                minWidth: '210px',
                paddingLeft: '28px',
                paddingRight: '22px',
                height: '80px',
                marginTop: '-6px',
                marginBottom: '-6px',
              }}
            >
              BOOK NOW
              <span className="w-2 h-2 rounded-full bg-white/50 flex-shrink-0" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-14 flex-shrink-0"
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
        className={`fixed inset-0 z-40 bg-site-black flex flex-col pt-[68px] overflow-y-auto
                    transition-opacity duration-250 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="px-8 pt-8 pb-2">
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-white/20">Menu</p>
        </div>
        {navLinks.map((link, i) => (
          <a
            key={link.label}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-between px-8 py-7 border-t border-white/8 group"
          >
            <div className="flex items-baseline gap-5">
              <span className="font-body text-[10px] text-white/20 tabular-nums w-5">0{i + 1}</span>
              <span className="font-display font-black text-[48px] uppercase leading-none text-white group-hover:text-orange transition-colors duration-150">
                {link.label}
              </span>
            </div>
            <span className="text-white/20 group-hover:text-orange transition-colors text-xl">↗</span>
          </a>
        ))}

        <div className="px-8 py-8 mt-auto border-t border-white/8">
          <button
            onClick={() => { setMenuOpen(false); onBookNow() }}
            className="w-full bg-orange text-white py-5 font-body font-semibold
                       text-[11px] tracking-[0.14em] uppercase flex items-center
                       justify-between px-6 hover:bg-[#C53D08] transition-colors"
          >
            BOOK YOUR PACK
            <span className="w-2 h-2 rounded-full bg-white/50" />
          </button>
          <p className="font-body text-[10px] tracking-wider text-white/20 mt-5">
            07984 237149 · Mon–Sat 8am–7pm
          </p>
        </div>
      </div>
    </>
  )
}
