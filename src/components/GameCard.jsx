// src/components/GameCard.jsx (CORRIGIDO: Anel de seleção ainda mais fino 'ring-1')

import React from "react";

export default function GameCard({ game, isSelected, onClick }) {
  
  // 1. Define o tamanho base
  const isSquare = game.id === 0 || game.id === 99; // Store (0) e Library (99)
  const sizeClasses = isSquare ? "w-20 h-20" : "w-20 h-24"; 
  
  // Classes de transição
  const transitionClass = 'transition-all duration-300 ease-in-out';

  return (
    <div
      className={`
        relative flex-shrink-0 cursor-pointer 
        ${transitionClass}
        
        // Contêiner principal: controla a opacidade e z-index
        ${isSelected ? "z-30 opacity-100" : "opacity-70 hover:opacity-100 z-20"}
      `}
      onClick={() => onClick(game)} 
    >
      <div
        className={`
          ${sizeClasses} rounded-lg overflow-hidden
          ${transitionClass}
          
          // CORRIGIDO: Agora usando 'ring-1' para um anel mais fino
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
      </div>
    </div>
  );
}