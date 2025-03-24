// tailwind.config.js
const {heroui} = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Habilita el modo oscuro con clases
 
  content: [
 "./index.html","./node_modules/@heroui/theme/dist/components/form.js","./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {},
  },
 
  plugins: [heroui()],
};
