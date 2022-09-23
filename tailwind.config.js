// eslint-disable-next-line
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'result-chart': 'conic-gradient(red 70%, #0000 0)',
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant('checked', '&[data-state="checked"]')
    }),
  ],
}
