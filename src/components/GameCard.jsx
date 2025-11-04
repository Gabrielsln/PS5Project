// src/components/GameCard.jsx (CORRIGIDO: Tamanho Menor e Formato Quase Quadrado)

import React from "react";

export default function GameCard({ game, isSelected, onClick }) {
  
  // 1. Define o tamanho base dependendo do tipo de item
  const isSquare = game.id === 0 || game.id === 99; // Store (0) e Library (99)
  
  // Ícones da Store/Library são 80x80px (w-20 h-20)
  // Cartões de Jogo são 80x96px (w-20 h-24)
  const sizeClasses = isSquare ? "w-20 h-20" : "w-20 h-24"; 

  return (
    <div
      className={`
        relative flex-shrink-0 cursor-pointer 
        transition-all duration-300 ease-in-out
        ${
          isSelected
            ? "transform scale-110 shadow-lg shadow-blue-500/50 z-30" 
            : "opacity-70 hover:opacity-100 z-20"
        }
      `}
      onClick={onClick}
    >
      <div
        className={`
          ${sizeClasses} rounded-lg overflow-hidden border-2 
          transition-all duration-300 ease-in-out
          ${
            isSelected ? "border-blue-400" : "border-transparent" 
          }
        `}
      >
        <img
          src={game.cover}
          alt={game.title}
          className="w-full h-full object-cover"
        />
      </div>
      {/* Opcional: Removido o título para maximizar a visualização do banner */}
    </div>
  );
}