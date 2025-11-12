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
          ${isSelected 
            ? 'border-white shadow-2xl shadow-white/50' 
            : 'border-transparent'
          }
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


export default function ProfileSelect({ profiles, onSelectProfile, profileMusic }) {
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(0);

  // --- CORREÇÃO 1: Estabiliza a função 'playProfileMusic' com useCallback ---
  const playProfileMusic = useCallback(() => {
    if (profileMusic && profileMusic.current && profileMusic.current.paused) {
      profileMusic.current.loop = true;
      profileMusic.current.play().catch(e => console.warn("Música de perfil falhou:", e));
    }
  }, [profileMusic]); // Esta função só depende da ref da música

  // --- CORREÇÃO 2: Unifica 'handleProfileClick' para tocar música ---
  const handleProfileClick = useCallback((index) => {
    playProfileMusic(); // Toca a música ao clicar
    
    const profile = profiles[index];
    setSelectedProfileIndex(index); 
    onSelectProfile(profile);        
  }, [profiles, onSelectProfile, playProfileMusic]); // Adiciona 'playProfileMusic'

  // --- CORREÇÃO 3: Adiciona 'playProfileMusic' às dependências do handleKeyDown ---
  const handleKeyDown = useCallback((event) => {
    playProfileMusic(); // Toca a música na primeira interação de teclado
    
    const key = event.key.toLowerCase(); 
    
    if (key === 'arrowleft' || key === 'a') {
      setSelectedProfileIndex(prev => Math.max(0, prev - 1));
    } else if (key === 'arrowright' || key === 'd') {
      setSelectedProfileIndex(prev => Math.min(profiles.length - 1, prev + 1));
    } 
    
    if (key === 'enter') {
      event.preventDefault();
      handleProfileClick(selectedProfileIndex);
    }
  }, [selectedProfileIndex, profiles, handleProfileClick, playProfileMusic]); // 'playProfileMusic' adicionado

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);


  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative bg-black">
      
      {/* VÍDEO DE FUNDO ANIMADO */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/videos/ps5_bg_loop.mp4" 
      >
        Seu navegador não suporta a tag de vídeo.
      </video>
      
      {/* Overlay com opacidade reduzida e SEM backdrop-blur */}
      <div className="absolute inset-0 bg-black/60 z-10" /> 
      
      {/* Conteúdo Central */}
      <div className="relative z-20 flex flex-col items-center">
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
              // CORREÇÃO 4: Simplifica o onClick para usar o handler unificado
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