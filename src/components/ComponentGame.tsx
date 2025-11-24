import { useState, useEffect, useRef } from 'react';
import type { GameState, GameMode, Variant } from '../types';
import { createEmptyBoard, checkWinner, isBoardFull } from '../utils/Board';
import { getBestMove } from '../utils/GameLogic';
import { useStorage } from './Storage';

export const useGame = (mode: GameMode, variant: Variant, playerNames: [string, string]) => {
  const { saveGame, loadGame, clearGame, saveScore } = useStorage();
  const aiTimeoutRef = useRef<number | null>(null);

  const initialState: GameState = {
    board: createEmptyBoard(),
    currentPlayer: 0,
    players: [
      { name: playerNames[0], symbol: 'X', wins: 0 },
      { name: playerNames[1], symbol: 'O', wins: 0 }
    ],
    mode,
    variant,
    winner: null,
    moveHistory: []
  };

  const [state, setState] = useState<GameState>(() => {
    const saved = loadGame();
    if (saved && saved.mode === mode && saved.variant === variant) return saved;
    return initialState;
  });

  useEffect(() => {
    saveGame(state);
  }, [state, saveGame]);

  useEffect(() => {
    return () => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
      }
    };
  }, []);
  useEffect(() => {
    if (mode !== 'ai') return;
    if (state.winner) return;
    if (state.currentPlayer !== 1) return;

    const availableMoves = state.board.map((c, i) => c === null ? i : -1).filter(i => i !== -1);
    if (availableMoves.length === 0) return;

    aiTimeoutRef.current = window.setTimeout(() => {
      const aiMove = getBestMove(state.board, state.players[1].symbol);
      const move = (aiMove === undefined || aiMove === null) ? availableMoves[0] : aiMove;
      makeMove(move);
    }, 500);

    return () => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
        aiTimeoutRef.current = null;
      }
    };
    
  }, [state.currentPlayer, state.board, state.winner, mode, state.players]); 
  const makeMove = (index: number) => {
    setState(prev => {
      if (prev.board[index] || prev.winner) return prev;

      const newBoard = [...prev.board];
      const currentSymbol = prev.players[prev.currentPlayer].symbol;
      const newMoveHistory = [...prev.moveHistory, index];

      if (prev.variant === 'three-moves' ) {
        const PlayerSymbol = currentSymbol;
        const playerMoves = newMoveHistory.filter(i => prev.board[i] === PlayerSymbol);
        if (playerMoves.length >= 3) {
          const oldest = playerMoves[0];
          newBoard[oldest] = null;
          const indexToRemove = newMoveHistory.indexOf(oldest);
          if (indexToRemove > -1) {
            newMoveHistory.splice(indexToRemove, 1);
          }
        }

      }

      newBoard[index] = currentSymbol;

      const winner = checkWinner(newBoard);
      const isDraw = !winner && isBoardFull(newBoard);

      const nextPlayer = prev.currentPlayer === 0 ? 1 : 0;

      const newState: GameState = {
        ...prev,
        board: newBoard,
        currentPlayer: nextPlayer,
        winner: winner || (isDraw ? 'draw' : null),
        moveHistory: newMoveHistory
      };

      
      if (winner) {
        const winnerIndex = newState.players.findIndex(p => p.symbol === winner);
        if (winnerIndex >= 0) {
          const playersCopy = [...newState.players];
          playersCopy[winnerIndex] = { ...playersCopy[winnerIndex], wins: playersCopy[winnerIndex].wins + 1 };
          newState.players = playersCopy;
          if (mode === 'ai') {
            const humanIndex = 0; 
            if (playersCopy[humanIndex].symbol === winner) {
              saveScore(playersCopy[humanIndex].name, playersCopy[humanIndex].wins);
            }
          }
        }
      }

      return newState;
    });
  };

  const resetGame = () => {
    setState(prev => ({
      ...prev,
      board: createEmptyBoard(),
      currentPlayer: 0,
      winner: null,
      moveHistory: []
    }));
  };

  const newGame = () => {
    clearGame();
    setState(initialState);
  };

  return { state, makeMove, resetGame, newGame };
};
