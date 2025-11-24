import type { Board, Symbol } from '../types';
import { checkWinner, getAvailableMoves } from './Board';


export const getBestMove = (board: Board, aiSymbol: Symbol): number => {
  const available = getAvailableMoves(board);
  let bestScore = -Infinity;
  let bestMove = available[0];

  for (const move of available) {
    const newBoard = [...board];
    newBoard[move] = aiSymbol;
    const score = minimax(newBoard, 0, false, aiSymbol);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  return bestMove;
};

function minimax(board: Board, depth: number, isMax: boolean, aiSymbol: Symbol): number {
  const winner = checkWinner(board);
  const playerSymbol: Symbol = aiSymbol === 'X' ? 'O' : 'X';
  
  if (winner === aiSymbol) return 10 - depth;
  if (winner === playerSymbol) return depth - 10;
  if (getAvailableMoves(board).length === 0) return 0;

  if (isMax) {
    let bestScore = -Infinity;
    for (const move of getAvailableMoves(board)) {
      board[move] = aiSymbol;
      bestScore = Math.max(bestScore, minimax(board, depth + 1, false, aiSymbol));
      board[move] = null;
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (const move of getAvailableMoves(board)) {
      board[move] = playerSymbol;
      bestScore = Math.min(bestScore, minimax(board, depth + 1, true, aiSymbol));
      board[move] = null;
    }
    return bestScore;
  }
}