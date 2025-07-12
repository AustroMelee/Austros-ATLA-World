/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nation: {
          // Earth Kingdom
          earth: '#4cda72',
          // Fire Nation
          fire: '#ed8796',
          // Water Tribe
          water: '#8aadee',
          // Air Nomads
          air:   '#f5e0b3',
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
