// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: { 
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
        // Animação da Tela de Boot (Pressione PS)
        borderPulse: {
          '0%, 100%': { borderColor: 'rgba(255, 255, 255, 0.4)' },
          '50%': { borderColor: 'rgba(255, 255, 255, 1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },

        // --- NOVO: Animação do Círculo Pulsante (Expande e Desaparece) ---
        pulseExpand: {
          '0%': { transform: 'scale(0.95)', opacity: '0.7' },
          '100%': { transform: 'scale(1.4)', opacity: '0' },
        },
        // --- FIM DO NOVO BLOCO ---
      },
      animation: {
        slideInUp: 'slideInUp 0.5s ease-out forwards',
        shimmer: 'shimmer 1.5s ease-out',
        borderPulse: 'borderPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        fadeIn: 'fadeIn 1s ease-in-out',
        // --- NOVO: Aplicando a animação ---
        pulseExpand: 'pulseExpand 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}