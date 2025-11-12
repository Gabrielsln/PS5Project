// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        // REVERTIDO: Animação de brilho horizontal
        shimmer: {
          '0%': { transform: 'translateX(-100%)' }, // Começa totalmente à esquerda
          '100%': { transform: 'translateX(100%)' }, // Termina totalmente à direita
        },
        slideInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        slideInUp: 'slideInUp 0.3s ease-out forwards',
        shimmer: 'shimmer 1.5s ease-out',
      },
    },
  },
  plugins: [],
}