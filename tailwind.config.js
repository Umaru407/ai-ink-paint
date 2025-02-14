/** @type {import('tailwindcss').Config} */
// const {heroui} = ;
const {heroui} = require("@heroui/react");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        custom: ["CustomFont", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui(),
    require('tailwind-scrollbar-hide'),
    // ...
  ]
}