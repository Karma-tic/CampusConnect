/** @type {import('tailwindcss').Config} */
export default {
  content: [
    
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cc-primary': '#FF5722', 
        'cc-secondary': '#121212', 
        'cc-offwhite': '#F5F5F5', 
        'cc-text-light': '#FFFFFF', 
        'cc-text-dark': '#121212', 
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        'marquee-mobile': 'marquee 40s linear infinite', 
      
      
      'marquee-desktop': 'marquee 60s linear infinite',
      }
    },
  },
  plugins: [],
}
