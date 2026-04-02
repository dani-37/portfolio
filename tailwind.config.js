import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        card: 'var(--color-card)',
        'card-glass': 'var(--color-card-glass)',
        'card-glass-heavy': 'var(--color-card-glass-heavy)',
        green: {
          deep: 'var(--color-green-deep)',
          mid: 'var(--color-green-mid)',
          topo: 'var(--color-green-topo)',
          muted: 'var(--color-green-muted)',
        },
        ink: 'var(--color-ink)',
        gray: {
          strong: 'var(--color-gray-strong)',
          DEFAULT: 'var(--color-gray)',
          mid: 'var(--color-gray-mid)',
          muted: 'var(--color-gray-muted)',
          soft: 'var(--color-gray-soft)',
          faint: 'var(--color-gray-faint)',
          warm: 'var(--color-gray-warm)',
          'warm-light': 'var(--color-gray-warm-light)',
        },
      },
      fontFamily: {
        display: ['Lora', 'serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      fontSize: {
        label: '12px',
        caption: '15px',
        body: '17px',
        subhead: '23px',
        heading: '30px',
        title: '46px',
      },
      letterSpacing: {
        tight: '-1px',
        wide: '2px',
        display: '5px',
      },
    },
  },
  plugins: [],
} satisfies Config
