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
      <div className="fixed top-0 left-0 right-0 z-50 h-8 bg-site-black flex items-center justify-center overflow-hidden">
        <p className="font-body text-[10px] tracking-[0.22em] uppercase text-white/50 whitespace-nowrap">
          100% Mobile — We Come To You&nbsp;
          <span className="text-orange font-semibold">·</span>&nbsp;
          Same-Day Slots Available&nbsp;
          <span className="text-orange font-semibold">·</span>&nbsp;
          Hemel Hempstead &amp; Surrounding Areas
        </p>
      </div>

      {/* Main nav */}
      <nav
        className={`fixed top-8 left-0 right-0 z-50 bg-white border-b border-black/10 transition-shadow duration-300 ${
          scrolled ? 'shadow-sm' : ''
        }`}
      >
        <div className="flex items-stretch h-[56px]">
          {/* Brand */}
          <a
            href="#"
            className="flex items-center px-8 font-display text-[21px] uppercase tracking-tight border-r border-black/10 hover:bg-site-light transition-colors duration-200 flex-shrink-0"
          >
            TRUE&nbsp;TO&nbsp;<span className="text-orange ml-1">DETAIL</span>
          </a>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Desktop nav */}
          <div className="hidden md:flex items-stretch">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center px-6 font-body font-semibold text-[11px] tracking-[0.14em] uppercase border-l border-black/10 hover:bg-orange hover:text-white transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={onBookNow}
              className="flex items-center gap-3 pl-7 pr-5 bg-site-black text-white font-body font-bold text-[11px] tracking-[0.14em] uppercase border-l border-black/10 hover:bg-orange transition-colors duration-150 flex-shrink-0"
            >
              BOOK NOW
              <span className="w-2 h-2 rounded-full bg-orange flex-shrink-0" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-14 border-l border-black/10"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-[5px]">
              <span
                className={`block h-[1.5px] bg-site-black transition-all duration-300 ${
                  menuOpen ? 'w-6 rotate-45 translate-y-[6.5px]' : 'w-6'
                }`}
              />
              <span
                className={`block h-[1.5px] bg-site-black transition-all duration-300 ${
                  menuOpen ? 'opacity-0 w-4' : 'w-4'
                }`}
              />
              <span
                className={`block h-[1.5px] bg-site-black transition-all duration-300 ${
                  menuOpen ? 'w-6 -rotate-45 -translate-y-[6.5px]' : 'w-6'
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile fullscreen menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-site-black flex flex-col pt-[88px] overflow-y-auto">
          <div className="px-8 pt-8 pb-4">
            <p className="font-body text-[10px] tracking-[0.22em] uppercase text-white/25">
              Navigation
            </p>
          </div>
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between px-8 py-8 border-t border-white/10 group"
            >
              <div className="flex items-baseline gap-5">
                <span className="font-body text-[10px] tracking-widest text-white/25 tabular-nums">
                  0{i + 1}
                </span>
                <span className="font-display text-5xl uppercase text-white group-hover:text-orange transition-colors duration-150">
                  {link.label}
                </span>
              </div>
              <span className="text-white/30 text-xl font-body">↗</span>
            </a>
          ))}
          <div className="px-8 py-8 mt-auto border-t border-white/10">
            <button
              onClick={() => {
                setMenuOpen(false)
                onBookNow()
              }}
              className="w-full bg-orange text-white py-5 font-body font-bold text-[12px] tracking-[0.14em] uppercase flex items-center justify-between px-6"
            >
              BOOK YOUR PACK
              <span className="w-2.5 h-2.5 rounded-full bg-white flex-shrink-0" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
