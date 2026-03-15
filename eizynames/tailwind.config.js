/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["selector", ":is(html.dark)"],

  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        "brand-dark": "#08090f",
      },
    },
  },

  plugins: [],
};
