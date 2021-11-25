module.exports = {
  purge: [
    './index.html', './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#0072BB',
        secondary: '#7FB800',
        error: '#ED1C24'
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
