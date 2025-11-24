import { useStorage } from './Storage';

export const Leaderboard = () => {
  const { getLeaderboard } = useStorage();
  const leaderboard = getLeaderboard();

  return (
    <div>
      <h1>Classement</h1>
      {leaderboard.length === 0 ? (
        <p>Aucun score enregistré</p>
      ) : (
        <ol>
          {leaderboard.map((entry, i) => (
            <li key={i}>
              {entry.name}: {entry.wins} victoires
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};