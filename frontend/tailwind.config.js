/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#1a202c',
        'brand-light': '#2d3748',
        'brand-accent': '#4299e1',
      }
    },
  },
  plugins: [],
}

