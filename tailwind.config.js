/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      keyframes: {
        l45: {
          '0%': {
            backgroundPosition:
              'calc(0*100%/3) 50%,calc(1*100%/3) calc(50% + calc(var(--s)/8)),calc(1*100%/3) calc(50% - calc(var(--s)/8)), calc(3*100%/3) 50%,calc(2*100%/3) calc(50% + calc(var(--s)/8)),calc(2*100%/3) calc(50% - calc(var(--s)/8))',
          },
          '33%': {
            backgroundPosition:
              'calc(0*100%/3) 50%,calc(1*100%/3) 100%,calc(1*100%/3) 0, calc(3*100%/3) 50%,calc(2*100%/3) 100%,calc(2*100%/3) 0',
          },
          '66%': {
            backgroundPosition:
              'calc(1*100%/3) 50%,calc(0*100%/3) 100%,calc(0*100%/3) 0, calc(2*100%/3) 50%,calc(3*100%/3) 100%,calc(3*100%/3) 0',
          },
          '90%, 100%': {
            backgroundPosition:
              'calc(1*100%/3) 50%,calc(0*100%/3) calc(50% + calc(var(--s)/8)),calc(0*100%/3) calc(50% - calc(var(--s)/8)), calc(2*100%/3) 50%,calc(3*100%/3) calc(50% + calc(var(--s)/8)),calc(3*100%/3) calc(50% - calc(var(--s)/8))',
          },
        },
      },
      animation: {
        l45: 'l45 1s infinite',
      }
    },
  },
  plugins: [],
}

