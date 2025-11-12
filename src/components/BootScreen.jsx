

import React, { useEffect, useCallback } from 'react';

export default function BootScreen({ onBoot }) {

  const handleInteraction = useCallback(() => {
    onBoot();
  }, [onBoot]);

  useEffect(() => {
    // Esta função lida com o Enter OU Clique
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        handleInteraction();
      }
    };
    
    // Adiciona os listeners
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleKeyDown); // Garante que 'Enter' funciona

    // Limpa os listeners quando o componente é desmontado
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleInteraction]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative bg-black">
      {/* Fundo de Partículas (o mesmo vídeo da tela de perfil) */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/videos/ps5_bg_loop.mp4" // Verifique se este caminho está correto
      >
        Seu navegador não suporta a tag de vídeo.
      </video>
      {/* Overlay Sutil */}
      <div className="absolute inset-0 bg-black/0 z-10" /> 
      
      {/* Conteúdo Central */}
      <div className="relative z-20 flex flex-col items-center animate-fadeIn">
        
        {/* Estrutura do Botão Pulsante */}
        <div className="relative flex items-center justify-center w-24 h-24">
          {/* 1. O Círculo Pulsante (Atrás) */}
          <div className="absolute w-full h-full rounded-full border-2 border-white/70 animate-pulseExpand z-10"></div>
          
          {/* 2. O Ícone Estático (Na Frente) */}
          <div className="relative w-24 h-24 rounded-full border-2 border-white/40 flex items-center justify-center z-20 bg-black/30">
              <img 
                src="/images/ps_icon_logo.png" // Ícone do PS
                alt="PlayStation Logo" 
                className="h-14 w-auto" 
              />
          </div>
        </div>

        <p className="mt-8 text-xl text-gray-300">
          Pressione o botão PS no seu controle.
        </p>
        
        {/* --- NOVO: Texto de Dica --- */}
        <p className="mt-4 text-sm text-gray-500 max-w-xs text-center">
          Para melhor experiência, acesse a página em tela cheia e utilize a navegação do teclado (W/A/S/D) para acessar.
        </p>
        {/* --- FIM DO NOVO TEXTO --- */}
        
      </div>
    </div>
  );
}