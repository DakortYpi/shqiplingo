'use client';

import React from 'react';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight } from 'lucide-react';

interface LessonFeedbackBannerProps {
  isSubmitted: boolean;
  isCorrect: boolean | null;
  correctAnswerText?: string;
  onWhyClick: () => void;
  onContinue: () => void;
  onCheck: () => void;
  canCheck: boolean;
}

export function LessonFeedbackBanner({
  isSubmitted,
  isCorrect,
  correctAnswerText,
  onWhyClick,
  onContinue,
  onCheck,
  canCheck,
}: LessonFeedbackBannerProps) {
  if (!isSubmitted) {
    return (
      <div className="p-4 bg-white border-t border-slate-200">
        <button
          disabled={!canCheck}
          onClick={onCheck}
          className={`w-full py-3.5 rounded-2xl font-extrabold text-base transition duration-200 shadow-md flex items-center justify-center space-x-2 active:scale-98 ${
            canCheck
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/25 cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          <span>Überprüfen</span>
        </button>
      </div>
    );
  }

  const isSuccess = isCorrect === true;

  return (
    <div
      className={`p-4 border-t-2 animate-in slide-in-from-bottom duration-200 ${
        isSuccess
          ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
          : 'bg-rose-50 border-rose-400 text-rose-950'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2.5">
          {isSuccess ? (
            <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
          ) : (
            <XCircle className="w-7 h-7 text-rose-600 shrink-0" />
          )}
          <div>
            <h4 className="font-black text-lg leading-tight">
              {isSuccess ? 'Ausgezeichnet! / Shumë mirë!' : 'Leider nicht ganz richtig'}
            </h4>
            {!isSuccess && correctAnswerText && (
              <p className="text-xs text-rose-800 mt-0.5">
                Richtige Antwort: <span className="font-bold underline">{correctAnswerText}</span>
              </p>
            )}
          </div>
        </div>

        {/* "Warum?" Button */}
        <button
          onClick={onWhyClick}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs shrink-0"
        >
          <HelpCircle className="w-3.5 h-3.5 text-red-500" />
          <span>Warum?</span>
        </button>
      </div>

      <button
        onClick={onContinue}
        className={`w-full py-3.5 rounded-2xl font-extrabold text-base transition duration-150 shadow-md flex items-center justify-center space-x-2 active:scale-98 text-white ${
          isSuccess
            ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
            : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30'
        }`}
      >
        <span>Weiter</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
