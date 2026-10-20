/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bordeaux: {
          50: '#fdf2f3',
          100: '#fce7e9',
          200: '#f9d0d5',
          300: '#f0a8b2',
          400: '#e06a7c',
          500: '#c9374b',
          600: '#a52939',
          700: '#8B1A2B',
          800: '#721623',
          900: '#5f131e',
          950: '#3d0a13',
        },
      },
    },
  },
  plugins: [],
};
