import { useLocation, useNavigate } from 'react-router-dom';
import { useGame } from './ComponentGame';

export const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, variant, players } = location.state || { 
    mode: 'ai', 
    variant: 'classic', 
    players: ['Joueur 1', 'IA'] 
  };

  const { state, makeMove, resetGame, newGame } = useGame(mode, variant, players);

  return (
    <div>
      <h1>Morpion - {variant === 'classic' ? 'Classique' : 'Trois coups'}</h1>
      
      <p>Tour de: {state.players[state.currentPlayer].name}</p>
      
      {state.winner && (
        <p>
          {state.winner === 'draw' 
            ? 'Match nul !' 
            : `${state.players.find(p => p.symbol === state.winner)?.name} gagne !`}
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)', gap: '5px' }}>
        {state.board.map((cell, i) => (
          <button 
            key={i}
            onClick={() => makeMove(i)}
            disabled={!!cell || !!state.winner}
            style={{ 
              width: '100px', 
              height: '100px',
              opacity: variant === 'three-moves' && state.moveHistory[0] === i ? 0.5 : 1
            }}
          >
            {cell}
          </button>
        ))}
      </div>

      <div>
        <p>{state.players[0].name}: {state.players[0].wins} victoires</p>
        <p>{state.players[1].name}: {state.players[1].wins} victoires</p>
      </div>

      <button onClick={resetGame}>Rejouer</button>
      <button onClick={newGame}>Nouvelle partie</button>
      <button onClick={() => navigate('/')}>Accueil</button>
    </div>
  );
};