'use client';

import React, { useState } from 'react';
import { X, Heart, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lesson } from '../../types';
import { useApp } from '../../context/AppContext';
import { soundManager } from '../../utils/audio';
import { MultipleChoiceExercise } from './MultipleChoiceExercise';
import { WordBankExercise } from './WordBankExercise';
import { MatchingPairsExercise } from './MatchingPairsExercise';
import { LessonFeedbackBanner } from './LessonFeedbackBanner';
import { GrammarWhyModal } from './GrammarWhyModal';

interface LessonModalProps {
  lesson: Lesson;
  onClose: () => void;
}

export function LessonModal({ lesson, onClose }: LessonModalProps) {
  const { stats, loseHeart, completeLesson, addMistakeCard } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [selectedTiles, setSelectedTiles] = useState<string[]>([]);
  const [matchingDone, setMatchingDone] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [isLessonFinished, setIsLessonFinished] = useState(false);

  const currentExercise = lesson.exercises[currentIndex];
  const progressPercent = Math.round(((currentIndex) / lesson.exercises.length) * 100);

  const canCheck =
    currentExercise.type === 'multiple-choice'
      ? selectedOption !== null
      : currentExercise.type === 'word-bank'
      ? selectedTiles.length > 0
      : matchingDone;

  const handleTileClick = (word: string, indexInSelected?: number) => {
    if (indexInSelected !== undefined) {
      setSelectedTiles((prev) => prev.filter((_, i) => i !== indexInSelected));
    } else {
      setSelectedTiles((prev) => [...prev, word]);
    }
  };

  const checkAnswer = () => {
    let correct = false;
    if (currentExercise.type === 'multiple-choice') {
      correct = selectedOption === currentExercise.correctOptionIndex;
    } else if (currentExercise.type === 'word-bank') {
      correct = selectedTiles.join(' ') === currentExercise.correctTileOrder?.join(' ');
    } else if (currentExercise.type === 'matching-pairs') {
      correct = matchingDone;
    }

    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct) {
      soundManager.playCorrectSound();
    } else {
      soundManager.playMistakeSound();
      loseHeart();
      if (currentExercise.sourceText) {
        addMistakeCard({
          sq: currentExercise.sourceLanguage === 'sq' ? currentExercise.sourceText : (currentExercise.correctAnswerText || currentExercise.audioText || 'Lektion Wort'),
          de: currentExercise.sourceLanguage === 'de' ? currentExercise.sourceText : (currentExercise.correctAnswerText || 'Wortschatz'),
          grammarNote: currentExercise.whyExplanation.ruleSummary,
          exampleSq: currentExercise.whyExplanation.exampleSq,
          exampleDe: currentExercise.whyExplanation.exampleDe,
        });
      }
    }
  };

  const handleContinue = () => {
    if (currentIndex + 1 < lesson.exercises.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setSelectedTiles([]);
      setMatchingDone(false);
      setIsSubmitted(false);
      setIsCorrect(null);
    } else {
      completeLesson(lesson.id, lesson.xpReward);
      setIsLessonFinished(true);
      try {
        confetti({ particleCount: 90, spread: 65, origin: { y: 0.6 } });
      } catch {}
    }
  };

  if (isLessonFinished) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col justify-between p-6 animate-in fade-in">
        <div className="my-auto text-center space-y-4">
          <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Award className="w-14 h-14" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Lektion gemeistert!</h2>
          <p className="text-slate-600 text-sm max-w-xs mx-auto">
            Großartige Leistung! Du hast die Lektion &ldquo;{lesson.title}&rdquo; erfolgreich abgeschlossen.
          </p>
          <div className="inline-flex items-center space-x-2 bg-red-50 border border-red-200 px-5 py-2.5 rounded-full text-red-600 font-black text-base shadow-xs">
            <Sparkles className="w-5 h-5" />
            <span>+{lesson.xpReward} XP gesammelt</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-2xl shadow-lg shadow-red-500/25 active:scale-98 transition"
        >
          Zurück zur Übersicht
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col justify-between">
      {/* Top Bar with Progress & Hearts */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center space-x-3 select-none">
        <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-700">
          <X className="w-6 h-6" />
        </button>
        <div className="flex-1 bg-slate-200 h-3 rounded-full overflow-hidden">
          <div
            className="bg-red-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex items-center space-x-1 text-rose-600 font-extrabold text-sm">
          <Heart className="w-5 h-5 fill-rose-500" />
          <span>{stats.hearts}</span>
        </div>
      </div>

      {/* Main Exercise Area */}
      <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col">
        {currentExercise.type === 'multiple-choice' && (
          <MultipleChoiceExercise
            exercise={currentExercise}
            selectedOptionIndex={selectedOption}
            onSelectOption={setSelectedOption}
            isAnswerSubmitted={isSubmitted}
            isCorrect={isCorrect}
          />
        )}
        {currentExercise.type === 'word-bank' && (
          <WordBankExercise
            exercise={currentExercise}
            selectedTiles={selectedTiles}
            onTileClick={handleTileClick}
            isAnswerSubmitted={isSubmitted}
          />
        )}
        {currentExercise.type === 'matching-pairs' && (
          <MatchingPairsExercise
            pairs={currentExercise.matchingPairs || []}
            onComplete={() => {
              setMatchingDone(true);
              setIsCorrect(true);
              setIsSubmitted(true);
            }}
            isAnswerSubmitted={isSubmitted}
          />
        )}
      </div>

      {/* Bottom Feedback Banner */}
      <LessonFeedbackBanner
        isSubmitted={isSubmitted}
        isCorrect={isCorrect}
        correctAnswerText={currentExercise.correctAnswerText || currentExercise.correctTileOrder?.join(' ')}
        onWhyClick={() => setShowWhyModal(true)}
        onContinue={handleContinue}
        onCheck={checkAnswer}
        canCheck={canCheck}
      />

      {/* Why Modal */}
      {showWhyModal && (
        <GrammarWhyModal
          explanation={currentExercise.whyExplanation}
          onClose={() => setShowWhyModal(false)}
        />
      )}
    </div>
  );
}
