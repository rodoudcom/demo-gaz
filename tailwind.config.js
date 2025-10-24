/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#ED0000',
          hover: '#D10000',
        },
        gas: {
          primary: '#0009CEA',
          secondary: '#4632FF',
          light: '#029BEB',
          dark: '#00084A',
        },
        text: {
          primary: '#374649',
          secondary: '#6B7280',
        }
      },
      ringColor: {
        DEFAULT: '#ED0000',
        brand: '#ED0000',
      },
      borderColor: {
        DEFAULT: '#E5E7EB',
        brand: '#ED0000',
      },
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      borderRadius: {
        'btn': '25px',
      },
    },
  },
  plugins: [],
}
