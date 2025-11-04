// src/App.jsx

import { useState, useEffect, useCallback, useRef } from "react";
import GameCard from "./components/GameCard";
import LibraryGrid from "./components/LibraryGrid";
import ProfileSelect from "./components/ProfileSelect"; 
import Navbar from "./components/Navbar"; 
import GameDetailScreen from "./components/GameDetailScreen"; // Importação necessária
import { games } from "./data/games";

// Importa todos os sons
import moveSound from "./sound/move.mp3";
import navigationEnterSound from "./sound/navigation_enter.mp3";
import navigationBackSound from "./sound/navigation_back.mp3";

// --- Constantes de JOGOS ---
const storeItem = { id: 0, title: "PlayStation Store", cover: "/images/ps_store_icon.png", banner: "/images/cyberpunk_banner.png" };
const libraryItem = { id: 99, title: "Biblioteca de Jogos", cover: "/images/library_icon.png", banner: "/images/gow_banner.webp" };
const allSelectableItems = [storeItem, ...games, libraryItem];
// --- Constantes de PERFIL ---
const PROFILES = [
  { id: 1, name: "Kratos", imageUrl: "/images/kratos_icon.jpeg", action: "home" }, // CORRIGIDO: kratos_icon.jpeg
  { id: 2, name: "Documentação", imageUrl: "/images/document_icon.png", action: "docs" },
];


export default function App() {
  const [view, setView] = useState('profile'); 
  const [appOpacity, setAppOpacity] = useState(1);
  const [selectedProfile, setSelectedProfile] = useState(PROFILES[0]); 

  const [selectedId, setSelectedId] = useState(1); 
  const [libraryIndex, setLibraryIndex] = useState(0);

  const [expandedGameId, setExpandedGameId] = useState(null); 

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
  
  // INICIALIZAÇÃO DE ITENS E BANNER
  const initialSelectedItem = allSelectableItems.find((item) => item.id === selectedId) || allSelectableItems[0];
  const [bannerOpacity, setBannerOpacity] = useState(1);
  const [currentBanner, setCurrentBanner] = useState(initialSelectedItem.banner);
  const selectedItem = allSelectableItems.find((item) => item.id === selectedId) || allSelectableItems[0];

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

  // Efeito de som para o movimento na Home
  useEffect(() => {
    if (isInitialLoad.current) return;
    if (viewRef.current !== 'home') return;
    
    audioTick.current.currentTime = 0;
    audioTick.current.play().catch((e) => console.error("Audio play failed:", e));
  }, [selectedId]); 


  // Lógica de transição de tela
  const handleChangeView = useCallback((newView) => {
    let transitionDelay = 200; 
    
    if (newView === 'home' && viewRef.current === 'library') { 
      audioBack.current.currentTime = 0;
      audioBack.current.play().catch((e) => console.error("Audio back failed:", e));
      transitionDelay = 400; 
    } 
    
    setAppOpacity(0);
    setTimeout(() => {
      setView(newView);
      setAppOpacity(1);
    }, transitionDelay); 
  }, []);
  
  // HANDLER DE SELEÇÃO DE PERFIL
  const handleProfileSelect = useCallback((profile) => {
    setSelectedProfile(profile);
    
    audioEnter.current.currentTime = 0;
    audioEnter.current.play().catch((e) => console.error("Audio enter failed:", e));

    if (profile.action === 'home') {
      setView('home'); 
    } else if (profile.action === 'docs') {
      alert("Abrindo Documentação do Site...");
    }
  }, []); 

  // HANDLER DE VOLTA DO PERFIL (Usado no Navbar)
  const handleGoToProfileSelect = useCallback(() => {
      audioBack.current.currentTime = 0;
      audioBack.current.play().catch((e) => console.error("Audio back failed:", e));
      setView('profile');
  }, []);

  const handleGameSelect = useCallback((newId) => {
    setSelectedId(newId);
  }, []);

  // --- HANDLERS DE EXPANSÃO ---
  const handleGameExpand = useCallback((gameId) => {
    audioEnter.current.currentTime = 0;
    audioEnter.current.play().catch((e) => console.error("Audio enter failed:", e));
    setExpandedGameId(gameId); 
  }, []); 

  const handleGameCollapse = useCallback(() => {
    audioBack.current.currentTime = 0;
    audioBack.current.play().catch((e) => console.error("Audio back failed:", e));
    setExpandedGameId(null);
  }, []);
  // -----------------------------

  // FUNÇÃO DE MOVIMENTO NA HOME (mantida e funcional)
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

  // FUNÇÃO DE MOVIMENTO NA LIBRARY (REMOVIDA)
  // Removida para garantir que o controle de teclado seja exclusivo do LibraryGrid.jsx
  
  useEffect(() => {
    if (view !== 'home') return;
    setBannerOpacity(0);
    const timer = setTimeout(() => {
      setCurrentBanner(selectedItem.banner);
      setBannerOpacity(1);
    }, 200);
    return () => clearTimeout(timer);
  }, [selectedItem, view]);
  
  // O CÉREBRO DO TECLADO: handleKeyDown/handleKeyUp
  const handleKeyDown = useCallback(
    (event) => {
      if (event.repeat) return;
      if (viewRef.current === 'profile') return; 

      if (viewRef.current === 'home') {
        if (event.key === 'Enter' && selectedIdRef.current === libraryItem.id) {
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
          // Deixa o LibraryGrid.jsx lidar com Enter e Movimento.
      }
    },
    [handleChangeView, moveHomeSelection] 
  );

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

    if (appOpacity === 1 && view !== 'profile' && !expandedGameId) { 
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
    }
    
    return cleanup;
  }, [handleKeyDown, handleKeyUp, appOpacity, view, expandedGameId]); 

  
  // O JOGO EXPANDIDO
  const expandedGame = games.find(g => g.id === expandedGameId);

  // --- RENDERIZAÇÃO (JSX) ---
  return (
    <div 
      className="min-h-screen w-full relative flex flex-col overflow-hidden"
      style={{ opacity: appOpacity, transition: 'opacity 0.2s ease-in-out' }}
    >
      
      {/* TELA DE DETALHE DO JOGO (Expansão) - Prioridade Máxima */}
      {expandedGame && (
        <GameDetailScreen
          game={expandedGame}
          onCollapse={handleGameCollapse}
        />
      )}

      {/* TELA DE SELEÇÃO DE PERFIL / HOME / LIBRARY (só renderiza se NÃO estiver expandido) */}
      {!expandedGame && (
        <>
          {view === 'profile' && (
              <ProfileSelect 
                profiles={PROFILES} 
                onSelectProfile={handleProfileSelect} 
              />
          )}
          
          {view === 'home' && (
            <>
              <Navbar 
                profile={selectedProfile}
                onProfileClick={handleGoToProfileSelect} 
              />
              
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

              <main className="relative z-20 flex flex-col flex-grow justify-between h-full pt-16"> 
                
                <div className="flex space-x-3 items-center pl-4"> 
                  <GameCard
                    game={storeItem}
                    isSelected={selectedId === storeItem.id}
                    onClick={() => handleGameSelect(storeItem.id)}
                  />
                  <div className="h-20 w-px bg-gray-600"></div>
                  <div className="flex space-x-3"> 
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
                  <h2 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight text-white mb-4">
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
              onGameExpand={handleGameExpand}
            />
          )}
        </>
      )}
    </div>
  );
}