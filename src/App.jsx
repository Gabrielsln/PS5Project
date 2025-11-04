// src/App.jsx

import { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "./components/Navbar";
import GameCard from "./components/GameCard";
import LibraryGrid from "./components/LibraryGrid";
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
  // Estados de View e Animação
  const [view, setView] = useState('home');
  const [appOpacity, setAppOpacity] = useState(1);

  // Estados de Seleção
  const [selectedId, setSelectedId] = useState(1);
  const [libraryIndex, setLibraryIndex] = useState(0); // Corrige o crash da biblioteca
  
  const selectedItem = allSelectableItems.find(
    (item) => item.id === selectedId
  );

  // Estados de Áudio
  const [audioTick] = useState(new Audio(moveSound));
  const [audioEnter] = useState(new Audio(navigationEnterSound));
  const [audioBack] = useState(new Audio(navigationBackSound));

  // Refs para Timers e Estado
  const initialDelayRef = useRef(null);
  const repeatIntervalRef = useRef(null);
  const heldDirection = useRef(null);
  const isInitialLoad = useRef(true);
  const selectedIdRef = useRef(selectedId);
  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  // Ref para a view
  const viewRef = useRef(view);
  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  // Pré-carrega todos os sons
  useEffect(() => {
    audioTick.load();
    audioEnter.load();
    audioBack.load();
  }, [audioTick, audioEnter, audioBack]);

  // Efeito de som de "mover" do carrossel (Home)
  useEffect(() => {
    if (isInitialLoad.current) return;
    if (viewRef.current !== 'home') return;
    audioTick.currentTime = 0;
    audioTick.play().catch((e) => console.error("Audio play failed:", e));
  }, [selectedId, audioTick]);

  // Efeito de som de "mover" da biblioteca
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    if (viewRef.current !== 'library') return;
    audioTick.currentTime = 0;
    audioTick.play().catch((e) => console.error("Audio play failed:", e));
  }, [libraryIndex, audioTick]);


  const [bannerOpacity, setBannerOpacity] = useState(1);
  const [currentBanner, setCurrentBanner] = useState(selectedItem.banner);

  // Função de troca de View (com som de "Voltar")
  const handleChangeView = useCallback((newView) => {
    if (newView === 'home') {
      audioBack.currentTime = 0;
      audioBack.play().catch((e) => console.error("Audio back failed:", e));
    }
    setAppOpacity(0);
    setTimeout(() => {
      setView(newView);
      setAppOpacity(1);
    }, 200);
  }, [audioBack]);

  // Funções de Movimento (sem som)
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


  // O "Cérebro" do Teclado
  const handleKeyDown = useCallback(
    (event) => {
      if (event.repeat) return;

      // Lógica da Tela HOME
      if (viewRef.current === 'home') {
        if (event.key === 'Enter' && selectedIdRef.current === libraryItem.id) {
          audioEnter.currentTime = 0;
          audioEnter.play().catch((e) => console.error("Audio enter failed:", e));
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
      // Lógica da Tela LIBRARY
      else if (viewRef.current === 'library') {
        if (event.key === 'Escape') {
          handleChangeView('home');
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
        moveLibrarySelection(direction);
        heldDirection.current = direction;
        initialDelayRef.current = setTimeout(() => {
          repeatIntervalRef.current = setInterval(() => {
            moveLibrarySelection(heldDirection.current);
          }, 200);
        }, 350);
      }
    },
    [moveHomeSelection, moveLibrarySelection, handleChangeView, audioEnter]
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

  // Event Listeners
  useEffect(() => {
    const cleanup = () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (initialDelayRef.current) clearTimeout(initialDelayRef.current);
      if (repeatIntervalRef.current) clearInterval(repeatIntervalRef.current);
      heldDirection.current = null;
    };

    cleanup();

    if (appOpacity === 1) {
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