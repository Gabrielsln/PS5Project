// src/components/LibraryGrid.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';

// Recebe o audioTick do App.jsx
export default function LibraryGrid({ games, onBack, audioTick = new Audio() }) {
  
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Refs para os timers
  const initialDelayRef = useRef(null);
  const repeatIntervalRef = useRef(null);
  const heldDirection = useRef(null);
  const isInitialLoad = useRef(true); // Para não tocar som na carga

  // --- CORREÇÃO: Efeito de Som Separado ---
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    audioTick.currentTime = 0;
    audioTick.play().catch((e) => console.error("Audio play failed:", e));
  }, [selectedIndex, audioTick]); // Toca quando o índice muda

  // --- CORREÇÃO: Função de Movimento (sem som) ---
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
  }, [games.length]); // <-- Dependência estável!

  // --- CORREÇÃO: onBack (para ser estável) ---
  // Embrulhamos a função 'onBack' (que vem das props) em um ref
  // para que 'handleKeyDown' não precise depender dela.
  const onBackRef = useRef(onBack);
  useEffect(() => {
    onBackRef.current = onBack;
  }, [onBack]);

  // --- CORREÇÃO: handleKeyDown (com dependências estáveis) ---
  const handleKeyDown = useCallback((event) => {
    if (event.repeat) return;

    if (event.key === 'Escape') {
      onBackRef.current(); // Chama a função a partir do Ref
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
    
    moveSelection(direction); // Move uma vez
    heldDirection.current = direction;

    if (initialDelayRef.current) clearTimeout(initialDelayRef.current);
    if (repeatIntervalRef.current) clearInterval(repeatIntervalRef.current);

    initialDelayRef.current = setTimeout(() => {
      repeatIntervalRef.current = setInterval(() => {
        moveSelection(heldDirection.current);
      }, 200);
    }, 350);

  }, [moveSelection]); // <-- Dependências estáveis!

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
  }, []); // <-- Estável!

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
  }, [handleKeyDown, handleKeyUp]); // <-- Dependências estáveis!

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
                // Adicionando onClick à grade para navegação
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