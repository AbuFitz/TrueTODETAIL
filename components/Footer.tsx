const currentYear = new Date().getFullYear()

type ColKey = 'MENU' | 'CONTACT INFO' | 'SOCIAL MEDIA' | 'LEGAL PAGES'

interface ColItem {
  label: string
  href: string | null
}

const tableData: Record<ColKey, { rows: ColItem[]; isMenu: boolean }> = {
  MENU: {
    isMenu: true,
    rows: [
      { label: 'PACKAGES', href: '#packages' },
      { label: 'SERVICES', href: '#services' },
      { label: 'ABOUT', href: '#about' },
      { label: 'CONTACT', href: '#contact' },
    ],
  },
  'CONTACT INFO': {
    isMenu: false,
    rows: [
      { label: 'Hemel Hempstead, Hertfordshire & Surrounding Areas', href: null },
      { label: 'bookings@truetodetail.co.uk', href: 'mailto:bookings@truetodetail.co.uk' },
      { label: '07984 237149', href: 'tel:+447984237149' },
      { label: 'Mon–Sat: 8am – 7pm', href: null },
    ],
  },
  'SOCIAL MEDIA': {
    isMenu: false,
    rows: [
      { label: 'Instagram', href: '#' },
      { label: 'Facebook', href: '#' },
      { label: 'TikTok', href: '#' },
      { label: 'YouTube', href: '#' },
    ],
  },
  'LEGAL PAGES': {
    isMenu: false,
    rows: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
      { label: 'Accessibility', href: '#' },
    ],
  },
}

const colKeys = Object.keys(tableData) as ColKey[]

export default function Footer({ onBookNow }: { onBookNow: () => void }) {
  return (
    <footer className="bg-white border-t border-black/8">

      {/* Brand row */}
      <div className="max-w-[1400px] mx-auto px-6 pt-14 pb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div>
          <a
            href="#"
            className="font-wordmark font-black uppercase leading-none text-site-black hover:text-orange transition-colors duration-200 block mb-3"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '0.22em' }}
          >
            TRUE TO <span className="text-orange">DETAIL</span>
          </a>
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-black/30">
            Premium Mobile Detailing · Hertfordshire
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 md:items-end">
          <button
            onClick={onBookNow}
            className="btn-sweep flex items-center gap-3 bg-site-black text-white px-7 py-4 font-mono font-semibold text-[11px] tracking-[0.16em] uppercase hover:bg-orange transition-colors duration-200"
          >
            BOOK NOW
            <span className="w-1.5 h-1.5 rounded-full bg-orange" style={{ backgroundColor: 'rgba(255,255,255,0.5)' }} />
          </button>
          <a
            href="tel:+447984237149"
            className="flex items-center justify-center gap-2 border border-black/10 text-black/50 px-7 py-4 font-mono font-semibold text-[11px] tracking-[0.16em] uppercase hover:border-black/25 hover:text-site-black transition-all duration-200"
          >
            07984 237149
          </a>
        </div>
      </div>

      {/* Table grid */}
      <div className="max-w-[1400px] mx-auto px-6 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr>
              {colKeys.map((col) => (
                <th
                  key={col}
                  className="bg-site-black text-white text-left px-6 py-3.5 font-mono font-semibold text-[9px] tracking-[0.22em] uppercase border-r border-white/8 last:border-r-0"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, rowIdx) => (
              <tr key={rowIdx} className="group/row">
                {colKeys.map((col) => {
                  const colData = tableData[col]
                  const item = colData.rows[rowIdx]
                  const isMenu = colData.isMenu
                  return (
                    <td
                      key={col}
                      className={`px-6 py-4 border-b border-r last:border-r-0 transition-colors duration-150 ${
                        isMenu
                          ? 'bg-orange border-white/15 hover:bg-[#C53D08]'
                          : 'bg-site-light border-white group-hover/row:bg-[#E6E6E6]'
                      }`}
                    >
                      {item.href ? (
                        <a
                          href={item.href}
                          className={`font-body text-[13px] transition-colors duration-150 ${
                            isMenu
                              ? 'font-bold tracking-wider text-white uppercase hover:text-white/80'
                              : 'text-black/55 hover:text-site-black font-medium'
                          }`}
                        >
                          {item.label}
                        </a>
                      ) : (
                        <span className={`font-body text-[13px] ${isMenu ? 'text-white font-bold tracking-wider uppercase' : 'text-black/45'}`}>
                          {item.label}
                        </span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Copyright bar */}
      <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-black/6 mt-0">
        <span className="font-body text-[11px] text-black/25">
          © {currentYear} True To Detail. All rights reserved.
        </span>
        <span className="font-body text-[11px] text-black/25">
          Professional Auto Detailing · Hemel Hempstead &amp; Surrounding Areas
        </span>
      </div>
    </footer>
  )
}
