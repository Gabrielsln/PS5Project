# 🎮 PS5 Dashboard Clone - Interface Interativa (React & Tailwind CSS)

**Executar o Projeto pelo Vercel(funcional):**

ps5interfaceproject.vercel.app

Este projeto é uma recriação da interface de usuário (UI) do PlayStation 5, focada na experiência de navegação por teclado e na exibição interativa de detalhes de jogos. Desenvolvido com React e estilizado com Tailwind CSS para garantir um layout moderno, responsivo e altamente personalizável.

## 🚀 Funcionalidades Principais

* **Seleção de Perfil na Inicialização:** O aplicativo começa com uma tela de seleção de perfil (similar ao PS5), permitindo escolher entre "Kratos" (Acessa o Dashboard) e "Documentação" (Exibe um alerta de documentação).
* **Navegação por Teclado:** Controle completo da Home View e da Biblioteca (Library Grid) usando as setas do teclado e/ou as teclas **A/D/W/S**.
* **Ícones de Jogo Compactos:** O layout da Home View foi otimizado para compactar os ícones dos jogos na linha superior, dando maior destaque ao banner de fundo do jogo selecionado.
* **Expansão de Detalhes do Jogo (New!):** Ao selecionar um jogo na Home View ou na Biblioteca e pressionar `ENTER` (ou clique do mouse):
    * A tela se expande, exibindo o banner do jogo em tela cheia.
    * Um painel lateral mostra o Título, Editora e uma **Sinopse detalhada** do jogo (com animação de entrada).
    * É possível retornar à Biblioteca pressionando `ESC` (ou clicando no botão "Voltar à Biblioteca").
* **Navegação Rápida:** O clique no ícone do Kratos (perfil) na `Navbar` retorna instantaneamente para a tela de seleção de perfil.
* **Link Real da PS Store:** O clique na sacola da PlayStation Store ou o uso da tecla `ENTER` sobre ela redireciona o usuário para o site oficial da PlayStation Store em uma nova aba.
* **Relógio em Tempo Real:** A Navbar exibe o horário atual do dispositivo.

## ⚙️ Tecnologias Utilizadas

* **Frontend:** React (usando Hooks como `useState`, `useEffect`, `useCallback`, `useRef`).
* **Estilização:** Tailwind CSS (altamente eficiente para layouts rápidos e responsivos).
* **Sons:** Gestão de som de navegação (`.mp3`) usando `useRef` para prevenir "race conditions" e garantir a estabilidade durante as transições.

## 📁 Estrutura do Projeto

O projeto é organizado para máxima clareza:

| Arquivo/Componente | Função |
| :--- | :--- |
| `App.jsx` | Lógica central de estado (`view`, `selectedId`, `expandedGameId`) e manipulação de eventos globais (`handleKeyDown`). |
| `ProfileSelect.jsx` | Tela de Login/Seleção de Perfil. Lida com navegação A/D e seleção de usuário. |
| `Navbar.jsx` | Barra de navegação superior (Relógio em tempo real, navegação "Jogos"/"Documentação", e ícone de perfil clicável). |
| `LibraryGrid.jsx` | Componente de grade. Gerencia a navegação WASD/Setas e a lógica de expandir o jogo com `ENTER`. |
| `GameDetailScreen.jsx` | Tela de visualização de detalhes do jogo, com sinopse dinâmica e animação de expansão. |
| `src/data/games.js` | Fonte de dados dos jogos, incluindo `title`, `publisher` (editora) e `sinopse` (implícita no `GameDetailScreen`). |

**COMANDOS DE INTERFACE:**

W/A/S/D - mover entre os jogos
Enter - mostrar informações do jogo/selecionar perfil
ESC - retornar a biblioteca/interface principal


## ▶️ Como Rodar o Projeto Localmente

Siga estes passos para configurar o ambiente de desenvolvimento:

1.  **Clone o Repositório:**
    ```bash
    git clone (https://github.com/Gabrielsln/PS5Project.git)
    cd PS5Project-main
    ```

2.  **Instale as Dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Inicie o Servidor de Desenvolvimento:**
    ```bash
    npm start
    # ou
    yarn start
    ```
    O aplicativo será aberto em `http://localhost:3000`.


**Autor:** Gabriel Silva (gabrielsln)

*Sinta-se à vontade para explorar, modificar e aprimorar esta interface!*
