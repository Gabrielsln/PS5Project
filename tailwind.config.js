// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // ADICIONE ISSO:
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      // E ADICIONE ISSO:
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out', // <-- Linha nova
      }
    },
  },
  plugins: [],
};