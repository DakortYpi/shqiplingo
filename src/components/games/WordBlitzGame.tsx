'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { allUnits } from '../../data/lessons';
import { soundManager } from '../../utils/audio';

interface WordPair { sq: string; de: string; }

function buildWordPool(): WordPair[] {
  const pool: WordPair[] = [];
  for (const unit of allUnits) {
    for (const lesson of unit.lessons) {
      for (const ex of lesson.exercises) {
        if (ex.type === 'matching-pairs' && ex.matchingPairs) {
          for (const p of ex.matchingPairs) pool.push({ sq: p.sq, de: p.de });
        }
      }
    }
  }
  // Deduplicate
  const seen = new Set<string>();
  return pool.filter((p) => { const k = p.sq + p.de; if (seen.has(k)) return false; seen.add(k); return true; });
}

const ROUND_WORDS = 10;
const TIME_PER_WORD = 10;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickOptions(correct: WordPair, all: WordPair[]): string[] {
  const others = shuffle(all.filter((p) => p.de !== correct.de)).slice(0, 3).map((p) => p.de);
  return shuffle([correct.de, ...others]);
}

interface Props { onClose: () => void; onXP: (xp: number) => void; }

export default function WordBlitzGame({ onClose, onXP }: Props) {
  const pool = useRef(shuffle(buildWordPool()));
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_WORD);
  const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null);
  const [finished, setFinished] = useState(false);
  const [chosen, setChosen] = useState<string | null>(null);

  const words = pool.current.slice(0, ROUND_WORDS);
  const current = words[round];
  const options = useRef<string[]>([]);
  if (!chosen && options.current.length === 0) {
    options.current = current ? pickOptions(current, pool.current) : [];
  }

  const advance = useCallback((correct: boolean) => {
    if (correct) { soundManager.playCorrectSound(); setScore((s) => s + 10); }
    else soundManager.playMistakeSound();
    setFlash(correct ? 'correct' : 'wrong');
    setTimeout(() => {
      setFlash(null);
      setChosen(null);
      options.current = [];
      if (round + 1 >= ROUND_WORDS) setFinished(true);
      else { setRound((r) => r + 1); setTimeLeft(TIME_PER_WORD); }
    }, 600);
  }, [round]);

  useEffect(() => {
    if (finished || flash) return;
    if (timeLeft <= 0) { advance(false); return; }
    const t = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, finished, flash, advance]);

  useEffect(() => {
    if (current) soundManager.speakAlbanian(current.sq);
  }, [round]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = (opt: string) => {
    if (flash || chosen) return;
    setChosen(opt);
    advance(opt === current.de);
  };

  const stars = score >= 90 ? 3 : score >= 60 ? 2 : score >= 30 ? 1 : 0;
  const xpEarned = score;

  if (finished) return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
        <div className="text-6xl mb-2">{'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Runde beendet!</h2>
        <p className="text-gray-500 mb-4">Du hast <span className="font-bold text-orange-500">{score}</span> / 100 Punkte erzielt</p>
        <p className="text-green-600 font-semibold mb-6">+{xpEarned} XP verdient 🎉</p>
        <button onClick={() => { onXP(xpEarned); onClose(); }}
          className="w-full py-3 bg-green-500 text-white rounded-2xl font-bold text-lg shadow-lg active:scale-95">
          Weiter
        </button>
      </div>
    </div>
  );

  if (!current) return null;
  const pct = (timeLeft / TIME_PER_WORD) * 100;
  const barColor = timeLeft <= 3 ? 'bg-red-500' : timeLeft <= 6 ? 'bg-orange-400' : 'bg-green-500';

  return (
    <div className={`fixed inset-0 flex flex-col z-50 transition-colors duration-150 ${flash === 'correct' ? 'bg-green-50' : flash === 'wrong' ? 'bg-red-50' : 'bg-gradient-to-b from-indigo-50 to-white'}`}>
      <div className="flex items-center justify-between p-4 pt-safe">
        <button onClick={onClose} className="text-gray-400 text-2xl font-light">✕</button>
        <span className="text-sm font-semibold text-gray-500">{round + 1} / {ROUND_WORDS}</span>
        <span className="font-bold text-orange-500">⚡ {score}</span>
      </div>
      <div className="px-4 pb-2">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-1000 ${barColor}`} style={{ width: `${pct}%` }} />
        </div>
        <p className="text-right text-xs text-gray-400 mt-1">{timeLeft}s</p>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        <div className="text-center">
          <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">Albanisch → Deutsch</p>
          <button onClick={() => soundManager.speakAlbanian(current.sq)}
            className="text-4xl font-bold text-indigo-700 bg-indigo-50 rounded-2xl px-8 py-5 shadow-inner active:scale-95">
            {current.sq} 🔊
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 w-full">
          {options.current.map((opt) => {
            const isChosen = chosen === opt;
            const isCorrect = opt === current.de;
            let cls = 'py-4 rounded-2xl font-semibold text-sm shadow active:scale-95 transition-all border-2 ';
            if (flash && isCorrect) cls += 'bg-green-500 text-white border-green-600';
            else if (flash && isChosen && !isCorrect) cls += 'bg-red-400 text-white border-red-500';
            else cls += 'bg-white text-gray-700 border-gray-200';
            return <button key={opt} className={cls} onClick={() => handleAnswer(opt)}>{opt}</button>;
          })}
        </div>
      </div>
    </div>
  );
}
