/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'black-rgba': 'rgba(0, 0, 0, 0.54)',
      },
      screens: {
        // Custom breakpoint 'xmd' between 'md' and 'lg'
        'xmd': '900px',
        'xs': '500px'
      },
    },
    
  },
  plugins: [],
}

