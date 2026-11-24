'use client';

import React from 'react';
import { Volume2 } from 'lucide-react';
import { Exercise } from '../../types';
import { soundManager } from '../../utils/audio';

interface MultipleChoiceExerciseProps {
  exercise: Exercise;
  selectedOptionIndex: number | null;
  onSelectOption: (index: number) => void;
  isAnswerSubmitted: boolean;
  isCorrect: boolean | null;
}

export function MultipleChoiceExercise({
  exercise,
  selectedOptionIndex,
  onSelectOption,
  isAnswerSubmitted,
  isCorrect,
}: MultipleChoiceExerciseProps) {
  const options = exercise.options || [];

  return (
    <div className="flex flex-col flex-1 justify-between">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 mb-6 leading-snug">
          {exercise.instruction}
        </h2>

        {/* Prompt Card */}
        {exercise.sourceText && (
          <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-5 mb-6 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                {exercise.sourceLanguage === 'sq' ? 'Albanisch' : 'Deutsch'}
              </span>
              <p className="text-xl font-black text-slate-800 tracking-wide">
                {exercise.sourceText}
              </p>
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
        )}

        {/* Options Grid */}
        <div className="space-y-3">
          {options.map((option, index) => {
            const isSelected = selectedOptionIndex === index;
            const isRightAnswer = isAnswerSubmitted && index === exercise.correctOptionIndex;
            const isWrongSelection = isAnswerSubmitted && isSelected && !isCorrect;

            let buttonStyle = 'bg-white border-slate-200 hover:border-slate-300 text-slate-800';
            if (isSelected && !isAnswerSubmitted) {
              buttonStyle = 'bg-red-50/80 border-red-500 text-red-700 shadow-xs ring-2 ring-red-500/20';
            } else if (isRightAnswer) {
              buttonStyle = 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold';
            } else if (isWrongSelection) {
              buttonStyle = 'bg-rose-50 border-rose-500 text-rose-800 font-bold';
            }

            return (
              <button
                key={index}
                disabled={isAnswerSubmitted}
                onClick={() => onSelectOption(index)}
                className={`w-full p-4 rounded-2xl border-2 text-left font-semibold text-base transition duration-150 flex items-center justify-between active:scale-[0.99] ${buttonStyle}`}
              >
                <span>{option}</span>
                <span className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0 ml-2">
                  {index + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
