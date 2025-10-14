const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "navy-blue": "#1a365d",
        gold: "#d4af37",
      },
      boxShadow: {
        'soft': '0 4px 14px 0 rgba(26, 54, 93, 0.1)',
        'soft-lg': '0 10px 30px 0 rgba(26, 54, 93, 0.12)',
      },
      fontSize: {
        'xs': '0.75rem', // 12px
      },
      // --- UPDATED: This is the correct way to add custom fonts ---
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        serif: ['Lora', ...defaultTheme.fontFamily.serif],
      },
      // This configures the typography plugin to use our new fonts
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            'h1, h2, h3, h4, h5, h6': {
              fontFamily: theme('fontFamily.serif').join(', '),
              color: theme('colors.navy-blue'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    // The incorrect plugin has been removed.
  ],
};