/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        b: "#404040",
        g: "#62cc84",
        "my-blue": "#12708a",
        yellow: "#ffffe1",
        green: "#00E04B",
      },
      fontFamily: {
        logo: ["Outfit", "sans-serif"],
        mono: ["Roboto Mono"],
        aptos: ["Hanken Grotesk"],
      },
    },
  },
  plugins: [],
};
