// FIX: Replaced placeholder content with a standard Tailwind CSS configuration.
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy-blue': '#001f3f',
        'gold': '#FFD700',
      }
    },
  },
  plugins: [],
}