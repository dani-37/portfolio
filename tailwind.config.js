import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#e6f0ed',
        card: '#fdfcf9',
        green: {
          deep: '#1a6b5a',
          mid: '#6aab90',
          topo: '#2d5a52',
        },
        ink: '#1a1a18',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config
