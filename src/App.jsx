// src/App.jsx

import { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import GameCard from "./components/GameCard";
import { games } from "./data/games";

// 1. IMPORTA O SEU NOVO ARQUIVO "move.mp3"
import moveSound from "./sound/move.mp3";

export default function App() {
  const [selectedId, setSelectedId] = useState(1);
  const selectedGame = games.find((g) => g.id === selectedId);

  // --- LÓGICA DE TRANSIÇÃO ---

  // 2. USA O SEU NOVO ARQUIVO "moveSound"
  const [audioTick] = useState(new Audio(moveSound));

  // 3. ADICIONA O PRÉ-CARREGAMENTO (PARA REMOVER O DELAY)
  useEffect(() => {
    audioTick.load(); // Força o navegador a carregar o áudio agora
  }, [audioTick]); // Roda apenas uma vez quando o componente é criado

  // BANNER: Estados (sem alteração)
  const [bannerOpacity, setBannerOpacity] = useState(1);
  const [currentBanner, setCurrentBanner] = useState(selectedGame.banner);

  // FUNÇÃO CENTRAL DE SELEÇÃO (sem alteração)
  const handleGameSelect = useCallback(
    (newId) => {
      if (newId === selectedId) return;
      audioTick.currentTime = 0;
      audioTick.play().catch((e) => console.error("Audio play failed:", e));
      setSelectedId(newId);
    },
    [selectedId, audioTick]
  );

  // EFEITO DO BANNER (sem alteração)
  useEffect(() => {
    setBannerOpacity(0);
    const timer = setTimeout(() => {
      setCurrentBanner(selectedGame.banner);
      setBannerOpacity(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedGame]);

  // FUNÇÃO DE NAVEGAÇÃO POR TECLADO (sem alteração)
  const handleKeyDown = useCallback(
    (event) => {
      const currentIndex = games.findIndex((g) => g.id === selectedId);
      let newIndex = currentIndex;

      if (event.key === "ArrowLeft") {
        newIndex = (currentIndex - 1 + games.length) % games.length;
      } else if (event.key === "ArrowRight") {
        newIndex = (currentIndex + 1) % games.length;
      }

      if (newIndex !== currentIndex) {
        handleGameSelect(games[newIndex].id);
      }
    },
    [selectedId, games, handleGameSelect]
  );

  // EFEITO DO TECLADO (sem alteração)
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // --- FIM DA LÓGICA DE TRANSIÇÃO ---

  return (
    <div className="min-h-screen w-full relative flex flex-col overflow-hidden">
      {/* 1. IMAGEM DE FUNDO DINÂMICA (BANNER) */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${currentBanner})`,
          opacity: bannerOpacity,
          transition: "opacity 0.3s ease-in-out",
        }}
      >
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/90 to-transparent z-10"></div>
      </div>

      <Navbar />

      <main className="relative z-20 flex flex-col flex-grow justify-between h-full pt-20">
        {/* CARROSSEL DE ÍCONES (EM CIMA) */}
        <div className="flex space-x-4 items-center p-8">
          <div className="w-20 h-20 bg-blue-700 rounded-lg flex items-center justify-center text-3xl font-bold cursor-pointer transition-all duration-300 hover:scale-110">
            PS
          </div>
          <div className="h-20 w-px bg-gray-600"></div>

          <div className="flex space-x-4">
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isSelected={game.id === selectedId}
                onClick={() => handleGameSelect(game.id)}
              />
            ))}
          </div>
        </div>

        {/* INFORMAÇÕES DO JOGO (EMBAIXO) */}
        <div
          key={selectedGame.id}
          className="text-left p-8 mb-16 max-w-2xl animate-fadeIn"
        >
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight text-blue-400 mb-4">
            {selectedGame.title}
          </h2>
          <p className="text-xl md:text-2xl font-light leading-relaxed text-gray-200 mb-8">
            Damos-te as boas-vindas à próxima geração.
          </p>
          <p className="text-lg text-gray-400">
            Dos mais recentes lançamentos a coleções primorosas, há algo para todos.
          </p>
        </div>
      </main>
    </div>
  );
}