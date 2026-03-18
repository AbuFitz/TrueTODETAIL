'use client'

import { useState, useEffect } from 'react'

const navLinks = [
  { label: 'PACKAGES', href: '#packages' },
  { label: 'SERVICES', href: '#services' },
  { label: 'ABOUT', href: '#about' },
  { label: 'CONTACT', href: '#contact' },
]

const announcements = [
  '100% Mobile — We Come To You',
  'Same-Day Slots Available',
  'Hemel Hempstead & Hertfordshire',
  'Fixed Prices · No Hidden Charges',
  'Professional-Grade Products Only',
  'Certified Detailers',
]

// Duplicate for seamless loop
const marqueeItems = [...announcements, ...announcements]

export default function Navbar({ onBookNow }: { onBookNow: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      {/* Announcement bar — scrolling marquee */}
      <div className="fixed top-0 left-0 right-0 z-50 h-7 bg-site-black overflow-hidden flex items-center">
        <div className="flex animate-marquee whitespace-nowrap">
          {marqueeItems.map((item, i) => (
            <span key={i} className="inline-flex items-center">
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 px-6">
                {item}
              </span>
              <span className="w-px h-2.5 bg-white/10 flex-shrink-0" />
            </span>
          ))}
        </div>
      </div>

      {/* Main nav */}
      <nav
        className={`fixed top-7 left-0 right-0 z-50 bg-white transition-all duration-300 overflow-visible ${
          scrolled
            ? 'shadow-[0_4px_30px_rgba(0,0,0,0.1)] border-b-0'
            : 'border-b border-black/8'
        }`}
      >
        <div className="flex items-stretch h-[72px]">

          {/* LOGO */}
          <a
            href="#"
            className="flex items-center pl-8 pr-10 border-r border-black/8 hover:bg-site-light/60 transition-colors duration-200 flex-shrink-0 group"
          >
            <span
              className="font-wordmark font-black uppercase leading-none text-site-black transition-colors duration-200"
              style={{ fontSize: '21px', letterSpacing: '0.24em' }}
            >
              TRUE TO <span className="text-orange group-hover:text-orange">DETAIL</span>
            </span>
          </a>

          <div className="flex-1" />

          {/* Desktop nav */}
          <div className="hidden md:flex items-stretch">
            {navLinks.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                className="relative flex items-center px-6 bg-orange text-white font-mono font-semibold text-[10.5px] tracking-[0.12em] uppercase border-l border-[#C53D08]/60 hover:bg-[#C53D08] transition-colors duration-150 group"
              >
                {link.label}
                {/* bottom line indicator */}
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/0 group-hover:bg-white/20 transition-colors duration-150" />
              </a>
            ))}

            {/* BOOK NOW */}
            <button
              onClick={onBookNow}
              className="btn-sweep relative flex items-center justify-between bg-site-black text-white font-mono font-semibold text-[10.5px] tracking-[0.16em] uppercase hover:bg-orange transition-colors duration-200 flex-shrink-0"
              style={{ minWidth: '200px', paddingLeft: '26px', paddingRight: '20px', height: '84px', marginTop: '-6px', marginBottom: '-6px' }}
            >
              <span>BOOK NOW</span>
              <span className="w-2 h-2 rounded-full bg-orange group-hover:bg-white flex-shrink-0 transition-colors duration-200" style={{ backgroundColor: 'currentColor', opacity: 0.6 }} />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-14 border-l border-black/8 flex-shrink-0"
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
      <div
        className={`fixed inset-0 z-40 bg-site-black flex flex-col pt-[99px] overflow-y-auto transition-opacity duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="px-8 pt-8 pb-3">
          <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-white/20">Navigation</p>
        </div>
        {navLinks.map((link, i) => (
          <a
            key={link.label}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-between px-8 py-7 border-t border-white/8 group"
          >
            <div className="flex items-baseline gap-5">
              <span className="font-mono text-[9px] tracking-widest text-white/20 tabular-nums w-6">0{i + 1}</span>
              <span className="font-display font-extrabold text-[50px] uppercase leading-none text-white group-hover:text-orange transition-colors duration-150">
                {link.label}
              </span>
            </div>
            <span className="text-white/20 group-hover:text-orange transition-colors duration-150 text-lg">↗</span>
          </a>
        ))}
        <div className="px-8 py-8 mt-auto border-t border-white/8">
          <button
            onClick={() => { setMenuOpen(false); onBookNow() }}
            className="w-full bg-orange text-white py-5 font-mono font-semibold text-[11px] tracking-[0.16em] uppercase flex items-center justify-between px-6 hover:bg-[#C53D08] transition-colors btn-sweep"
          >
            BOOK YOUR PACK
            <span className="w-2 h-2 rounded-full bg-white/60 flex-shrink-0" />
          </button>
          <div className="mt-6 flex flex-col gap-2">
            <a href="tel:+447984237149" className="font-mono text-[10px] tracking-[0.2em] text-white/30 hover:text-white/60 transition-colors">
              07984 237149
            </a>
            <p className="font-mono text-[9px] tracking-[0.2em] text-white/15 uppercase">
              Mon–Sat · 8am–7pm · Hertfordshire
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
