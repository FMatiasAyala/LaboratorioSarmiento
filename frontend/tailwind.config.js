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
          50: "#FAECEC",
          100: "#F2D2D2",
          200: "#E5AFAF",
          300: "#D18A8A",
          400: "#BC6868",
          500: "#A63A3A",
          600: "#8F2F2F",
          700: "#772626",
          800: "#5F1E1E",
          900: "#461616",
        }, // rojo principal
        secondary: "#bfbfbf", // gris claro
        dark: "#6c6c6c", // gris oscuro
        light: "#f5f5f5", // blanco cálido
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        scaleOut: {
          "0%": { opacity: "1", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(.95)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fadeIn .2s ease-out",
        "fade-out": "fadeOut .2s ease-in",
        "scale-in": "scaleIn .2s ease-out",
        "scale-out": "scaleOut .2s ease-in",
        "slide-up": "slideUp .25s ease-out",
      },
    },
  },
  plugins: [],
};
