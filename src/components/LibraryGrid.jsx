// src/components/LibraryGrid.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import moveSound from '../sound/move.mp3'; // Importa o som localmente para uso exclusivo

// As props selectedIndex/onGameSelect de App.jsx serão ignoradas aqui para manter
// a lógica de estado de navegação local, como estava no seu LibraryGrid.

export default function LibraryGrid({ games, onBack }) { 
  
  const [selectedIndex, setSelectedIndex] = useState(0);

  // --- NOVO ESTADO: Adiciona controle para atrasar o som de mover ---
  const [isSoundReady, setIsSoundReady] = useState(false);

  // --- CORREÇÃO DE ÁUDIO: Adiciona objeto Audio local e estável ---
  const audioTick = useRef(new Audio(moveSound)); 

  // Refs para os timers e flag de load
  const initialDelayRef = useRef(null);
  const repeatIntervalRef = useRef(null);
  const heldDirection = useRef(null);
  const isInitialLoad = useRef(true); 

  // --- NOVO useEffect: Adiciona um atraso de  para o som de mover ---
  useEffect(() => {
    // Dá um tempo para o som de entrada ('navigation_enter.mp3') terminar
    const timer = setTimeout(() => {
      setIsSoundReady(true);
    }, 700); 

    return () => clearTimeout(timer);
  }, []); // Roda SÓ UMA VEZ na montagem

  // --- Efeito de Som Separado (para o som de mover na grid) ---
  useEffect(() => {
    // 1. Atraso na inicialização.
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    // 2. VERIFICAÇÃO ADICIONAL: Só toca se isSoundReady for true (após o delay)
    if (!isSoundReady) return;

    // 3. Toca o som de mover.
    audioTick.current.currentTime = 0; 
    audioTick.current.play().catch((e) => console.error("Audio play failed:", e)); 
  }, [selectedIndex, isSoundReady]); // Adicione isSoundReady como dependência

  // --- onBack (para ser estável) ---
  const onBackRef = useRef(onBack);
  useEffect(() => {
    onBackRef.current = onBack;
  }, [onBack]);

  // --- Função de Movimento (sem som) ---
  const moveSelection = useCallback((direction) => {
    const COLS = 6;
    const numGames = games.length;

    setSelectedIndex(prevIndex => {
      let newIndex = prevIndex;

      switch (direction) {
        case 'up':
          newIndex = Math.max(0, prevIndex - COLS);
          break;
        case 'down':
          newIndex = Math.min(numGames - 1, prevIndex + COLS);
          break;
        case 'left':
          newIndex = Math.max(0, prevIndex - 1);
          break;
        case 'right':
          newIndex = Math.min(numGames - 1, prevIndex + 1);
          break;
        default:
          return prevIndex;
      }
      
      return (newIndex !== prevIndex) ? newIndex : prevIndex;
    });
  }, [games.length]);

  // --- handleKeyDown ---
  const handleKeyDown = useCallback((event) => {
    if (event.repeat) return;

    if (event.key === 'Escape') {
      onBackRef.current(); 
      return;
    }

    let direction = null;
    switch (event.key.toLowerCase()) {
      case 'w': direction = 'up'; break;
      case 's': direction = 'down'; break;
      case 'a': direction = 'left'; break;
      case 'd': direction = 'right'; break;
      default: return;
    }

    event.preventDefault();
    
    moveSelection(direction); 
    heldDirection.current = direction;

    if (initialDelayRef.current) clearTimeout(initialDelayRef.current);
    if (repeatIntervalRef.current) clearInterval(repeatIntervalRef.current);

    initialDelayRef.current = setTimeout(() => {
      repeatIntervalRef.current = setInterval(() => {
        moveSelection(heldDirection.current);
      }, 200);
    }, 350);

  }, [moveSelection]);

  // handleKeyUp (sem alteração)
  const handleKeyUp = useCallback((event) => {
    let direction = null;
    switch (event.key.toLowerCase()) {
      case 'w': direction = 'up'; break;
      case 's': direction = 'down'; break;
      case 'a': direction = 'left'; break;
      case 'd': direction = 'right'; break;
      default: return;
    }

    if (direction === heldDirection.current) {
      heldDirection.current = null;
      if (initialDelayRef.current) {
        clearTimeout(initialDelayRef.current);
        initialDelayRef.current = null;
      }
      if (repeatIntervalRef.current) {
        clearInterval(repeatIntervalRef.current);
        repeatIntervalRef.current = null;
      }
    }
  }, []);

  // useEffect dos Listeners (sem alteração)
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      
      if (initialDelayRef.current) clearTimeout(initialDelayRef.current);
      if (repeatIntervalRef.current) clearInterval(repeatIntervalRef.current);
    };
  }, [handleKeyDown, handleKeyUp]);

  // --- RENDERIZAÇÃO (JSX) ---
  return (
    <div 
      className="min-h-screen w-full relative bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(/images/cyberpunk_banner.png)` }}
    >
      <div className="absolute inset-0 bg-black/70 z-0" />
      <div className="relative z-10 min-h-screen w-full p-8 pt-24 max-w-7xl mx-auto animate-fadeIn">
        <h1 className="text-4xl font-light mb-8">Biblioteca de Jogos</h1>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {games.map((game, index) => {
            const isSelected = index === selectedIndex;
            return (
              <div 
                key={game.id} 
                className={`
                  flex flex-col cursor-pointer transition-transform duration-150 
                  ${isSelected ? 'scale-110 ring-2 ring-blue-500' : 'hover:scale-105'}
                `}
                onClick={() => setSelectedIndex(index)}
              >
                <img 
                  src={game.cover}
                  alt={game.title}
                  className="w-full object-cover rounded-lg shadow-lg aspect-square"
                />
              </div>
            );
          })}
        </div>
        
        <p className="text-center text-gray-400 mt-12">
          Pressione 'ESC' para voltar
        </p>
      </div>
    </div>
  );
}