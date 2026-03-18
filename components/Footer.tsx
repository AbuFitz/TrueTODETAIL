const YEAR = new Date().getFullYear()

export default function Footer({ onBookNow }: { onBookNow: () => void }) {
  return (
    <footer
      style={{
        background: '#0A0A0A',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '18px clamp(24px, 5vw, 80px)',
      }}
    >
      <div
        style={{
          maxWidth: '1380px', margin: '0 auto',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center',
          justifyContent: 'space-between', gap: '12px',
        }}
      >
        {/* Left: wordmark */}
        <a href="#" style={{ textDecoration: 'none' }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: '16px',
            letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)',
          }}>
            TRUE TO <span style={{ color: '#E84A0C' }}>DETAIL</span>
          </span>
        </a>

        {/* Centre: copyright */}
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: '11px',
          color: 'rgba(255,255,255,0.18)', letterSpacing: '0.04em',
        }}>
          © {YEAR} True To Detail · Hertfordshire
        </span>

        {/* Right: quick links */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {[
            ['Services',  '#services'],
            ['Packages',  '#packages'],
            ['07984 237149', 'tel:+447984237149'],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              style={{
                fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 500,
                color: 'rgba(255,255,255,0.28)', textDecoration: 'none',
                letterSpacing: '0.04em', transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.28)')}
            >
              {label}
            </a>
          ))}
          <button
            onClick={onBookNow}
            style={{
              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              background: '#E84A0C', color: 'white', border: 'none',
              padding: '8px 16px', cursor: 'pointer', transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#C53D08')}
            onMouseLeave={e => (e.currentTarget.style.background = '#E84A0C')}
          >
            Book
          </button>
        </div>
      </div>
    </footer>
  )
}
