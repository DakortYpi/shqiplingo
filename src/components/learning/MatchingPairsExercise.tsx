'use client';

import React, { useState, useEffect } from 'react';
import { MatchingPair } from '../../types';
import { soundManager } from '../../utils/audio';

interface MatchingPairsExerciseProps {
  pairs: MatchingPair[];
  onComplete: () => void;
  isAnswerSubmitted: boolean;
}

interface TileItem {
  id: string;
  pairId: string;
  text: string;
  lang: 'sq' | 'de';
}

export function MatchingPairsExercise({
  pairs,
  onComplete,
  isAnswerSubmitted,
}: MatchingPairsExerciseProps) {
  const [shuffledTiles, setShuffledTiles] = useState<TileItem[]>([]);
  const [selectedTile, setSelectedTile] = useState<TileItem | null>(null);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [wrongPair, setWrongPair] = useState<[string, string] | null>(null);

  useEffect(() => {
    const sqTiles: TileItem[] = pairs.map((p) => ({ id: `sq-${p.id}`, pairId: p.id, text: p.sq, lang: 'sq' }));
    const deTiles: TileItem[] = pairs.map((p) => ({ id: `de-${p.id}`, pairId: p.id, text: p.de, lang: 'de' }));
    // Simple deterministic/stable shuffle
    const combined = [...sqTiles, ...deTiles].sort(() => Math.random() - 0.5);
    setShuffledTiles(combined);
    setMatchedPairIds([]);
    setSelectedTile(null);
  }, [pairs]);

  const handleTileClick = (tile: TileItem) => {
    if (isAnswerSubmitted || matchedPairIds.includes(tile.pairId)) return;

    if (tile.lang === 'sq') {
      soundManager.speakAlbanian(tile.text);
    }

    if (!selectedTile) {
      setSelectedTile(tile);
      return;
    }

    if (selectedTile.id === tile.id) {
      setSelectedTile(null);
      return;
    }

    // Attempting match
    if (selectedTile.lang !== tile.lang && selectedTile.pairId === tile.pairId) {
      // Correct Match!
      soundManager.playCorrectSound();
      const updated = [...matchedPairIds, tile.pairId];
      setMatchedPairIds(updated);
      setSelectedTile(null);

      if (updated.length === pairs.length) {
        onComplete();
      }
    } else {
      // Wrong Match
      soundManager.playMistakeSound();
      setWrongPair([selectedTile.id, tile.id]);
      setTimeout(() => {
        setWrongPair(null);
        setSelectedTile(null);
      }, 700);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <h2 className="text-xl font-extrabold text-slate-900 mb-2 leading-snug">
        Verbinde die Wortpaare
      </h2>
      <p className="text-xs text-slate-500 mb-6">
        Tippe auf das albanische Wort und danach auf die deutsche Übersetzung.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {shuffledTiles.map((tile) => {
          const isMatched = matchedPairIds.includes(tile.pairId);
          const isSelected = selectedTile?.id === tile.id;
          const isWrong = wrongPair && (wrongPair[0] === tile.id || wrongPair[1] === tile.id);

          let tileClass = 'bg-white border-slate-200 text-slate-800 hover:border-slate-300';
          if (isMatched) {
            tileClass = 'bg-emerald-50/60 border-emerald-300 text-emerald-800 opacity-60 cursor-default';
          } else if (isWrong) {
            tileClass = 'bg-rose-50 border-rose-500 text-rose-700 animate-shake';
          } else if (isSelected) {
            tileClass = 'bg-red-50 border-red-500 text-red-700 ring-2 ring-red-500/20 shadow-xs';
          }

          return (
            <button
              key={tile.id}
              disabled={isMatched || isAnswerSubmitted}
              onClick={() => handleTileClick(tile)}
              className={`p-3.5 rounded-2xl border-2 font-bold text-sm min-h-[64px] flex items-center justify-center text-center transition active:scale-95 duration-150 ${tileClass}`}
            >
              {tile.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
