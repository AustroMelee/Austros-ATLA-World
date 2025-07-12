/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nation-air': '#FFD700',      // Gold/Yellow
        'nation-water': '#6495ED',    // Cornflower Blue
        'nation-earth': '#556B2F',    // Dark Olive Green
        'nation-fire': '#DC143C',     // Crimson Red
        'nation-neutral': '#A9A9A9', // Dark Gray
      },
    },
  },
  plugins: [],
}
