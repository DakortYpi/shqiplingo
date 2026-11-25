'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { soundManager } from '../../utils/audio';

// All Albanian number words with their numeric values (from unit5 vocabulary)
const NUMBERS: { sq: string; value: number }[] = [
  { sq: 'zero', value: 0 }, { sq: 'një', value: 1 }, { sq: 'dy', value: 2 },
  { sq: 'tre', value: 3 }, { sq: 'katër', value: 4 }, { sq: 'pesë', value: 5 },
  { sq: 'gjashtë', value: 6 }, { sq: 'shtatë', value: 7 }, { sq: 'tetë', value: 8 },
  { sq: 'nëntë', value: 9 }, { sq: 'dhjetë', value: 10 }, { sq: 'njëmbëdhjetë', value: 11 },
  { sq: 'dymbëdhjetë', value: 12 }, { sq: 'trembëdhjetë', value: 13 },
  { sq: 'katërmbëdhjetë', value: 14 }, { sq: 'pesëmbëdhjetë', value: 15 },
  { sq: 'gjashtëmbëdhjetë', value: 16 }, { sq: 'shtatëmbëdhjetë', value: 17 },
  { sq: 'tetëmbëdhjetë', value: 18 }, { sq: 'nëntëmbëdhjetë', value: 19 },
  { sq: 'njëzet', value: 20 }, { sq: 'tridhjetë', value: 30 },
  { sq: 'dyzet', value: 40 }, { sq: 'pesëdhjetë', value: 50 },
  { sq: 'gjashtëdhjetë', value: 60 }, { sq: 'shtatëdhjetë', value: 70 },
  { sq: 'tetëdhjetë', value: 80 }, { sq: 'nëntëdhjetë', value: 90 },
  { sq: 'njëqind', value: 100 }, { sq: 'dyqind', value: 200 },
  { sq: 'pesëqind', value: 500 }, { sq: 'njëmijë', value: 1000 },
];

const ROUNDS = 8;
const TIME_PER_ROUND = 8;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickOptions(correct: { sq: string; value: number }, all: typeof NUMBERS): number[] {
  const others = shuffle(all.filter((n) => n.value !== correct.value)).slice(0, 3).map((n) => n.value);
  return shuffle([correct.value, ...others]);
}

interface Props { onClose: () => void; onXP: (xp: number) => void; }

export default function NumberDashGame({ onClose, onXP }: Props) {
  const sequence = useRef(shuffle(NUMBERS).slice(0, ROUNDS));
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_ROUND);
  const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null);
  const [finished, setFinished] = useState(false);
  const [chosen, setChosen] = useState<number | null>(null);
  const optRef = useRef<number[]>([]);

  const current = sequence.current[round];
  if (!chosen && optRef.current.length === 0 && current) {
    optRef.current = pickOptions(current, NUMBERS);
  }

  const advance = useCallback((correct: boolean) => {
    if (correct) { soundManager.playCorrectSound(); setScore((s) => s + 10); }
    else soundManager.playMistakeSound();
    setFlash(correct ? 'correct' : 'wrong');
    setTimeout(() => {
      setFlash(null); setChosen(null); optRef.current = [];
      if (round + 1 >= ROUNDS) setFinished(true);
      else { setRound((r) => r + 1); setTimeLeft(TIME_PER_ROUND); }
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

  const stars = score >= 70 ? 3 : score >= 50 ? 2 : score >= 20 ? 1 : 0;

  if (finished) return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
        <div className="text-5xl mb-2">{'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Zahlen-Profi!</h2>
        <p className="text-gray-500 mb-4"><span className="font-bold text-blue-600">{score}</span> / 80 Punkte</p>
        <p className="text-green-600 font-semibold mb-6">+{score} XP 🎉</p>
        <button onClick={() => { onXP(score); onClose(); }}
          className="w-full py-3 bg-blue-500 text-white rounded-2xl font-bold text-lg shadow-lg active:scale-95">
          Weiter
        </button>
      </div>
    </div>
  );

  if (!current) return null;
  const pct = (timeLeft / TIME_PER_ROUND) * 100;
  const barColor = timeLeft <= 2 ? 'bg-red-500' : timeLeft <= 4 ? 'bg-orange-400' : 'bg-blue-500';

  return (
    <div className={`fixed inset-0 flex flex-col z-50 transition-colors ${flash === 'correct' ? 'bg-green-50' : flash === 'wrong' ? 'bg-red-50' : 'bg-gradient-to-b from-blue-50 to-white'}`}>
      <div className="flex items-center justify-between p-4 pt-safe">
        <button onClick={onClose} className="text-gray-400 text-2xl">✕</button>
        <span className="text-sm font-semibold text-gray-500">{round + 1} / {ROUNDS}</span>
        <span className="font-bold text-blue-600">🔢 {score}</span>
      </div>
      <div className="px-4 pb-2">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-1000 ${barColor}`} style={{ width: `${pct}%` }} />
        </div>
        <p className="text-right text-xs text-gray-400 mt-1">{timeLeft}s</p>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
        <div className="text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Welche Zahl ist das?</p>
          <button onClick={() => soundManager.speakAlbanian(current.sq)}
            className="text-4xl font-bold text-blue-700 bg-blue-50 rounded-2xl px-10 py-6 shadow-inner active:scale-95">
            {current.sq} 🔊
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 w-full">
          {optRef.current.map((opt) => {
            const isChosen = chosen === opt;
            const isCorrect = opt === current.value;
            let cls = 'py-5 rounded-2xl font-bold text-2xl shadow active:scale-95 transition-all border-2 ';
            if (flash && isCorrect) cls += 'bg-green-500 text-white border-green-600';
            else if (flash && isChosen && !isCorrect) cls += 'bg-red-400 text-white border-red-500';
            else cls += 'bg-white text-gray-700 border-gray-200';
            return (
              <button key={opt} className={cls} onClick={() => { if (!flash && chosen === null) { setChosen(opt); advance(opt === current.value); } }}>
                {opt.toLocaleString()}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
