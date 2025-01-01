/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "main-background": '#OD1117',
        "color-background": '#161C22',
      }
    },
  },
  plugins: [],
}

