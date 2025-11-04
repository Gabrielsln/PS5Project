// src/components/Navbar.jsx

import React, { useState, useEffect } from 'react'; // Importamos useState e useEffect

export default function Navbar({ profile, onProfileClick }) { 
  
  // 1. ESTADO: Armazena a hora atual como um objeto Date
  const [currentTime, setCurrentTime] = useState(new Date());

  // 2. EFEITO: Configura o relógio
  useEffect(() => {
    // Função para atualizar a hora
    const updateTime = () => {
      setCurrentTime(new Date());
    };

    // Configura o temporizador para atualizar a cada segundo (1000ms)
    const timerId = setInterval(updateTime, 1000);

    // 3. LIMPEZA: Limpa o temporizador quando o componente é desmontado
    return () => clearInterval(timerId);
  }, []); // O array vazio garante que o efeito rode apenas na montagem/desmontagem

  // Formata a hora para HH:MM no fuso horário local do dispositivo
  // Usa padStart para garantir que minutos/horas sejam '05' em vez de '5'
  const hours = String(currentTime.getHours()).padStart(2, '0');
  const minutes = String(currentTime.getMinutes()).padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;

  // Dados do Perfil (Kratos)
  const profileImageUrl = profile?.imageUrl || "/images/placeholder_profile.png"; 
  const profileName = profile?.name || "Usuário";

  return (
    <nav className="fixed top-0 left-0 right-0 w-full px-10 py-4 flex justify-between items-center text-gray-300 z-50">
      
      {/* Esquerda: "Jogos" e "Mídia" */}
      <div className="flex items-center space-x-8 text-xl font-semibold">
        <span className="text-white cursor-pointer hover:text-blue-400 transition-colors duration-200">Jogos</span>
       {/* CORREÇÃO: Mudar texto e adicionar onClick para a Documentação */}
               <span 
                 className="cursor-pointer hover:text-blue-400 transition-colors duration-200"
                 onClick={() => alert("Abrindo Documentação do Site...")} 
               >
                 Documentação
               </span>
      </div>

      {/* Direita: Perfil e Relógio */}
      <div className="flex items-center space-x-6 z-50">
        
        {/* Foto de Perfil (Kratos) - Clicável */}
        <div 
          className="w-8 h-8 rounded-full border border-gray-400 cursor-pointer overflow-hidden transition-all duration-200 hover:ring-2 hover:ring-blue-400"
          onClick={onProfileClick}
          title={`Logado como: ${profileName} (Clique para trocar)`}
        >
          <img 
            src={profileImageUrl}
            alt={profileName}
            className="w-full h-full object-cover"
          />
        </div> 
        
        {/* HORÁRIO ATUALIZADO */}
        <span className="text-2xl font-light">
          {formattedTime}
        </span>
      </div>
    </nav>
  );
}