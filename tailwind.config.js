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
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        
      },
      slideDown: {
        '0%': { transform: 'translateY(-20px)', opacity: '0' },
        '100%': { transform: 'translateY(0)', opacity: '1' },
      },
      animation: {
        l45: 'l45 1s infinite',
        'spin-slow': 'spin 10s linear infinite',
        'fadeIn': 'fadeIn 0.5s ease-in',
        'slideDown': 'slideDown 0.5s ease-out',
      },
      screens: {
        xsm: { min: "320px", max: "480px" },
        sm: { min: "481px", max: "720px" },
        md: { min: "721px", max: "1024px" },
        lg: { min: "1025px", max: "1599px" },
        xl: { min: "1600px", max: "1999px" },
        "2xl": { min: "2000px" },
        // fold: { min: "660px", max: "690px" },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
}

