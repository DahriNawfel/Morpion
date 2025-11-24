export type Symbol = 'X' | 'O' | null;
export type Board = Symbol[];
export type GameMode = 'ai' | 'local';
export type Variant = 'classic' | 'three-moves';

export interface Player {
  name: string;
  symbol: 'X' | 'O';
  wins: number;
}

export interface GameState {
  board: Board;
  currentPlayer: 0 | 1;
  players: [Player, Player];
  mode: GameMode;
  variant: Variant;
  winner: 'X' | 'O' | 'draw' | null;
  moveHistory: number[]; 
}

export interface LeaderboardEntry {
  name: string;
  wins: number;
}