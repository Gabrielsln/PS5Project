// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: { 
      // --- ESTE BLOCO É ESSENCIAL ---
      keyframes: {
        // Brilho horizontal
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        // Slide para cima (para os logos)
        slideInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        slideInUp: 'slideInUp 0.5s ease-out forwards', // 0.5s de duração
        shimmer: 'shimmer 1.5s ease-out',
      },
      // --- FIM DO BLOCO ---
    },
  },
  plugins: [],
}