/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: '#f3e8ff',
          100: '#e9d5ff',
          200: '#d8b4fe',
          300: '#c084fc',
          400: '#a855f7',
          500: '#9333ea',
          600: '#7c3aed',
          700: '#6d28d9',
        },
        mauve: {
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
        },
        plum: {
          900: '#3b0764',
          800: '#4c0882',
          700: '#5b21b6',
        }
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        lato: ['Lato', 'Nunito', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'typing': 'typing 1.4s steps(3) infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(0.97)' },
        },
        typing: {
          '0%': { content: "''" },
          '33%': { content: "'·'" },
          '66%': { content: "'··'" },
          '100%': { content: "'···'" },
        }
      }
    },
  },
  plugins: [],
}
