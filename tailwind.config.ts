import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand
        orange: '#E84A0C',
        'orange-dark': '#C53D08',
        // Dark palette
        ink: '#0C0C0C',
        'ink-1': '#161614',
        'ink-2': '#242420',
        // Light palette
        parchment: '#FAFAF8',
        'parchment-2': '#F0EDE8',
        // Legacy aliases (keep so BookingModal doesn't break)
        'site-black': '#0C0C0C',
        'site-light': '#F0EDE8',
        'site-gray': '#FAFAF8',
        'site-dark': '#161614',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        // legacy alias
        wordmark: ['var(--font-display)', 'sans-serif'],
      },
      animation: {
        marquee: 'marquee 36s linear infinite',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
