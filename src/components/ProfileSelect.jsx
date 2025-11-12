

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
  
  // --- NOVO ESTADO DE ANIMAÇÃO ---
  // Controla se os elementos da tela de perfil estão prontos para aparecer
  const [isLoaded, setIsLoaded] = useState(false);

  // --- EFEITO DE ANIMAÇÃO AO MONTAR ---
  useEffect(() => {
    // Um pequeno atraso (50ms) para garantir que a transição de fade do App.jsx comece
    // antes que a animação de pop-in dos perfis comece.
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []); // Roda apenas uma vez quando o componente é montado

  // Função auxiliar para tocar a música de perfil (se pausada)
  const playProfileMusic = useCallback(() => {
    if (profileMusic && profileMusic.current && profileMusic.current.paused) {
      profileMusic.current.loop = true;
      profileMusic.current.play().catch(e => console.warn("Música de perfil falhou:", e));
    }
  }, [profileMusic]); 

  // Handler unificado para cliques e navegação
  const handleProfileClick = useCallback((index) => {
    playProfileMusic(); // Toca a música ao clicar
    
    const profile = profiles[index];
    setSelectedProfileIndex(index); 
    onSelectProfile(profile);        
  }, [profiles, onSelectProfile, playProfileMusic]); 

  // Manipulação de Teclado
  const handleKeyDown = useCallback((event) => {
    playProfileMusic(); 
    
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
  }, [selectedProfileIndex, profiles, handleProfileClick, playProfileMusic]); 

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
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/0 z-10" /> 
      
      {/* Conteúdo Central */}
      <div className="relative z-20 flex flex-col items-center">
        {/* --- ANIMAÇÃO DE TEXTO --- */}
        <h1 
          className={`text-3xl font-light text-white mb-2 transition-all duration-500 ease-out
            ${isLoaded ? 'opacity-100' : 'opacity-0 -translate-y-4'}
          `}
          style={{ transitionDelay: '50ms' }} // Atraso leve
        >
          Seja bem-vindo(a) novamente ao PlayStation
        </h1>
        <p 
          className={`text-gray-400 mb-20 transition-all duration-500 ease-out
            ${isLoaded ? 'opacity-100' : 'opacity-0 -translate-y-4'}
          `}
          style={{ transitionDelay: '100ms' }} // Atraso um pouco maior
        >
          Quem está usando esse controle?
        </p>
        {/* --- FIM DA ANIMAÇÃO DE TEXTO --- */}

        <div className="flex justify-center">
          {profiles.map((profile, index) => (
            // --- ANIMAÇÃO DE POP-IN ESCALONADA ---
            <div
              key={profile.id}
              className={`
                transition-all duration-300 ease-out
                ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
              `}
              // Atraso de 200ms para o primeiro, 300ms para o segundo
              style={{ transitionDelay: `${200 + (index * 100)}ms` }} 
            >
              <ProfileCard
                profile={profile}
                isSelected={index === selectedProfileIndex}
                onClick={() => handleProfileClick(index)} 
              />
            </div>
          ))}
        </div>

        <p className="mt-16 text-xl text-gray-400">
            Dica: Use as setas Esquerda/Direita ou A/D para navegar e Enter para selecionar.
        </p>
      </div>
    </div>
  );
}