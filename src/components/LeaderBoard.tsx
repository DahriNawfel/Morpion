import { useStorage } from './Storage';

type LeaderboardEntry = {
  name: string;
  wins: number;
};

type RankedEntry = LeaderboardEntry & { rank: number };

export const Leaderboard = () => {
  const { getLeaderboard } = useStorage();
  const leaderboard: LeaderboardEntry[] = getLeaderboard();
  const sorted = [...leaderboard].sort((a, b) => b.wins - a.wins);
  const ranked: RankedEntry[] = [];
  let currentRank = 1;
  let previousWins: number | null = null;

  sorted.forEach((entry) => {
    if (previousWins === null) {
      ranked.push({ ...entry, rank: 1 });
    } else if (entry.wins === previousWins) {
      ranked.push({ ...entry, rank: currentRank });
    } else {
      currentRank += 1;
      ranked.push({ ...entry, rank: currentRank });
    }
    previousWins = entry.wins;
  });

  return (
    <div>
      <h1>Classement des champions</h1>
      {leaderboard.length === 0 ? (
        <p>Aucun score enregistré</p>
      ) : (
        <ol>
          {ranked.map((entry, i) => (
            <li 
              key={i} 
              className={entry.rank === 1 ? "top1" : ""}
            >
              #{entry.rank} — {entry.name}: {entry.wins} victoires
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};
