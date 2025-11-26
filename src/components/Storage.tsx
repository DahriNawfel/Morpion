import type { LeaderboardEntry, GameState, GameMode, Variant } from '../types';

interface GameConfig {
  mode: GameMode;
  variant: Variant;
  players: [string, string];
}

export const useStorage = () => {
  const saveGame = (state: GameState) => {
    localStorage.setItem('tic-tac-toe-game', JSON.stringify(state));
  };

  const loadGame = (): GameState | null => {
    const saved = localStorage.getItem('tic-tac-toe-game');
    return saved ? JSON.parse(saved) : null;
  };

  const clearGame = () => {
    localStorage.removeItem('tic-tac-toe-game');
  };

  const saveGameConfig = (config: GameConfig) => {
    localStorage.setItem('tic-tac-toe-config', JSON.stringify(config));
  };

  const loadGameConfig = (): GameConfig | null => {
    const saved = localStorage.getItem('tic-tac-toe-config');
    return saved ? JSON.parse(saved) : null;
  };

  const clearGameConfig = () => {
    localStorage.removeItem('tic-tac-toe-config');
  };

  const saveScore = (name: string, wins: number) => {
    const leaderboard = getLeaderboard();
    const existing = leaderboard.find(e => e.name === name);
    
    if (existing) {
      existing.wins = Math.max(existing.wins, wins);
    } else {
      leaderboard.push({ name, wins });
    }
    
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  };

  const getLeaderboard = (): LeaderboardEntry[] => {
    const saved = localStorage.getItem('leaderboard');
    const data = saved ? JSON.parse(saved) : [];
    return data.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.wins - a.wins);
  };

  return { 
    saveGame, 
    loadGame, 
    clearGame, 
    saveGameConfig, 
    loadGameConfig, 
    clearGameConfig,
    saveScore, 
    getLeaderboard 
  };
};