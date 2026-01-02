/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'magenta': {
          200: '#f5d0fe',
          500: '#d946ef',
        }
      },
      fontFamily: {
        'black': ['Arial Black', 'sans-serif'],
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [],
};
