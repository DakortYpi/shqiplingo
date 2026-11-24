'use client';

import React, { useState } from 'react';
import { Volume2, RotateCcw, CheckCircle2, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { soundManager } from '../../utils/audio';

export function ReviewTab() {
  const { stats, toggleCardLearned } = useApp();
  const [filter, setFilter] = useState<'all' | 'due' | 'learned'>('due');
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredCards = stats.reviewCards.filter((c) => {
    if (filter === 'due') return !c.learned;
    if (filter === 'learned') return c.learned;
    return true;
  });

  const safeIndex = filteredCards.length > 0 ? Math.min(currentIndex, filteredCards.length - 1) : 0;
  const currentCard = filteredCards[safeIndex];

  const handleNext = () => {
    setIsFlipped(false);
    if (filteredCards.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
    }
  };

  const handleToggleLearned = () => {
    if (!currentCard) return;
    toggleCardLearned(currentCard.id);
    setIsFlipped(false);
    setCurrentIndex(0);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col justify-between pb-20 select-none">
      {/* Header & Filter Controls */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">Smart Wiederholen</h2>
            <p className="text-xs text-slate-500">Festige deine Vokabeln & Grammatik</p>
          </div>
          <div className="flex space-x-1 bg-slate-200/80 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => { setFilter('due'); setCurrentIndex(0); setIsFlipped(false); }}
              className={`px-2.5 py-1 rounded-lg transition ${filter === 'due' ? 'bg-white text-red-600 shadow-xs' : 'text-slate-600'}`}
            >
              Üben ({stats.reviewCards.filter((c) => !c.learned).length})
            </button>
            <button
              onClick={() => { setFilter('learned'); setCurrentIndex(0); setIsFlipped(false); }}
              className={`px-2.5 py-1 rounded-lg transition ${filter === 'learned' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600'}`}
            >
              Gelernt ({stats.reviewCards.filter((c) => c.learned).length})
            </button>
          </div>
        </div>

        {/* Card View */}
        {!currentCard || filteredCards.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center my-8">
            <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h3 className="font-extrabold text-slate-800 text-base mb-1">Alles wiederholt!</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Aktuell sind keine Vokabeln in diesem Filter. Spiele Lektionen durch, um neue Wörter zu sammeln!
            </p>
          </div>
        ) : (
          <div className="my-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-2 px-1">
              <span>Karte {safeIndex + 1} von {filteredCards.length}</span>
              <span>Tippe zum Umdrehen</span>
            </div>

            {/* 3D Flip Card */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full h-72 cursor-pointer perspective-1000"
            >
              <div
                className={`w-full h-full relative duration-500 transform-style-3d ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* Front: Albanian */}
                <div className="absolute inset-0 bg-white border-2 border-slate-200/90 rounded-3xl p-6 shadow-sm flex flex-col justify-between backface-hidden">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-extrabold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full uppercase">
                      Albanisch
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundManager.speakAlbanian(currentCard.sq);
                      }}
                      className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl transition"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="text-center my-auto">
                    <h3 className="text-2xl font-black text-slate-900 mb-2">{currentCard.sq}</h3>
                    {currentCard.exampleSq && (
                      <p className="text-xs text-slate-500 italic max-w-xs mx-auto">&ldquo;{currentCard.exampleSq}&rdquo;</p>
                    )}
                  </div>

                  <div className="text-center text-xs text-slate-400 font-semibold flex items-center justify-center space-x-1">
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Umdrehen für deutsche Übersetzung</span>
                  </div>
                </div>

                {/* Back: German */}
                <div className="absolute inset-0 bg-slate-900 border-2 border-slate-800 text-white rounded-3xl p-6 shadow-sm flex flex-col justify-between backface-hidden rotate-y-180">
                  <span className="text-[11px] font-extrabold text-amber-400 bg-amber-950/60 border border-amber-800 px-2.5 py-0.5 rounded-full uppercase w-fit">
                    Deutsch & Erklärung
                  </span>

                  <div className="text-center my-auto">
                    <h3 className="text-2xl font-black text-white mb-2">{currentCard.de}</h3>
                    {currentCard.grammarNote && (
                      <p className="text-xs text-slate-300 bg-slate-800/80 p-2.5 rounded-xl max-w-xs mx-auto border border-slate-700">
                        {currentCard.grammarNote}
                      </p>
                    )}
                  </div>

                  <span className="text-center text-xs text-slate-400">Tippe zum Zurückdrehen</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center space-x-3 mt-5">
              <button
                onClick={handleToggleLearned}
                className={`flex-1 py-3.5 rounded-2xl font-bold text-sm transition flex items-center justify-center space-x-2 active:scale-95 shadow-xs ${
                  currentCard.learned
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{currentCard.learned ? 'Nochmals üben' : 'Als gelernt markieren'}</span>
              </button>
              <button
                onClick={handleNext}
                className="px-5 py-3.5 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 active:scale-95 text-sm transition"
              >
                Weiter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
