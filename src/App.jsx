// src/App.jsx

import { useState, useEffect, useCallback, useRef } from "react";
import GameCard from "./components/GameCard";
import LibraryGrid from "./components/LibraryGrid";
import ProfileSelect from "./components/ProfileSelect"; 
import Navbar from "./components/Navbar"; 
import GameDetailScreen from "./components/GameDetailScreen"; 
import { games } from "./data/games";

// Importa todos os sons
import moveSound from "./sound/move.mp3";
import navigationEnterSound from "./sound/navigation_enter.mp3";
import navigationBackSound from "./sound/navigation_back.mp3";
import backgroundMusic from "./sound/background_music.mp3"; // Música do Dashboard
import profileMusicFile from "./sound/profile_music.mp3"; // NOVO: Música da Tela de Perfil

// --- Constantes de JOGOS ---
const storeItem = { id: 0, title: "PlayStation Store", cover: "/images/ps_store_icon.png", banner: "/images/cyberpunk_banner.png", logoUrl: null };
const libraryItem = { id: 99, title: "Biblioteca de Jogos", cover: "/images/library_icon.png", banner: "/images/gow_banner.webp", logoUrl: null };
const allSelectableItems = [storeItem, ...games, libraryItem];
// --- Constantes de PERFIL ---
const PROFILES = [
  { id: 1, name: "Kratos", imageUrl: "/images/kratos_icon.jpeg", action: "home" },
  { id: 2, name: "Documentação", imageUrl: "/images/document_icon.png", action: "docs" },
];
const PS_STORE_URL = "https://store.playstation.com/pt-br/pages/latest"; 
const DOCS_URL = "https://github.com/Gabrielsln/PS5Project/blob/main/README.md";
// --- Itens da Navbar ---
const NAVBAR_ITEMS = ['jogos', 'documentacao', 'perfil'];


