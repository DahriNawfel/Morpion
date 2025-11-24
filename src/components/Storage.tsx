import type { LeaderboardEntry, GameState } from '../types';

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

  return { saveGame, loadGame, clearGame, saveScore, getLeaderboard };
};