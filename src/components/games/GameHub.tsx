'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useApp } from '../../context/AppContext';

const WordBlitzGame = dynamic(() => import('./WordBlitzGame'), { ssr: false });
const NumberDashGame = dynamic(() => import('./NumberDashGame'), { ssr: false });

type GameId = 'word-blitz' | 'number-dash' | null;

interface GameCard {
  id: Exclude<GameId, null>;
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
  bg: string;
}

const GAMES: GameCard[] = [
  {
    id: 'word-blitz',
    emoji: '⚡',
    title: 'Word Blitz',
    subtitle: '10 Wörter · 10 Sekunden',
    color: 'text-indigo-700',
    bg: 'from-indigo-50 to-indigo-100 border-indigo-200',
  },
  {
    id: 'number-dash',
    emoji: '🔢',
    title: 'Zahlen-Dash',
    subtitle: '8 Zahlen · 8 Sekunden',
    color: 'text-blue-700',
    bg: 'from-blue-50 to-blue-100 border-blue-200',
  },
];

export default function GameHub() {
  const { addXp } = useApp();
  const [activeGame, setActiveGame] = useState<GameId>(null);
  const [scores, setScores] = useState<Record<string, number>>({});

  const handleXP = (game: string, xp: number) => {
    addXp(xp);
    setScores((s) => ({ ...s, [game]: Math.max(s[game] ?? 0, xp) }));
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 bg-gradient-to-b from-slate-50 to-white">
      <h2 className="text-xl font-extrabold text-gray-800 mb-1">🎮 Mini-Spiele</h2>
      <p className="text-sm text-gray-500 mb-6">Übe mit Spielen und verdiene XP!</p>

      <div className="flex flex-col gap-4">
        {GAMES.map((g) => (
          <button
            key={g.id}
            onClick={() => setActiveGame(g.id)}
            className={`flex items-center gap-4 p-5 rounded-2xl border-2 bg-gradient-to-r ${g.bg} active:scale-95 transition-all shadow-sm w-full text-left`}
          >
            <span className="text-5xl">{g.emoji}</span>
            <div className="flex-1">
              <p className={`text-lg font-bold ${g.color}`}>{g.title}</p>
              <p className="text-sm text-gray-500">{g.subtitle}</p>
            </div>
            <div className="text-right">
              {scores[g.id] ? (
                <>
                  <p className="text-xs text-gray-400">Bestleistung</p>
                  <p className={`font-bold ${g.color}`}>{scores[g.id]} XP</p>
                </>
              ) : (
                <span className={`text-sm font-semibold ${g.color}`}>Spielen →</span>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center">
        <p className="text-2xl mb-1">🏆</p>
        <p className="text-sm font-semibold text-amber-700">Mehr Spiele kommen bald!</p>
        <p className="text-xs text-amber-600 mt-1">Hör-Quiz, Satz-Puzzle &amp; mehr…</p>
      </div>

      {activeGame === 'word-blitz' && (
        <WordBlitzGame
          onClose={() => setActiveGame(null)}
          onXP={(xp) => handleXP('word-blitz', xp)}
        />
      )}
      {activeGame === 'number-dash' && (
        <NumberDashGame
          onClose={() => setActiveGame(null)}
          onXP={(xp) => handleXP('number-dash', xp)}
        />
      )}
    </div>
  );
}
