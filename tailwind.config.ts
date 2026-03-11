import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: 'var(--background)',
        'card-bg': 'var(--card-bg)',
        'primary-text': 'var(--primary-text)',
        'muted-text': 'var(--muted-text)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        border: 'var(--border)',
        'table-header-bg': 'var(--table-header-bg)',
        'row-hover-bg': 'var(--row-hover-bg)',
        'nav-border': 'var(--nav-border)',
        'badge-primary-bg': 'var(--badge-primary-bg)',
        'badge-primary-text': 'var(--badge-primary-text)',
        'badge-secondary-bg': 'var(--badge-secondary-bg)',
        'badge-secondary-text': 'var(--badge-secondary-text)',
        input: 'var(--border)',
        ring: 'var(--accent)',
        foreground: 'var(--primary-text)',
        muted: {
          DEFAULT: 'var(--table-header-bg)',
          foreground: 'var(--muted-text)',
        },
        popover: {
          DEFAULT: 'var(--card-bg)',
          foreground: 'var(--primary-text)',
        },
        primary: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--table-header-bg)',
          foreground: 'var(--primary-text)',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        card: {
          DEFAULT: 'var(--card-bg)',
          foreground: 'var(--primary-text)',
        },
      },
      borderRadius: {
        lg: '0.5rem',
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config
