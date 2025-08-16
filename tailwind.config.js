/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#1a1a1a',
            a: {
              color: '#2563eb',
              '&:hover': {
                color: '#1d4ed8',
              },
            },
          },
        },
      },
      keyframes: {
        pulse: {
          '0%': { boxShadow: '0 0 0 0 rgba(236, 72, 153, 0.7)' },
          '70%': { boxShadow: '0 0 0 10px rgba(236, 72, 153, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(236, 72, 153, 0)' },
        },
        'pulse-pink': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(219, 39, 119, 0.6)' },
          '70%': { boxShadow: '0 0 0 10px rgba(219, 39, 119, 0)' },
        },
        'pulse-blue': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(37, 99, 235, 0.6)' },
          '70%': { boxShadow: '0 0 0 10px rgba(37, 99, 235, 0)' },
        },
        'pulse-green': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(22, 163, 74, 0.6)' },
          '70%': { boxShadow: '0 0 0 10px rgba(22, 163, 74, 0)' },
        },
        'pulse-cyan': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(79, 195, 247, 0.6)' },
          '70%': { boxShadow: '0 0 0 10px rgba(79, 195, 247, 0)' },
        },
      },
      animation: {
        pulse: 'pulse 2s infinite',
        'pulse-pink': 'pulse-pink 1.5s infinite',
        'pulse-blue': 'pulse-blue 1.5s infinite',
        'pulse-green': 'pulse-green 1.5s infinite',
        'pulse-cyan': 'pulse-cyan 1.5s infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function({ addUtilities }) {
      const newUtilities = {
        '.badge': {
          '@apply inline-block px-3 py-1 text-xs font-semibold rounded-full bg-[#4FC3F7] text-white': {},
        },
      }
      addUtilities(newUtilities)
    }
  ],
}
