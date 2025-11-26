/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // 👈 importantísimo
  ],
  theme: {
    extend: {
      colors: {
       primary: {
      50:'#FAECEC',100:'#F2D2D2',200:'#E5AFAF',300:'#D18A8A',400:'#BC6868',
      500:'#A63A3A',600:'#8F2F2F',700:'#772626',800:'#5F1E1E',900:'#461616',
    },   // rojo principal
      secondary: '#bfbfbf', // gris claro
      dark: '#6c6c6c',      // gris oscuro
      light: '#f5f5f5',     // blanco cálido
    },
    },
  },
  plugins: [],
}

