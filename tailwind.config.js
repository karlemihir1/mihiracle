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
          mint: '#B8E7BF',
          'mint-dark': '#8FD89B',
          'mint-light': '#DDF5E1',
          bg: '#F7F8F5',
          surface: '#FFFFFF',
          text: '#17252D',
          muted: '#6B7780',
          border: '#E5E8E2',
        },
        dark: {
          bg: '#0D151C',
          surface: '#16232E',
          card: '#1A2A38',
          border: '#2A3C4D',
          text: '#F1F5F9',
          muted: '#94A3B8',
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
      }
    },
  },
  plugins: [],
}
