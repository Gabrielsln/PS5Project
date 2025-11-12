

import React, { useEffect, useState } from 'react';

// Dados de Sinopse INTEGRADOS
const getSynopsis = (gameTitle) => {
  switch (gameTitle) {
    case "Marvel's Spider-Man": 
      return "Após oito anos usando a máscara, Peter Parker é um mestre no combate ao crime. Com a ameaça de um novo vilão sobre a Nova York da Marvel, ele precisa se superar para salvar a cidade e aqueles que ama. Sinta o poder total de um Spider-Man experiente, com combates improvisados e travessia urbana fluida.";
    
    case "WATCH_DOGS": 
      return "Em Watch Dogs, você assume o papel de Aiden Pearce, um habilidoso hacker e vigilante que busca vingança após um ataque que resultou na morte de sua sobrinha. Ambientado em uma versão fictícia de Chicago, a cidade é totalmente controlada por um sistema central de vigilância chamado ctOS (Central Operating System) — que monitora e conecta tudo e todos.Usando seu smartphone como arma principal, Aiden pode invadir câmeras, semáforos, contas bancárias e sistemas de segurança para manipular o ambiente e seus inimigos. Entre conspirações, corrupção e dilemas morais, ele luta para descobrir a verdade e fazer justiça com as próprias mãos, em um mundo onde a informação é o poder.";
    
    case "Grand Theft Auto: San Andreas": 
      return "Há cinco anos, Carl Johnson (CJ) fugiu das pressões da vida em Los Santos, uma cidade consumida por gangues, drogas e corrupção. Agora, no início dos anos 90, ele precisa voltar para casa. Ao retornar, dois policiais corruptos o acusam de homicídio, obrigando CJ a embarcar em uma jornada pelo estado de San Andreas para salvar sua família e retomar o controle das ruas.";
    
    case "The Last of Us Part II": 
      return "Cinco anos após a perigosa jornada pelos Estados Unidos pós-pandêmicos, Ellie e Joel se acomodaram em Jackson, Wyoming. Viver em uma próspera comunidade de sobreviventes permitiu que eles tivessem paz e estabilidade, apesar da constante ameaça de infectados e outros sobreviventes desesperados.";
    
    case "Grand Theft Auto: Vice City": 
      return "Em GTA: Vice City, você vive Tommy Vercetti, um ex-membro da máfia que, após sair da prisão, é enviado à ensolarada e perigosa Vice City (inspirada em Miami dos anos 1980) para expandir os negócios de seu chefe. Porém, um acordo de drogas dá errado, e Tommy perde o dinheiro e a mercadoria — sendo forçado a reconstruir tudo do zero. Determinando-se a dominar o submundo do crime, ele começa a construir seu próprio império, enfrentando traficantes, gangues, políticos corruptos e velhos inimigos, enquanto mergulha em um cenário vibrante de música retrô, carros esportivos, neon e excessos da década de 80.";
    
    case "God of War": 
      return "Pela primeira vez na série, há dois protagonistas: Kratos, o antigo deus da guerra grego, e seu jovem filho Atreus. Após a morte da segunda esposa de Kratos e mãe de Atreus, eles viajam para cumprir sua promessa de espalhar as cinzas dela no pico mais alto dos nove reinos.";
    
    case "Resident Evil 4": 
      return "Seis anos após os eventos de Resident Evil 2, Leon Kennedy, sobrevivente de Raccoon City, foi enviado a um vilarejo isolado na Europa para investigar o desaparecimento da filha do presidente dos Estados Unidos. O que ele descobre lá é diferente de tudo o que ele já enfrentou antes.";
    
    case "Batman: Arkham Knight": 
      return "No explosivo final da série Arkham, Batman encara a última ameaça contra a cidade que jurou proteger. O Espantalho retorna para reunir um grupo impressionante de supervilões, incluindo o Pinguim, o Duas-Caras e a Arlequina, para destruir definitivamente o Cavaleiro das Trevas.";
    
    case "Cyberpunk 2077": 
      return "Em Cyberpunk 2077, você é V, um mercenário personalizável que busca fama, poder e um implante cibernético lendário capaz de conceder a imortalidade. A história se passa em Night City, uma megalópole futurista dominada por corporações, violência, tecnologia e desigualdade extrema. Após um roubo dar terrivelmente errado, V acaba com o chip experimental preso ao seu cérebro — um dispositivo que carrega a consciência digital de Johnny Silverhand, um roqueiro e terrorista interpretado por Keanu Reeves. Agora, os dois precisam dividir o mesmo corpo e lutar por controle, enquanto desvendam uma conspiração que pode mudar o destino da cidade..";
    
    case "Red Dead Redemption 2": 
      return "Estados Unidos, 1899. O fim da era do Velho Oeste se aproxima. Depois de tudo dar errado em um roubo na cidade de Blackwater, Arthur Morgan e a gangue Van der Linde são obrigados a fugir, roubar e lutar para sobreviver no implacável coração do país.";
      
    default: 
      return `Sinopse detalhada indisponível para ${gameTitle}. Pressione ESC para voltar à Biblioteca.`;
  }
};

