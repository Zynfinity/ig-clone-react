/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '8px',
    },
    extend: {
      colors: {
        dark: '#1f2937',
      }
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('daisyui'),
    function ({ addUtilities }) {
      addUtilities({
        '.hide-scrollbar': {
          /* For WebKit browsers */
          '::-webkit-scrollbar': {
            display: 'none',
          },
          /* For Firefox */
          '-ms-overflow-style': 'none',  /* IE and Edge */
          'scrollbar-width': 'none',  /* Firefox */
        }
      }, ['responsive', 'hover']);
    }
  ],
}