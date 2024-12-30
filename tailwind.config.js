/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    
    extend: {
      colors: {
        'b': '#404040',
        'g': '#62cc84',
        'my-blue': '#12708a'
      },
      fontFamily: {
        'logo': ['Outfit', 'sans-serif'],
        'mono': ['Overpass Mono'],
        'aptos': ['Moderustic']
      }
    },
  },
  plugins: [],
}
