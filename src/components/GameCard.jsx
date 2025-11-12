// src/components/GameCard.jsx (CORRIGIDO: Brilho horizontal)

import React from "react";

export default function GameCard({ game, isSelected, onClick }) {
  
  const isSquare = game.id === 0 || game.id === 99;
  const sizeClasses = isSquare ? "w-20 h-20" : "w-20 h-24"; 
  const transitionClass = 'transition-all duration-300 ease-in-out';

  return (
    <div
      className={`
        relative flex-shrink-0 cursor-pointer 
        ${transitionClass}
        ${isSelected ? "z-30 opacity-100" : "opacity-70 hover:opacity-100 z-20"}
      `}
      onClick={() => onClick(game)} 
    >
      <div
        className={`
          ${sizeClasses} rounded-lg overflow-hidden
          ${transitionClass}
          
          relative // Necessário para posicionar o brilho
          
          ${isSelected 
            ? 'transform scale-110 ring-1 ring-white shadow-lg shadow-white/50' 
            : 'transform scale-100'
          }
        `}
      >
        <img
          src={game.cover}
          alt={game.title}
          className="w-full h-full object-cover"
        />

        {/* ELEMENTO DE BRILHO HORIZONTAL */}
        {isSelected && (
          <span 
            className="
              absolute inset-0 
              
              bg-gradient-to-r from-transparent via-white/30 to-transparent // 1. Gradiente horizontal
              
              -translate-x-full // 2. Posição inicial à esquerda
              
              animate-shimmer // 3. Aplica a animação horizontal
              opacity-50
            "
          />
        )}
      </div>
    </div>
  );
}