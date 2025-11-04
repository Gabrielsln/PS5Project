// src/components/GameCard.jsx

import React from "react";

export default function GameCard({ game, isSelected, onClick }) {
  // O ícone é menor por padrão
  const baseSize = "w-20 h-20"; // Tamanho base do ícone
  const selectedSize = "w-24 h-24 scale-110"; // Tamanho e escala quando selecionado

  return (
    <div
      className={`
        relative flex-shrink-0 cursor-pointer rounded-lg overflow-hidden
        transition-all duration-300 ease-in-out transform
        ${isSelected ? selectedSize : baseSize}
        ${isSelected ? "ring-2 ring-blue-500 shadow-lg" : "shadow-md opacity-60"}
      `}
      onClick={onClick}
    >
      <img
        src={game.cover}
        alt={game.title}
        className="w-full h-full object-cover" // Apenas a imagem!
      />
      {/* Adicionei 'opacity-60' para os não selecionados para destacá-los menos */}
    </div>
  );
}