    import { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import type { GameMode, Variant } from '../types';

    export const Home = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState<GameMode>('ai');
    const [variant, setVariant] = useState<Variant>('classic');
    const [player1, setPlayer1] = useState('');
    const [player2, setPlayer2] = useState('');

    const handleStart = (e: React.FormEvent) => {
        e.preventDefault();
        
        const p1 = player1.trim() || 'Joueur 1';
        const p2 = mode === 'ai' ? 'IA' : (player2.trim() || 'Joueur 2');
        
        if (mode === 'ai' && !player1.trim()) {
        alert('Pseudonyme requis pour jouer contre l\'IA');
        return;
        }

        navigate('/game', { state: { mode, variant, players: [p1, p2] } });
    };

    return (
        <div>
        <h1>Mort aux pions</h1>
        <form onSubmit={handleStart}>
            <div>
            <label>Mode de jeu:</label>
            <select value={mode} onChange={e => setMode(e.target.value as GameMode)}>
                <option value="ai">Contre le robot super intelligent</option>
                <option value="local">Multijoueur</option>
            </select>
            </div>

            <div>
            <label>Variante:</label>
            <select value={variant} onChange={e => setVariant(e.target.value as Variant)}>
                <option value="classic">La classique</option>
                <option value="three-moves">Trois coups</option>
            </select>
            </div>

            <div>
            <label>Joueur 1:</label>
            <input 
                type="text" 
                value={player1} 
                onChange={e => setPlayer1(e.target.value)}
                required={mode === 'ai'}
            />
            </div>

            {mode === 'local' && (
            <div>
                <label>Joueur 2:</label>
                <input 
                type="text" 
                value={player2} 
                onChange={e => setPlayer2(e.target.value)}
                />
            </div>
            )}

            <button type="submit">Commencer</button>
        </form>
        </div>
    );
    };