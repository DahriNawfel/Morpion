import { Link } from 'react-router-dom';

export const Navigation = () => {
  return (
    <nav>
      <Link to="/">Accueil</Link>
      <Link to="/game">Jeu</Link>
      <Link to="/leaderboard">Classement des champions</Link>
    </nav>
  );
};