// src/components/Navbar.jsx

import React from 'react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 w-full px-10 py-4 flex justify-between items-center text-gray-300 z-20 bg-black bg-opacity-20 backdrop-blur-md border-b border-gray-700">
      {/* Esquerda: "Jogos" e "Mídia" */}
      <div className="flex items-center space-x-8 text-xl font-semibold">
        <span className="text-white cursor-pointer hover:text-blue-400 transition-colors duration-200">Jogos</span>
        <span className="cursor-pointer hover:text-blue-400 transition-colors duration-200">Mídia</span>
      </div>

      {/* Direita: Ícones e Relógio */}
      <div className="flex items-center space-x-6">
        {/* Ícones placeholder para pesquisa, configurações, etc. */}
        <span className="text-2xl cursor-pointer hover:text-white transition-colors duration-220">🔍</span> {/* Ícone de Pesquisa */}
        <span className="text-2xl cursor-pointer hover:text-white transition-colors duration-220">⚙️</span> {/* Ícone de Configurações */}
        <div className="w-8 h-8 rounded-full bg-gray-600 border border-gray-400 cursor-pointer"></div> {/* Foto de Perfil */}
        <span className="text-2xl font-light">8:19</span> {/* Hora */}
      </div>
    </nav>
  );
}