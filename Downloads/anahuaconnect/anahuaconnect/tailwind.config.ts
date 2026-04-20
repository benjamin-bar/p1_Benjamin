import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#F97316',
          dark:    '#EA6A05',
          light:   '#FFF7ED',
        },
        navy: {
          DEFAULT: '#1A1A3E',
          2:       '#252868',
          3:       '#1E2252',
        },
      },
      borderRadius: {
        xl2: '1rem',
        xl3: '1.25rem',
      },
    },
  },
  plugins: [],
}

export default config