export default function App() {
  const [view, setView] = useState('profile'); 
  const [appOpacity, setAppOpacity] = useState(1);
  const [selectedProfile, setSelectedProfile] = useState(PROFILES[0]); 

  const [selectedId, setSelectedId] = useState(1); 
  const [libraryIndex, setLibraryIndex] = useState(0);
  const [expandedGameId, setExpandedGameId] = useState(null); 

  // Estados de Navegação
  const [navZone, setNavZone] = useState('games'); 
  const [navbarIndex, setNavbarIndex] = useState(0); 

  // Refs de Áudio e Estado
  const audioTick = useRef(new Audio(moveSound));
  const audioEnter = useRef(new Audio(navigationEnterSound));
  const audioBack = useRef(new Audio(navigationBackSound));
  const bgMusic = useRef(new Audio(backgroundMusic)); // Música do Dashboard
  const profileMusic = useRef(new Audio(profileMusicFile)); // NOVO: Música do Perfil
  
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

  // Lógica de áudio e load inicial (Pré-carrega TODAS as músicas)
  useEffect(() => {
    audioTick.current.load();
    audioEnter.current.load();
    audioBack.current.load();
    bgMusic.current.load(); 
    profileMusic.current.load(); // NOVO
    isInitialLoad.current = false; 
  }, []); 

  // --- NOVO: Efeito para controlar as músicas de fundo baseado na VIEW ---
  useEffect(() => {
    // Define o volume padrão
    const dashMusic = bgMusic.current;
    const profMusic = profileMusic.current;
    dashMusic.volume = 0.3;
    profMusic.volume = 0.3;

    if (view === 'profile') {
      // 1. Se estamos na tela de perfil
      dashMusic.pause(); // Para a música do dashboard
      dashMusic.currentTime = 0;
      
      // Toca a música do perfil
      profMusic.loop = true;
      profMusic.play().catch(e => console.warn("Música de perfil falhou:", e));
    } else {
      // 2. Se estamos em qualquer outra tela (home, library, etc.)
      profMusic.pause(); // Para a música do perfil
      profMusic.currentTime = 0;
      
      // Toca a música do dashboard (se já não estiver tocando)
      if (dashMusic.paused) {
        dashMusic.loop = true;
        dashMusic.play().catch(e => console.warn("Música do dashboard falhou:", e));
      }
    }
  }, [view]); // Este efeito roda toda vez que a 'view' muda
  // -----------------------------------------------------------------

  // Efeito de som para o movimento na Home
  useEffect(() => {
    if (isInitialLoad.current) return;
    if (viewRef.current !== 'home' || navZone !== 'games') return; 
    
    audioTick.current.currentTime = 0;
    audioTick.current.play().catch((e) => console.error("Audio play failed:", e));
  }, [selectedId, navZone]); 


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
  
  // HANDLERS DE EXPANSÃO (DECLARADOS PRIMEIRO)
  const handleGameExpand = useCallback((gameId) => {
    audioEnter.current.currentTime = 0;
    audioEnter.current.play().catch((e) => console.error("Audio play failed:", e));
    setExpandedGameId(gameId); 
  }, []); 

  const handleGameCollapse = useCallback(() => {
    audioBack.current.currentTime = 0;
    audioBack.current.play().catch((e) => console.error("Audio back failed:", e));
    setExpandedGameId(null);
  }, []);
  
  // HANDLER: ABRIR DOCUMENTAÇÃO
  const handleOpenDocumentation = useCallback(() => {
      window.open(DOCS_URL, '_blank'); 
  }, []);

  // HANDLER DE SELEÇÃO DE PERFIL
  const handleProfileSelect = useCallback((profile) => {
    setSelectedProfile(profile);
    
    audioEnter.current.currentTime = 0;
    audioEnter.current.play().catch((e) => console.error("Audio enter failed:", e));

    if (profile.action === 'home') {
      // O novo useEffect[view] cuidará de trocar a música
      setView('home'); 
    } else if (profile.action === 'docs') {
      handleOpenDocumentation(); 
    }
  }, [handleOpenDocumentation]); 

  // HANDLER DE VOLTA DO PERFIL (Usado no Navbar)
  const handleGoToProfileSelect = useCallback(() => {
      audioBack.current.currentTime = 0;
      audioBack.current.play().catch((e) => console.error("Audio back failed:", e));
      
      // O novo useEffect[view] cuidará de trocar a música
      setView('profile');
  }, []);

  // FUNÇÃO DE CLIQUE PADRÃO NA HOME (COM CORREÇÃO DA STORE)
  const handleHomeGameClick = useCallback((item) => {
    if (item.id === storeItem.id) {
      window.open(PS_STORE_URL, '_blank');
      return;
    }
    if (item.id === libraryItem.id) {
      handleChangeView('library');
      return;
    }
    handleGameExpand(item.id);
  }, [handleGameExpand, handleChangeView]); 


  // FUNÇÃO DE MOVIMENTO NA HOME
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
  }, []); 

  // FUNÇÃO DE MOVIMENTO NA NAVBAR
  const moveNavbarSelection = useCallback((direction) => {
    setNavbarIndex(prevIndex => {
        let newIndex = prevIndex;
        if (direction === 'left') {
            newIndex = Math.max(0, prevIndex - 1);
        } else if (direction === 'right') {
            newIndex = Math.min(NAVBAR_ITEMS.length - 1, prevIndex + 1);
        }
        
        if (newIndex !== prevIndex) {
            audioTick.current.currentTime = 0;
            audioTick.current.play().catch((e) => console.error("Audio play failed:", e));
        }
        return newIndex;
    });
  }, []); 

  
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
      if (viewRef.current === 'profile' || expandedGameId) return; 

      const key = event.key.toLowerCase();

      if (viewRef.current === 'home') {
        
        if (navZone === 'games') {
          // --- Zona de Jogos (Inferior) ---
          
          if (key === 'w' || key === 'arrowup') {
            setNavZone('navbar');
            audioTick.current.currentTime = 0;
            audioTick.current.play().catch((e) => console.error("Audio play failed:", e));
            return;
          }

          if (key === 'enter') {
            const currentItem = allSelectableItems.find(item => item.id === selectedIdRef.current);
            if (currentItem.id === libraryItem.id) {
                audioEnter.current.currentTime = 0;
                audioEnter.current.play().catch((e) => console.error("Audio enter failed:", e));
                handleChangeView('library');
            } else if (currentItem.id === storeItem.id) {
                window.open(PS_STORE_URL, '_blank');
            } else {
                handleGameExpand(currentItem.id);
            }
            return;
          }
          
          let direction = null;
          if (key === "arrowleft" || key === "a") direction = 'left';
          if (key === "arrowright" || key === "d") direction = 'right';

          if (direction) {
            moveHomeSelection(direction);
            heldDirection.current = direction;
            initialDelayRef.current = setTimeout(() => {
              repeatIntervalRef.current = setInterval(() => {
                moveHomeSelection(heldDirection.current);
              }, 200);
            }, 350);
          }

        } else if (navZone === 'navbar') {
          // --- Zona da Navbar (Superior) ---

          if (key === 's' || key === 'arrowdown') {
            setNavZone('games');
            audioTick.current.currentTime = 0;
            audioTick.current.play().catch((e) => console.error("Audio play failed:", e));
            return;
          }

          if (key === 'enter') {
            if (navbarIndex === 1) { // Documentação
                handleOpenDocumentation();
            } else if (navbarIndex === 2) { // Perfil
                handleGoToProfileSelect();
            }
            return;
          }

          let direction = null;
          if (key === "arrowleft" || key === "a") direction = 'left';
          if (key === "arrowright" || key === "d") direction = 'right';

          if (direction) {
            moveNavbarSelection(direction);
          }
        }
      }
      else if (viewRef.current === 'library') {
          // Deixa o LibraryGrid.jsx lidar com Enter e Movimento.
      }
    },
    [
        navZone, navbarIndex, expandedGameId,
        handleChangeView, moveHomeSelection, handleGameExpand, 
        handleOpenDocumentation, handleGoToProfileSelect, moveNavbarSelection
    ] 
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
                onDocumentationClick={handleOpenDocumentation}
                navZone={navZone} 
                navbarIndex={navbarIndex} 
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
                    isSelected={navZone === 'games' && selectedId === storeItem.id} 
                    onClick={() => handleHomeGameClick(storeItem)}
                  />
                  <div className="h-20 w-px bg-gray-600"></div>
                  <div className="flex space-x-3"> 
                    {games.map((game) => (
                      <GameCard
                        key={game.id}
                        game={game}
                        isSelected={navZone === 'games' && selectedId === game.id} 
                        onClick={() => handleHomeGameClick(game)}
                      />
                    ))}
                  </div>
                  <GameCard
                    game={libraryItem}
                    isSelected={navZone === 'games' && selectedId === libraryItem.id} 
                    onClick={() => handleHomeGameClick(libraryItem)}
                  />
                </div>

                <div
                  key={selectedItem.id}
                  className="text-left p-8 mb-16 max-w-2xl animate-slideInUp" 
                >
                  {selectedItem.logoUrl ? (
                    <img 
                      src={selectedItem.logoUrl} 
                      alt={`${selectedItem.title} logo`}
                      className="h-28 mb-4" 
                    />
                  ) : (
                    <h2 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight text-white mb-4">
                      {selectedItem.title}
                    </h2>
                  )}

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