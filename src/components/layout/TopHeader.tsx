'use client';

import React, { useState } from 'react';
import { Flame, Sparkles, Heart, Volume2, VolumeX, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function TopHeader() {
  const { stats, refillHearts, toggleSound } = useApp();
  const [showHeartModal, setShowHeartModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2.5 flex items-center justify-between select-none">
        {/* Streak */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-600 font-bold text-sm shadow-xs">
          <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
          <span>{stats.streak}</span>
        </div>

        {/* XP Points */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 font-bold text-sm shadow-xs">
          <Sparkles className="w-4 h-4 text-red-500" />
          <span>{stats.xp} XP</span>
        </div>

        {/* Hearts */}
        <button
          onClick={() => setShowHeartModal(true)}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 font-bold text-sm shadow-xs transition hover:scale-105 active:scale-95"
          title="Herzen auffüllen"
        >
          <Heart className={`w-4 h-4 fill-rose-500 text-rose-500 ${stats.hearts <= 1 ? 'animate-heart-beat' : ''}`} />
          <span>{stats.hearts}</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          className="p-1.5 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
          title={stats.soundEnabled ? 'Ton ausschalten' : 'Ton einschalten'}
        >
          {stats.soundEnabled ? (
            <Volume2 className="w-4 h-4 text-slate-700" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-400" />
          )}
        </button>
      </header>

      {/* Heart Refill Modal */}
      {showHeartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full text-center shadow-2xl border border-slate-100">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-9 h-9 fill-rose-500 text-rose-500 animate-heart-beat" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Herzen auffüllen</h3>
            <p className="text-sm text-slate-600 mb-5">
              Du hast aktuell <span className="font-bold text-rose-600">{stats.hearts}</span> von{' '}
              {stats.maxHearts} Herzen. Mit vollen Herzen kannst du fehlerfrei weiterlernen!
            </p>

            <button
              onClick={() => {
                refillHearts();
                setShowHeartModal(false);
              }}
              className="w-full py-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-red-500/30 flex items-center justify-center space-x-2 transition mb-2.5"
            >
              <Plus className="w-5 h-5" />
              <span>Kostenlos auffüllen (5/5)</span>
            </button>

            <button
              onClick={() => setShowHeartModal(false)}
              className="text-sm font-semibold text-slate-400 hover:text-slate-600 py-1"
            >
              Schließen
            </button>
          </div>
        </div>
      )}
    </>
  );
}
