import type { Config } from 'tailwindcss'

export default <Config>{
  darkMode: 'class',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  safelist: {
    pattern: /^(bg|text|ring)-(primary|secondary|accent|success|danger|warning|info|gray|red|blue|green|yellow|purple|pink|indigo)-(50|100|200|300|400|500|600|700|800|900)$/,
    variants: ['hover', 'focus', 'active', 'disabled']
  },
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#1193d4',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554'
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#38A169',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16'
        },
        accent: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#E53E3E',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a'
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#16A34A',
          600: '#15803d',
          700: '#166534',
          800: '#14532d',
          900: '#052e16',
          950: '#000000'
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#DC2626',
          600: '#b91c1c',
          700: '#991b1b',
          800: '#7f1d1d',
          900: '#450a0a',
          950: '#000000'
        },
        'background-light': '#FFFFFF',
        'background-dark': '#1A202C',
        'neutral-light': '#EDF2F7',
        'neutral-dark': '#2D3748',
        'text-light': '#1A202C',
        'text-dark': '#E2E8F0',
        'border-light': '#E2E8F0',
        'border-dark': '#2D3748',
        'accent-green': '#28a745',
        'alert-red': '#dc3545'
      },
      fontFamily: {
        display: ['Inter', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '1rem',
        '2xl': '1rem',
        full: '9999px'
      }
    }
  },
  plugins: []
}
