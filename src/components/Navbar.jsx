// src/components/Navbar.jsx

import React, { useState, useEffect } from 'react'; 

export default function Navbar({ profile, onProfileClick, onDocumentationClick, navZone, navbarIndex }) { 
  
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date());
    };
    const timerId = setInterval(updateTime, 1000);
    return () => clearInterval(timerId);
  }, []); 

  const hours = String(currentTime.getHours()).padStart(2, '0');
  const minutes = String(currentTime.getMinutes()).padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;

  const profileImageUrl = profile?.imageUrl || "/images/placeholder_profile.png"; 
  const profileName = profile?.name || "Usuário";

  // --- LÓGICA DE FOCO VISUAL ---
  const isNavbarFocused = navZone === 'navbar';

  // Helper para classes de Foco
  const getFocusClasses = (index) => {
    if (!isNavbarFocused) return 'text-gray-400 opacity-70'; // Navbar inativa
    if (navbarIndex === index) return 'text-white scale-110'; // Item ativo
    return 'text-gray-400 opacity-70'; // Item inativo
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-full px-10 py-4 flex justify-between items-center text-gray-300 z-50">
      
      {/* Esquerda: "Jogos" e "Documentação" */}
      <div className="flex items-center space-x-8 text-xl font-semibold">
        <span 
          className={`cursor-pointer transition-all duration-200 ${getFocusClasses(0)}`}
        >
          Jogos
        </span>
       
        <span 
          className={`cursor-pointer transition-all duration-200 ${getFocusClasses(1)}`}
          onClick={onDocumentationClick} 
        >
          Documentação
        </span>
      </div>

      {/* Direita: Perfil e Relógio */}
      <div className="flex items-center space-x-6 z-50">
        
        {/* Foto de Perfil (Kratos) - Clicável */}
        <div 
          className={`
            w-8 h-8 rounded-full cursor-pointer overflow-hidden 
            transition-all duration-200
            ${isNavbarFocused && navbarIndex === 2 
              ? 'ring-2 ring-white scale-110' // Foco no Perfil
              : 'border border-gray-400 opacity-70' // Padrão
            }
          `}
          onClick={onProfileClick}
          title={`Logado como: ${profileName} (Clique para trocar)`}
        >
          <img 
            src={profileImageUrl}
            alt={profileName}
            className="w-full h-full object-cover"
          />
        </div> 
        
        {/* HORÁRIO ATUALIZADO (sempre visível) */}
        <span className="text-2xl font-light">
          {formattedTime}
        </span>
      </div>
    </nav>
  );
}