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
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      {/* Announcement bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-7 bg-site-black flex items-center justify-center overflow-hidden">
        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/40 whitespace-nowrap">
          100% Mobile — We Come To You&nbsp;
          <span className="text-orange mx-1">·</span>&nbsp;
          Same-Day Slots Available&nbsp;
          <span className="text-orange mx-1">·</span>&nbsp;
          Hemel Hempstead &amp; Hertfordshire
        </p>
      </div>

      {/* Main nav — 72px height */}
      <nav
        className={`fixed top-7 left-0 right-0 z-50 bg-white transition-shadow duration-300 overflow-visible ${
          scrolled ? 'shadow-[0_2px_20px_rgba(0,0,0,0.08)]' : 'border-b border-black/10'
        }`}
      >
        <div className="flex items-stretch h-[72px]">

          {/* LOGO — Barlow 900 normal-width + wide letter-spacing = dragged wordmark */}
          <a
            href="#"
            className="flex items-center pl-8 pr-10 border-r border-black/10 hover:bg-site-light transition-colors duration-200 flex-shrink-0"
          >
            <span
              className="font-wordmark font-black uppercase leading-none text-site-black"
              style={{ fontSize: '22px', letterSpacing: '0.22em' }}
            >
              TRUE TO <span className="text-orange">DETAIL</span>
            </span>
          </a>

          <div className="flex-1" />

          {/* Desktop nav */}
          <div className="hidden md:flex items-stretch">

            {/* Nav links — solid orange like S&Y reference, always on */}
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center px-6 bg-orange text-white font-mono font-semibold text-[11px] tracking-[0.1em] uppercase border-l border-[#C53D08] hover:bg-[#C53D08] transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}

            {/* BOOK NOW — black, wider than nav links, protrudes 6px top+bottom */}
            <button
              onClick={onBookNow}
              className="relative flex items-center justify-between bg-site-black text-white font-mono font-semibold text-[11px] tracking-[0.14em] uppercase hover:bg-orange transition-colors duration-150 flex-shrink-0"
              style={{ minWidth: '210px', paddingLeft: '28px', paddingRight: '22px', height: '84px', marginTop: '-6px', marginBottom: '-6px' }}
            >
              BOOK NOW
              <span className="w-2 h-2 rounded-full bg-white/80 flex-shrink-0" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-14 border-l border-black/10 flex-shrink-0"
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

      {/* Mobile fullscreen menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-site-black flex flex-col pt-[99px] overflow-y-auto">
          <div className="px-8 pt-8 pb-3">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/25">Navigation</p>
          </div>
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between px-8 py-8 border-t border-white/10 group"
            >
              <div className="flex items-baseline gap-5">
                <span className="font-mono text-[10px] tracking-widest text-white/25 tabular-nums">0{i + 1}</span>
                <span className="font-display font-extrabold text-[52px] uppercase leading-none text-white group-hover:text-orange transition-colors duration-150">
                  {link.label}
                </span>
              </div>
              <span className="text-white/25 text-xl">↗</span>
            </a>
          ))}
          <div className="px-8 py-8 mt-auto border-t border-white/10">
            <button
              onClick={() => { setMenuOpen(false); onBookNow() }}
              className="w-full bg-orange text-white py-5 font-mono font-semibold text-[12px] tracking-[0.14em] uppercase flex items-center justify-between px-6 hover:bg-[#C53D08] transition-colors"
            >
              BOOK YOUR PACK
              <span className="w-2.5 h-2.5 rounded-full bg-white/80 flex-shrink-0" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
