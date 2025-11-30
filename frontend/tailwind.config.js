/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Crucial for scanning all component files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}