/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "Segoe UI", "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
      },
      colors: {
        gju: {
          crimson: "#8B1538",
          gold: "#C4A35A",
          ink: "#14181F",
        },
      },
      boxShadow: {
        card: "0 18px 40px -24px rgba(15, 23, 42, 0.45)",
      },
    },
  },
  plugins: [],
};
