'use client'

export default function ManageCookiesButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event('ttd:manage-cookies'))}
      style={{
        display: 'inline-block', background: '#0C0C0C', color: '#fff',
        padding: '14px 28px', border: 'none', cursor: 'pointer',
        fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '11px',
        letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '24px',
      }}
    >
      Manage Cookie Preferences
    </button>
  )
}
