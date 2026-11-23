/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Fraunces', 'Cinzel', 'Georgia', 'serif'],
        display: ['Cinzel', 'Fraunces', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"Fira Code"', 'JetBrains Mono', 'monospace'],
      },
      colors: {
        study: {
          darkest: '#120d1c',
          dark: '#1c1528',
          shelf: '#271e36',
          wood: '#3b2b48',
          accent: '#e69a38',
        },
        parchment: {
          50: '#fffef9',
          100: '#fcf7ed',
          150: '#f7f0e1',
          200: '#f3e8d5',
          300: '#e5d1b3',
          400: '#cbb08b',
          700: '#644e3b',
          800: '#433326',
          900: '#2c2017',
        },
        cozynavy: {
          50: '#f0f3fa',
          100: '#dce4f7',
          600: '#343f66',
          700: '#27304f',
          800: '#1d243c',
          900: '#14192b',
        },
        softgreen: {
          50: '#f2fbf4',
          100: '#daf1e0',
          200: '#bee7c7',
          700: '#238647',
          800: '#1c6b39',
        }
      },
      boxShadow: {
        'parchment': '0 8px 30px rgba(18, 13, 28, 0.45), 0 2px 8px rgba(0,0,0,0.2)',
        'parchment-inner': 'inset 0 2px 4px rgba(255,255,255,0.7), 0 4px 12px rgba(44,32,23,0.08)',
        'lantern': '0 0 40px 10px rgba(245, 158, 11, 0.25)',
        'button-glow': '0 4px 14px rgba(37, 45, 74, 0.4)',
      }
    },
  },
  plugins: [],
}
