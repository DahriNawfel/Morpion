import { useState, useEffect, useRef } from 'react';
import type { GameState, GameMode, Variant } from '../types';
import { createEmptyBoard, checkWinner, isBoardFull } from '../utils/Board';
import { getBestMove } from '../utils/GameLogic';
import { useStorage } from './Storage';

export const useGame = (
  mode: GameMode,
  variant: Variant,
  playerNames: [string, string]
) => {
  const { saveGame, loadGame, clearGame, clearGameConfig, saveScore } = useStorage();
  const aiTimeoutRef = useRef<number | null>(null);

  const [state, setState] = useState<GameState>(() => {
    const saved = loadGame();

    if (
      saved &&
      saved.mode === mode &&
      saved.variant === variant &&
      saved.players[0].name === playerNames[0] &&
      saved.players[1].name === playerNames[1]  
    ) {
      console.log(saved.players[0].name, playerNames[0]);
      return saved;
    }

    return {
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
  });

  useEffect(() => {
    setState(prev => {
      if (
        prev.players[0].name !== playerNames[0] ||
        prev.players[1].name !== playerNames[1]
      ) {
        return {
          ...prev,
          players: [
            { ...prev.players[0], name: playerNames[0] },
            { ...prev.players[1], name: playerNames[1] }
          ]
        };
      }
      return prev;
    });
  }, [playerNames[0], playerNames[1]]);

  useEffect(() => {
    saveGame(state);
  }, [state]);

  useEffect(() => {
    return () => {
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (mode !== 'ai') return;
    if (state.winner) return;
    if (state.currentPlayer !== 1) return;

    const availableMoves = state.board
      .map((c, i) => (c === null ? i : -1))
      .filter(i => i !== -1);

    if (availableMoves.length === 0) return;

    aiTimeoutRef.current = window.setTimeout(() => {
      const aiMove = getBestMove(state.board, state.players[1].symbol);
      const move = aiMove ?? availableMoves[0];
      makeMove(move);
    }, 500);

    return () => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
        aiTimeoutRef.current = null;
      }
    };
  }, [state.currentPlayer, state.board, state.winner, mode]);

  const makeMove = (index: number) => {
    setState(prev => {
      if (prev.board[index] || prev.winner) return prev;

      const newBoard = [...prev.board];
      const symbol = prev.players[prev.currentPlayer].symbol;

      const newMoveHistory = [...prev.moveHistory, index];

      if (prev.variant === 'three-moves') {
        const movesForPlayer = newMoveHistory.filter(i => prev.board[i] === symbol);

        if (movesForPlayer.length >= 3) {
          const oldest = movesForPlayer[0];
          newBoard[oldest] = null;

          const idx = newMoveHistory.indexOf(oldest);
          if (idx !== -1) newMoveHistory.splice(idx, 1);
        }
      }

      newBoard[index] = symbol;

      const winner = checkWinner(newBoard);
      const draw = !winner && isBoardFull(newBoard);

      const updatedState: GameState = {
        ...prev,
        board: newBoard,
        currentPlayer: prev.currentPlayer === 0 ? 1 : 0,
        winner: winner || (draw ? 'draw' : null),
        moveHistory: newMoveHistory
      };

      if (winner) {
        const winnerIndex = updatedState.players.findIndex(p => p.symbol === winner);
        if (winnerIndex !== -1) {
          const copy = [...updatedState.players];
          copy[winnerIndex] = { ...copy[winnerIndex], wins: copy[winnerIndex].wins + 1 };
          updatedState.players = [copy[0], copy[1]];

          if (mode === 'ai' && winnerIndex === 0) {
            saveScore(copy[0].name, copy[0].wins);
          }
        }
      }

      return updatedState;
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
    clearGameConfig();
    setState({
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
    });
  };

  return { state, makeMove, resetGame, newGame };
};
