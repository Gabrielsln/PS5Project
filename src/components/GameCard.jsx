// src/components/GameCard.jsx

import React from "react";

export default function GameCard({ game, isSelected, onClick }) {
  // 1. TAMANHO BASE ÚNICO
  // O "box" do layout sempre será w-20 h-20
  const baseSize = "w-20 h-20";

  // 2. CLASSES DE ESTADO
  // O que muda são apenas transformações e efeitos visuais
  const stateClasses = isSelected
    ? "scale-125 ring-2 ring-blue-500 shadow-lg z-10" // Aumenta (scale), brilha e fica na frente (z-index)
    : "opacity-60 shadow-md"; // Não selecionado: fica opaco

  return (
    <div
      className={`
        relative flex-shrink-0 cursor-pointer rounded-lg overflow-hidden
        transition-all duration-150 ease-in-out transform
        ${baseSize} 
        ${stateClasses}
      `}
      onClick={onClick}
    >
      <img
        src={game.cover}
        alt={game.title}
        className="w-full h-full object-cover"
      />
    </div>
  );
}