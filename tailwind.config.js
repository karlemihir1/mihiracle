/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#192D3A',
          'navy-dark': '#12212B',
          'navy-light': '#243F52',
          mint: '#D4FF00', // Volt lime accent
          'mint-dark': '#B8E000',
          'mint-light': '#E9FF80',
          volt: '#D4FF00',
          cyan: '#00F0FF',
          pink: '#FF007A',
          amber: '#FFB800',
          bg: '#F7F8F5',
          surface: '#FFFFFF',
          text: '#17252D',
          muted: '#6B7780',
          border: '#E5E8E2',
        },
        dark: {
          bg: '#0B0C10',
          surface: '#161822',
          card: '#1B1E29',
          border: '#262A38',
          text: '#FFFFFF',
          muted: '#8E92A4',
          volt: '#D4FF00',
          cyan: '#00F0FF',
          pink: '#FF007A',
          amber: '#FFB800',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'Cambria', 'serif'],
      },
      boxShadow: {
        'card': '0 2px 8px -2px rgba(25, 45, 58, 0.06), 0 1px 4px -1px rgba(25, 45, 58, 0.04)',
        'card-hover': '0 8px 24px -4px rgba(25, 45, 58, 0.10), 0 2px 6px -1px rgba(25, 45, 58, 0.06)',
        'subtle': '0 1px 3px rgba(0,0,0,0.05)',
        'volt': '0 0 25px rgba(212, 255, 0, 0.35)',
        'cyan': '0 0 25px rgba(0, 240, 255, 0.35)',
        'pink': '0 0 25px rgba(255, 0, 122, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}
