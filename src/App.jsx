// src/App.jsx (VERSÃO COM TELA DE SELEÇÃO DE PERFIL E LÓGICA DE SOM AJUSTADA)

import { useState, useEffect, useCallback, useRef } from "react";
import GameCard from "./components/GameCard";
import LibraryGrid from "./components/LibraryGrid";
import ProfileSelect from "./components/ProfileSelect"; 
import { games } from "./data/games";

// Importa todos os sons
import moveSound from "./sound/move.mp3";
import navigationEnterSound from "./sound/navigation_enter.mp3";
import navigationBackSound from "./sound/navigation_back.mp3";

// --- Constantes (sem alteração) ---
const storeItem = {
  id: 0,
  title: "PlayStation Store",
  cover: "/images/ps_store_icon.png",
  banner: "/images/cyberpunk_banner.png",
};
const libraryItem = {
  id: 99,
  title: "Biblioteca de Jogos",
  cover: "/images/library_icon.png",
  banner: "/images/gow_banner.webp",
};
const allSelectableItems = [storeItem, ...games, libraryItem];
// --- Fim Constantes ---


export default function App() {
  // Estado de View inicial
  const [view, setView] = useState('profile'); 
  const [appOpacity, setAppOpacity] = useState(1);

  // Estados de Seleção
  const [selectedId, setSelectedId] = useState(1);
  const [libraryIndex, setLibraryIndex] = useState(0);
  
  const selectedItem = allSelectableItems.find(
    (item) => item.id === selectedId
  );

  // Refs de Áudio e Estado
  const audioTick = useRef(new Audio(moveSound));
  const audioEnter = useRef(new Audio(navigationEnterSound));
  const audioBack = useRef(new Audio(navigationBackSound));
  const initialDelayRef = useRef(null);
  const repeatIntervalRef = useRef(null);
  const heldDirection = useRef(null);
  const isInitialLoad = useRef(true);
  const selectedIdRef = useRef(selectedId);
  const viewRef = useRef(view);
  
  useEffect(() => {
    selectedIdRef.current = selectedId;
    viewRef.current = view;
  }, [selectedId, view]);

  // Lógica de áudio e load inicial
  useEffect(() => {
    audioTick.current.load();
    audioEnter.current.load();
    audioBack.current.load();
    isInitialLoad.current = false; 
  }, []); 

  useEffect(() => {
    if (isInitialLoad.current) return;
    if (viewRef.current !== 'home') return;
    
    audioTick.current.currentTime = 0;
    audioTick.current.play().catch((e) => console.error("Audio play failed:", e));
  }, [selectedId]); 


  const [bannerOpacity, setBannerOpacity] = useState(1);
  const [currentBanner, setCurrentBanner] = useState(selectedItem.banner);

  // --- FUNÇÃO CORRIGIDA 1/2: Lógica de transição de tela ---
  const handleChangeView = useCallback((newView) => {
    let transitionDelay = 200; 
    
    // Toca o som de 'BACK' APENAS se estiver voltando da library para home (via ESC)
    if (newView === 'home' && viewRef.current === 'library') { 
      audioBack.current.currentTime = 0;
      audioBack.current.play().catch((e) => console.error("Audio back failed:", e));
      transitionDelay = 400; 
    } 
    // OBS: O som de ENTER/AVANÇAR é tocado nos manipuladores (handleKeyDown, handleProfileSelect)
    
    setAppOpacity(0);
    setTimeout(() => {
      setView(newView);
      setAppOpacity(1);
    }, transitionDelay); 
  }, []);
  
  // --- FUNÇÃO CORRIGIDA 2/2: Seleção de Perfil (Dispara o som de ENTER) ---
  const handleProfileSelect = useCallback((action) => {
    if (action === 'home') {
      // Dispara o som de ENTER imediatamente antes de mudar a view
      audioEnter.current.currentTime = 0;
      audioEnter.current.play().catch((e) => console.error("Audio enter failed:", e));
      
      // Muda a view diretamente, pois a navegação de perfil para home é imediata
      setView('home'); 
    } else if (action === 'docs') {
      alert("Abrindo Documentação do Site...");
    }
  }, []); 

  // Funções de Movimento (mantidas)
  const handleGameSelect = useCallback((newId) => {
    setSelectedId(newId);
  }, []); 

  const moveHomeSelection = useCallback((direction) => {
    setSelectedId(prevId => {
      const currentIndex = allSelectableItems.findIndex(item => item.id === prevId);
      let newIndex = currentIndex;
      if (direction === 'left') {
        newIndex = (currentIndex - 1 + allSelectableItems.length) % allSelectableItems.length;
      } else if (direction === 'right') {
        newIndex = (currentIndex + 1) % allSelectableItems.length;
      }
      return (newIndex !== currentIndex) ? allSelectableItems[newIndex].id : prevId;
    });
  }, [allSelectableItems]);

  const moveLibrarySelection = useCallback((direction) => {
    const COLS = 6;
    const numGames = games.length;
    setLibraryIndex(prevIndex => {
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
  }, [games.length]);


  useEffect(() => {
    if (view !== 'home') return;
    setBannerOpacity(0);
    const timer = setTimeout(() => {
      setCurrentBanner(selectedItem.banner);
      setBannerOpacity(1);
    }, 200);
    return () => clearTimeout(timer);
  }, [selectedItem, view]);
  
  // O CÉREBRO DO TECLADO:
  const handleKeyDown = useCallback(
    (event) => {
      if (event.repeat) return;
      
      if (viewRef.current === 'profile') return; // IGNORA O TECLADO NA TELA DE PERFIL (deixando o ProfileSelect controlar)

      if (viewRef.current === 'home') {
        if (event.key === 'Enter' && selectedIdRef.current === libraryItem.id) {
          // Toca o som de ENTER aqui (função de navegação para a Library)
          audioEnter.current.currentTime = 0;
          audioEnter.current.play().catch((e) => console.error("Audio enter failed:", e));
          handleChangeView('library');
          return;
        }
        
        let direction = null;
        if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") direction = 'left';
        if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") direction = 'right';

        if (direction) {
          moveHomeSelection(direction);
          heldDirection.current = direction;
          initialDelayRef.current = setTimeout(() => {
            repeatIntervalRef.current = setInterval(() => {
              moveHomeSelection(heldDirection.current);
            }, 200);
          }, 350);
        }
      }
      else if (viewRef.current === 'library') {
        if (event.key === 'Escape') {
          handleChangeView('home');
          return;
        }
        let direction = null;
        if (event.key === "ArrowUp") direction = 'up';
        if (event.key === "ArrowDown") direction = 'down';
        if (event.key === "ArrowLeft") direction = 'left';
        if (event.key === "ArrowRight") direction = 'right';
        
        if (direction) {
          moveLibrarySelection(direction);
        }
      }
    },
    [moveHomeSelection, moveLibrarySelection, handleChangeView] 
  );
  
  // handleKeyUp
  const handleKeyUp = useCallback((event) => {
    if (heldDirection.current) {
      heldDirection.current = null;
      if (initialDelayRef.current) clearTimeout(initialDelayRef.current);
      if (repeatIntervalRef.current) clearInterval(repeatIntervalRef.current);
      initialDelayRef.current = null;
      repeatIntervalRef.current = null;
    }
  }, []);

  
  useEffect(() => {
    const cleanup = () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (initialDelayRef.current) clearTimeout(initialDelayRef.current);
      if (repeatIntervalRef.current) clearInterval(repeatIntervalRef.current);
      heldDirection.current = null;
    };

    cleanup();

    if (appOpacity === 1 && view !== 'profile') { 
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
    }
    
    return cleanup;
  }, [handleKeyDown, handleKeyUp, appOpacity, view]);

  
  // --- RENDERIZAÇÃO (JSX) ---
  return (
    <div 
      className="min-h-screen w-full relative flex flex-col overflow-hidden"
      style={{ opacity: appOpacity, transition: 'opacity 0.2s ease-in-out' }}
    >
      
      {/* TELA DE SELEÇÃO DE PERFIL */}
      {view === 'profile' && (
          <ProfileSelect onSelectProfile={handleProfileSelect} />
      )}
      
      {view === 'home' && (
        <>
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${currentBanner})`,
              opacity: bannerOpacity,
              transition: "opacity 0.2s ease-in-out",
            }}
          >
            <div className="absolute inset-0 bg-black/50 z-10"></div>
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/90 to-transparent z-10"></div>
          </div>

          <nav className="fixed top-0 left-0 right-0 w-full px-10 py-4 flex justify-between items-center text-gray-300 z-20">
             <div className="flex items-center space-x-8 text-xl font-semibold">
               <span className="text-white cursor-pointer hover:text-blue-400 transition-colors duration-200">Jogos</span>
               <span className="cursor-pointer hover:text-blue-400 transition-colors duration-200">Mídia</span>
             </div>
             <div className="flex items-center space-x-6">
               <span className="text-2xl cursor-pointer hover:text-white transition-colors duration-220">🔍</span>
               <span className="text-2xl cursor-pointer hover:text-white transition-colors duration-220">⚙️</span>
               <div className="w-8 h-8 rounded-full bg-gray-600 border border-gray-400 cursor-pointer"></div>
               <span className="text-2xl font-light">8:19</span>
             </div>
          </nav>

          <main className="relative z-20 flex flex-col flex-grow justify-between h-full pt-20">
            {/* CORREÇÃO DO BALANÇO: Usando 'space-x-4' (versão restaurada) */}
            <div className="flex space-x-4 items-center p-8">
              <GameCard
                game={storeItem}
                isSelected={selectedId === storeItem.id}
                onClick={() => handleGameSelect(storeItem.id)}
              />
              <div className="h-20 w-px bg-gray-600"></div>
              <div className="flex space-x-4">
                {games.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    isSelected={selectedId === game.id} 
                    onClick={() => handleGameSelect(game.id)}
                  />
                ))}
              </div>
              <GameCard
                game={libraryItem}
                isSelected={selectedId === libraryItem.id}
                onClick={() => handleGameSelect(libraryItem.id)}
              />
            </div>

            <div
              key={selectedItem.id}
              className="text-left p-8 mb-16 max-w-2xl animate-fadeIn"
            >
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight text-blue-400 mb-4">
                {selectedItem.title}
              </h2>
              {selectedItem.id === storeItem.id && (
                <>
                  <p className="text-xl md:text-2xl font-light leading-relaxed text-gray-200 mb-8">
                    Damos-te as boas-vindas à próxima geração.
                  </p>
                  <p className="text-lg text-gray-400">
                    Dos mais recentes lançamentos a coleções primorosas, há algo
                    para todos.
                  </p>
                </>
              )}
            </div>
          </main>
        </>
      )}

      {view === 'library' && (
        <LibraryGrid 
          games={games} 
          onBack={() => handleChangeView('home')} 
          selectedIndex={libraryIndex}
          onGameSelect={setLibraryIndex} 
        />
      )}
    </div>
  );
}