export default function GameDetailScreen({ game, onCollapse }) {
  
  const [isVisible, setIsVisible] = useState(false); // Estado para controlar a animação
  const synopsis = getSynopsis(game.title);

  // 1. Efeito para iniciar a animação de entrada
  useEffect(() => {
    // Dá um pequeno atraso para a transição do App.jsx carregar
    setTimeout(() => {
        setIsVisible(true);
    }, 50); 

    // 2. Escuta a tecla ESC para fechar a tela de detalhes
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsVisible(false); // Inicia a animação de saída
        setTimeout(onCollapse, 300); // Chama onCollapse depois que a animação terminar
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onCollapse]);

  // Classes de animação de entrada/saída
  const animationClasses = isVisible
    ? 'opacity-100 translate-x-0'
    : 'opacity-0 -translate-x-10'; // Move para a esquerda na saída

  return (
    <div className="min-h-screen w-full relative">
      
      {/* Banner de Fundo Expansivo */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
        style={{ backgroundPosition: 'center top', backgroundImage: `url(${game.banner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/90 to-transparent"></div>
      </div>
      
      {/* PAINEL DE DETALHES (Estilo PlayStation Store) */}
      <div className={`relative z-10 p-16 pt-32 h-screen flex items-end transition-all duration-300 ${animationClasses}`}>
        
        <div className="bg-black/80 p-8 rounded-lg shadow-2xl max-w-lg min-h-[400px]">
          
          {/* Título do Jogo */}
          <h1 className="text-3xl font-light text-white mb-2">{game.title}</h1>
          
          {/* EDITOR A DINÂMICA */}
          <p className="text-sm text-gray-400 mb-6">
            {game.publisher}
          </p> 

          {/* Botão Sinopse (Voltar) */}
          <button
            onClick={() => { setIsVisible(false); setTimeout(onCollapse, 300); }} // Inicia saída ao clicar
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-200 shadow-md mb-4"
          >
            Voltar à Biblioteca (ESC)
          </button>
          
          {/* DETALHES DA SINOPSE */}
          <div className="text-sm text-gray-300 mt-4">
            
            <h3 className="text-lg font-bold text-white mb-2">Sinopse</h3>
            <p className="text-sm leading-relaxed max-h-40 overflow-y-auto">{synopsis}</p>
            
            {/* Infos Adicionais */}
            <div className="mt-6 pt-4 border-t border-gray-700 grid grid-cols-2 gap-y-2 text-xs text-gray-400">
                <span>Versão para: PS4 / PS4 Pro</span>
                <span>Idade: +18</span>
                <span>Idioma: Português (Opcional)</span>
                <span>Recursos: 1 Jogador</span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}