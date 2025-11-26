import { useLocation, useNavigate } from 'react-router-dom';
import { useGame } from './ComponentGame';
import { useStorage } from './Storage';
import { useEffect, useState } from 'react';

export const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const storage = useStorage();

  const [gameConfig, setGameConfig] = useState<any>(() => {
    if (!location.state) {
      const saved = storage.loadGameConfig();
      return saved || null;
    }
    return location.state;
  });

  useEffect(() => {
    if (location.state) {
      const { mode, variant, players } = location.state;
      setGameConfig({ mode, variant, players });
      storage.saveGameConfig({ mode, variant, players });
    } else if (!gameConfig) {
      navigate('/');
    }
  }, [location.state]);

  const mode = gameConfig?.mode ?? 'ai';
  const variant = gameConfig?.variant ?? 'classic';
  const players = gameConfig?.players ?? ['Joueur 1', 'IA'];

  const { state, makeMove, resetGame } = useGame(mode, variant, players);

  if (!gameConfig) {
    return <div>Chargement…</div>;
  }

  const handleCellClick = (index: number) => {
    if (mode === 'ai' && state.currentPlayer === 1) return;
    makeMove(index);
  };

  return (
    <div>
      <h1>Morpion - {variant === 'classic' ? 'Classique' : 'Trois coups'}</h1>

      <p>Tour de : {state.players[state.currentPlayer].name}</p>

      {state.winner && (
        <p>
          {state.winner === 'draw'
            ? 'Match nul !'
            : `${state.players.find(p => p.symbol === state.winner)?.name} gagne !`}
        </p>
      )}

      <div className="grid-board" style={{ gridTemplateColumns: 'repeat(3, 100px)' }}>
        {state.board.map((cell, i) => (
          <button
            key={i}
            className={`grid-cell ${cell === 'X' ? 'x' : cell === 'O' ? 'o' : ''}`}
            onClick={() => handleCellClick(i)}
            disabled={!!cell || !!state.winner}
          >
            {cell}
          </button>
        ))}
      </div>

      <div>
        <p>{state.players[0].name} : {state.players[0].wins} victoires</p>
        <p>{state.players[1].name} : {state.players[1].wins} victoires</p>
      </div>

      <div className="Btns">
        <button className="GameButton" onClick={resetGame}>Rejouer</button>
        <button className="GameButton" onClick={() => navigate('/')}>Accueil</button>
      </div>
    </div>
  );
};