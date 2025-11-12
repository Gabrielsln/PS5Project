

import React, { useState, useEffect, useRef, useCallback } from 'react';
import moveSound from '../sound/move.mp3'; 

export default function LibraryGrid({ games, onBack, onGameExpand }) { 
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSoundReady, setIsSoundReady] = useState(false);
  const audioTick = useRef(new Audio(moveSound)); 
  const initialDelayRef = useRef(null);
  const repeatIntervalRef = useRef(null);
  const heldDirection = useRef(null);
  const isInitialLoad = useRef(true); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSoundReady(true);
    }, 700); 
    return () => clearTimeout(timer);
  }, []); 

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    if (!isSoundReady) return;
    audioTick.current.currentTime = 0; 
    audioTick.current.play().catch((e) => console.error("Audio play failed:", e)); 
  }, [selectedIndex, isSoundReady]); 

  const onBackRef = useRef(onBack);
  useEffect(() => {
    onBackRef.current = onBack;
  }, [onBack]);

  const moveSelection = useCallback((direction) => {
    if (!Array.isArray(games) || games.length === 0) return; 
      
    const COLS = 6;
    const numGames = games.length;

    setSelectedIndex(prevIndex => {
      let newIndex = prevIndex;

      switch (direction) {
        case 'up': newIndex = Math.max(0, prevIndex - COLS); break;
        case 'down': newIndex = Math.min(numGames - 1, prevIndex + COLS); break;
        case 'left': newIndex = Math.max(0, prevIndex - 1); break;
        case 'right': newIndex = Math.min(numGames - 1, prevIndex + 1); break;
        default: return prevIndex;
      }
      return (newIndex !== prevIndex) ? newIndex : prevIndex;
    });
  }, [games]); 

  const handleKeyDown = useCallback((event) => {
    if (event.repeat) return;

    if (event.key === 'Escape') {
      onBackRef.current(); // ESC deve voltar
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const gameToExpand = games[selectedIndex];
      if (gameToExpand) {
        onGameExpand(gameToExpand.id); 
      }
      return;
    }

    let direction = null;
    switch (event.key.toLowerCase()) {
      case 'w': direction = 'up'; break; case 's': direction = 'down'; break;
      case 'a': direction = 'left'; break; case 'd': direction = 'right'; break;
      case 'arrowup': direction = 'up'; break; case 'arrowdown': direction = 'down'; break;
      case 'arrowleft': direction = 'left'; break; case 'arrowright': direction = 'right'; break;
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

  }, [moveSelection, selectedIndex, games, onGameExpand]); 

  const handleKeyUp = useCallback((event) => {
    let direction = null;
    switch (event.key.toLowerCase()) {
      case 'w': direction = 'up'; break; case 's': direction = 'down'; break;
      case 'a': direction = 'left'; break; case 'd': direction = 'right'; break;
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

  return (
    <div 
      className="min-h-screen w-full relative bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(/images/cyberpunk_banner.png)` }}
    >
      <div className="absolute inset-0 bg-black/70 z-0" />
      <div className="relative z-10 min-h-screen w-full p-8 pt-24 max-w-7xl mx-auto animate-fadeIn">
        <h1 className="text-4xl font-light mb-8">Biblioteca de Jogos</h1>
        
        {(!Array.isArray(games) || games.length === 0) ? (
            <p className="text-2xl text-gray-500">Carregando jogos...</p>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {games.map((game, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                        <div 
                            key={game.id} 
                            // 'relative' e 'overflow-hidden' para conter o brilho
                            className={`
                              relative overflow-hidden rounded-lg
                              flex flex-col cursor-pointer transition-transform duration-150 
                              ${isSelected ? 'scale-110 ring-2 ring-white' : 'hover:scale-105'}
                            `}
                            onClick={() => { setSelectedIndex(index); onGameExpand(game.id); }}
                        >
                            <img 
                              src={game.cover} 
                              alt={game.title} 
                              className="w-full object-cover shadow-lg aspect-square"
                            />
                            
                            {/* O <span> de brilho (shimmer) */}
                            {isSelected && (
                              <span 
                                className="
                                  absolute inset-0 
                                  bg-gradient-to-r from-transparent via-white/30 to-transparent 
                                  -translate-x-full 
                                  animate-shimmer 
                                  opacity-50
                                "
                              />
                            )}
                        </div>
                    );
                })}
            </div>
        )}
        
        <p className="text-center text-gray-400 mt-12">Pressione 'ESC' para voltar</p>
      </div>
    </div>
  );
}