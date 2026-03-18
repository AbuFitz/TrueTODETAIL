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
      { label: '123 Detail Lane, Manchester, M1 1AA', href: null },
      { label: 'hello@truetodetail.co.uk', href: 'mailto:hello@truetodetail.co.uk' },
      { label: '+44 7700 900 000', href: 'tel:+447700900000' },
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
    <footer className="bg-white border-t border-black/10">
      {/* Brand row */}
      <div className="max-w-[1400px] mx-auto px-6 pt-12 pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <a href="#" className="font-display text-5xl md:text-7xl uppercase leading-none">
          TRUE TO <span className="text-orange">DETAIL</span>
        </a>
        <button
          onClick={onBookNow}
          className="self-start md:self-auto flex items-center gap-3 bg-site-black text-white px-7 py-4 font-body font-bold text-[11px] tracking-[0.15em] uppercase hover:bg-orange transition-colors duration-150"
        >
          BOOK NOW
          <span className="w-2 h-2 rounded-full bg-orange flex-shrink-0" />
        </button>
      </div>

      {/* Table grid */}
      <div className="max-w-[1400px] mx-auto px-6 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr>
              {colKeys.map((col) => (
                <th
                  key={col}
                  className="bg-site-black text-white text-left px-6 py-3 font-body font-semibold text-[10px] tracking-[0.2em] uppercase border-r border-white/10 last:border-r-0"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, rowIdx) => (
              <tr key={rowIdx}>
                {colKeys.map((col) => {
                  const colData = tableData[col]
                  const item = colData.rows[rowIdx]
                  const isMenu = colData.isMenu
                  return (
                    <td
                      key={col}
                      className={`px-6 py-[14px] border-b border-r last:border-r-0 ${
                        isMenu
                          ? 'bg-orange border-white/20'
                          : 'bg-site-light border-white'
                      }`}
                    >
                      {item.href ? (
                        <a
                          href={item.href}
                          className={`font-body text-[13px] transition-colors ${
                            isMenu
                              ? 'font-bold tracking-wider text-white uppercase underline-offset-4 hover:underline'
                              : 'text-black/60 hover:text-site-black'
                          }`}
                        >
                          {item.label}
                        </a>
                      ) : (
                        <span className="font-body text-[13px] text-black/60">
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
      <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <span className="font-body text-[11px] text-black/30">
          © {currentYear} True To Detail. All rights reserved.
        </span>
        <span className="font-body text-[11px] text-black/30">
          Professional Auto Detailing · Manchester &amp; Surrounding Areas
        </span>
      </div>
    </footer>
  )
}
