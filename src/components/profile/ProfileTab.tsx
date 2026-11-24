'use client';

import React, { useState } from 'react';
import { Flame, Sparkles, Trophy, Heart, Volume2, RotateCcw, CheckCircle, Shield, Play } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { soundManager } from '../../utils/audio';

export function ProfileTab() {
  const { stats, refillHearts, toggleSound } = useApp();
  const [isSlowMode, setIsSlowMode] = useState(false);

  const masteredCount = stats.reviewCards.filter((c) => c.learned).length;
  const userLevel = Math.floor(stats.xp / 50) + 1;

  const handleSpeedToggle = () => {
    const nextSlow = !isSlowMode;
    setIsSlowMode(nextSlow);
    soundManager.setSpeechRate(nextSlow ? 0.8 : 0.95);
  };

  const handleTestAudio = () => {
    soundManager.speakAlbanian('Përshëndetje! Mirë se vini në ShqipLingo.');
  };

  const handleReset = () => {
    if (window.confirm('Möchtest du deinen Fortschritt wirklich zurücksetzen?')) {
      localStorage.removeItem('shqiplingo_user_stats');
      window.location.reload();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 pb-20 select-none">
      {/* User Header Profile */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white text-2xl font-black shadow-md">
          🦅
        </div>
        <div>
          <div className="flex items-center space-x-1.5">
            <h2 className="text-lg font-black text-slate-900">Albanisch-Entdecker</h2>
            <Shield className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-xs text-slate-500">Stufe {userLevel} · Fillestar (Anfänger)</p>
          <div className="mt-1 inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-red-50 text-red-700 font-bold text-[10px]">
            <span>🇦🇱 Shqipëria</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center space-x-2 text-amber-500 mb-1">
            <Flame className="w-5 h-5 fill-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Tage-Serie</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.streak} Tage</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center space-x-2 text-red-600 mb-1">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Gesamt-XP</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.xp} XP</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center space-x-2 text-emerald-600 mb-1">
            <CheckCircle className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Lektionen</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.completedLessonIds.length} gemeistert</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center space-x-2 text-blue-600 mb-1">
            <Trophy className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Wortschatz</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{masteredCount} Vokabeln</p>
        </div>
      </div>

      {/* Settings & Voice Configuration */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Audio & Sprachausgabe</h3>

        {/* Test Voice Stream */}
        <div className="flex items-center justify-between py-1 border-b border-slate-100">
          <div>
            <span className="text-sm font-semibold text-slate-800 block">Albanische Stimme</span>
            <span className="text-xs text-emerald-600 font-bold">Standardalbanisch (Nativ)</span>
          </div>
          <button
            onClick={handleTestAudio}
            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 active:scale-95 text-red-600 font-bold text-xs rounded-xl border border-red-200 transition flex items-center space-x-1"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Hörprobe</span>
          </button>
        </div>

        {/* Speed Toggle */}
        <div className="flex items-center justify-between py-1 border-b border-slate-100">
          <div>
            <span className="text-sm font-semibold text-slate-800 block">Sprechgeschwindigkeit</span>
            <span className="text-xs text-slate-400">{isSlowMode ? 'Langsamer (0.8x) für Einsteiger' : 'Normal (1.0x)'}</span>
          </div>
          <button
            onClick={handleSpeedToggle}
            className={`px-3 py-1 rounded-xl font-bold text-xs transition border ${
              isSlowMode ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {isSlowMode ? '0.8x' : '1.0x'}
          </button>
        </div>

        {/* Sound FX Toggle */}
        <div className="flex items-center justify-between py-1 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <Volume2 className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold text-slate-800">Soundeffekte</span>
          </div>
          <button
            onClick={toggleSound}
            className={`w-12 h-6 rounded-full transition p-0.5 ${stats.soundEnabled ? 'bg-red-600' : 'bg-slate-300'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition ${stats.soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Hearts Refill */}
        <div className="flex items-center justify-between py-1 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Heart className="w-4 h-4 fill-rose-500" />
            </div>
            <div>
              <span className="text-sm font-semibold text-slate-800 block">Herzen voll auffüllen</span>
              <span className="text-xs text-slate-400">{stats.hearts}/5 verfügbar</span>
            </div>
          </div>
          <button
            onClick={refillHearts}
            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl border border-rose-200 transition"
          >
            Auffüllen
          </button>
        </div>

        <button
          onClick={handleReset}
          className="w-full py-2 text-xs font-bold text-slate-400 hover:text-rose-600 transition flex items-center justify-center space-x-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Fortschritt zurücksetzen</span>
        </button>
      </div>
    </div>
  );
}
