/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          300: "#C8E3DF",
          600: "#559092",
          700: "#3F6B6B",
        },
      },
    },
  },
  content: ["./**/*.tsx"],
  plugins: [],
};
