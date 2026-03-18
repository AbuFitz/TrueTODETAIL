const YEAR = new Date().getFullYear()

const COL_LINKS = {
  Navigate: [
    { label: 'Services',  href: '#services'  },
    { label: 'Packages',  href: '#packages'  },
    { label: 'About',     href: '#about'     },
    { label: 'Contact',   href: '#contact'   },
  ],
  Legal: [
    { label: 'Privacy Policy',   href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy',    href: '#' },
  ],
  Social: [
    { label: 'Instagram', href: '#' },
    { label: 'Facebook',  href: '#' },
    { label: 'TikTok',    href: '#' },
    { label: 'YouTube',   href: '#' },
  ],
}

export default function Footer({ onBookNow }: { onBookNow: () => void }) {
  return (
    <footer className="bg-parchment border-t border-ink/[0.06]">
      <div className="max-w-[1380px] mx-auto px-6 md:px-10">

        {/* Top row: logo + CTA */}
        <div
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-ink/[0.06]"
          style={{ paddingTop: 'clamp(56px, 7vw, 100px)', paddingBottom: 'clamp(40px, 5vw, 72px)' }}
        >
          <div>
            <a href="#" className="block mb-3 group hover:opacity-70 transition-opacity">
              <span
                className="font-display text-ink leading-none"
                style={{ fontSize: 'clamp(36px, 6vw, 72px)', letterSpacing: '0.05em' }}
              >
                TRUE TO <span className="text-orange">DETAIL</span>
              </span>
            </a>
            <p className="font-body text-[13px] text-ink/40">
              Premium Mobile Auto Detailing · Hemel Hempstead & Hertfordshire
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button
              onClick={onBookNow}
              className="btn-cta"
            >
              Book Now
              <span className="dot" />
            </button>
            <a
              href="tel:+447984237149"
              className="inline-flex items-center justify-center border border-ink/12
                         font-body font-semibold text-[12px] tracking-[0.08em] uppercase
                         text-ink/45 px-7 py-4 hover:border-ink/30 hover:text-ink
                         transition-all duration-200"
            >
              07984 237149
            </a>
          </div>
        </div>

        {/* Link columns */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-10 border-b border-ink/[0.06]"
          style={{ paddingTop: 'clamp(40px, 5vw, 64px)', paddingBottom: 'clamp(40px, 5vw, 64px)' }}
        >
          {/* Contact info column */}
          <div>
            <p className="section-label text-ink/30 mb-5">Contact</p>
            <div className="flex flex-col gap-2.5">
              {[
                { text: 'hello@truetodetail.co.uk', href: 'mailto:hello@truetodetail.co.uk' },
                { text: '07984 237149',              href: 'tel:+447984237149' },
                { text: 'Mon–Sat 8am–7pm',          href: null },
                { text: 'Hertfordshire, UK',         href: null },
              ].map(({ text, href }) =>
                href ? (
                  <a key={text} href={href} className="font-body text-[13px] text-ink/45 hover:text-ink transition-colors">
                    {text}
                  </a>
                ) : (
                  <span key={text} className="font-body text-[13px] text-ink/35">{text}</span>
                )
              )}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(COL_LINKS).map(([col, links]) => (
            <div key={col}>
              <p className="section-label text-ink/30 mb-5">{col}</p>
              <div className="flex flex-col gap-2.5">
                {links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    className="font-body text-[13px] text-ink/45 hover:text-ink transition-colors"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="font-body text-[11px] text-ink/25">
            © {YEAR} True To Detail. All rights reserved.
          </span>
          <span className="font-body text-[11px] text-ink/20">
            Professional Mobile Auto Detailing · Hertfordshire
          </span>
        </div>

      </div>
    </footer>
  )
}
