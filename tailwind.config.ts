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
  theme: {
    extend: {
      colors: {
        primary: '#1193d4',
        'primary-light': '#DBEAFE',
        secondary: '#38A169',
        accent: '#E53E3E',
        'background-light': '#FFFFFF',
        'background-dark': '#1A202C',
        'neutral-light': '#EDF2F7',
        'neutral-dark': '#2D3748',
        'text-light': '#1A202C',
        'text-dark': '#E2E8F0',
        'border-light': '#E2E8F0',
        'border-dark': '#2D3748',
        success: '#16A34A',
        danger: '#DC2626',
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
