import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const config = [
  ...nextVitals,
  ...nextTs,
  {
    // Tests and scripts poke at raw provider JSON, where `any` is the honest type.
    files: ['tests/**', 'scripts/**'],
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  },
  {
    ignores: ['.next/**', 'node_modules/**', 'out/**', 'public/**', 'next-env.d.ts', 'tsconfig.tsbuildinfo'],
  },
]

export default config
