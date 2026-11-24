'use client';

import React from 'react';
import { Volume2 } from 'lucide-react';
import { Exercise } from '../../types';
import { soundManager } from '../../utils/audio';

interface WordBankExerciseProps {
  exercise: Exercise;
  selectedTiles: string[];
  onTileClick: (word: string, indexInSelected?: number) => void;
  isAnswerSubmitted: boolean;
}

export function WordBankExercise({
  exercise,
  selectedTiles,
  onTileClick,
  isAnswerSubmitted,
}: WordBankExerciseProps) {
  const availableTiles = exercise.wordBankTiles || [];

  // Count instances of each word used
  const usedWordCounts: Record<string, number> = {};
  selectedTiles.forEach((w) => {
    usedWordCounts[w] = (usedWordCounts[w] || 0) + 1;
  });

  return (
    <div className="flex flex-col flex-1 justify-between">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 mb-6 leading-snug">
          {exercise.instruction}
        </h2>

        {/* German Source Sentence */}
        <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-5 mb-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Deutsch
            </span>
            <p className="text-xl font-black text-slate-800">{exercise.sourceText}</p>
          </div>

          {exercise.audioText && (
            <button
              onClick={() => soundManager.speakAlbanian(exercise.audioText!)}
              className="p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl transition hover:scale-105 active:scale-95 shrink-0"
              title="Aussprache anhören"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Selected Tiles Construction Slot */}
        <div className="min-h-[72px] bg-slate-100/80 border-2 border-dashed border-slate-300 rounded-2xl p-3 mb-6 flex flex-wrap gap-2 items-center">
          {selectedTiles.length === 0 ? (
            <span className="text-sm text-slate-400 font-medium px-2 select-none">
              Tippe auf die Wörter unten, um den Satz zu bauen...
            </span>
          ) : (
            selectedTiles.map((word, idx) => (
              <button
                key={`${word}-${idx}`}
                disabled={isAnswerSubmitted}
                onClick={() => onTileClick(word, idx)}
                className="px-3.5 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-800 text-sm shadow-xs hover:border-red-400 active:scale-95 transition"
              >
                {word}
              </button>
            ))
          )}
        </div>

        {/* Word Bank Pool */}
        <div className="flex flex-wrap gap-2.5 justify-center py-2">
          {availableTiles.map((tile, i) => {
            // Check if this particular occurrence has already been placed
            let occInBank = 0;
            for (let j = 0; j <= i; j++) {
              if (availableTiles[j] === tile) occInBank++;
            }
            const isUsed = (usedWordCounts[tile] || 0) >= occInBank;

            return (
              <button
                key={`${tile}-${i}`}
                disabled={isUsed || isAnswerSubmitted}
                onClick={() => {
                  soundManager.speakAlbanian(tile);
                  onTileClick(tile);
                }}
                className={`px-4 py-2.5 rounded-2xl font-bold text-base border-2 shadow-xs transition duration-150 active:scale-95 ${
                  isUsed
                    ? 'bg-slate-200 border-transparent text-transparent select-none cursor-default shadow-none'
                    : 'bg-white border-slate-200 hover:border-slate-400 text-slate-800 hover:shadow-sm'
                }`}
              >
                {tile}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
