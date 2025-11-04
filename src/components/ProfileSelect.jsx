// src/components/ProfileSelect.jsx

import React, { useState, useEffect, useCallback } from 'react';

// Componente para o Cartão de Perfil
const ProfileCard = ({ profile, isSelected, onClick }) => {
  return (
    <div 
      className={`
        flex flex-col items-center justify-center cursor-pointer 
        transition-all duration-300 ease-in-out mx-8
        ${isSelected ? 'transform scale-110' : 'opacity-70 hover:opacity-100'}
      `}
      onClick={onClick}
    >
      <div 
        className={`
          w-48 h-48 rounded-full border-4 transition-colors duration-300
          ${isSelected ? 'border-blue-500 shadow-2xl shadow-blue-500/50' : 'border-transparent'}
          overflow-hidden bg-gray-800
        `}
      >
        <img 
          src={profile.imageUrl} 
          alt={profile.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <h2 
        className={`
          mt-4 text-xl font-medium transition-colors duration-300
          ${isSelected ? 'text-white' : 'text-gray-400'}
        `}
      >
        {profile.name}
      </h2>
      {isSelected && (
        <span className="text-sm text-blue-400 mt-1">Opções</span>
      )}
    </div>
  );
};


export default function ProfileSelect({ profiles, onSelectProfile }) {
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(0);

  // NOVO: Handler unificado para cliques e navegação
  const handleProfileClick = useCallback((index) => {
    const profile = profiles[index];
    
    // Atualiza o estado de seleção para feedback visual
    setSelectedProfileIndex(index); 
    
    // Executa a ação no App.jsx, passando o OBJETO do perfil
    onSelectProfile(profile);        
  }, [profiles, onSelectProfile]);

  // Manipulação de Teclado
  const handleKeyDown = useCallback((event) => {
    const key = event.key.toLowerCase(); 
    
    // Lógica de movimento A/D e setas
    if (key === 'arrowleft' || key === 'a') {
      setSelectedProfileIndex(prev => Math.max(0, prev - 1));
    } else if (key === 'arrowright' || key === 'd') {
      setSelectedProfileIndex(prev => Math.min(profiles.length - 1, prev + 1));
    } 
    
    // Usa handleProfileClick para o Enter
    if (key === 'enter') {
      event.preventDefault();
      handleProfileClick(selectedProfileIndex);
    }
  }, [selectedProfileIndex, profiles, handleProfileClick]); 

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);


  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative bg-black">
      {/* BACKGROUND CORRIGIDO */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: `url(/images/background_login.jpg)` }} 
      />
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" /> 
      
      {/* Conteúdo Central */}
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-3xl font-light text-white mb-2">
          Seja bem-vindo(a) novamente ao PlayStation
        </h1>
        <p className="text-gray-400 mb-20">Quem está usando esse controle?</p>

        <div className="flex justify-center">
          {profiles.map((profile, index) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              isSelected={index === selectedProfileIndex}
              // O clique do mouse agora chama o handleProfileClick, passando o índice
              onClick={() => handleProfileClick(index)} 
            />
          ))}
        </div>

        <p className="mt-16 text-xl text-gray-400">
            Dica: Use as setas Esquerda/Direita ou A/D para navegar e Enter para selecionar.
        </p>
      </div>
    </div>
  );
}